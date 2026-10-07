import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://vimdvpwiickofbdgryao.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpbWR2cHdpaWNrb2ZiZGdyeWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3MTg5NjEsImV4cCI6MjA3NTI5NDk2MX0.LF0B9y6zZz2u5v5x5v5x5v5x5v5x5v5x'
)
