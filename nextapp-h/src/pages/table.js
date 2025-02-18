import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, CircularProgress 
} from "@mui/material";

export default function StudentTable() {
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
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "#333" }}>
        Students List
      </Typography>

      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1E293B" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Student ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Full Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Roll Number</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date of Birth</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Gender</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Address</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>City</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>State</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Country</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.student_id} hover>
                  <TableCell>{student.student_id}</TableCell>
                  <TableCell>{student.first_name} {student.last_name}</TableCell>
                  <TableCell>{student.roll_number}</TableCell>
                  <TableCell>{student.date_of_birth}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone_number}</TableCell>
                  <TableCell>{student.address}</TableCell>
                  <TableCell>{student.city}</TableCell>
                  <TableCell>{student.state}</TableCell>
                  <TableCell>{student.country}</TableCell>
                  <TableCell>{new Date(student.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}