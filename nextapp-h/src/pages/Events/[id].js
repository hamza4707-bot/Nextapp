import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";

export async function getServerSideProps({ params }) {
  const { id } = params;

  console.log("Fetching Event ID:", id);  // Debugging ✅

  const { data: event, error } = await supabase
    .from("events")
    .select("id, title, image, content, created_at")
    .eq("id", id)
    .single();

  if (error || !event) {
    console.error("Event Not Found:", error);
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