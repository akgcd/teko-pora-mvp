import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("saberes")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ saberes: data });
  }

  if (req.method === "POST") {
    const { elderName, territory, problemSolved, materialType, link, description } = req.body;

    if (!elderName || !territory || !problemSolved || !materialType || !description) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    const { data, error } = await supabase
      .from("saberes")
      .insert([
        {
          elderName,
          territory,
          problemSolved,
          materialType,
          link: link || "",
          description,
          createdAt: new Date().toISOString(),
          adaptations: [],
        },
      ])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ saber: data });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).json({ error: "Method not allowed" });
}