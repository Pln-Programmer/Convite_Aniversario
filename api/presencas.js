import { createClient } from '@supabase/supabase-js';

// Conecta com as variáveis de ambiente que vamos cadastrar na Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Libera acessos CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET: Busca todas as crianças confirmadas
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('presencas')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    }

    // POST: Cadastra o nome de uma criança
    if (req.method === 'POST') {
      const { nome } = req.body;
      if (!nome) return res.status(400).json({ error: 'Nome da criança é obrigatório' });

      const { data, error } = await supabase
        .from('presencas')
        .insert([{ nome }])
        .select();

      if (error) throw error;
      return res.status(201).json(data[0]);
    }

    // PUT: Edita o nome de uma criança cadastrada
    if (req.method === 'PUT') {
      const { id, nome } = req.body;
      if (!id || !nome) return res.status(400).json({ error: 'ID e Nome são obrigatórios' });

      const { data, error } = await supabase
        .from('presencas')
        .update({ nome })
        .eq('id', id)
        .select();

      if (error) throw error;
      return res.status(200).json(data[0]);
    }

    // DELETE: Exclui uma criança da lista
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID é obrigatório' });

      const { error } = await supabase
        .from('presencas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Removido com sucesso' });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erro no servidor' });
  }
}