import { useState, useEffect } from 'react';
import { Input, Button, Select, SelectItem, DatePicker } from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
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

  const fetchEvents = async (reset = false) => {
    setLoading(true);

    const params = new URLSearchParams({
      keywords,
      location,
      type,
      category,
      startDate: startDate || '',
      endDate: endDate || '',
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
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchEvents(true);
  }, [keywords, location, type, category, startDate, endDate]);

  const resetFilters = () => {
    setLoading(true);
    setStartDate(null);
    setEndDate(null);
    setKeywords('');
    setLocation('');
    setType('');
    setCategory('');
    setEvents([]);
    setOffset(0);
    setHasMore(true);
  };

  return (
    <>
      <Menu />

      <div className="bg-white min-h-screen py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold mb-6 text-center text-black">Find Events</h1>

          {/* Search Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Input
              label="Search events"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="text-black placeholder-black"
            />

            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="text-black placeholder-black"
            />

            <DatePicker
              label="Start Date"
              selected={startDate}
              onChange={setStartDate}
              variant="bordered"
              className="text-black"
            />

            <DatePicker
              label="End Date"
              selected={endDate}
              onChange={setEndDate}
              minValue={startDate}
              variant="bordered"
              className="text-black"
            />

            <Select
              label="Event Type"
              selectedKeys={[type]}
              onChange={(e) => setType(e.target.value)}
              className="text-black"
            >
              <SelectItem key="">All Types</SelectItem>
              <SelectItem key="amusement">Amusement Parks</SelectItem>
              <SelectItem key="hikes">Hikes</SelectItem>
              <SelectItem key="museums">Museums</SelectItem>
            </Select>

            <Select
              label="Category"
              selectedKeys={[category]}
              onChange={(e) => setCategory(e.target.value)}
              className="text-black"
            >
              <SelectItem key="">All Categories</SelectItem>
              <SelectItem key="date">Date Night</SelectItem>
              <SelectItem key="family">Family Fun</SelectItem>
            </Select>
          </div>

          {/* Search & Reset Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => fetchEvents(true)}
              color="primary"
              size="lg"
              className="px-6 py-3"
            >
              Search
            </Button>

            <Button
              onClick={resetFilters}
              color="secondary"
              variant="flat"
              size="lg"
              className="px-6 py-3"
            >
              Reset
            </Button>
          </div>

          {/* Events List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {loading && (
              <div className="flex justify-center mt-4">
                <span>Loading...</span>
              </div>
            )}

            {events.map((event) => (
              <div key={event.id} className="bg-white shadow-lg rounded-lg p-6 border">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-56 object-cover rounded-md mb-4"
                  />
                )}

                <h5 className="text-black text-2xl font-semibold mb-2">{event.title}</h5>

                {event.type && (
                  <span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm mb-2">
                    {event.type}
                  </span>
                )}

                <p className="text-black mb-2">
                  <FontAwesomeIcon icon={faClock} className="mr-2" />
                  {event.start_date} to {event.end_date}
                </p>
                <p className="text-black mb-4">
                  <FontAwesomeIcon icon={faLocationArrow} className="mr-2" />
                  {event.location}
                </p>

                <Link href={`/events/${event.id}`}>
                  <Button color="primary" size="md" className="w-full px-6 py-3">
                    View Event
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && !loading && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={() => fetchEvents(false)}
                color="primary"
                size="lg"
                className="px-6 py-3"
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;