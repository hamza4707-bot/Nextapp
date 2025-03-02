import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Header from "../components/Header";
import Menu from "../components/Menu";
import Footer from "../components/Footer";

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
  const [hasMore, setHasMore] = useState(true);

  const limit = 2;

  // Fetch events from the API
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
    if (data.length < limit) {
      setHasMore(false); // No more events to load
    }
  };

  // Fetch events on component mount and when filters change
  useEffect(() => {
    fetchEvents(true);
  }, [keywords, location, type, category, startDate, endDate]);

  // Reset filters
  const resetFilters = () => {
    setLoading(true); // Show loader while resetting

    // Reset all state variables
    setStartDate(null);
    setEndDate(null);
    setKeywords('');
    setLocation('');
    setType('');
    setCategory('');
    setEvents([]); // Clear the event list
    setOffset(0);
    setHasMore(true);

    // No need for setTimeout, useEffect will handle the fetch
  };

  return (
    <>
      
      <Menu />

      <div className="container mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">Find Events</h1>

        {/* Search Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Keywords Filter */}
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Search events..."
            className="border p-2 rounded-md text-black"
          />

          {/* Location Filter */}
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location..."
            className="border p-2 rounded-md text-black"
          />

          {/* Start Date Picker */}
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                if (endDate && date > endDate) setEndDate(null); // Ensure valid range
              }}
              className="border p-2 rounded-md w-full text-black"
              placeholderText="Start Date"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          {/* End Date Picker */}
          <div className="relative text-black">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="border p-2 rounded-md w-full text-black"
              placeholderText="End Date"
              dateFormat="yyyy-MM-dd"
              minDate={startDate}
            />
          </div>

          {/* Type Filter */}
          <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded-md text-black">
            <option value="">All Types</option>
            <option value="amusement">Amusement Parks</option>
            <option value="animals">Animals & Aquariums</option>
            <option value="beaches">Beaches</option>
            <option value="caves">Caves</option>
            <option value="chair">Chair Champs</option>
            <option value="fair">Fairs & Festivals</option>
            <option value="food">Food Halls / Court</option>
            <option value="free">Free is for Me!</option>
            <option value="girls">Girls at Night</option>
            <option value="hikes">Hikes</option>
            <option value="lakes">Lakes</option>
            <option value="move">Move Your Body</option>
            <option value="museums">Museums</option>
            <option value="art">Museums – Art</option>
            <option value="nature">Nature Centers</option>
            <option value="parks">Parks with Perks</option>
            <option value="race">Race & Endurance Events</option>
            <option value="rainy">Rainy Day (Indoor activities)</option>
            <option value="rentals">Rentals</option>
            <option value="scavenger">Scavenger Hunts</option>
            <option value="splash">Splash Pads</option>
            <option value="tours">Tours</option>
            <option value="unique">Unique Food Experiences</option>
            <option value="volunteering">Volunteering (with no obligation)</option>
            <option value="wild">Wild & Wacky</option>
            <option value="zen">Zen Out</option>
          </select>

          {/* Category Filter */}
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded-md text-black">
            <option value="">All Categories</option>
            <option value="date">Date Night</option>
            <option value="family">Family Fun</option>
            <option value="solo">Flying solo</option>
            <option value="group">Group Galivanting</option>
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
          {loading && (
            <div className="flex justify-center mt-4">
              <span>Loading...</span>
            </div>
          )}
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                {event.image && (
                  <img src={event.image} alt={event.title} className="w-full h-56 object-cover rounded-md mb-4" />
                )}

                <h5 className="capitalize text-black text-2xl font-semibold mb-2">{event.title}</h5>

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

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => fetchEvents(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Home;