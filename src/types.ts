export interface Adaptacao {
  id: string;
  designerName: string;
  contextUsed: string; // Contexto onde foi aplicado/adaptado
  outcome: string; // Resultado ou lições aprendidas
  date: string; // Data do registro
}

export interface Saber {
  id: string;
  elderName: string; // Nome do ancião
  territory: string; // Território/Comunidade de origem
  problemSolved: string; // Problema resolvido
  materialType: string; // Vídeo, Artigo, Documentário, Texto/Esquema, etc.
  description: string; // Descrição curta
  link: string; // Link para o material original
  createdAt: string;
  adaptations: Adaptacao[];
}
