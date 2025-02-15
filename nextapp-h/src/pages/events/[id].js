import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons"; // Import Facebook icon

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

  // Function to generate Facebook share URL
  const shareOnFacebook = () => {
    const shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(shareURL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container mx-auto mt-5 px-4">
      <h1 className="text-4xl font-bold text-black">{event.title}</h1>
      <img src={event.image} alt={event.title} className="w-full h-96 object-cover my-4" />
      <div className="mt-4 text-gray-800">{event.content}</div>

      {/* Date and Location */}
      <h2 className="text-xl font-semibold mt-4">📅 Date: {event.date}</h2>
      <h2 className="text-xl font-semibold mt-2">📍 Location: {event.location}</h2>

      {/* Facebook Share Button */}
      <button 
        onClick={shareOnFacebook} 
        className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        <FontAwesomeIcon icon={faFacebook} /> Share on Facebook
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