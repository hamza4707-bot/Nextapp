import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { startDate, endDate, keywords, location, type, category, limit = 6, offset = 0 } = req.query;

  let query = supabase.from('events').select('*');

  // Date handling: Match start and end date range
  if (startDate && endDate) {
    const formattedStartDate = new Date(startDate.split('-').reverse().join('-')).toISOString().split('T')[0];
    const formattedEndDate = new Date(endDate.split('-').reverse().join('-')).toISOString().split('T')[0];

    // Query to match the start_date and end_date separately
    query = query.or(`
      (start_date >= '${formattedStartDate}' AND end_date <= '${formattedEndDate}'),
      (start_date <= '${formattedEndDate}' AND end_date >= '${formattedStartDate}')
    `);
  }

  // Handle other filters like keywords, location, type, category
  if (keywords) {
    query = query.or(`title.ilike.%${keywords}%, description.ilike.%${keywords}%`);
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