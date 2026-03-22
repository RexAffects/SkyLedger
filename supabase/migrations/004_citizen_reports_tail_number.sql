-- Add tail_number to citizen_reports so photo evidence can be pinned to a specific aircraft
ALTER TABLE citizen_reports
  ADD COLUMN tail_number TEXT DEFAULT NULL;

-- Index for looking up all reports tied to a specific aircraft
CREATE INDEX idx_citizen_reports_tail_number
  ON citizen_reports (tail_number)
  WHERE tail_number IS NOT NULL;
