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
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";

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
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#121212" }}>
      {/* Sidebar */}
      <Drawer
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
            bgcolor: "#1f1f1f",
            color: "#fff",
            borderRight: "none",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem button onClick={() => setSelectedTab("students")}>
            <ListItemText primary="Students" sx={{ color: "#fff" }} />
          </ListItem>
          <Divider sx={{ bgcolor: "#333" }} />
          <ListItem button onClick={() => setSelectedTab("teaches")}>
            <ListItemText primary="Teachers" sx={{ color: "#fff" }} />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#121212",
          color: "#fff",
          p: 3,
          overflow: "auto",
        }}
      >
        <AppBar position="sticky" sx={{ bgcolor: "#1E293B" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Tabs */}
        <Tabs
          value={selectedTab}
          onChange={(event, newValue) => setSelectedTab(newValue)}
          indicatorColor="secondary"
          textColor="inherit"
          sx={{
            mt: 3,
            bgcolor: "#1f1f1f",
            borderRadius: 1,
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Tab label="Students" value="students" sx={{ fontWeight: "bold" }} />
          <Tab label="Teachers" value="teaches" sx={{ fontWeight: "bold" }} />
        </Tabs>

        {/* Data Tables */}
        {loading ? (
          <div className="flex justify-center items-center mt-5">
            <CircularProgress sx={{ color: "#1E293B" }} />
          </div>
        ) : selectedTab === "students" ? (
          <TableContainer
            component={Paper}
            sx={{
              mt: 3,
              bgcolor: "#2c2c2c",
              borderRadius: 2,
              boxShadow: 3,
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "#1E293B" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Student ID
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Full Name
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Roll Number
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Date of Birth
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Gender
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Phone
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Address
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    City
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    State
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Country
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Created At
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.student_id} hover sx={{ bgcolor: "#333" }}>
                    <TableCell>{student.student_id}</TableCell>
                    <TableCell>
                      {student.first_name} {student.last_name}
                    </TableCell>
                    <TableCell>{student.roll_number}</TableCell>
                    <TableCell>{student.date_of_birth}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.phone_number}</TableCell>
                    <TableCell>{student.address}</TableCell>
                    <TableCell>{student.city}</TableCell>
                    <TableCell>{student.state}</TableCell>
                    <TableCell>{student.country}</TableCell>
                    <TableCell>
                      {new Date(student.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              mt: 3,
              bgcolor: "#2c2c2c",
              borderRadius: 2,
              boxShadow: 3,
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "#1E293B" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Teach ID
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Student ID
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Subject Name
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Teacher Name
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Start Date
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    End Date
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Grade
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.teach_id} hover sx={{ bgcolor: "#333" }}>
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