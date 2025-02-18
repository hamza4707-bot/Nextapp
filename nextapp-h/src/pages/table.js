import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Pol() {
  const [students, setStudents] = useState([]); // State to store fetched students
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data, error } = await supabase.from("students").select("*");

    if (error) {
      console.error("Error fetching students:", error);
    } else {
      setStudents(data || []); // Store data in state
    }

    setLoading(false);
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-5">
        <h1 className="text-2xl font-bold mb-4">Students</h1>

        {/* List */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-3">
            {students.map((student) => (
              <li key={student.student_id} className="flex items-center justify-between bg-white p-3 rounded shadow">
                {student.first_name} {student.last_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}