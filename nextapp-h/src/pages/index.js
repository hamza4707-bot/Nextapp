import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

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

  const limit = 6;

  const fetchEvents = async (reset = false) => {
    setLoading(true);

    const params = new URLSearchParams({
      keywords,
      location,
      type,
      category,
      // Ensure startDate and endDate are formatted in 'YYYY-MM-DD' format for the API
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

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setKeywords('');
    setLocation('');
    setType('');
    setCategory('');
    fetchEvents(true);
  };

  // Log date format whenever startDate or endDate is updated
  const logDateFormat = (date, label) => {
    if (date) {
      console.log(`${label} selected date: ${date.toISOString().split('T')[0]}`);
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Find Events</h1>

      {/* Search Filters */}
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

        {/* Start Date Picker */}
        <div className="relative">
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              logDateFormat(date, 'Start Date'); // Log the start date format
              if (endDate && date > endDate) setEndDate(null); // Ensure valid range
            }}
            className="border p-2 rounded-md w-full"
            placeholderText="Start Date"
            dateFormat="dd-MM-yyyy" // Keep this format for UI
          />
        </div>

        {/* End Date Picker */}
        <div className="relative">
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              setEndDate(date);
              logDateFormat(date, 'End Date'); // Log the end date format
            }}
            className="border p-2 rounded-md w-full"
            placeholderText="End Date"
            dateFormat="dd-MM-yyyy" // Keep this format for UI
            minDate={startDate} // Prevent selecting an end date before start date
          />
        </div>

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

      {/* Search & Reset Buttons */}
      <div className="flex gap-4">
        <button 
          onClick={() => fetchEvents(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>

        <button 
          onClick={resetFilters}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Reset
        </button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              {event.image && (
                <img src={event.image} alt={event.title} className="w-full h-56 object-cover rounded-md mb-4" />
              )}

              <h5 className="capitalize text-black text-2xl font-semibold mb-2">{event.title}</h5>

              <p className="text-gray-700 mb-4">{event.description}</p>

              <p className="text-gray-700 mb-2">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                {event.start_date} to {event.end_date}
              </p>
              <p className="text-gray-700 mb-4">
                <FontAwesomeIcon icon={faLocationArrow} className="mr-2" />
                {event.location}
              </p>

              <Link href={`/events/${event.id}`}>
                <span className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer">
                  View Event
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;