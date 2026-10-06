import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://vimdvpwiickofbdgryao.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpbWR2cHdpaWNrb2ZiZGdyeWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNTk4NDMsImV4cCI6MjEwNjgzNTg0M30.t6WSwG03DsTN50fL0Qi0-qB1y5KygU0FFMqcr1Qq7qY'
)
