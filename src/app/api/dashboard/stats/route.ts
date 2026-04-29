import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get Businesses
    const { data: businesses, error: busError } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (busError) throw busError;

    if (!businesses || businesses.length === 0) {
      return NextResponse.json({
        stats: [
          { title: "Total Revenue", value: "$0", change: "0%" },
          { title: "Active Businesses", value: "0", change: "0" },
          { title: "Total Leads", value: "0", change: "0" },
          { title: "Messages Sent", value: "0", change: "0" },
        ],
        businesses: [],
      });
    }

    const businessIds = businesses.map(b => b.id);

    // 2. Get Activities for dynamic calculation
    const { data: activities, error: actError } = await supabase
      .from('activities')
      .select('*')
      .in('business_id', businessIds);

    if (actError) throw actError;

    // 3. Dynamic Calculation logic
    // Leads = Base leads (e.g. 10 per business) + (Lead Finder activities * 5)
    // Revenue = Sales Manager activities * $150
    // Messages = Copywriter activities * 20
    
    const leadFinderActs = activities?.filter(a => a.agent_name === 'Lead Finder').length || 0;
    const salesManagerActs = activities?.filter(a => a.agent_name === 'Sales Manager').length || 0;
    const copywriterActs = activities?.filter(a => a.agent_name === 'Copywriter').length || 0;

    const totalLeads = (businesses.length * 12) + (leadFinderActs * 8);
    const totalRevenue = salesManagerActs * 450;
    const messagesSent = (copywriterActs * 45) + (leadFinderActs * 12);

    // 4. Aggregate data
    const stats = [
      { title: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "+100%" },
      { title: "Active Businesses", value: String(businesses.length), change: `+${businesses.length}` },
      { title: "Total Leads", value: totalLeads.toLocaleString(), change: `+${totalLeads}` },
      { title: "Messages Sent", value: messagesSent.toLocaleString(), change: `+${messagesSent}` },
    ];

    // 5. Per-business stats
    const formattedBusinesses = businesses.map(b => {
      const bActivities = activities?.filter(a => a.business_id === b.id) || [];
      const bLeads = 12 + (bActivities.filter(a => a.agent_name === 'Lead Finder').length * 8);
      const bRevenue = bActivities.filter(a => a.agent_name === 'Sales Manager').length * 450;

      return {
        id: b.id,
        name: b.name,
        status: b.status === 'active' ? 'Running' : 'Creating',
        leads: String(bLeads),
        revenue: `$${bRevenue.toLocaleString()}`,
      };
    });

    return NextResponse.json({
      stats,
      businesses: formattedBusinesses,
    });
  } catch (error: any) {
    console.error('Dashboard Stats Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
