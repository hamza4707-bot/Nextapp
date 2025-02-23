import { useState, useEffect } from "react"; import { supabase } from "@/lib/supabase"; import FullCalendar from "@fullcalendar/react"; import dayGridPlugin from "@fullcalendar/daygrid"; import interactionPlugin from "@fullcalendar/interaction"; import { FaUserGraduate, FaChalkboardTeacher, FaClipboardList, FaCalendarAlt } from "react-icons/fa"; import { Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab, Button, TextField, Typography, } from "@mui/material";

export default function Dashboard() { const [selectedTab, setSelectedTab] = useState("students"); const [subTab, setSubTab] = useState("view"); const [data, setData] = useState([]); const [loading, setLoading] = useState(true); const [formData, setFormData] = useState({}); const [events, setEvents] = useState([]);

useEffect(() => { fetchData(); }, [selectedTab, subTab]);

const fetchData = async () => { setLoading(true); const table = selectedTab; const { data, error } = await supabase.from(table).select("*"); if (error) console.error(Error fetching ${table}:, error); else setData(data || []); setLoading(false); };

const handleAddEntry = async () => { const table = selectedTab; const { data, error } = await supabase.from(table).insert([formData]); if (error) console.error(Error adding entry to ${table}:, error); else { setFormData({}); fetchData(); } };

const handleDateClick = (info) => { const title = prompt("Enter event title"); if (title) { setEvents([...events, { title, date: info.dateStr }]); } };

return ( <Box className="flex min-h-screen bg-white text-black"> {/* Sidebar */} <Box className="w-64 bg-gray-100 p-5 space-y-4"> <Typography variant="h6" className="flex items-center space-x-2"> <FaCalendarAlt /> <span>Dashboard</span> </Typography> <nav className="space-y-3"> <button className="flex items-center space-x-2" onClick={() => setSelectedTab("calendar")}> <FaCalendarAlt /> <span>Calendar</span> </button> <button className="flex items-center space-x-2" onClick={() => setSelectedTab("students")}> <FaUserGraduate /> <span>Students</span> </button> <button className="flex items-center space-x-2" onClick={() => setSelectedTab("teachers")}> <FaChalkboardTeacher /> <span>Teachers</span> </button> <button className="flex items-center space-x-2" onClick={() => setSelectedTab("attendance")}> <FaClipboardList /> <span>Attendance</span> </button> </nav> </Box>

{/* Main Content */}
  <Box className="flex-1 p-5">
    {selectedTab === "calendar" ? (
      <FullCalendar plugins={[dayGridPlugin, interactionPlugin]} initialView="dayGridMonth" events={events} dateClick={handleDateClick} />
    ) : (
      <>
        <Tabs value={subTab} onChange={(e, val) => setSubTab(val)} textColor="primary" indicatorColor="primary">
          <Tab label="View" value="view" />
          <Tab label="Add" value="add" />
        </Tabs>

        {subTab === "view" ? (
          loading ? (
            <CircularProgress className="my-5" />
          ) : (
            <TableContainer component={Paper} className="shadow-md">
              <Table>
                <TableHead className="bg-gray-200">
                  <TableRow>
                    {data.length > 0 && Object.keys(data[0]).map((key) => (
                      <TableCell key={key} className="font-bold">{key.toUpperCase()}</TableCell>
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
          <Box className="mt-5 space-y-3">
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => (
                <TextField
                  key={key}
                  label={key.toUpperCase()}
                  variant="outlined"
                  fullWidth
                  className="bg-white"
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                />
              ))}
            <Button variant="contained" color="primary" onClick={handleAddEntry}>Add Entry</Button>
          </Box>
        )}
      </>
    )}
  </Box>
</Box>

); }

