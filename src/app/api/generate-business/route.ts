export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { generateBusiness } from '@/lib/ai-business-builder';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 1. Generate the business content using AI
    const businessData = await generateBusiness(prompt);

    // 2. Save the business to the database
    const { data: business, error } = await supabase
      .from('businesses')
      .insert({
        user_id: user.id,
        name: businessData.brandName,
        type: prompt,
        description: businessData.description,
        prompt: prompt,
        data: businessData,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving business:', error);
      return NextResponse.json({ error: 'Failed to save business' }, { status: 500 });
    }

    // 3. Parallelize initialization tasks to optimize speed
    const { simulateActivities } = await import('@/lib/activity-simulator');
    const { generateInitialTasks } = await import('@/lib/task-simulator');

    const initialLeads = businessData.leadTargets.map(target => ({
      business_id: business.id,
      name: `${target.split(' ')[0]} Business`,
      company: target,
      status: 'new',
    }));

    const staticTasks = [
      { business_id: business.id, title: 'Initialize brand assets', status: 'completed', type: 'setup' },
      { business_id: business.id, title: 'Generate outreach strategy', status: 'completed', type: 'marketing' },
      { business_id: business.id, title: 'Find first 10 leads', status: 'pending', type: 'sales' },
    ];

    // Run these in parallel
    await Promise.all([
      simulateActivities(business.id, business.type),
      generateInitialTasks(business.id, business.type),
      supabase.from('leads').insert(initialLeads),
      supabase.from('business_tasks').insert(staticTasks)
    ]);

    // 4. Return the created business
    return NextResponse.json(business);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
