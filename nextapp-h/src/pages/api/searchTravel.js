import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { keywords, location, type, category, date, limit = 5, offset = 0 } = req.query;

  console.log("Received Params:", { keywords, location, type, category, date, limit, offset });

  let query = supabase.from('events').select('*');

  if (keywords) {
    console.log("Filtering by keywords:", keywords);
    query = query.or(`(title.ilike.%${keywords}%,description.ilike.%${keywords}%)`);
  }

  if (location) {
    console.log("Filtering by location:", location);
    query = query.ilike('location', `%${location}%`);
  }

  if (type) {
    console.log("Filtering by type:", type);
    query = query.ilike('type', `%${type}%`);
  }

  if (category) {
    console.log("Filtering by category:", category);
    query = query.ilike('category', `%${category}%`);
  }

  if (date) {
    console.log("Filtering by date:", date);
    query = query.ilike('date', `%${date}%`);
  }

  // Pagination
  query = query.range(Number(offset), Number(offset) + Number(limit) - 1);

  const { data, error } = await query;

  if (error) {
    console.error("Supabase Error:", error);
    return res.status(500).json({ error: error.message });
  }

  console.log("Query Result:", data);
  return res.status(200).json(data);
}