import { createClient } from '@/utils/supabase/server';

const AGENT_TEMPLATES: Record<string, string[]> = {
  'Sales Manager': [
    'Closing deal with {target}',
    'Following up on proposal for {target}',
    'Negotiating terms with {target}',
    'Reviewing sales pipeline for {target} leads',
    'Onboarding new client in the {target} sector',
  ],
  'Lead Finder': [
    'Scraping LinkedIn for {target}',
    'Verifying email addresses for {target} leads',
    'Adding new {target} contacts to CRM',
    'Identifying high-intent {target} prospects',
    'Filtering lead list for {target} businesses',
  ],
  'Copywriter': [
    'Drafting outreach email for {target}',
    'Optimizing ad copy for {target} campaign',
    'Creating content strategy for {target} clients',
    'Writing follow-up sequence for {target} leads',
    'Refining brand voice for {target} outreach',
  ],
  'Website Builder': [
    'Updating landing page for {target} agency',
    'Integrating CRM with {target} website',
    'Improving SEO for {target} keywords',
    'Deploying new features to {target} funnel',
    'Optimizing mobile view for {target} landing page',
  ],
  'Appointment Setter': [
    'Scheduling discovery call with {target}',
    'Confirming meeting with {target} prospect',
    'Managing calendar for {target} outreach',
    'Handling objections from {target} lead',
    'Booking demo session for {target}',
  ],
  'Customer Support': [
    'Answering FAQ for {target} client',
    'Resolving technical issue for {target}',
    'Updating documentation for {target} services',
    'Processing feedback from {target} customer',
    'Setting up support portal for {target}',
  ],
};

export async function simulateActivities(businessId: string, businessType: string) {
  const supabase = await createClient();
  const agents = Object.keys(AGENT_TEMPLATES);
  
  // Pick 2-4 random agents to have performed an activity
  const numActivities = Math.floor(Math.random() * 3) + 2;
  const shuffledAgents = agents.sort(() => 0.5 - Math.random());
  const selectedAgents = shuffledAgents.slice(0, numActivities);

  const target = businessType.toLowerCase().includes('agency') 
    ? businessType.replace(/agency/gi, '').trim() 
    : businessType;

  const activities = selectedAgents.map(agent => {
    const templates = AGENT_TEMPLATES[agent];
    const template = templates[Math.floor(Math.random() * templates.length)];
    const action = template.replace(/{target}/g, target);

    return {
      business_id: businessId,
      agent_name: agent,
      action: action,
    };
  });

  const { data, error } = await supabase
    .from('activities')
    .insert(activities)
    .select();

  if (error) {
    console.error('Error simulating activities:', error);
    return [];
  }

  // If Lead Finder was active, occasionally add a real lead to the table
  if (selectedAgents.includes('Lead Finder') && Math.random() < 0.4) {
    const leadNames = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown'];
    const leadCompanies = [`${target} Solutions`, `${target} Corp`, `${target} & Co`, `The ${target} Group`];
    
    await supabase.from('leads').insert({
      business_id: businessId,
      name: leadNames[Math.floor(Math.random() * leadNames.length)],
      company: leadCompanies[Math.floor(Math.random() * leadCompanies.length)],
      status: 'new',
      email: `contact@${target.toLowerCase().replace(/\s+/g, '')}.com`,
    });
  }

  return data;
}

export async function getRecentActivities(businessIds: string[]) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .in('business_id', businessIds)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching activities:', error);
    return [];
  }

  return data;
}
