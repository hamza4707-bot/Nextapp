import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("posts");
  const [editing, setEditing] = useState(null);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // New Fields
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    fetchData();
  }, [selectedTab]);

  async function fetchData() {
    setLoading(true);
    const table = selectedTab === "posts" ? "posts" : "events";
    const { data, error } = await supabase.from(table).select("*");

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setItems(data);
    }

    setLoading(false);
  }

  const handleImageChange = (e) => setImage(e.target.files[0]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !description || !content || (selectedTab === "events" && (!location || !date))) {
      return alert("All fields are required!");
    }

    setUploading(true);
    let imageUrl = editing?.image || "";

    if (image) {
      const fileExtension = image.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExtension}`;
      const { error } = await supabase.storage.from("images").upload(`${selectedTab}/${fileName}`, image);

      if (error) {
        alert("Image upload failed");
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from("images").getPublicUrl(`${selectedTab}/${fileName}`);
      imageUrl = data.publicUrl.split("?")[0];
    }

    const table = selectedTab === "posts" ? "posts" : "events";
    const dataToInsert = { title, description, content, image: imageUrl, type, category, tag };

    if (selectedTab === "events") {
      dataToInsert.location = location;
      dataToInsert.date = date; // Storing date as text
    }

    let response;
    if (editing) {
      response = await supabase.from(table).update(dataToInsert).eq("id", editing.id);
    } else {
      response = await supabase.from(table).insert([dataToInsert]);
    }

    if (response.error) {
      console.error("Error saving data:", response.error);
    }

    setUploading(false);
    resetForm();
    fetchData();
  }

  async function handleDelete(id) {
    const table = selectedTab === "posts" ? "posts" : "events";
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      console.error("Error deleting data:", error);
    } else {
      fetchData();
    }
  }

  function resetForm() {
    setTitle("");
    setLocation("");
    setDate("");
    setDescription("");
    setContent("");
    setImage(null);
    setEditing(null);
    setType("");
    setCategory("");
    setTag("");
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 text-white p-5">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <button onClick={() => setSelectedTab("posts")} className="block w-full py-2 px-4 mb-2 bg-gray-700 hover:bg-gray-600 rounded">
          Posts
        </button>
        <button onClick={() => setSelectedTab("events")} className="block w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded">
          Events
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5">
        <h1 className="text-2xl font-bold mb-4">Manage {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-5 bg-gray-100 p-4 rounded">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title"
            className="w-full p-2 border rounded mb-3" />

          {selectedTab === "events" && (
            <>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location"
                className="w-full p-2 border rounded mb-3" />
              <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date (e.g. 25-Dec-2025 to 12-Dec-2034)"
                className="w-full p-2 border rounded mb-3" />
            </>
          )}

          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"
            className="w-full p-2 border rounded mb-3"></textarea>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content"
            className="w-full p-2 border rounded mb-3"></textarea>

          {/* New Fields */}
          <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Type"
            className="w-full p-2 border rounded mb-3" />
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category"
            className="w-full p-2 border rounded mb-3" />
          <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Tag"
            className="w-full p-2 border rounded mb-3" />

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

        {/* List */}
        {loading ? <p>Loading...</p> : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between bg-white p-3 rounded shadow">
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  {selectedTab === "events" && <p>{item.location} - {item.date}</p>}
                </div>
                <div>
                  <button onClick={() => setEditing(item)} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
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