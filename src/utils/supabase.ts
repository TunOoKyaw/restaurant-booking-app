import { createClient } from '@supabase/supabase-js';

// (import.meta as any) ခံပြီး စနစ်တကျ ပြန်ခေါ်ခြင်း
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string;
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);