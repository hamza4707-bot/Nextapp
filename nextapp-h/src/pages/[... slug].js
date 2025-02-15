import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const { params } = context;

  if (!params.slug || params.slug.length < 2) {
    return { notFound: true };
  }

  const [type, id] = params.slug; // Extract type (event/blog) and id
  const table = type === "event" ? "events" : "posts";

  // Fetch data from the correct table
  const { data: post, error } = await supabase
    .from(table)
    .select("id, title, image, description, content, created_at")
    .eq("id", id)
    .single();

  if (error || !post) {
    console.error(`Error fetching from ${table}:`, error);
    return { notFound: true };
  }

  return {
    props: { post, type },
  };
}

const PostPage = ({ post, type }) => {
  const router = useRouter();

  return (
    <div className="container mx-auto mt-5 px-4">
      {/* Display "Event" or "Blog" based on type */}
      <h1 className="text-4xl font-bold text-black">
        {type === "event" ? "Event: " : "Blog: "} {post.title}
      </h1>

      <img src={post.image} alt={post.title} className="w-full h-96 object-cover my-4" />
      <p className="text-gray-600">{post.description}</p>

      {/* Full Content */}
      <div className="mt-4 text-gray-800">{post.content}</div>

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mt-6 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
      >
        Back
      </button>
    </div>
  );
};

export default PostPage;