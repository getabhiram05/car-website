import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uhdzqjkogggxpnuehcma.supabase.co";

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZHpxamtvZ2dneHBudWVoY21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNDY1MzIsImV4cCI6MjEwMDYyMjUzMn0.ca16_A3LG7nbcsRPxslhaCJ2QNXR9DCnYit7RVFdTV8";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);