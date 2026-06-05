import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: any, res: any) {
  try {
    const { id } = req.query;

    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { designerName, contextUsed, outcome } = req.body;
    if (!designerName || !contextUsed || !outcome) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    const { data: saber, error: fetchError } = await supabase
      .from('saberes')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !saber) {
      return res.status(404).json({ error: 'Saber não encontrado.' });
    }

    const newAdaptation = {
      id: `adapt_${Date.now()}`,
      designerName,
      contextUsed,
      outcome,
      date: new Date().toISOString(),
    };

    const updatedAdaptations = [...(saber.adaptations || []), newAdaptation];

    const { error: updateError } = await supabase
      .from('saberes')
      .update({ adaptations: updatedAdaptations })
      .eq('id', id);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    return res.status(201).json({ success: true, adaptation: newAdaptation });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
