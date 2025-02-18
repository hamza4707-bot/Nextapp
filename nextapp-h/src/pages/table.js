import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Table() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("students"); // Default to 'students' tab

  // Fetch data based on the selected tab
  useEffect(() => {
    fetchData();
  }, [selectedTab]);

  async function fetchData() {
    setLoading(true);

    if (selectedTab === "students") {
      // Fetch students data from Supabase
      const { data, error } = await supabase.from("students").select("*");
      if (error) {
        console.error("Error fetching students:", error);
      } else {
        setStudents(data);
      }
    } else if (selectedTab === "teachers") {
      // Fetch teachers data from Supabase
      const { data, error } = await supabase.from("teaches").select("*");
      if (error) {
        console.error("Error fetching teachers:", error);
      } else {
        setTeachers(data);
      }
    }

    setLoading(false);
  }

  // Handle table row delete
  async function handleDelete(id) {
    const table = selectedTab === "students" ? "students" : "teaches";
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      console.error("Error deleting data:", error);
    } else {
      fetchData(); // Re-fetch data after delete
    }
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Students and Teachers</h1>

      {/* Tab buttons */}
      <div className="mb-5">
        <button
          onClick={() => setSelectedTab("students")}
          className={`px-4 py-2 ${selectedTab === "students" ? "bg-blue-500" : "bg-gray-300"} text-white rounded`}
        >
          Students
        </button>
        <button
          onClick={() => setSelectedTab("teachers")}
          className={`ml-2 px-4 py-2 ${selectedTab === "teachers" ? "bg-blue-500" : "bg-gray-300"} text-white rounded`}
        >
          Teachers
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {selectedTab === "students" && (
            <>
              <h2 className="text-xl font-bold mb-3">Students</h2>
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="border-b p-2">ID</th>
                    <th className="border-b p-2">Name</th>
                    <th className="border-b p-2">Roll Number</th>
                    <th className="border-b p-2">Email</th>
                    <th className="border-b p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="border-b p-2">{student.student_id}</td>
                      <td className="border-b p-2">{student.first_name} {student.last_name}</td>
                      <td className="border-b p-2">{student.roll_number}</td>
                      <td className="border-b p-2">{student.email}</td>
                      <td className="border-b p-2">
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {selectedTab === "teachers" && (
            <>
              <h2 className="text-xl font-bold mb-3">Teachers</h2>
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="border-b p-2">ID</th>
                    <th className="border-b p-2">Subject</th>
                    <th className="border-b p-2">Teacher Name</th>
                    <th className="border-b p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td className="border-b p-2">{teacher.teach_id}</td>
                      <td className="border-b p-2">{teacher.subject_name}</td>
                      <td className="border-b p-2">{teacher.teacher_name}</td>
                      <td className="border-b p-2">
                        <button
                          onClick={() => handleDelete(teacher.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
}