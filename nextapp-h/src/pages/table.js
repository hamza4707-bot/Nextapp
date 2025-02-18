// src/pages/table.js
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Table() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [activeTab, setActiveTab] = useState('students');

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchData() {
      // Fetch students data
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*');
      if (studentError) console.error(studentError);
      else setStudents(studentData);

      // Fetch teachers data
      const { data: teacherData, error: teacherError } = await supabase
        .from('teaches')
        .select('*');
      if (teacherError) console.error(teacherError);
      else setTeachers(teacherData);
    }

    fetchData();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-xl text-black-500 font-bold mb-6">Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <button
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeTab === 'students' ? 'bg-gray-600' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('students')}
            >
              Students
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeTab === 'teachers' ? 'bg-gray-600' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('teachers')}
            >
              Teachers
            </button>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">{activeTab === 'students' ? 'Students' : 'Teachers'} Data</h1>
        {activeTab === 'students' && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border border-gray-300">ID</th>
                  <th className="px-4 py-2 border border-gray-300">First Name</th>
                  <th className="px-4 py-2 border border-gray-300">Last Name</th>
                  <th className="px-4 py-2 border border-gray-300">Roll Number</th>
                  <th className="px-4 py-2 border border-gray-300">Email</th>
                  <th className="px-4 py-2 border border-gray-300">Gender</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.student_id}>
                    <td className="px-4 py-2 border border-gray-300">{student.student_id}</td>
                    <td className="px-4 py-2 border border-gray-300">{student.first_name}</td>
                    <td className="px-4 py-2 border border-gray-300">{student.last_name}</td>
                    <td className="px-4 py-2 border border-gray-300">{student.roll_number}</td>
                    <td className="px-4 py-2 border border-gray-300">{student.email}</td>
                    <td className="px-4 py-2 border border-gray-300">{student.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'teachers' && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border border-gray-300">ID</th>
                  <th className="px-4 py-2 border border-gray-300">Subject</th>
                  <th className="px-4 py-2 border border-gray-300">Teacher Name</th>
                  <th className="px-4 py-2 border border-gray-300">Start Date</th>
                  <th className="px-4 py-2 border border-gray-300">End Date</th>
                  <th className="px-4 py-2 border border-gray-300">Grade</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.teach_id}>
                    <td className="px-4 py-2 border border-gray-300">{teacher.teach_id}</td>
                    <td className="px-4 py-2 border border-gray-300">{teacher.subject_name}</td>
                    <td className="px-4 py-2 border border-gray-300">{teacher.teacher_name}</td>
                    <td className="px-4 py-2 border border-gray-300">{teacher.start_date}</td>
                    <td className="px-4 py-2 border border-gray-300">{teacher.end_date}</td>
                    <td className="px-4 py-2 border border-gray-300">{teacher.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}