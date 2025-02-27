import { useState, useEffect } from 'react';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 2; // Load 2 events at a time
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await fetch(`/api/events?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    
    if (data.length < limit) {
      setHasMore(false); // No more events to load
    }
    
    setEvents((prev) => [...prev, ...data]);
    setOffset((prev) => prev + limit);
  };

  return (
    <div className="container">
      {/* Event Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <h2>{event.title}</h2>
            <p>{event.date}</p>
            <p>{event.location}</p>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={fetchEvents}
            className="bg-white text-black font-semibold px-6 py-3 rounded-lg shadow-md transition-all hover:shadow-xl hover:bg-gray-100 border border-gray-300"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;