-- Phase 3: Database Schema for SOC OS
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/jdmlzzigsyndfqcwysut/sql/new)

-- =====================================================
-- 1. Journal Entries Table
-- =====================================================

CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('study', 'lab', 'incident', 'general')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for journal_entries
CREATE POLICY "Users can view their own journal entries"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries"
  ON journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
  ON journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
  ON journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX journal_entries_user_id_idx ON journal_entries(user_id);
CREATE INDEX journal_entries_created_at_idx ON journal_entries(created_at DESC);
CREATE INDEX journal_entries_entry_type_idx ON journal_entries(entry_type);

-- =====================================================
-- 2. Ticket Progress Table
-- =====================================================

CREATE TABLE IF NOT EXISTS ticket_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ticket_id TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  mode TEXT NOT NULL CHECK (mode IN ('guided', 'expert')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'stuck')),
  notes TEXT DEFAULT '',
  hints_used INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ticket_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ticket_progress
CREATE POLICY "Users can view their own ticket progress"
  ON ticket_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ticket progress"
  ON ticket_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ticket progress"
  ON ticket_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ticket progress"
  ON ticket_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX ticket_progress_user_id_idx ON ticket_progress(user_id);
CREATE INDEX ticket_progress_ticket_id_idx ON ticket_progress(ticket_id);
CREATE INDEX ticket_progress_status_idx ON ticket_progress(status);

-- =====================================================
-- 3. Cert Roadmap Table (for custom user roadmaps)
-- =====================================================

CREATE TABLE IF NOT EXISTS cert_roadmap (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cert_name TEXT NOT NULL,
  cert_provider TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  started_date DATE,
  target_date DATE,
  completed_date DATE,
  notes TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE cert_roadmap ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cert_roadmap
CREATE POLICY "Users can view their own cert roadmap"
  ON cert_roadmap FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cert roadmap entries"
  ON cert_roadmap FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cert roadmap entries"
  ON cert_roadmap FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cert roadmap entries"
  ON cert_roadmap FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX cert_roadmap_user_id_idx ON cert_roadmap(user_id);
CREATE INDEX cert_roadmap_order_idx ON cert_roadmap(order_index);
CREATE INDEX cert_roadmap_status_idx ON cert_roadmap(status);

-- =====================================================
-- 4. Auto-update timestamp trigger function
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ticket_progress_updated_at
  BEFORE UPDATE ON ticket_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cert_roadmap_updated_at
  BEFORE UPDATE ON cert_roadmap
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Done! Your database is ready.
-- =====================================================
