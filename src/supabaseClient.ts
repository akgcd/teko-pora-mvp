import { createClient } from '@supabase/supabase-js';

// Credenciais diretas - FIXO
const supabaseUrl = "https://plmzqgsskjtripdwmwos.supabase.co";
const supabaseAnonKey = "sb_publishable_VMQL62AY1EdvkBPnpuDDyw_nHG6h_";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log para debug
console.log("Supabase inicializado com URL:", supabaseUrl);
