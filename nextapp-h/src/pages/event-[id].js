import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Adjust if your Supabase instance is elsewhere
import Menu from '../components/Menu';
import Footer from '../components/Footer';

const EventPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return; 
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
      
      if (error) {
        console.error('Error fetching event:', error);
      } else {
        setEvent(data);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p className="text-center text-xl mt-10">Loading event...</p>;
  if (!event) return <p className="text-center text-xl mt-10">Event not found.</p>;

  return (
    <div>
      <Menu />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-black">{event.title}</h1>
        <img src={event.image} alt={event.title} className="w-full max-h-96 object-cover mt-4 rounded-lg" />
        <p className="text-gray-700 mt-4">{event.excerpt}</p>
        <p className="text-gray-700 mt-2"><strong>Date:</strong> {event.date}</p>
        <p className="text-gray-700 mt-2"><strong>Location:</strong> {event.location}</p>
      </div>
      <Footer />
    </div>
  );
};

export default EventPage;