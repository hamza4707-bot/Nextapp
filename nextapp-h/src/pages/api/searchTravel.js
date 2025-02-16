import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { startDate, endDate, keywords, location, type, category } = req.query;

  let query = supabase.from('events').select('*'); // Select everything, including `tag`

  if (startDate && endDate) {
    query = query.gte('date', startDate).lte('date', endDate);
  }

  if (keywords) {
    query = query.or(`title.ilike.%${keywords}%, description.ilike.%${keywords}%`);
  }

  if (location) {
    query = query.ilike('location', `%${location}%`);
  }

  if (type) {
    query = query.ilike('type', `%${type}%`); // Keep 'type' as is
}

if (category) {
    query = query.ilike('category', `%${category}%`); // Use 'cat' instead of 'category'
}

  const { data, error } = await query;

  console.log("Fetched Events:", data); // Debugging ✅

  if (error) {
    console.error("Supabase Error:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}