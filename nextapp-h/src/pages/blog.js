import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Menu from '../components/Menu'; 
import Footer from '../components/Footer';
export async function getServerSideProps() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, image, description, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return { props: { posts: [] } };
  }

  return {
    props: { posts },
  };
}

const Blog = ({ posts }) => {
  return (
<Menu />
    <div className="container mx-auto mt-5 px-4">
      <h1 className="text-4xl font-bold mb-8 text-black">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
              <p className="text-gray-600">{post.description}</p>
              {/* ✅ Fix: Remove '/blog/' from the path */}
              <Link href={`Blogs/${post.id}`} className="text-blue-500 mt-2 block">
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
<Footer />
  );
};

export default Blog;