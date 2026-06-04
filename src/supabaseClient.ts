import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://plmzqgsskjtripdwmwos.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "sb_publishable_VMQL62AY1EdvkBPnpuDDyw_nHG6h_";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

console.log("Supabase inicializado com Service Role Key");
