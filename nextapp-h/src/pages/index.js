import { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import Footer from '../components/Footer';

const Home = () => {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [allArticles, setAllArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState(5);
  const [loading, setLoading] = useState(false);

  // Fetch events from API
  const fetchArticles = async (params = {}) => {
    setLoading(true);
    console.log("Fetching with params:", params);

    const response = await fetch(`/api/searchTravel?${new URLSearchParams(params)}`);
    const articles = await response.json();

    setLoading(false);
    return articles;
  };

  // Handle search with filters
  const handleSearch = async () => {
    const params = {
      keywords,
      location,
      type,
      category,
      date,
      offset: 0,
    };

    console.log("Search Params:", params);

    const filtered = await fetchArticles(params);
    setAllArticles(filtered);
    setFilteredArticles(filtered.slice(0, 5));
    setVisibleEvents(5);
  };

  // Load more events
  const loadMoreEvents = async () => {
    setLoading(true);

    const offset = visibleEvents;

    const params = {
      keywords,
      location,
      type,
      category,
      date,
      offset,
    };

    console.log("Loading More with Params:", params);

    const newArticles = await fetchArticles(params);

    setAllArticles((prev) => [...prev, ...newArticles]);
    setFilteredArticles((prev) => [...prev, ...newArticles]);
    setVisibleEvents((prev) => prev + 5);

    setLoading(false);
  };

  // Initial fetch on page load
  useEffect(() => {
    const initialFetch = async () => {
      const initialArticles = await fetchArticles();
      setAllArticles(initialArticles);
      setFilteredArticles(initialArticles.slice(0, 5));
    };

    initialFetch();
  }, []);

  return (
    <div>
      <Menu />
      <div className="container mx-auto mt-10 px-4">
        <h1 className="text-4xl font-bold mb-8 text-black text-center">
          Find Your Next Adventure!
        </h1>

        {/* Search Filters */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="p-3 border border-gray-300 rounded-md text-black"
            placeholder="Search for events"
          />

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-3 border border-gray-300 rounded-md text-black"
            placeholder="Enter location"
          />

          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-md text-black"
            placeholder="Enter date range (e.g., March 1 - March 5)"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-3 border border-gray-300 rounded-md text-black"
          >
            <option value="">Select Type</option>
            <option value="festival">Festival</option>
            <option value="concert">Concert</option>
            <option value="sports">Sports</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border border-gray-300 rounded-md text-black"
          >
            <option value="">Select Category</option>
            <option value="music">Music</option>
            <option value="art">Art</option>
            <option value="outdoor">Outdoor</option>
          </select>
        </div>

        <button 
          onClick={handleSearch}
          className="bg-blue-500 text-white px-6 py-3 rounded-md"
        >
          Search
        </button>

        {/* Event List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-lg p-6">
              <h5 className="text-2xl font-semibold">{article.title}</h5>
              <p>{article.date} - {article.location}</p>
              <p>{article.type} | {article.category}</p>
            </div>
          ))}
        </div>

        {/* Load More */}
        <button
          onClick={loadMoreEvents}
          disabled={loading}
          className="bg-green-500 text-white px-6 py-3 rounded-md mt-6"
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Home;