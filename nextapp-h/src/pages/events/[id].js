import { useRouter } from "next/router";

export async function getServerSideProps({ params }) {
  const { id } = params;

  // Fetch all events from your API
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/searchTravel`);
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

  return (
    <div className="container mx-auto mt-5 px-4">
      <h1 className="text-4xl font-bold text-black">{event.title}</h1>
      <img src={event.image} alt={event.title} className="w-full h-96 object-cover my-4" />
      <div className="mt-4 text-gray-800">{event.content}</div>
      <button onClick={() => router.back()} className="mt-6 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300">
        Back
      </button>
    </div>
  );
};

export default EventPage;