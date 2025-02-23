import { useState, useEffect } from "react"; import { supabase } from "@/lib/supabase"; import FullCalendar from "@fullcalendar/react"; import dayGridPlugin from "@fullcalendar/daygrid"; import interactionPlugin from "@fullcalendar/interaction"; import { Tabs, Tab, Button, TextField, } from "@mui/material";

export default function Dashboard() { const [selectedTab, setSelectedTab] = useState("calendar"); const [subTab, setSubTab] = useState("view"); const [data, setData] = useState([]); const [loading, setLoading] = useState(true); const [formData, setFormData] = useState({}); const [events, setEvents] = useState([]);

useEffect(() => { if (selectedTab !== "calendar") fetchData(); }, [selectedTab]);

async function fetchData() { setLoading(true); const table = selectedTab; const { data, error } = await supabase.from(table).select("*"); if (!error) setData(data || []); setLoading(false); }

async function handleAddEntry() { const table = selectedTab; const { data, error } = await supabase.from(table).insert([formData]); if (!error) { setFormData({}); fetchData(); } }

function handleDateClick(info) { const title = prompt("Enter Event Title"); if (title) { setEvents([...events, { title, start: info.dateStr }]); } }

return ( <div className="flex h-screen bg-gray-100"> {/* Sidebar */} <aside className="w-64 bg-white p-5 shadow-md"> <h2 className="text-lg font-bold mb-4">Dashboard</h2> <ul className="space-y-2"> <li> <button onClick={() => setSelectedTab("calendar")} className="w-full text-left p-2 hover:bg-gray-200 rounded">Calendar</button> </li> <li> <button onClick={() => setSelectedTab("students")} className="w-full text-left p-2 hover:bg-gray-200 rounded">Students</button> </li> <li> <button onClick={() => setSelectedTab("teachers")} className="w-full text-left p-2 hover:bg-gray-200 rounded">Teachers</button> </li> </ul> </aside>

{/* Main Content */}
  <main className="flex-1 p-5">
    {selectedTab === "calendar" ? (
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
      />
    ) : (
      <>
        <Tabs value={subTab} onChange={(e, v) => setSubTab(v)}>
          <Tab label="View" value="view" />
          <Tab label="Add" value="add" />
        </Tabs>
        {subTab === "add" ? (
          <div className="mt-4 p-4 bg-white shadow rounded">
            {selectedTab === "teachers" ? (
              <>
                <TextField label="Name" fullWidth className="mb-2" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <TextField label="Subject" fullWidth className="mb-2" onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                <TextField label="Email" fullWidth className="mb-2" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <TextField label="Password" fullWidth className="mb-2" type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </>
            ) : (
              <>
                <TextField label="Name" fullWidth className="mb-2" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <TextField label="Roll Number" fullWidth className="mb-2" onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} />
                <TextField label="Grade" fullWidth className="mb-2" onChange={(e) => setFormData({...formData, grade: e.target.value})} />
                <TextField label="Courses" fullWidth className="mb-2" onChange={(e) => setFormData({...formData, courses: e.target.value})} />
                <TextField label="Email" fullWidth className="mb-2" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <TextField label="Password" fullWidth className="mb-2" type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </>
            )}
            <Button variant="contained" color="primary" onClick={handleAddEntry}>Add Entry</Button>
          </div>
        ) : (
          <div className="mt-4 bg-white p-4 shadow rounded">
            <h3 className="text-lg font-bold mb-2">{selectedTab} List</h3>
            {loading ? <p>Loading...</p> : data.map((item, i) => <p key={i}>{JSON.stringify(item)}</p>)}
          </div>
        )}
      </>
    )}
  </main>
</div>

); }

