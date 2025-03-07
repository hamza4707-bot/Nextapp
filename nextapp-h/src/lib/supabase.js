import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://knausqaqzcsdszclncue.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuYXVzcWFxemNzZHN6Y2xuY3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MzY5NDQsImV4cCI6MjA1NTExMjk0NH0.gfQIyPcDlhSfhETyJiyhBK7bS0bqduIWYprtn5kns8g';

export const supabase = createClient(supabaseUrl, supabaseKey);