import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Pol() {
  const [students, setStudents] = useState([]);
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
      setStudents(data || []);
    }

    setLoading(false);
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4 text-black">Students List</h1>

      {loading ? (
        <p className="text-black">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr className="bg-black text-white">
                <th className="border border-black p-2">Student ID</th>
                <th className="border border-black p-2">Full Name</th>
                <th className="border border-black p-2">Roll Number</th>
                <th className="border border-black p-2">Date of Birth</th>
                <th className="border border-black p-2">Gender</th>
                <th className="border border-black p-2">Email</th>
                <th className="border border-black p-2">Phone Number</th>
                <th className="border border-black p-2">Address</th>
                <th className="border border-black p-2">City</th>
                <th className="border border-black p-2">State</th>
                <th className="border border-black p-2">Country</th>
                <th className="border border-black p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.student_id} className="text-black">
                  <td className="border border-black p-2">{student.student_id}</td>
                  <td className="border border-black p-2">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="border border-black p-2">{student.roll_number}</td>
                  <td className="border border-black p-2">{student.date_of_birth}</td>
                  <td className="border border-black p-2">{student.gender}</td>
                  <td className="border border-black p-2">{student.email}</td>
                  <td className="border border-black p-2">{student.phone_number}</td>
                  <td className="border border-black p-2">{student.address}</td>
                  <td className="border border-black p-2">{student.city}</td>
                  <td className="border border-black p-2">{student.state}</td>
                  <td className="border border-black p-2">{student.country}</td>
                  <td className="border border-black p-2">{student.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}