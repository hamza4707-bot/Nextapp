import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { startDate, endDate, keywords, location, type, category, limit = 6, offset = 0 } = req.query;

  let query = supabase.from('events').select('*');

  // Use startDate and endDate directly without modification since the db stores them in 'yyyy-MM-dd' format
if (startDate && endDate) {
  query = query.or(`
    (start_date >= '${startDate}' AND start_date <= '${endDate}'),
    (end_date >= '${startDate}' AND end_date <= '${endDate}'),
    (start_date <= '${startDate}' AND end_date >= '${endDate}')
  `);
}

  // Handle other filters like keywords, location, type, category
  // Handle keywords filter for title only
if (keywords) {
  query = query.ilike('title', `%${keywords}%`);
}



  if (location) {
    query = query.ilike('location', `%${location}%`);
  }

  if (type) {
    query = query.ilike('type', `%${type}%`);
  }

  if (category) {
    query = query.ilike('category', `%${category}%`);
  }

  // Pagination: Fetch only the required number of events
  query = query.range(Number(offset), Number(offset) + Number(limit) - 1);

  const { data, error } = await query;

  if (error) {
    console.error("Supabase Error:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}