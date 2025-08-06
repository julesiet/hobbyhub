import { createClient } from '@supabase/supabase-js';

const URL = "https://vbrttprlxfwuyhpiadon.supabase.co";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZicnR0cHJseGZ3dXlocGlhZG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTU4MTYsImV4cCI6MjA2OTYzMTgxNn0.H82bedWIbeleJxMiJa246LoLwlJhWDjbjgcJfvs41BY";

export const supabase = createClient(URL, API_KEY);