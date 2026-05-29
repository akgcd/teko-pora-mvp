import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Inicilaização preguiçosa (lazy load) do cliente do Gemini, conforme diretrizes
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Arquivo de persistência de dados
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "saberes.json");

// Sementes de dados iniciais conforme os exemplos do prompt
const INITIAL_SABERES = [
  {
    id: "saber_1",
    elderName: "Maria das Dores (Dona Maria)",
    territory: "Bairro do Canguera, São Roque, SP",
    problemSolved: "Pesca fluvial artesanal e sustentável com baixíssimo custo",
    materialType: "Vídeo",
    description: "Aprendi com meu avô a fazer rede de pesca de vime. No meu bairro, descobri que garrafa PET cortada em tiras dura mais e resiste melhor à correnteza do rio. Resolve a necessidade de pescar com baixo custo em água doce, usando materiais que iriam para o lixo comum.",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    createdAt: new Date().toISOString(),
    adaptations: [
      {
        id: "adapt_1_1",
        designerName: "Amanda Costa (Designer de Comunidade)",
        contextUsed: "Comunidade ribeirinha em Registro, SP",
        outcome: "Adaptamos a técnica de tiras de garrafa PET para tecer cestas de transporte de mandioca. O material provou-se extremamente lavável e higiênico, reduzindo em 40% a perda de raiz fresca durante o transporte.",
        date: new Date().toISOString()
      }
    ]
  },
  {
    id: "saber_2",
    elderName: "Mestre Francisco (Chicão)",
    territory: "Sertão do Pajeú, PE",
    problemSolved: "Conforto térmico natural sem ar-condicionado ou eletricidade",
    materialType: "Artigo",
    description: "A casa de barro (construída no modo tradicional de taipa de mão ou pau-a-pique) mantém o ambiente fresco e agradável durante o dia quente e protege do frio gelado do sertão à noite, sem gasto algum de energia artificial. O segredo está no controle da espessura do barro misturado com ramos e água.",
    link: "https://vimeo.com/channels/ancestral",
    createdAt: new Date().toISOString(),
    adaptations: []
  },
  {
    id: "saber_3",
    elderName: "Tupã Kwaray (Ancião Guaraní)",
    territory: "Aldeia Tenondé Porã, SP",
    problemSolved: "Manejo correto de ervas sagradas e fortalecimento da imunidade nativa",
    materialType: "Vídeo-Relato",
    description: "Este registro compartilha o conhecimento ancestral sobre o ciclo de colheita e preparo das ervas medicinais nativas da Mata Atlântica. Detalha como a observação das fases da lua e o respeito ao espírito da floresta são fundamentais para reter a força vital. Ensina também a transição do remédio para a imunidade comunitária.",
    link: "https://www.youtube.com/watch?v=tupakwaray",
    createdAt: new Date().toISOString(),
    adaptations: [
      {
        id: "adapt_3_1",
        designerName: "João Pedro (Designer de Serviços de Saúde)",
        contextUsed: "Posto de saúde periférico no sul de São Paulo",
        outcome: "Integramos o calendário lunar e o conhecimento sobre ervas trazido pelo Ancião num folder infográfico em português. Isso aumentou em 70% a adesão de idosos periféricos ao tratamento fitoterápico do posto.",
        date: new Date().toISOString()
      }
    ]
  },
  {
    id: "saber_4",
    elderName: "Seu José do Poço",
    territory: "Vale do Jequitinhonha, MG",
    problemSolved: "Drenagem natural de encostas e contenção seca contra deslizamentos",
    materialType: "Texto/Esquema",
    description: "Construção de muros de contenção usando pedras encaixadas sem massa de cimento (muro seco), deixando espaços para o fluxo natural da água de chuva. Resolve a contenção de estradas ou encostas inclinadas de forma ecológica, permitindo a infiltração lenta e filtragem física da água.",
    link: "https://pt.wikipedia.org/wiki/Muro_de_arrimo",
    createdAt: new Date().toISOString(),
    adaptations: []
  },
  {
    id: "saber_5",
    elderName: "Seu Dito Caiçara",
    territory: "Praia Vermelha, Ubatuba, SP",
    problemSolved: "Produção sustentável de canoas rústicas e conservação do Guapuruvu",
    materialType: "Documentário",
    description: "A canoa esculpida de um tronco só de Guapuruvu caído. O saber envolve o reflorestamento e manejo de sementes nativas rápidas, regenerando as áreas para as próximas gerações. Ensina a não agressão à árvore viva e a ler os ventos e correntes marítimas básicas.",
    link: "https://vimeo.com/caicara",
    createdAt: new Date().toISOString(),
    adaptations: []
  }
];

// Carregar saberes arquivados
function loadSaberes() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_SABERES, null, 2), "utf-8");
      return INITIAL_SABERES;
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao carregar dados do arquivo:", error);
    return INITIAL_SABERES;
  }
}

// Salvar saberes arquivados
function saveSaberes(saberes: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(saberes, null, 2), "utf-8");
  } catch (error) {
    console.error("Erro ao salvar dados no arquivo:", error);
  }
}

// 1. GET ALL SABERES
app.get("/api/saberes", (req, res) => {
  const saberes = loadSaberes();
  res.json({ saberes });
});

// 2. GET SINGLE SABER
app.get("/api/saberes/:id", (req, res) => {
  const saberes = loadSaberes();
  const saber = saberes.find((s: any) => s.id === req.params.id);
  if (!saber) {
    res.status(404).json({ error: "Saber não encontrado." });
    return;
  }
  res.json({ saber });
});

// 3. POST NEW SABER
app.post("/api/saberes", (req, res) => {
  const { elderName, territory, problemSolved, materialType, description, link } = req.body;

  if (!elderName || !territory || !problemSolved || !materialType || !description) {
    res.status(400).json({ error: "Por favor, preencha todos os metadados obrigatórios." });
    return;
  }

  const saberes = loadSaberes();
  const newSaber = {
    id: "saber_" + Date.now(),
    elderName,
    territory,
    problemSolved,
    materialType,
    description,
    link: link || "",
    createdAt: new Date().toISOString(),
    adaptations: []
  };

  saberes.unshift(newSaber); // Insere no início
  saveSaberes(saberes);

  res.status(201).json({ success: true, saber: newSaber });
});

// 4. POST ADAPTATION
app.post("/api/saberes/:id/adaptations", (req, res) => {
  const { designerName, contextUsed, outcome } = req.body;

  if (!designerName || !contextUsed || !outcome) {
    res.status(400).json({ error: "Metadados de reciprocidade e adaptação são obrigatórios." });
    return;
  }

  const saberes = loadSaberes();
  const index = saberes.findIndex((s: any) => s.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ error: "Saber não encontrado." });
    return;
  }

  const newAdaptation = {
    id: "adapt_" + Date.now(),
    designerName,
    contextUsed,
    outcome,
    date: new Date().toISOString()
  };

  saberes[index].adaptations.push(newAdaptation);
  saveSaberes(saberes);

  res.status(201).json({ success: true, adaptation: newAdaptation });
});

// 5. POST AI SEMANTIC SEARCH WITH GEMINI
// Nós usamos o Gemini para mapear o problema do Designer para os Saberes e dar uma pontuação de relevância.
app.post("/api/ai-search", async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === "") {
    res.json({ aiResult: [] });
    return;
  }

  const saberes = loadSaberes();
  const client = getGeminiClient();

  if (!client) {
    // Modo de degradação elegante (fallback por palavra-chave se a chave do Gemini estiver ausente)
    console.log("Gemini API key não configurada. Ativando busca resiliente por palavra-chave...");
    const lowercaseQuery = query.toLowerCase();
    const result = saberes.map((s: any) => {
      let score = 0;
      // pontuação por conteúdo
      if (s.problemSolved.toLowerCase().includes(lowercaseQuery)) score += 8;
      if (s.description.toLowerCase().includes(lowercaseQuery)) score += 5;
      if (s.territory.toLowerCase().includes(lowercaseQuery)) score += 2;

      // pontuação básica de keywords parciais
      const words = lowercaseQuery.split(/\s+/).filter((w: string) => w.length > 3);
      words.forEach((word: string) => {
        if (s.problemSolved.toLowerCase().includes(word)) score += 3;
        if (s.description.toLowerCase().includes(word)) score += 1;
      });

      const matchedScore = score > 10 ? 10 : score;
      let explanation = "";
      if (matchedScore > 0) {
        explanation = `Este saber aborda temas diretamente relacionados a "${query}" por meio do conhecimento de ${s.elderName} em ${s.territory}.`;
      } else {
        explanation = `Relacionado indiretamente por conta das práticas regenerativas comunitárias tradicionais de ${s.territory}.`;
      }

      return {
        id: s.id,
        score: matchedScore || 1, // garante uma nota padrão mínima para preenchimento
        explanation
      };
    });

    res.json({ aiResult: result.sort((a, b) => b.score - a.score), fallbackUserAlert: true });
    return;
  }

  try {
    // Reduzimos o payload enviando apenas os resumos relevantes para o modelo
    const promptInput = saberes.map((s: any) => ({
      id: s.id,
      elderName: s.elderName,
      territory: s.territory,
      problemSolved: s.problemSolved,
      description: s.description
    }));

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Você é o interpretador de saberes ancestrais do Teko Porã.
O designer chegou com a seguinte necessidade de projeto real de design regenerativo: "${query}"

Mapeie e classifique a relevância (de 1 a 10) de cada um dos saberes seguintes em relação à necessidade apresentada.
Retorne um vetor JSON contendo objetos exatamente com esta estrutura:
[
  { "id": "id_do_saber", "score": número_entre_1_e_10, "explanation": "Breve parágrafo explicativo em português explicando como o saber resolve a necessidade" }
]

Aqui estão os saberes disponíveis:
${JSON.stringify(promptInput, null, 2)}
`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              score: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["id", "score", "explanation"]
          }
        }
      }
    });

    const textResult = response.text.trim();
    const parsed = JSON.parse(textResult);
    res.json({ aiResult: parsed });
  } catch (err: any) {
    console.error("Erro na busca de IA com o Gemini:", err);
    // Erros capturados também degradam elegantemente para o fallback de palavra-chave
    res.json({ error: "Erro ao processar busca refinada por IA. Exibindo resultados tradicionais.", fallbackUserAlert: true, aiResult: [] });
  }
});

// Vite middleware para desenvolvimento / servir arquivos estáticos em produção
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Teko Porã Back-end] Servidor escutando na porta ${PORT}`);
  });
}

startServer();
