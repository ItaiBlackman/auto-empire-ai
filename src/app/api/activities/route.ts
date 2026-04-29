export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getRecentActivities, simulateActivities } from '@/lib/activity-simulator';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get user's businesses
    const { data: businesses, error: busError } = await supabase
      .from('businesses')
      .select('id, type')
      .eq('user_id', user.id);

    if (busError) throw busError;

    if (!businesses || businesses.length === 0) {
      return NextResponse.json([]);
    }

    const businessIds = businesses.map(b => b.id);

    // 2. Fetch existing activities
    let activities = await getRecentActivities(businessIds);

    // 3. Simulation logic: 
    // To make it feel "live", we simulate new activities 20% of the time a user visits the feed
    // or if they have very few activities.
    if (activities.length < 5 || Math.random() < 0.2) {
       // Simulate for a random active business
       const randomBusiness = businesses[Math.floor(Math.random() * businesses.length)];
       await simulateActivities(randomBusiness.id, randomBusiness.type);
       activities = await getRecentActivities(businessIds);
    }

    return NextResponse.json(activities);
  } catch (error: any) {
    console.error('Activities API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
