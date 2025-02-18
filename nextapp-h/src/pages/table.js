import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Table() {
  const [data, setData] = useState([]); // Stores fetched data
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("students"); // Default tab

  useEffect(() => {
    fetchData();
  }, [selectedTab]);

  async function fetchData() {
    setLoading(true);
    const table = selectedTab === "students" ? "students" : "teachers";
    const { data, error } = await supabase.from(table).select("*");

    if (error) {
      console.error(`Error fetching ${selectedTab}:`, error);
    } else {
      setData(data);
    }

    setLoading(false);
  }

  async function handleDelete(id) {
    const table = selectedTab === "students" ? "students" : "teachers";
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      console.error("Error deleting data:", error);
    } else {
      fetchData();
    }
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4 text-black">Students and Teachers</h1>

      {/* Tabs */}
      <div className="mb-5">
        <button
          onClick={() => setSelectedTab("students")}
          className={`px-4 py-2 text-black ${selectedTab === "students" ? "bg-blue-500 text-white" : "bg-gray-300"} rounded`}
        >
          Students
        </button>
        <button
          onClick={() => setSelectedTab("teachers")}
          className={`ml-2 px-4 py-2 text-black ${selectedTab === "teachers" ? "bg-blue-500 text-white" : "bg-gray-300"} rounded`}
        >
          Teachers
        </button>
      </div>

      {loading ? (
        <p className="text-black">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead className="bg-gray-200 text-black">
              <tr>
                {selectedTab === "students" ? (
                  <>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Roll Number</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Actions</th>
                  </>
                ) : (
                  <>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Teacher Name</th>
                    <th className="border p-2">Subject</th>
                    <th className="border p-2">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="text-black">
              {data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-100">
                  {selectedTab === "students" ? (
                    <>
                      <td className="border p-2">{item.id}</td>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2">{item.roll_number}</td>
                      <td className="border p-2">{item.email}</td>
                    </>
                  ) : (
                    <>
                      <td className="border p-2">{item.id}</td>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2">{item.subject}</td>
                    </>
                  )}
                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}