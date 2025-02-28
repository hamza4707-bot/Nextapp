import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Home = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [events, setEvents] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 6; // Number of events to load

  // Fetch events from API
  const fetchEvents = async (reset = false) => {
    setLoading(true);

    const params = new URLSearchParams({
      keywords,
      location,
      type,
      category,
      startDate: startDate ? startDate.toISOString().split('T')[0] : '',
      endDate: endDate ? endDate.toISOString().split('T')[0] : '',
      offset: reset ? 0 : offset,
      limit,
    });

    const response = await fetch(`/api/searchTravel?${params}`);
    const data = await response.json();

    if (reset) {
      setEvents(data);
      setOffset(limit);
    } else {
      setEvents((prev) => [...prev, ...data]);
      setOffset((prev) => prev + limit);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEvents(true);
  }, []);

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Find Events</h1>

      {/* 🔍 Search Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Search events..."
          className="border p-2 rounded-md"
        />

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location..."
          className="border p-2 rounded-md"
        />

        {/* 📅 Date Pickers (Start & End Date) */}
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="border p-2 rounded-md"
          placeholderText="Start Date"
          dateFormat="yyyy-MM-dd"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          className="border p-2 rounded-md"
          placeholderText="End Date"
          dateFormat="yyyy-MM-dd"
        />

        <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded-md">
          <option value="">All Types</option>
          <option value="festival">Festival</option>
          <option value="concert">Concert</option>
          <option value="sports">Sports</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded-md">
          <option value="">All Categories</option>
          <option value="music">Music</option>
          <option value="art">Art</option>
          <option value="outdoor">Outdoor</option>
        </select>
      </div>

      {/* Search Button */}
      <button 
        onClick={() => fetchEvents(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Search
      </button>

      {/* 📌 Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {events.map((event) => (
          <div key={event.id} className="border p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="text-gray-600">{event.description}</p>
            <p className="text-sm"><strong>Location:</strong> {event.location}</p>
            <p className="text-sm"><strong>Date:</strong> {event.date}</p>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {events.length >= limit && (
        <button
          onClick={() => fetchEvents(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded-md mt-6"
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default Home;