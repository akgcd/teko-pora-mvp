import { createClient } from '@supabase/supabase-js';

// Usando import.meta.env para Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Variaveis nao encontradas");
  // Valores hardcoded como fallback
  const fallbackUrl = "https://plmzqgsskjtripdwmwos.supabase.co";
  const fallbackKey = "sb_publishable_VMQL62AY1EdvkBPnpuDDyw_nHG6h_";
  export const supabase = createClient(fallbackUrl, fallbackKey);
} else {
  export const supabase = createClient(supabaseUrl, supabaseKey);
}
