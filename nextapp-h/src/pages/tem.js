import { useState } from "react";
import { faCloud, faSun, faSnowflake, faCloudRain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function WeatherPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to fetch city suggestions (using a static list for demo)
  const handleCitySearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 2) {
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${value}`)
        .then(res => res.json())
        .then(data => setSuggestions(data.results || []));
    } else {
      setSuggestions([]);
    }
  };

  // Fetch weather data
  const fetchWeather = (city) => {
    setWeather(null);
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current_weather=true`)
      .then(res => res.json())
      .then(data => {
        setWeather({ temp: data.current_weather.temperature, condition: "Clear" });
      });
  };

  // Weather icons
  const getWeatherIcon = (condition) => {
    if (condition.includes("sun")) return faSun;
    if (condition.includes("cloud")) return faCloud;
    if (condition.includes("rain")) return faCloudRain;
    if (condition.includes("snow")) return faSnowflake;
    return faCloud;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Weather Search</h1>

      {/* Search Input */}
      <div className="relative w-80">
        <input
          type="text"
          placeholder="Search city..."
          className="w-full p-3 border rounded-lg"
          value={query}
          onChange={handleCitySearch}
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white border mt-1 rounded-lg shadow-lg">
            {suggestions.map((city, idx) => (
              <li
                key={idx}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => fetchWeather(city)}
              >
                {city.name}, {city.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Weather Display */}
      {weather && (
        <div className="mt-6 p-4 bg-white shadow-md rounded-lg text-center">
          <FontAwesomeIcon icon={getWeatherIcon(weather.condition.toLowerCase())} className="text-4xl mt-2" />
          <p className="text-lg mt-2">{weather.temp}°C</p>
        </div>
      )}

      {/* Open Modal Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Open Form
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Contact Form</h2>
            <form className="space-y-3">
              <input type="text" placeholder="Name" className="w-full p-2 border rounded" />
              <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
              <textarea placeholder="Message" className="w-full p-2 border rounded"></textarea>
              <button className="w-full py-2 bg-blue-500 text-white rounded">Submit</button>
            </form>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}