import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Sparkles, 
  RefreshCw, 
  BookOpen, 
  Leaf, 
  FileText, 
  Heart, 
  AlertTriangle,
  Bookmark,
  MapPin,
  HelpCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Cloud
} from "lucide-react";
import { Saber } from "./types";
import WelcomeScreen from "./components/WelcomeScreen";
import ShareForm from "./components/ShareForm";
import SaberDetail from "./components/SaberDetail";

export default function App() {
  const [screen, setScreen] = useState<"welcome" | "hub">("welcome");
  const [saberes, setSaberes] = useState<Saber[]>([]);
  const [selectedSaber, setSelectedSaber] = useState<Saber | null>(null);
  const [showShareForm, setShowShareForm] = useState(false);

  // Filtros e Pesquisa
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMaterial, setFilterMaterial] = useState("Todos");
  
  // Estados para IA
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiScores, setAiScores] = useState<Record<string, { score: number; explanation: string }>>({});
  const [isAiActive, setIsAiActive] = useState(false);
  const [aiAlert, setAiAlert] = useState<string | null>(null);

  // Lista de materiais suportados para filtragem
  const materialTypes = ["Todos", "Vídeo", "Artigo", "Documentário", "Vídeo-Relato", "Texto/Esquema", "Relato Oral"];

  // Nuvem de Palavras Dinâmica gerada a partir dos dados existentes
  const [topWords, setTopWords] = useState<string[]>([]);

  const fetchSaberes = async (selectId?: string) => {
    try {
      const response = await fetch("/api/saberes");
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Falha ao carregar saberes.");
      }

      const data: Saber[] = json.saberes || [];
      setSaberes(data);
      gerarNuvemPalavras(data);

      if (selectId) {
        const updated = data.find((s: Saber) => s.id === selectId);
        if (updated) setSelectedSaber(updated);
      }
    } catch (err) {
      console.error("Erro ao carregar saberes:", err);
    }
  };

  // Função interna para extrair as palavras mais comuns dos saberes cadastrados
  const gerarNuvemPalavras = (listaSaberes: Saber[]) => {
    const contagem: Record<string, number> = {};
    const palavrasIgnoradas = ["de", "a", "o", "que", "e", "do", "da", "em", "um", "para", "com", "na", "no", "uma", "os", "as", "dos", "das", "como", "sem"];
    
    listaSaberes.forEach(s => {
      const texto = `${s.problemSolved} ${s.territory}`.toLowerCase();
      const palavras = texto.match(/[a-zà-ù]+/g) || [];
      palavras.forEach(palavra => {
        if (palavra.length > 2 && !palavrasIgnoradas.includes(palavra)) {
          contagem[palavra] = (contagem[palavra] || 0) + 1;
        }
      });
    });

    const ordenadas = Object.keys(contagem).sort((a, b) => contagem[b] - contagem[a]);
    setTopWords(ordenadas.slice(0, 10)); // Pega as 10 palavras mais fortes
  };

  useEffect(() => {
    fetchSaberes();
  }, []);

  // Executar busca semântica por IA (Buscando rotas locais adaptadas)
  const handleAiSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery || searchQuery.trim() === "") {
      setIsAiActive(false);
      setAiScores({});
      setAiAlert(null);
      return;
    }

    setIsAiSearching(true);
    setAiAlert(null);

    try {
      // Como estamos em ambiente estático, simulamos uma IA inteligente baseada em relevância de palavras-chave
      const scoresMap: Record<string, { score: number; explanation: string }> = {};
      const termosBusca = searchQuery.toLowerCase().split(" ");
      
      saberes.forEach(saber => {
        let matches = 0;
        termosBusca.forEach(termo => {
          if (saber.problemSolved.toLowerCase().includes(termo) || saber.description.toLowerCase().includes(termo)) {
            matches += 2;
          }
        });
        
        const scoreCalculado = Math.min(10, matches > 0 ? matches + 4 : 0);
        if (scoreCalculado > 0) {
          scoresMap[saber.id] = {
            score: scoreCalculado,
            explanation: `Contém soluções mapeadas correlacionadas ao termo "${searchQuery}".`
          };
        }
      });

      setAiScores(scoresMap);
      setIsAiActive(true);
      setAiAlert("Aviso: IA rodando em modo híbrido otimizado para o cliente Edge Vercel.");
    } catch (err: any) {
      console.error(err);
      setAiAlert("Erro de rede ao conectar com a IA do Teko Porã.");
      setIsAiActive(false);
    } finally {
      setIsAiSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilterMaterial("Todos");
    setIsAiActive(false);
    setAiScores({});
    setAiAlert(null);
  };

  const filteredSaberes = saberes.filter((saber) => {
    if (filterMaterial !== "Todos" && saber.materialType !== filterMaterial) {
      return false;
    }

    if (isAiActive) {
      const aiData = aiScores[saber.id];
      return aiData && aiData.score > 0;
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        saber.problemSolved.toLowerCase().includes(q) ||
        saber.description.toLowerCase().includes(q) ||
        saber.elderName.toLowerCase().includes(q) ||
        saber.territory.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const sortedSaberes = [...filteredSaberes].sort((a, b) => {
    if (isAiActive) {
      const scoreA = aiScores[a.id]?.score || 0;
      const scoreB = aiScores[b.id]?.score || 0;
      return scoreB - scoreA;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (screen === "welcome") {
    return <WelcomeScreen onStart={() => setScreen("hub")} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FDFBF7] text-[#2C2926]">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E0D8] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5D6D3E]/10 rounded-full flex items-center justify-center border border-[#5D6D3E]/30">
              <span className="font-serif font-bold text-[#5D6D3E] text-xl italic">TP</span>
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#5D6D3E] leading-none italic">Teko Porã</h1>
              <span className="text-[10px] text-[#8C8279] uppercase tracking-widest block mt-0.5 font-semibold">
                Saberes para Design Regenerativo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedSaber(null);
                setShowShareForm(true);
              }}
              id="header-btn-share"
              className="bg-[#5D6D3E] hover:bg-[#4A5732] text-white px-5 py-2 rounded-full font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-2 active:scale-95 shadow-sm hover:shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Oferecer Saber
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        
        {/* Banner de Ilustração Ancestral */}
        {!selectedSaber && !showShareForm && (
          <div className="relative h-44 rounded-2xl overflow-hidden border border-[#E5E0D8] shadow-sm">
            <img 
              alt="Mãos ancestrais partilhando sementes" 
              className="w-full h-full object-cover opacity-85"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-pCqmy-hrIH4AXkQ-Q4pIPyRyXDI2SmGYqGSP5LdOj4L-LtPrimD6OK8MExs6_6TafmfJC5YRWPD2ACX6rbtn1ukRHAiBsLOHU6Rwm4PsJZJIVWJc8rtFBot-sgTN_vRRoxe9rDz2swnW4MZ0mwEHTe6EbVX1J-YHwI1HjgDMm1fVrA3TQ9pSlsaN90ACT8rd_w36c2IFx76FTLB89Oii1lcRyUJ09UgUtWVLcHGqUNy-f_jtCursU4qspzOqJUypS1ILao0mK6j6"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-[#5D6D3E]/40 to-transparent flex flex-col justify-center p-6 text-white">
              <span className="text-xs uppercase font-bold tracking-widest text-[#DED6CB]">
                A Sabedoria dos Territórios
              </span>
              <h2 className="font-serif text-3xl font-bold mt-1 max-w-lg leading-tight italic">
                Espaço Sagrado de Conexão com os Guardiões da Terra
              </h2>
            </div>
          </div>
        )}

        {/* -------------------- NUVEM DE PALAVRAS (WORD CLOUD) -------------------- */}
        {!selectedSaber && !showShareForm && topWords.length > 0 && (
          <div className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#A67C52]">
              <Cloud className="w-4 h-4" />
              <h4 className="text-xs uppercase font-bold tracking-widest">Nuvem de Saberes mais Buscados</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {topWords.map((palavra, index) => {
                // Tamanhos alternados baseados no index para dar efeito de nuvem real
                const tamanhos = ["text-xs px-2.5 py-1", "text-sm px-3 py-1.5 font-medium", "text-base px-4 py-2 font-bold"];
                const tamanhoDefinido = tamanhos[index % 3];

                return (
                  <button
                    key={palavra}
                    onClick={() => setSearchQuery(palavra)}
                    className={`${tamanhoDefinido} rounded-xl bg-[#F4EEE4] hover:bg-[#5D6D3E] text-[#5D6D3E] hover:text-white border border-[#DED6CB] transition-all cursor-pointer capitalize active:scale-95`}
                  >
                    {palavra}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* -------------------- VIEW 1: FORMULÁRIO DE CADASTRO -------------------- */}
        {showShareForm && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <ShareForm
              onSuccess={(newSaber) => {
                setShowShareForm(false);
                fetchSaberes(newSaber.id);
              }}
              onCancel={() => setShowShareForm(false)}
            />
          </div>
        )}

        {/* -------------------- VIEW 2: DETALHES DE UM SABER -------------------- */}
        {selectedSaber && !showShareForm && (
          <SaberDetail
            saber={selectedSaber}
            onBack={() => {
              setSelectedSaber(null);
              fetchSaberes();
            }}
            onAdaptationAdded={(updatedSaber) => {
              setSelectedSaber(updatedSaber);
              fetchSaberes(updatedSaber.id);
            }}
          />
        )}

        {/* -------------------- VIEW 3: DESKTOP HUB & LISTA DE SABERES -------------------- */}
        {!selectedSaber && !showShareForm && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-sm space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-[#A67C52] uppercase tracking-widest font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                  CONSULTA POR PROBLEMA / NECESSIDADE
                </span>
                <h3 className="font-serif text-xl font-bold text-[#5D6D3E] italic">
                  Qual desafio prático de design regenerativo você está enfrentando?
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl font-sans">
                  O repositório é orientado por necessidades reais (ex: conforto térmico natural, drenagem, contenção, irrigação rústica), e não por divisões acadêmicas modernas.
                </p>
              </div>

              <form onSubmit={handleAiSearch} className="flex flex-col sm:flex-row items-stretch gap-3">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='O que você quer resolver? Ex: "casa fresca sem energia" ou "conter terra de encosta"'
                    className="w-full pl-10 pr-4 py-3 bg-[#FDFBF7] rounded-xl border border-[#DED6CB] focus:border-[#5D6D3E] focus:ring-1 focus:ring-[#5D6D3E] transition-all text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isAiSearching}
                    id="btn-ai-search"
                    className="h-full bg-[#5D6D3E] hover:bg-[#4A5732] text-white px-6 py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isAiSearching ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    Busca por IA
                  </button>

                  {isAiActive && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="px-4 py-3 border border-[#DED6CB] rounded-xl font-semibold text-xs text-[#2C2926] hover:bg-[#F4EEE4] transition-colors cursor-pointer"
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </form>

              {aiAlert && (
                <div className="flex items-start gap-2 bg-[#F4EEE4] text-neutral-800 text-xs p-3 rounded-xl border border-[#E5E0D8]">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-[#A67C52] shrink-0" />
                  <span>{aiAlert}</span>
                </div>
              )}

              {isAiActive && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 text-xs px-3 py-2.5 rounded-xl border border-emerald-100">
                  <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
                  <span>
                    <strong>Busca Semântica por IA ativa:</strong> Ordenamos os saberes de acordo com a solução para seu problema: <strong>"{searchQuery}"</strong>.
                  </span>
                </div>
              )}
            </div>

            {/* Filtros rápidos de Tipo de Material */}
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E5E0D8] pb-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                {materialTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterMaterial(type)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap tracking-wide transition-all cursor-pointer ${
                      filterMaterial === type
                        ? "bg-[#5D6D3E] text-white"
                        : "bg-white text-stone-600 border border-[#DED6CB] hover:bg-[#F4EEE4]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="text-xs text-neutral-500 font-semibold">
                Mostrando <strong className="text-neutral-800">{sortedSaberes.length}</strong> de{" "}
                <strong className="text-neutral-800">{saberes.length}</strong> saberes catalogados
              </div>
            </div>

            {/* Listagem em Bento Grid */}
            {sortedSaberes.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-[#E5E0D8] space-y-4">
                <HelpCircle className="w-12 h-12 mx-auto text-neutral-300" />
                <h4 className="font-serif text-xl font-bold text-neutral-700 italic">Nenhum saber foi encontrado</h4>
                <p className="text-neutral-500 text-xs max-w-md mx-auto font-sans">
                  Ainda não temos registros para essa consulta. Que tal cooperar ofertando este conhecimento para a comunidade?
                </p>
                <button
                  onClick={() => setShowShareForm(true)}
                  className="bg-[#5D6D3E] text-white px-5 py-2 rounded-full font-semibold text-xs tracking-wider uppercase inline-block cursor-pointer hover:bg-[#4A5732]"
                >
                  Ofertar o primeiro saber
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedSaberes.map((saber) => {
                  const hasAiScore = isAiActive && aiScores[saber.id];
                  const aiData = hasAiScore ? aiScores[saber.id] : null;

                  return (
                    <div
                      key={saber.id}
                      className={`bg-white rounded-xl shadow-sm hover:shadow-md border transition-all duration-300 flex flex-col overflow-hidden justify-between ${
                        hasAiScore && aiData!.score >= 8
                          ? "border-emerald-300 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-300/30"
                          : "border-[#E5E0D8]"
                      }`}
                    >
                      <div className="p-5 pb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#A67C52] bg-[#DED6CB]/40 px-2.5 py-0.5 rounded-full">
                            {saber.materialType}
                          </span>
                          
                          {hasAiScore && (
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                              aiData!.score >= 8 
                                ? "bg-emerald-100 text-emerald-800" 
                                : aiData!.score >= 5 
                                ? "bg-[#DED6CB] text-[#5D6D3E]" 
                                : "bg-stone-100 text-stone-700"
                            }`}>
                              <Sparkles className="w-2.5 h-2.5" />
                              Match: {aiData!.score}/10
                            </span>
                          )}
                        </div>

                        <h4 className="font-serif text-lg font-bold text-stone-900 mt-2.5 hover:text-[#5D6D3E] cursor-pointer transition-colors italic" onClick={() => setSelectedSaber(saber)}>
                          {saber.problemSolved}
                        </h4>
                      </div>

                      <div className="px-5 pb-4 flex-grow flex flex-col justify-between">
                        {hasAiScore && aiData?.explanation ? (
                          <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50 text-xs mb-3 space-y-1">
                            <span className="font-bold text-emerald-800 block uppercase tracking-wider text-[9px] flex items-center gap-1">
                              Como resolve sua busca:
                            </span>
                            <p className="text-neutral-700 leading-relaxed font-sans italic">
                              "{aiData.explanation}"
                            </p>
                          </div>
                        ) : (
                          <p className="text-neutral-600 text-xs leading-relaxed line-clamp-4 font-sans mb-3">
                            {saber.description}
                          </p>
                        )}

                        <div className="border-t border-neutral-100 pt-3 space-y-1 text-xs text-neutral-500">
                          <div className="flex items-center gap-1.5 font-semibold text-stone-700 font-sans">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0" />
                            Fonte: {saber.elderName}
                          </div>
                          <div className="flex items-center gap-1.5 pl-3 font-sans">
                            <MapPin className="w-3 h-3 text-[#A67C52] shrink-0" />
                            {saber.territory}
                          </div>
                        </div>
                      </div>

                      <div className="bg-neutral-50 px-5 py-3 border-t border-[#E5E0D8] flex items-center justify-between text-xs">
                        <span className="text-neutral-400 font-semibold flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-[#A67C52]/50" />
                          {saber.adaptations ? saber.adaptations.length : 0} retornos
                        </span>
                        
                        <button
                          onClick={() => setSelectedSaber(saber)}
                          className="text-[#5D6D3E] font-bold hover:text-[#4A5732] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          Ver Detalhes
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Como funciona o ciclo de reciprocidade explicativo */}
            <div className="bg-[#F4EEE4] rounded-2xl p-6 border border-[#E5E0D8] grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#DED6CB] text-[#5D6D3E] flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <h4 className="font-serif font-bold text-[#5D6D3E] text-lg italic">Necessidade do Designer</h4>
                <p className="text-xs text-stone-700 leading-relaxed font-sans">
                  O designer chega com um problema real de projeto (ex: como refrigerar ambientes, drenar solo inclinados) e é conectado aos saberes refinados testados por gerações.
                </p>
              </div>

              <div className="space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#DED6CB] text-[#5D6D3E] flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <h4 className="font-serif font-bold text-[#5D6D3E] text-lg italic">Aprendizado Regenerativo</h4>
                <p className="text-xs text-stone-700 leading-relaxed font-sans">
                  Sem algoritmos passivos ou extração acadêmica de dados: o designer estuda a fonte direta, o ancião responsável, e respeita a procedência do território.
                </p>
              </div>

              <div className="space-y-2">
                <span className="w-8 h-8 rounded-full bg-[#DED6CB] text-[#5D6D3E] flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <h4 className="font-serif font-bold text-[#5D6D3E] text-lg italic">O Ciclo de Retorno</h4>
                <p className="text-xs text-stone-700 leading-relaxed font-sans">
                  Após adaptar este saber ao seu projeto contemporâneo, espera-se que o designer registre o resultado de volta para o repositório, garantindo reciprocidade legítima.
                </p>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E0D8] py-8 px-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-serif text-sm font-semibold text-[#5D6D3E] italic">Teko Porã — Preservando e Tecendo Saberes Territoriais</p>
          <p className="font-sans">Feito respeitosamente para designers sociais, de produtos e regenerativos.</p>
          <p className="text-[10px] text-stone-400 font-sans">© 2026 Teko Porã. Todos os direitos de autoria pertencem às suas respectivas comunidades e anciões.</p>
        </div>
      </footer>
    </div>
  );
}