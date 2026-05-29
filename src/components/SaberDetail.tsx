import React, { useState } from "react";
import { ArrowLeft, User, MapPin, Link as LinkIcon, Calendar, CheckSquare, Plus, FileText, Send, Sparkles } from "lucide-react";
import { Saber, Adaptacao } from "../types";

interface SaberDetailProps {
  saber: Saber;
  onBack: () => void;
  onAdaptationAdded: (updatedSaber: Saber) => void;
}

export default function SaberDetail({ saber, onBack, onAdaptationAdded }: SaberDetailProps) {
  const [designerName, setDesignerName] = useState("");
  const [contextUsed, setContextUsed] = useState("");
  const [outcome, setOutcome] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAddAdaptation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!designerName || !contextUsed || !outcome) {
      setError("Por favor, preencha todos os campos do ciclo de reciprocidade.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch(`/api/saberes/${saber.id}/adaptations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          designerName,
          contextUsed,
          outcome,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Algo deu errado ao registrar sua adaptação.");
      }

      // Adiciona de forma imediata à lista local
      const updatedSaber = {
        ...saber,
        adaptations: [...saber.adaptations, data.adaptation]
      };

      setSuccessMsg("Sua adaptação foi registrada! O ciclo de reciprocidade foi fechado.");
      setDesignerName("");
      setContextUsed("");
      setOutcome("");
      
      // Notifica o componente pai
      onAdaptationAdded(updatedSaber);
    } catch (err: any) {
      setError(err.message || "Erro de conexão ao salvar adaptação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Back navigation bar */}
      <button
        onClick={onBack}
        id="btn-back-to-list"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#5D6D3E] hover:text-[#4A5732] transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
        Voltar para a busca
      </button>

      {/* Main Grid: Details + Adaptation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Wisdom Details Card (Left side) */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-md border border-[#E5E0D8] overflow-hidden">
          {/* Header */}
          <div className="bg-[#F4EEE4] p-6 border-b border-[#E5E0D8]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A67C52] bg-[#DED6CB]/50 px-3 py-1 rounded-full">
              Saber Tradicional • {saber.materialType}
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#5D6D3E] mt-3 leading-tight italic">
              {saber.problemSolved}
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Meta information row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-neutral-600 border-b border-[#E5E0D8] pb-6">
              <div className="space-y-1">
                <span className="text-xs uppercase font-semibold text-neutral-400 block">Quem Compartilhou (Ancião)</span>
                <span className="font-semibold text-neutral-800 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-600" />
                  {saber.elderName}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs uppercase font-semibold text-neutral-400 block">Território de Origem</span>
                <span className="font-semibold text-neutral-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#A67C52]" />
                  {saber.territory}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#5D6D3E] uppercase tracking-wider">Como funciona &amp; Contexto</h4>
              <p className="text-neutral-700 leading-relaxed whitespace-pre-line text-base">
                {saber.description}
              </p>
            </div>

            {/* Link button if present */}
            {saber.link && (
              <div className="pt-4 border-t border-neutral-100 flex justify-between items-center bg-[#F4EEE4]/30 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-[#A67C52]" />
                  <span className="text-sm font-semibold text-neutral-700">Material Documentado Original</span>
                </div>
                <a
                  href={saber.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#5D6D3E] hover:bg-[#4A5732] text-white px-5 py-2 rounded-full font-semibold text-xs tracking-wider transition-colors inline-block text-center cursor-pointer"
                >
                  Acessar Documentação
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Adaptation & Reciprocity (Right side) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* List of Previous Adaptations */}
          <div className="bg-[#F4EEE4] p-6 rounded-xl border border-[#E5E0D8] space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#5D6D3E] border-b border-[#E5E0D8] pb-2 flex items-center gap-2 italic">
              <Sparkles className="w-5 h-5 text-[#A67C52]" />
              Ciclo de Reciprocidade ({saber.adaptations.length})
            </h3>

            {saber.adaptations.length === 0 ? (
              <p className="text-neutral-500 text-sm italic">
                Nenhum designer registrou uma adaptação ou retorno deste saber ainda. Seja o primeiro a fechar o ciclo!
              </p>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {saber.adaptations.map((adapt) => (
                  <div key={adapt.id} className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 text-sm space-y-2">
                    <div className="flex justify-between items-center text-xs text-neutral-400">
                      <span className="font-bold text-neutral-700">{adapt.designerName}</span>
                      <span>{new Date(adapt.date).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] uppercase font-bold text-[#A67C52] block">Contexto de Uso:</span>
                      <p className="text-neutral-600 text-xs">{adapt.contextUsed}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] uppercase font-bold text-emerald-800 block">Resultado obtido:</span>
                      <p className="text-neutral-700 font-sans italic leading-relaxed">"{adapt.outcome}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form to Register Adaptation */}
          <div className="bg-white p-6 rounded-xl border border-[#E5E0D8] shadow-sm space-y-4">
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-bold text-[#5D6D3E] italic">Como você adaptou este saber?</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Ao registrar sua aplicação, você gera um retorno respeitoso e evita o extrativismo intelectual de territórios ancestrais.
              </p>
            </div>

            {successMsg && (
              <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-lg border border-emerald-200">
                {successMsg}
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleAddAdaptation} className="space-y-3">
              {/* Designer Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700" htmlFor="designerName">
                  Nome do Designer, Estudante ou Coletivo
                </label>
                <input
                  type="text"
                  id="designerName"
                  value={designerName}
                  onChange={(e) => setDesignerName(e.target.value)}
                  placeholder="Escreva seu nome completo"
                  className="w-full px-3 py-2 bg-[#FDFBF7] rounded-lg border border-[#DED6CB] focus:border-[#5D6D3E] focus:ring-1 focus:ring-[#5D6D3E] transition-all text-xs text-neutral-800 outline-none"
                  required
                />
              </div>

              {/* Context Applied */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700" htmlFor="contextUsed">
                  Onde e em que contexto o aplicou?
                </label>
                <input
                  type="text"
                  id="contextUsed"
                  value={contextUsed}
                  onChange={(e) => setContextUsed(e.target.value)}
                  placeholder="Ex: Comunidade periférica, horta social, etc."
                  className="w-full px-3 py-2 bg-[#FDFBF7] rounded-lg border border-[#DED6CB] focus:border-[#5D6D3E] focus:ring-1 focus:ring-[#5D6D3E] transition-all text-xs text-neutral-800 outline-none"
                  required
                />
              </div>

              {/* Adaptation Outcome */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-neutral-700" htmlFor="outcome">
                  Resultados ou Aprendizados alcançados
                </label>
                <textarea
                  id="outcome"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  rows={3}
                  placeholder="Descreva o que mudou no projeto, qual material foi alterado, o que funcionou e o retorno dado para a comunidade associada..."
                  className="w-full px-3 py-2 bg-[#FDFBF7] rounded-lg border border-[#DED6CB] focus:border-[#5D6D3E] focus:ring-1 focus:ring-[#5D6D3E] transition-all text-xs text-neutral-800 resize-none leading-relaxed outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2 bg-[#5D6D3E] text-white rounded-full font-semibold text-xs tracking-wider uppercase hover:bg-[#4A5732] transition-colors flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-3 H-3" />
                )}
                Registrar Retorno Recíproco
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
