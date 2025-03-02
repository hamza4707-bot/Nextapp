import { useRouter } from "next/router";
import { FaFacebook } from "react-icons/fa"; // Import Facebook icon
import { useEffect, useState } from "react";

export async function getServerSideProps({ params }) {
  const { id } = params;

  // Fetch all events from your API
  const res = await fetch(`https://trip1o.netlify.app/api/searchTravel`);
  const events = await res.json();

  // Find the specific event by ID
  const event = events.find((event) => event.id === id);

  // If no event is found, return a 404 page
  if (!event) {
    return { notFound: true };
  }

  return { props: { event } };
}

const EventPage = ({ event }) => {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState("");
  const [isExpanded, setIsExpanded] = useState(false); // State to control expand/collapse

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Function to generate Facebook share URL
  const shareOnFacebook = () => {
    const shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(shareURL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container mx-auto mt-5 px-4">
      <h1 className="text-4xl font-bold text-black">{event.title}</h1>
      <img src={event.image} alt={event.title} className="w-full h-96 object-cover my-4" />
      <div className="mt-4 text-gray-800">{event.content}</div>

      {/* Date and Location */}
      <h2 className="text-xl text-black font-semibold mt-4">📅 Date: {event.date}</h2>
      <h2 className="text-xl text-black font-semibold mt-2">📍 Location: {event.location}</h2>

      {/* Expand/Collapse Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="mt-4 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
      >
        {isExpanded ? "Show Less" : "More Event Info"}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Click the link for more content:</h3>
          <a 
            href={event.el} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline"
          >
            {event.el}
          </a>
        </div>
      )}

      {/* Facebook Share Button */}
      <button 
        onClick={shareOnFacebook} 
        className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        <FaFacebook className="mr-2" /> Share on Facebook
      </button>

      {/* Back Button */}
      <button 
        onClick={() => router.back()} 
        className="mt-4 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
      >
        Back
      </button>
    </div>
  );
};

export default EventPage;