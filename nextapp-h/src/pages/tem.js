import { useState } from "react";
import { faCloud, faSun, faSnowflake, faCloudRain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function WeatherPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch city suggestions
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
    setQuery(city.name);
    setSuggestions([]); // Hide dropdown after selection
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current_weather=true`)
      .then(res => res.json())
      .then(data => {
        setWeather({ 
          temp: data.current_weather.temperature, 
          condition: data.current_weather.weathercode
        });
      });
  };

  // Weather icons
  const getWeatherIcon = (code) => {
    if ([0, 1].includes(code)) return faSun; // Clear sky
    if ([2, 3].includes(code)) return faCloud; // Cloudy
    if ([51, 53, 55, 61, 63, 65].includes(code)) return faCloudRain; // Rain
    if ([71, 73, 75, 77].includes(code)) return faSnowflake; // Snow
    return faCloud;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-black mb-4">Weather Search</h1>

      {/* Search Input */}
      <div className="relative w-80">
        <input
          type="text"
          placeholder="Search city..."
          className="w-full p-3 border rounded-lg text-black"
          value={query}
          onChange={handleCitySearch}
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white border mt-1 rounded-lg shadow-lg text-black">
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
          <FontAwesomeIcon icon={getWeatherIcon(weather.condition)} className="text-4xl mt-2 text-black" />
          <p className="text-lg mt-2 text-black">{weather.temp}°C</p>
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
            <h2 className="text-xl font-semibold mb-4 text-black">Contact Form</h2>
            <form className="space-y-3">
              <input type="text" placeholder="Name" className="w-full p-2 border rounded text-black" />
              <input type="email" placeholder="Email" className="w-full p-2 border rounded text-black" />
              <textarea placeholder="Message" className="w-full p-2 border rounded text-black"></textarea>
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