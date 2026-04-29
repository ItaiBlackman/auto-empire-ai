-- Add indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_business_id ON leads(business_id);
CREATE INDEX IF NOT EXISTS idx_activities_business_id ON activities(business_id);
CREATE INDEX IF NOT EXISTS idx_business_tasks_business_id ON business_tasks(business_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_business_id ON messages_sent(business_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_lead_id ON messages_sent(lead_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
