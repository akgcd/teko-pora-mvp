import React, { useState } from "react";
import { Send, Leaf, Link as LinkIcon, User, MapPin, HelpCircle, FileText, CheckCircle2 } from "lucide-react";
import { Saber } from "../types";

interface ShareFormProps {
  onSuccess: (newSaber: Saber) => void;
  onCancel: () => void;
}

export default function ShareForm({ onSuccess, onCancel }: ShareFormProps) {
  const [elderName, setElderName] = useState("");
  const [territory, setTerritory] = useState("");
  const [problemSolved, setProblemSolved] = useState("");
  const [materialType, setMaterialType] = useState("Vídeo");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!elderName || !territory || !problemSolved || !description) {
      setError("Por favor, preencha todos os campos obrigatórios marcados com *.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/saberes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          elderName,
          territory,
          problemSolved,
          materialType,
          description,
          link,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Algo deu errado ao ofertar o saber.");
      }

      setSubmitted(true);
      setTimeout(() => {
        onSuccess(data.saber);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Não foi possível enviar sua contribuição.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-[#e5e0d5] text-center space-y-4 max-w-lg mx-auto my-12 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#5D6D3E]">Saber Ofertado com Sucesso!</h3>
        <p className="text-neutral-600 text-sm">
          Agradecemos imensamente por partilhar este conhecimento. A memória ancestral foi protegida e agora está disponível para inspirar designs regenerativos.
        </p>
        <p className="text-xs text-neutral-400 italic">Retornando ao repositório...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#E5E0D8] overflow-hidden max-w-2xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#5D6D3E] to-[#4A5732] text-[#FDFBF7] p-6 relative">
        <div className="absolute right-4 top-4 opacity-10">
          <Leaf className="w-24 h-24" />
        </div>
        <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
          Espaço de Partilha
        </h3>
        <p className="text-[#E5E0D8] text-xs mt-1">
          Proteja a memória e a vida da terra depositando um saber prático.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nome do Ancião */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5" htmlFor="elderName">
              <User className="w-3.5 h-3.5 text-[#A67C52]" />
              Seu Nome (Ancião) <span className="text-[#5D6D3E]">*</span>
            </label>
            <input
              type="text"
              id="elderName"
              value={elderName}
              onChange={(e) => setElderName(e.target.value)}
              placeholder="Como devemos lhe chamar?"
              className="w-full px-3 py-2 bg-[#FDFBF7] rounded-lg border border-[#DED6CB] focus:border-[#5D6D3E] focus:ring-1 focus:ring-[#5D6D3E] transition-all text-sm text-neutral-800 outline-none"
              required
            />
          </div>

          {/* Território */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5" htmlFor="territory">
              <MapPin className="w-3.5 h-3.5 text-[#A67C52]" />
              Seu Território ou Comunidade <span className="text-[#5D6D3E]">*</span>
            </label>
            <input
              type="text"
              id="territory"
              value={territory}
              onChange={(e) => setTerritory(e.target.value)}
              placeholder="De onde vem este saber?"
              className="w-full px-3 py-2 bg-[#FDFBF7] rounded-lg border border-[#DED6CB] focus:border-[#5D6D3E] focus:ring-1 focus:ring-[#5D6D3E] transition-all text-sm text-neutral-800 outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Problema Resolvido */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5" htmlFor="problemSolved">
              <HelpCircle className="w-3.5 h-3.5 text-[#A67C52]" />
              Que problema este saber resolve? <span className="text-[#5D6D3E]">*</span>
            </label>
            <input
              type="text"
              id="problemSolved"
              value={problemSolved}
              onChange={(e) => setProblemSolved(e.target.value)}
              placeholder="Ex: Conforto térmico, controle de erosão..."
              className="w-full px-3 py-2 bg-[#FDFBF7] rounded-lg border border-[#DED6CB] focus:border-[#5D6D3E] focus:ring-1 focus:ring-[#5D6D3E] transition-all text-sm text-neutral-800 outline-none"
              required
            />
          </div>

          {/* Tipo de Material */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5" htmlFor="materialType">
              <FileText className="w-3.5 h-3.5 text-[#A67C52]" />
              Tipo de Material <span className="text-[#5D6D3E]">*</span>
            </label>
            <select
              id="materialType"
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value)}
              className="w-full px-3 py-2 bg-[#FDFBF7] rounded-lg border border-[#DED6CB] focus:border-[#5D6D3E] focus:ring-1 focus:ring-[#5D6D3E] transition-all text-sm text-neutral-800 cursor-pointer outline-none"
            >
              <option value="Vídeo">Vídeo</option>
              <option value="Artigo">Artigo</option>
              <option value="Documentário">Documentário</option>
              <option value="Video-Relato">Vídeo-Relato</option>
              <option value="Texto/Esquema">Texto / Esquema</option>
              <option value="Relato Oral">Relato Oral</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>

        {/* Link */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5" htmlFor="link">
            <LinkIcon className="w-3.5 h-3.5 text-[#A67C52]" />
            Link para o material original (Opcional)
          </label>
          <input
            type="url"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://exemplo.com/video-ou-artigo"
            className="w-full px-3 py-2 bg-[#FDFBF7] rounded-lg border border-[#DED6CB] focus:border-[#5D6D3E] focus:ring-1 focus:ring-[#5D6D3E] transition-all text-sm text-neutral-800 outline-none"
          />
        </div>

        {/* Descrição Curta */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5" htmlFor="description">
            <Leaf className="w-3.5 h-3.5 text-[#A67C52]" />
            Descrição Curta e Contexto <span className="text-[#5D6D3E]">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Descreva o saber, o contexto (território, materiais, condições climáticas ou do solo) e como este saber é aplicado em detalhes..."
            className="w-full px-3 py-2 bg-[#FDFBF7] rounded-lg border border-[#DED6CB] focus:border-[#5D6D3E] focus:ring-1 focus:ring-[#5D6D3E] transition-all text-sm text-neutral-800 resize-none leading-relaxed outline-none"
            required
          />
        </div>

        {/* Form Actions */}
        <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#DED6CB] text-stone-600 font-semibold text-sm hover:bg-[#F4EEE4] transition-colors cursor-pointer text-center"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={loading}
            id="btn-submit-saber"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#5D6D3E] text-white rounded-full font-semibold text-sm hover:bg-[#4A5732] transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Ofertar Saber
          </button>
        </div>
      </form>
    </div>
  );
}
