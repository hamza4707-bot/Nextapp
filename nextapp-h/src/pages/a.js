"use client";
import { useState, useEffect } from 'react';
import { Input, Button, Select, SelectItem, Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
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
    if (data.length < limit) setHasMore(false);
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

      <div className="container mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">Find Events</h1>

        {/* Search Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Input
            label="Search Events"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />

          <Input
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                if (endDate && date > endDate) setEndDate(null);
              }}
              className="border p-2 rounded-md w-full"
              placeholderText="Start Date"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="border p-2 rounded-md w-full"
              placeholderText="End Date"
              dateFormat="yyyy-MM-dd"
              minDate={startDate}
            />
          </div>

          <Select label="Event Type" value={type} onChange={setType}>
            {[
              "amusement", "animals", "beaches", "caves", "chair", "fair", "food",
              "free", "girls", "hikes", "lakes", "move", "museums", "art",
              "nature", "parks", "race", "rainy", "rentals", "scavenger", "splash",
              "tours", "unique", "volunteering", "wild", "zen"
            ].map((value) => (
              <SelectItem key={value} value={value}>{value}</SelectItem>
            ))}
          </Select>

          <Select label="Category" value={category} onChange={setCategory}>
            {["date", "family", "solo", "group"].map((value) => (
              <SelectItem key={value} value={value}>{value}</SelectItem>
            ))}
          </Select>
        </div>

        {/* Search & Reset Buttons */}
        <div className="flex gap-4">
          <Button color="primary" onClick={() => fetchEvents(true)}>Search</Button>
          <Button color="secondary" onClick={resetFilters}>Reset</Button>
        </div>

        {/* Events List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {loading && (
            <div className="flex justify-center mt-4">
              <span>Loading...</span>
            </div>
          )}

          {events.map((event) => (
            <Card key={event.id}>
              {event.image && <Image src={event.image} alt={event.title} width="100%" height={200} />}
              <CardHeader>
                <h5 className="capitalize text-black text-2xl font-semibold">{event.title}</h5>
              </CardHeader>
              <CardBody>
                {event.type && <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">{event.type}</span>}

                <p className="text-gray-700">
                  <FontAwesomeIcon icon={faClock} className="mr-2" />
                  {event.start_date} to {event.end_date}
                </p>
                <p className="text-gray-700">
                  <FontAwesomeIcon icon={faLocationArrow} className="mr-2" />
                  {event.location}
                </p>

                <Link href={`/events/${event.id}`}>
                  <Button color="primary">View Event</Button>
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>

        {hasMore && !loading && (
          <div className="flex justify-center mt-4">
            <Button color="primary" onClick={() => fetchEvents(false)}>Load More</Button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Home;