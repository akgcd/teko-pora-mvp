import { createClient } from '@supabase/supabase-js';

// Valores diretos e fixos
const supabaseUrl = "https://plmzqgsskjtripdwmwos.supabase.co";
const supabaseKey = "sb_publishable_VMQL62AY1EdvkBPnpuDDyw_nHG6h_";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

console.log("Supabase iniciado com sucesso");
