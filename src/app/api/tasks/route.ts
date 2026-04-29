export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    let query = supabase
      .from('business_tasks')
      .select('*, businesses!inner(user_id)')
      .eq('businesses.user_id', user.id)
      .order('due_date', { ascending: true });

    if (businessId) {
      query = query.eq('business_id', businessId);
    }

    const { data: tasks, error } = await query;

    if (error) throw error;

    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error('Tasks API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Verify ownership
    const { data: task, error: verifyError } = await supabase
      .from('business_tasks')
      .select('*, businesses!inner(user_id)')
      .eq('id', id)
      .eq('businesses.user_id', user.id)
      .single();

    if (verifyError || !task) {
      return NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 });
    }

    const { data: updatedTask, error } = await supabase
      .from('business_tasks')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updatedTask);
  } catch (error: any) {
    console.error('Tasks API PATCH Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
