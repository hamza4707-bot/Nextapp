import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { startDate, endDate, keywords, location } = req.query;

  // Start building the query from the 'events' table
  let query = supabase.from('events').select('*');

  // Filter by date range if both startDate and endDate are provided
  if (startDate && endDate) {
    const start = new Date(startDate).toISOString().split('T')[0];
    const end = new Date(endDate).toISOString().split('T')[0];

    query = query.gte('date', start).lte('date', end);
  }

  // Filter by keywords in title and excerpt
  if (keywords) {
    query = query.or(`title.ilike.%${keywords}%, description.ilike.%${keywords}%`);
  }

  // Filter by location
  if (location) {
    query = query.ilike('location', `%${location}%`);
  }

  // Execute the query
  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}