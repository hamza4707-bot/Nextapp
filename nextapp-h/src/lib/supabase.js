import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = 'https://knausqaqzcsdszclncue.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)