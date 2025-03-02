import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { startDate, endDate, keywords, location, type, category, limit = 6, offset = 0 } = req.query;

  let query = supabase.from('events').select('*');
if (startDate && endDate) {
  // Search within the date range
  query = query.or(`
    (start_date.gte.${startDate} AND start_date.lte.${endDate}),
    (end_date.gte.${startDate} AND end_date.lte.${endDate}),
    (start_date.lte.${startDate} AND end_date.gte.${endDate})
  `);
} else if (startDate) {
  // Search where event starts from or after startDate
  query = query.gte("start_date", startDate);
} else if (endDate) {
  // Search where event ends on or before endDate
  query = query.lte("end_date", endDate);
}
if (keywords.trim() !== '') {
  query = query.ilike('title', `%${keywords.trim()}%`);
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