import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
export async function getServerSideProps({ params }) {
  const { id } = params;

  const { data: post, error } = await supabase
    .from("posts")
    .select("id, title, image, content, created_at")
    .eq("id", id)
    .single();

  if (error || !post) {
    console.error("Error fetching post:", error);
    return { notFound: true };
  }

  return { props: { post } };
}

const BlogPost = ({ post }) => {
  const router = useRouter();

  return (

    <div className="container mx-auto mt-5 px-4">
      <h1 className="text-4xl font-bold text-black">{post.title}</h1>
      <img src={post.image} alt={post.title} className="w-full h-96 object-cover my-4" />
      <div className="mt-4 text-gray-800">{post.content}</div>
      <button onClick={() => router.back()} className="mt-6 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300">
        Back
      </button>
    </div>

  );
};

export default BlogPost;
