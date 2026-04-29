import { createClient } from '@/utils/supabase/server';

const TASK_TEMPLATES: Record<string, string[]> = {
  'Sales Manager': [
    'Review proposal for {target}',
    'Prepare contract for {target} client',
    'Follow up with {target} lead from yesterday',
  ],
  'Lead Finder': [
    'Expand {target} lead list',
    'Verify {target} contact info',
    'Scrape {target} business directories',
  ],
  'Copywriter': [
    'Write new ad copy for {target}',
    'Refine outreach template for {target}',
    'Create social media posts for {target} agency',
  ],
  'Website Builder': [
    'Fix responsive issues on {target} site',
    'Add testimonials to {target} landing page',
    'Update logo for {target} brand',
  ],
};

export async function generateInitialTasks(businessId: string, businessType: string) {
  const supabase = await createClient();
  const agents = Object.keys(TASK_TEMPLATES);
  
  const target = businessType.toLowerCase().includes('agency') 
    ? businessType.replace(/agency/gi, '').trim() 
    : businessType;

  const tasks = agents.map(agent => {
    const templates = TASK_TEMPLATES[agent];
    const title = templates[Math.floor(Math.random() * templates.length)].replace(/{target}/g, target);

    return {
      business_id: businessId,
      title: title,
      status: 'pending',
      due_date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });

  const { data, error } = await supabase
    .from('business_tasks')
    .insert(tasks)
    .select();

  if (error) {
    console.error('Error generating tasks:', error);
    return [];
  }

  return data;
}
