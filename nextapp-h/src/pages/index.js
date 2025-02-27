 import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faLocationArrow } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);
const [filteredArticles, setFilteredArticles] = useState([]);
const [keywords, setKeywords] = useState('');
const [location, setLocation] = useState('');
const [type, setType] = useState('');
const [category, setCategory] = useState('');
const [allArticles, setAllArticles] = useState([]);

useEffect(() => {
const fetchArticles = async () => {
const response = await fetch('/api/searchTravel');
const articles = await response.json();
setAllArticles(articles);
setFilteredArticles(articles);
};

fetchArticles();

}, []);

useEffect(() => {
const delayDebounceFn = setTimeout(() => {
handleSearch();
}, 500);

return () => clearTimeout(delayDebounceFn);

}, [keywords, location, type, category, startDate, endDate]);

const formatDate = (date) => date ? date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

const handleSearch = async () => {
const params = new URLSearchParams();

if (startDate) params.append("startDate", formatDate(startDate));  
if (endDate) params.append("endDate", formatDate(endDate));  
if (keywords) params.append("keywords", keywords);  
if (location) params.append("location", location);  
if (type) params.append("type", type);  
if (category) params.append("category", category);  

const response = await fetch(`/api/searchTravel?${params.toString()}`);  
const filtered = await response.json();  
setFilteredArticles(filtered);

};

return (
<div className="">
<Menu />
<div className="container mx-auto mt-30 px-2 ml-5">
<h1 className="text-4xl font-bold mb-8 text-black text-center opacity-80">
Looking for a new adventure this weekend in Orange County, California?
</h1>
<h3 className="text-2xl font-bold mb-8 text-black text-center opacity-80">
Search for an adventure below!
</h3>

{/* 🔍 Search Filters */}  
    <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">  
      {/* 🔎 Keyword Search */}  
      <div className="flex flex-col">  
        <label className="mb-2 text-sm text-gray-600">Keyword</label>  
        <input  
          type="text"  
          value={keywords}  
          onChange={(e) => setKeywords(e.target.value)}  
          className="p-3 border border-gray-300 rounded-md text-black"  
          placeholder="Search for events"  
        />  
      </div>  

      {/* 📍 Location Filter */}  
      <div className="flex flex-col">  
        <label className="mb-2 text-sm text-gray-600">Location</label>  
        <input  
          type="text"  
          value={location}  
          onChange={(e) => setLocation(e.target.value)}  
          className="p-3 border border-gray-300 rounded-md text-black"  
          placeholder="Enter location"  
        />  
      </div>  

      {/* 📅 Start Date Picker */}  
      <div className="flex flex-col">  
        <label className="mb-2 text-sm text-gray-600">Start Date</label>  
        <DatePicker  
          selected={startDate}  
          onChange={(date) => setStartDate(date)}  
          className="p-3 border border-gray-300 rounded-md text-black w-full"  
          dateFormat="dd-MMM-yyyy"  
          placeholderText="Select start date"  
        />  
      </div>  

      {/* 📅 End Date Picker */}  
      <div className="flex flex-col">  
        <label className="mb-2 text-sm text-gray-600">End Date</label>  
        <DatePicker  
          selected={endDate}  
          onChange={(date) => setEndDate(date)}  
          className="p-3 border border-gray-300 rounded-md text-black w-full"  
          dateFormat="dd-MMM-yyyy"  
          placeholderText="Select end date"  
        />  
      </div>  

      {/* 🏷️ Type Filter */}  
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

      {/* 🏷️ Category Filter */}  
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

    {/* 📌 Filtered Events List */}  
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">  
      {filteredArticles.map((article) => (  
        <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden">  
          <div className="p-6">  
            <img src={article.image} alt={article.title} className="w-full h-56 object-cover rounded-md mb-4" />  

            <h5 className=" capitalize text-black text-2xl font-semibold mb-2">{article.title}</h5>  

            {article.tag && (  
              <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">  
                {article.tag}  
              </span>  
            )}  

            <p className="text-gray-700 mb-4">{article.excerpt}</p>  

            <p className="text-gray-700 mb-2">  
              <FontAwesomeIcon icon={faClock} className="mr-2" />  
              {article.date}  
            </p>  
            <p className="text-gray-700 mb-4">  
              <FontAwesomeIcon icon={faLocationArrow} className="mr-2" />  
              {article.location}  
            </p>  

            <Link href={`/events/${article.id}`}>  
              <span className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer">  
                View Event  
              </span>  
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

