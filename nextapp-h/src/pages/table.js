import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("students"); // Default tab is students

  useEffect(() => {
    fetchData();
  }, [selectedTab]);

  async function fetchData() {
    setLoading(true);
    if (selectedTab === "students") {
      const { data, error } = await supabase.from("students").select("*");
      if (error) {
        console.error("Error fetching students:", error);
      } else {
        setStudents(data || []);
      }
    } else if (selectedTab === "teaches") {
      const { data, error } = await supabase.from("teaches").select("*");
      if (error) {
        console.error("Error fetching teaches:", error);
      } else {
        setTeachers(data || []);
      }
    }
    setLoading(false);
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem button onClick={() => setSelectedTab("students")}>
            <ListItemText primary="Students" />
          </ListItem>
          <ListItem button onClick={() => setSelectedTab("teaches")}>
            <ListItemText primary="Teachers" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6">Dashboard</Typography>
          </Toolbar>
        </AppBar>

        {/* Tabs */}
        <Tabs
          value={selectedTab}
          onChange={(event, newValue) => setSelectedTab(newValue)}
          indicatorColor="secondary"
          textColor="inherit"
          sx={{ mt: 2 }}
        >
          <Tab label="Students" value="students" />
          <Tab label="Teachers" value="teaches" />
        </Tabs>

        {/* Data Tables */}
        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : selectedTab === "students" ? (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Roll Number</TableCell>
                  <TableCell>Date of Birth</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.student_id}>
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
        ) : (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Teach ID</TableCell>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Subject Name</TableCell>
                  <TableCell>Teacher Name</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Grade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.teach_id}>
                    <TableCell>{teacher.teach_id}</TableCell>
                    <TableCell>{teacher.student_id}</TableCell>
                    <TableCell>{teacher.subject_name}</TableCell>
                    <TableCell>{teacher.teacher_name}</TableCell>
                    <TableCell>{teacher.start_date}</TableCell>
                    <TableCell>{teacher.end_date}</TableCell>
                    <TableCell>{teacher.grade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}