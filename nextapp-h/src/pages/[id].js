import { supabase } from "@/lib/supabase";

export async function getServerSideProps({ params }) {
  const { data: post, error } = await supabase
    .from("posts")
    .select("id, title, image, description, content, created_at")
    .eq("id", params.id)
    .single();

  if (error || !post) {
    console.error("Error fetching post:", error);
    return { notFound: true };
  }

  return {
    props: { post },
  };
}

const PostPage = ({ post }) => {
  return (
    <div className="container mx-auto mt-5 px-4">
      <h1 className="text-4xl font-bold text-black">{post.title}</h1>
      <img src={post.image} alt={post.title} className="w-full h-96 object-cover my-4" />
      <p className="text-gray-600">{post.description}</p>
      {/* ✅ Display Full Blog Content */}
      <div className="mt-4 text-gray-800">{post.content}</div>
    </div>
  );
};

export default PostPage;