import { createClient } from '@supabase/supabase-js';

// Usando a URL correta do Supabase (com .co, não .com)
const supabaseUrl = "https://plmzqgsskjtripdwmwos.supabase.co";
const supabaseAnonKey = "sb_publishable_VMQL62AY1EdvkBPnpuDDyw_nHG6h_";

// Configuração adicional para evitar CORS
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

console.log("Supabase configurado com:", supabaseUrl);
