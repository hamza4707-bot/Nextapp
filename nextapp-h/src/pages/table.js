import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt, FaPlus, FaEye } from "react-icons/fa";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("students"); 
  const [subTab, setSubTab] = useState("view"); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchData();
  }, [selectedTab, subTab]);

  const fetchData = async () => {
    setLoading(true);
    const table = selectedTab;

    const { data, error } = await supabase.from(table).select("*");

    if (error) {
      console.error(`Error fetching ${table}:`, error);
    } else {
      setData(data || []);
    }

    setLoading(false);
  };

  const handleAddEntry = async () => {
    const table = selectedTab;

    const { data, error } = await supabase.from(table).insert([formData]);

    if (error) {
      console.error(`Error adding entry to ${table}:`, error);
    } else {
      setFormData({});
      fetchData();
    }
  };

  const handleDateClick = (arg) => {
    const title = prompt("Enter event title:");
    if (title) {
      setEvents([...events, { title, date: arg.dateStr }]);
    }
  };

  return (
    <Box className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <Drawer variant="permanent" className="w-64 bg-gray-200 p-4">
        <List>
          <ListItem button onClick={() => setSelectedTab("calendar")}>
            <ListItemIcon><FaCalendarAlt /></ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItem>
          <ListItem button onClick={() => setSelectedTab("students")}>
            <ListItemIcon><FaUserGraduate /></ListItemIcon>
            <ListItemText primary="Students" />
          </ListItem>
          <ListItem button onClick={() => setSelectedTab("teachers")}>
            <ListItemIcon><FaChalkboardTeacher /></ListItemIcon>
            <ListItemText primary="Teachers" />
          </ListItem>
          <ListItem button onClick={() => setSelectedTab("attendance")}>
            <ListItemIcon><FaEye /></ListItemIcon>
            <ListItemText primary="Attendance" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box className="flex-1 p-6">
        {/* Show Calendar */}
        {selectedTab === "calendar" ? (
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
          />
        ) : (
          <>
            {/* Tabs for View / Add */}
            <Tabs
              value={subTab}
              onChange={(event, newValue) => setSubTab(newValue)}
              className="mb-4"
            >
              <Tab icon={<FaEye />} label="View" value="view" />
              <Tab icon={<FaPlus />} label="Add" value="add" />
            </Tabs>

            {/* View Data Table */}
            {subTab === "view" ? (
              loading ? (
                <Box className="flex justify-center mt-4">
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper} className="shadow-md">
                  <Table>
                    <TableHead className="bg-gray-300">
                      <TableRow>
                        {data.length > 0 &&
                          Object.keys(data[0]).map((key) => (
                            <TableCell key={key} className="font-bold">
                              {key.toUpperCase()}
                            </TableCell>
                          ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((row, index) => (
                        <TableRow key={index} className="hover:bg-gray-100">
                          {Object.values(row).map((value, idx) => (
                            <TableCell key={idx}>{value}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )
            ) : (
              // Add New Entry Form
              <Box className="mt-4">
                {Object.keys(formData).length === 0 && data.length > 0 ? (
                  Object.keys(data[0]).map((key) => (
                    <TextField
                      key={key}
                      label={key.toUpperCase()}
                      variant="outlined"
                      fullWidth
                      className="mb-2 bg-white"
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                    />
                  ))
                ) : (
                  <p>No data structure found for form fields.</p>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  className="mt-2"
                  onClick={handleAddEntry}
                >
                  Add Entry
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}