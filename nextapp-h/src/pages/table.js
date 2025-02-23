import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt } from "react-icons/fa";
import { AiOutlineUserAdd } from "react-icons/ai";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("students");
  const [subTab, setSubTab] = useState("view");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, [selectedTab]);

  async function fetchData() {
    setLoading(true);
    const { data, error } = await supabase.from(selectedTab).select("*");
    if (error) console.error(error);
    else setData(data || []);
    setLoading(false);
  }

  async function handleAddEntry() {
    const { error } = await supabase.from(selectedTab).insert([formData]);
    if (error) console.error(error);
    else {
      setFormData({});
      fetchData();
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaCalendarAlt className="mr-2" /> Dashboard
        </h2>
        <ul className="space-y-3">
          <li className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-200"
              onClick={() => setSelectedTab("calendar")}>
            <FaCalendarAlt className="mr-2" /> Calendar
          </li>
          <li className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-200"
              onClick={() => setSelectedTab("students")}>
            <FaUserGraduate className="mr-2" /> Students
          </li>
          <li className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-200"
              onClick={() => setSelectedTab("teachers")}>
            <FaChalkboardTeacher className="mr-2" /> Teachers
          </li>
          <li className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-200"
              onClick={() => setSelectedTab("attendance")}>
            <AiOutlineUserAdd className="mr-2" /> Attendance
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Tabs */}
        {selectedTab !== "calendar" && (
          <div className="mb-4 flex space-x-4">
            <button className={`px-4 py-2 rounded ${subTab === "view" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setSubTab("view")}>
              View
            </button>
            <button className={`px-4 py-2 rounded ${subTab === "add" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setSubTab("add")}>
              Add
            </button>
          </div>
        )}

        {/* Calendar */}
        {selectedTab === "calendar" ? (
          <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />
        ) : (
          <>
            {/* View Table */}
            {subTab === "view" ? (
              loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : (
                <div className="bg-white p-4 rounded shadow-md">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        {data.length > 0 &&
                          Object.keys(data[0]).map((key) => (
                            <th key={key} className="p-2 text-left">{key.toUpperCase()}</th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <tr key={index} className="border-t">
                          {Object.values(row).map((value, idx) => (
                            <td key={idx} className="p-2">{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              // Add New Entry Form
              <div className="bg-white p-4 rounded shadow-md">
                {data.length > 0 && Object.keys(data[0]).map((key) => (
                  key !== "id" && (
                    <div key={key} className="mb-3">
                      <label className="block text-sm font-medium">{key.toUpperCase()}</label>
                      <input type="text"
                             className="w-full p-2 border rounded"
                             onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))} />
                    </div>
                  )
                ))}
                <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={handleAddEntry}>
                  Add Entry
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}