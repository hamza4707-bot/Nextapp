import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Menu from '../components/Menu'; 
import Footer from '../components/Footer';
import DatePicker from 'react-datepicker'; 
import "react-datepicker/dist/react-datepicker.css"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faLocationArrow } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [allArticles, setAllArticles] = useState([]);

  // Fetch all articles on initial load
  useEffect(() => {
    const fetchArticles = async () => {
      const response = await fetch('/api/searchTravel'); // No filter, get all articles
      const articles = await response.json();
      setAllArticles(articles);
      setFilteredArticles(articles);
    };

    fetchArticles();
  }, []);

  // Fetch articles whenever filters change (debounced to optimize API calls)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keywords, location, type, category]);

  // Function to handle Enter key press and trigger filtering
  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Toggle calendar dropdown visibility
  const toggleCalendar = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  // Handle outside click detection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) && 
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Handle search/filter logic
  const handleSearch = async () => {
    const params = new URLSearchParams();

    if (startDate) params.append("startDate", startDate.toISOString());
    if (endDate) params.append("endDate", endDate.toISOString());
    if (keywords) params.append("keywords", keywords);
    if (location) params.append("location", location);
    if (type) params.append("type", type);
    if (category) params.append("category", category);

    const response = await fetch(`/api/searchTravel?${params.toString()}`);
    const filtered = await response.json();
    setFilteredArticles(filtered);
  };

  const clearDateRange = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredArticles(allArticles);
    setDropdownOpen(false);
  };

  return (
    <div className="">
      <Menu /> {/* Include the Menu Component */}
      
      <div className="container mx-auto mt-30 px-2 ml-5">
        <h1 className="text-4xl font-bold mb-8 text-black text-center opacity-80">
          Looking for a new adventure this weekend in Orange County, California?
        </h1>
        <h3 className="text-2xl font-bold mb-8 text-black text-center opacity-80">
          Search for an adventure below!
        </h3>

        {/* Search Section */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Keywords Search */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm text-gray-600">Keyword</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              onKeyUp={handleKeyUp} 
              className="p-3 border border-gray-300 rounded-md text-black"
              placeholder="Search for events"
            />
          </div>

          {/* Location Search */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm text-gray-600">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyUp={handleKeyUp} 
              className="p-3 border border-gray-300 rounded-md text-black"
              placeholder="Enter location"
            />
          </div>

          {/* Type Filter */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm text-gray-600">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-3 border border-gray-300 rounded-md text-black"
            >
              <option value="">Select Type</option>
              <option value="adventure">Adventure</option>
              <option value="relaxation">Relaxation</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm text-gray-600">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-3 border border-gray-300 rounded-md text-black"
            >
              <option value="">Select Category</option>
              <option value="hiking">Hiking</option>
              <option value="beach">Beach</option>
              <option value="museum">Museum</option>
              <option value="concert">Concert</option>
            </select>
          </div>
        </div>

        {/* Grid of Filtered Articles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src={article.image} alt={article.title} className="w-full h-56 object-cover" />
              <div className="p-6">
                <h5 className="text-black text-2xl font-semibold mb-4">{article.title}</h5>
                <p className="text-gray-700 mb-4">{article.excerpt}</p>
                <p className="text-gray-700 mb-4">
                  <FontAwesomeIcon icon={faClock} className="mr-2" />
                  {article.date}
                </p>
                <p className="text-gray-700 mb-4">
                  <FontAwesomeIcon icon={faLocationArrow} className="mr-2" />
                  {article.location}
                </p>
                <Link href={`/events/${article.id}`} className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  View Event
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;