import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { startDate, endDate, keywords, location, type, category, limit = 6, offset = 0 } = req.query;

  let query = supabase.from('events').select('*');

  // Format the startDate and endDate if provided
  if (startDate && endDate) {
    // Ensure the date is in 'YYYY-MM-DD' format for comparison
    const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

    // Query to match the start_date and end_date range
    query = query.or(`
      (start_date >= '${formattedStartDate}' AND start_date <= '${formattedEndDate}'),
      (end_date >= '${formattedStartDate}' AND end_date <= '${formattedEndDate}'),
      (start_date <= '${formattedStartDate}' AND end_date >= '${formattedEndDate}')
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