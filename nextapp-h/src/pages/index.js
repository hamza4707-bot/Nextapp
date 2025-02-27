import { useState, useEffect } from 'react';
import Link from 'next/link';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 2; // Load 2 events at a time
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    if (loading) return;
    setLoading(true);

    const response = await fetch(`/api/events?limit=${limit}&offset=${offset}`);
    const data = await response.json();

    if (data.length < limit) {
      setHasMore(false); // No more events to load
    }

    setEvents((prev) => [...prev, ...data]);
    setOffset((prev) => prev + limit);
    setLoading(false);
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-4xl font-bold mb-6 text-black text-center opacity-80">
        Discover Exciting Events Near You!
      </h1>

      {/* Event Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-lg p-6">
            <img src={event.image} alt={event.title} className="w-full h-56 object-cover rounded-md mb-4" />
            <h2 className="text-2xl font-semibold">{event.title}</h2>
            <p className="text-gray-600">{event.date}</p>
            <p className="text-gray-600">{event.location}</p>
            <Link href={`/events/${event.id}`}>
              <span className="block bg-blue-500 text-white text-center py-2 mt-4 rounded-md cursor-pointer">
                View Event
              </span>
            </Link>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={fetchEvents}
            disabled={loading}
            className="bg-white text-black font-semibold px-6 py-3 rounded-lg shadow-md transition-all hover:shadow-xl hover:bg-gray-100 border border-gray-300"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home$