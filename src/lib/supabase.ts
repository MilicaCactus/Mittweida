import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://mzvzwwwipxgvynceywcq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16dnp3d3dpcHhndnluY2V5d2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTEzNzAsImV4cCI6MjA2NjUyNzM3MH0.QUc50zxwkpeBNSyQK0xwxM0ArmkKePSmBxtv8Ufm1Ec')