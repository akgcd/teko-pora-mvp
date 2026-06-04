import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface ShareFormProps {
  onSuccess: (newSaber: any) => void;
  onCancel: () => void;
}

export default function ShareForm({ onSuccess, onCancel }: ShareFormProps) {
  const [elderName, setElderName] = useState('');
  const [territory, setTerritory] = useState('');
  const [problemSolved, setProblemSolved] = useState('');
  const [materialType, setMaterialType] = useState('Vídeo');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!elderName || !territory || !problemSolved || !description) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from('saberes')
        .insert([
          {
            elderName,
            territory,
            problemSolved,
            materialType,
            link: link || null,
            description,
          }
        ])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      setSubmitted(true);
      setTimeout(() => {
        onSuccess(data);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Não foi possível enviar sua contribuição.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-[#e5e0d5] text-center space-y-4 max-w-lg mx-auto my-12">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#5D6D3E]">Saber Ofertado com Sucesso!</h3>
        <p className="text-neutral-600 text-sm">Agradecemos por partilhar este conhecimento.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-[#e5e0d5] max-w-2xl mx-auto">
      <h2 className="font-serif text-2xl font-bold text-[#5D6D3E] mb-4">Ofertar Saber</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium mb-1">Nome do Ancião *</label>
          <input type="text" value={elderName} onChange={(e) => setElderName(e.target.value)} className="w-full p-2 border rounded-lg" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Território *</label>
          <input type="text" value={territory} onChange={(e) => setTerritory(e.target.value)} className="w-full p-2 border rounded-lg" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Problema que resolve *</label>
          <input type="text" value={problemSolved} onChange={(e) => setProblemSolved(e.target.value)} className="w-full p-2 border rounded-lg" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Material *</label>
          <select value={materialType} onChange={(e) => setMaterialType(e.target.value)} className="w-full p-2 border rounded-lg">
            <option>Vídeo</option>
            <option>Artigo</option>
            <option>Documentário</option>
            <option>Relato Oral</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Link (opcional)</label>
          <input type="url" value={link} onChange={(e) => setLink(e.target.value)} className="w-full p-2 border rounded-lg" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Descrição *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded-lg" rows={4} required />
        </div>
        
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg">Cancelar</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-[#5D6D3E] text-white rounded-lg disabled:opacity-50">
            {loading ? 'Enviando...' : 'Ofertar Saber'}
          </button>
        </div>
      </form>
    </div>
  );
}
