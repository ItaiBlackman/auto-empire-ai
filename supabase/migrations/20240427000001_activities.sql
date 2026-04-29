-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  agent_name TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view activities for their own businesses" ON activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = activities.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert activities for their own businesses" ON activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = activities.business_id
      AND businesses.user_id = auth.uid()
    )
  );
