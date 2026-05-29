import React from "react";
import { ArrowRight, Sprout } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-12 px-6 relative overflow-hidden">
      {/* Background Decorative Patterns */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.25]"
        style={{
          backgroundImage: "radial-gradient(#5D6D3E 0.75px, transparent 0.75px)",
          backgroundSize: "24px 24px"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-100/10 to-[#5D6D3E]/5 pointer-events-none" />

      {/* Main Content Card */}
      <div className="relative z-10 max-w-3xl w-full text-center flex flex-col items-center space-y-8">
        
        {/* Animated Custom Logo */}
        <div className="relative group select-none">
          <div className="absolute inset-0 bg-[#5D6D3E]/10 blur-3xl rounded-full scale-110 animate-pulse duration-4000" />
          
          <div className="w-40 h-40 md:w-52 md:h-52 bg-white rounded-full p-4 shadow-xl border-4 border-[#5D6D3E] flex items-center justify-center transform transition-transform duration-700 hover:rotate-6 relative z-10">
            {/* Embedded Logo SVG representing the seed, earth and community arches */}
            <svg viewBox="0 0 200 200" className="w-full h-full text-[#5D6D3E] fill-current">
              <circle cx="100" cy="100" r="92" fill="none" stroke="#5D6D3E" strokeWidth="3" />
              {/* Core Seed Leaf */}
              <path 
                d="M100,30 C60,75 60,125 100,165 C140,125 140,75 100,30 Z" 
                fill="#8C8279" 
                stroke="#5D6D3E" 
                strokeWidth="2"
              />
              {/* Forest Green Wave of Ancestry */}
              <path 
                d="M68,110 C85,92 115,92 132,110" 
                fill="none" 
                stroke="#5D6D3E" 
                strokeWidth="8" 
                strokeLinecap="round"
              />
              {/* Clay Orange Root Arc */}
              <path 
                d="M78,135 C90,123 110,123 122,135" 
                fill="none" 
                stroke="#A67C52" 
                strokeWidth="6" 
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Title Stack */}
        <div className="space-y-4 max-w-2xl">
          <span className="text-xs uppercase font-semibold tracking-widest text-[#A67C52] bg-[#DED6CB]/50 px-4 py-1.5 rounded-full inline-block">
            MVP • REPOSITÓRIO COMUNITÁRIO
          </span>
          
          <h1 className="font-serif text-5xl md:text-6xl text-[#5D6D3E] font-bold tracking-tight leading-tight italic">
            Bem-vindo ao <br />
            <span className="relative">
              Teko Porã
              <span className="absolute left-0 bottom-1 w-full h-1 bg-[#DED6CB] rounded-full" />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#2C2926] leading-relaxed font-sans max-w-xl mx-auto">
            Um ecossistema vivo de saberes ancestrais e periféricos voltado para qualificar e regenerar práticas de design contemporâneo.
          </p>
        </div>

        {/* Informational Credentials Badge */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-[#F4EEE4] border border-[#E5E0D8] p-4 rounded-xl max-w-lg shadow-sm">
          <div className="p-2 bg-[#DED6CB] text-[#5D6D3E] rounded-full">
            <Sprout className="w-6 h-6" />
          </div>
          <div className="text-left text-sm text-[#2C2926]">
            <span className="font-semibold text-[#5D6D3E] block">Reciprocidade e Respeito à Fonte</span>
            O conhecimento compartilhado pertence ao território originário. Designers recebem o saber e são convidados a registrar e reportar sua aplicação prática.
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 w-full max-w-xs">
          <button
            onClick={onStart}
            id="btn-welcome-start"
            className="group w-full relative inline-flex items-center justify-center h-16 px-8 bg-[#5D6D3E] text-white rounded-full font-semibold text-lg transition-all duration-300 hover:bg-[#4A5732] active:scale-95 shadow-lg shadow-[#5D6D3E]/20 overflow-hidden cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-3">
              Entrar no Repositório
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <p className="mt-3 text-xs text-[#8C8279] italic">
            Tecendo futuros regenerativos a partir de nossas raízes territoriais.
          </p>
        </div>

      </div>
    </div>
  );
}
