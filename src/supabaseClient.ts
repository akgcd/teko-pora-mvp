import { createClient } from '@supabase/supabase-js';

// Chave direta - Service Role Key
const supabaseUrl = "https://plmzqgsskjtripdwmwos.supabase.co";
const supabaseKey = "sb_secret_Qq8DlZTjYUr0gI749fN_kg_NUZgrygq";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

console.log("Supabase inicializado com chave direta");
