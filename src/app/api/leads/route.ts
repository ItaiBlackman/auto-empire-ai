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
      .from('leads')
      .select('*, businesses!inner(user_id)')
      .eq('businesses.user_id', user.id)
      .order('created_at', { ascending: false });

    if (businessId) {
      query = query.eq('business_id', businessId);
    }

    const { data: leads, error } = await query;

    if (error) throw error;

    return NextResponse.json(leads);
  } catch (error: any) {
    console.error('Leads API Error:', error);
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

    const { id, status, notes } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    // Verify ownership via business_id join
    const { data: lead, error: verifyError } = await supabase
      .from('leads')
      .select('*, businesses!inner(user_id)')
      .eq('id', id)
      .eq('businesses.user_id', user.id)
      .single();

    if (verifyError || !lead) {
      return NextResponse.json({ error: 'Lead not found or unauthorized' }, { status: 404 });
    }

    const { data: updatedLead, error } = await supabase
      .from('leads')
      .update({ status, notes })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updatedLead);
  } catch (error: any) {
    console.error('Leads API PATCH Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
