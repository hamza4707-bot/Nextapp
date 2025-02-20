import { useState, useEffect } from "react"; import { supabase } from "@/lib/supabase"; import { Box, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Divider, Button, TextField, } from "@mui/material";

export default function Dashboard() { const [selectedTab, setSelectedTab] = useState("students"); const [subTab, setSubTab] = useState("view"); const [data, setData] = useState([]); const [loading, setLoading] = useState(true);

useEffect(() => { fetchData(); }, [selectedTab, subTab]);

async function fetchData() { setLoading(true); const table = selectedTab; const { data, error } = await supabase.from(table).select("*"); if (error) { console.error(Error fetching ${table}:, error); } else { setData(data || []); } setLoading(false); }

return ( <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#121212" }}> <Drawer sx={{ width: 250, flexShrink: 0, "& .MuiDrawer-paper": { width: 250, boxSizing: "border-box", bgcolor: "#1f1f1f", color: "#fff", borderRight: "none", }, }} variant="permanent" anchor="left" > <List> {["students", "teachers", "attendance"].map((item) => ( <ListItem button key={item} onClick={() => setSelectedTab(item)}> <ListItemText primary={item.charAt(0).toUpperCase() + item.slice(1)} sx={{ color: "#fff" }} /> </ListItem> ))} </List> </Drawer>

<Box component="main" sx={{ flexGrow: 1, bgcolor: "#121212", color: "#fff", p: 3, overflow: "auto" }}>
    <AppBar position="sticky" sx={{ bgcolor: "#1E293B" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ color: "#fff" }}>
          Dashboard
        </Typography>
      </Toolbar>
    </AppBar>

    <Tabs value={subTab} onChange={(event, newValue) => setSubTab(newValue)}>
      <Tab label="View" value="view" />
      <Tab label="Add" value="add" />
    </Tabs>

    {loading ? (
      <CircularProgress sx={{ color: "#1E293B", mt: 3 }} />
    ) : subTab === "view" ? (
      <TableContainer component={Paper} sx={{ mt: 3, bgcolor: "#2c2c2c", borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#1E293B" }}>
            <TableRow>
              {data.length > 0 && Object.keys(data[0]).map((key) => (
                <TableCell key={key} sx={{ color: "#fff", fontWeight: "bold" }}>
                  {key.replace("_", " ").toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} hover sx={{ bgcolor: "#333" }}>
                {Object.values(row).map((value, i) => (
                  <TableCell key={i}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Add New {selectedTab.slice(0, -1)}</Typography>
        <form>
          <TextField label="Name" fullWidth sx={{ my: 2, bgcolor: "#fff" }} />
          <Button variant="contained" color="primary">Submit</Button>
        </form>
      </Box>
    )}
  </Box>
</Box>

); }

