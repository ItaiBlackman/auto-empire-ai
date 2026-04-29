import OpenAI from 'openai';

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'placeholder',
    });
  }
  return _openai;
}

export interface GeneratedBusiness {
  brandName: string;
  logoPrompt: string;
  description: string;
  outreachScript: string;
  leadTargets: string[];
  emailTemplates: { subject: string; body: string }[];
  salesFunnelSteps: string[];
  websiteContent: {
    heroTitle: string;
    heroSubtitle: string;
    features: { title: string; description: string }[];
    ctaText: string;
  };
  aiEmployees: { name: string; role: string; focus: string }[];
}

export async function generateBusiness(userPrompt: string): Promise<GeneratedBusiness> {
  const systemPrompt = `
You are the AutoEmpire AI Business Builder. Your goal is to create a complete, premium, ready-made AI business based on a single user prompt.

Output MUST be in valid JSON format.

The JSON should include:
- brandName: A catchy, professional name for the business.
- logoPrompt: A highly detailed prompt for an AI image generator (like DALL-E 3) to create a premium logo for this brand. Use a minimalist, luxury style.
- description: A compelling 2-sentence description of what the business does.
- outreachScript: A high-converting cold email/message script for finding clients.
- leadTargets: An array of 5 specific types of businesses or individuals who would be ideal clients.
- emailTemplates: An array of 3 email templates (Intro, Follow-up 1, Follow-up 2) with 'subject' and 'body'.
- salesFunnelSteps: An array of 4 steps in the sales funnel.
- websiteContent: {
    heroTitle: "A catchy hero title",
    heroSubtitle: "A compelling subtitle",
    features: [{title: "Feature name", description: "Feature description"}],
    ctaText: "Primary button text"
  }
- aiEmployees: An array of 4 specialized AI staff members for this business, each with a 'name', 'role', and 'focus'.

Tone: Premium, modern, elite, efficient.
User Prompt: "${userPrompt}"
`;

  try {
    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a business generation expert. Always output JSON." },
        { role: "user", content: systemPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content received from OpenAI');
    
    return JSON.parse(content) as GeneratedBusiness;
  } catch (error) {
    console.error("Error generating business:", error);
    throw error;
  }
}
