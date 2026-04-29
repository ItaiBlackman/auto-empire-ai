-- Create business_tasks table
CREATE TABLE IF NOT EXISTS business_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending', -- pending, completed
  type TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages_sent table
CREATE TABLE IF NOT EXISTS messages_sent (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  subject TEXT,
  body TEXT,
  channel TEXT DEFAULT 'email',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE business_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages_sent ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view tasks for their own businesses" ON business_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = business_tasks.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks for their own businesses" ON business_tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = business_tasks.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view messages for their own businesses" ON messages_sent
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = messages_sent.business_id
      AND businesses.user_id = auth.uid()
    )
  );
