import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqdpkdsbpwkoinpqwjps.supabase.co';
const supabaseKey = 'sb_publishable_nskl0iJvuzAF59oErHfKHw_R0tOs3ix';

if (!supabaseUrl || !supabaseKey) {
    console.warn('Missing Supabase URL or Key. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
