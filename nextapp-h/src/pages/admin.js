import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // ✅ Correct import

export default function AdminPanel() {
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("posts");
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 🔄 Fetch posts & events from Supabase
  useEffect(() => {
    async function fetchData() {
      let { data: postsData, error: postsError } = await supabase.from("posts").select("*");
      let { data: eventsData, error: eventsError } = await supabase.from("events").select("*");

      if (!postsError) setPosts(postsData);
      if (!eventsError) setEvents(eventsData);
      setLoading(false);
    }
    fetchData();
  }, []);

  // 📸 Handle image file selection
  const handleImageChange = (e) => setImage(e.target.files[0]);

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !content) return alert("All fields are required!");

    setUploading(true);
    let imageUrl = editing?.image_url || "";

    // 📤 Upload image if selected
    if (image) {
      const fileName = `${Date.now()}-${image.name}`;
      const { data, error } = await supabase.storage.from("images").upload(`posts/${fileName}`, image);

      if (error) {
        alert("Image upload failed");
        setUploading(false);
        return;
      }

      imageUrl = supabase.storage.from("images").getPublicUrl(`posts/${fileName}`).data.publicUrl;
    }

    const table = selectedTab === "posts" ? "posts" : "events";

    if (editing) {
      await supabase
        .from(table)
        .update({ title, description, content, image_url: imageUrl })
        .eq("id", editing.id);
    } else {
      await supabase.from(table).insert([{ title, description, content, image_url: imageUrl }]);
    }

    setUploading(false);
    setTitle("");
    setDescription("");
    setContent("");
    setImage(null);
    setEditing(null);

    // ✅ Fetch updated data without reloading
    const { data: updatedData } = await supabase.from(table).select("*");
    selectedTab === "posts" ? setPosts(updatedData) : setEvents(updatedData);
  };

  // ❌ Handle delete
  const handleDelete = async (id) => {
    const table = selectedTab === "posts" ? "posts" : "events";
    await supabase.from(table).delete().eq("id", id);

    // ✅ Fetch updated data after deletion
    const { data: updatedData } = await supabase.from(table).select("*");
    selectedTab === "posts" ? setPosts(updatedData) : setEvents(updatedData);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 text-white p-5">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <button onClick={() => setSelectedTab("posts")} className="block w-full py-2 px-4 mb-2 text-left bg-gray-700 hover:bg-gray-600 rounded">
          Posts
        </button>
        <button onClick={() => setSelectedTab("events")} className="block w-full py-2 px-4 text-left bg-gray-700 hover:bg-gray-600 rounded">
          Events
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5">
        <h1 className="text-2xl font-bold mb-4">Manage {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}</h1>

        {/* Form for Adding/Editing */}
        <form onSubmit={handleSubmit} className="mb-5 bg-gray-100 p-4 rounded">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title"
            className="w-full p-2 border rounded mb-3" />

          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"
            className="w-full p-2 border rounded mb-3"></textarea>

          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content"
            className="w-full p-2 border rounded mb-3"></textarea>

          <input type="file" accept="image/*" onChange={handleImageChange}
            className="w-full p-2 border rounded mb-3" />

          <button type="submit" disabled={uploading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {uploading ? "Saving..." : editing ? "Update" : "Create"}
          </button>
          {editing && (
            <button onClick={() => setEditing(null)}
              className="ml-3 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              Cancel Edit
            </button>
          )}
        </form>

        {/* List of Posts/Events */}
        {loading ? <p>Loading...</p> : (
          <ul className="space-y-3">
            {(selectedTab === "posts" ? posts : events).map((item) => (
              <li key={item.id} className="flex items-center justify-between bg-white p-3 rounded shadow">
                <div className="flex items-center gap-3">
                  {item.image_url && <img src={item.image_url} alt="" className="w-12 h-12 rounded" />}
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm">{item.description}</p>
                  </div>
                </div>
                <div>
                  <button onClick={() => { setEditing(item); setTitle(item.title); setDescription(item.description); setContent(item.content); }}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}