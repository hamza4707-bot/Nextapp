import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
} from "@mui/material";

export default function TablePage() {
  const [selectedTab, setSelectedTab] = useState("students"); // Default tab
  const [subTab, setSubTab] = useState("view"); // "view" or "add"
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({}); // Form data for new entries

  useEffect(() => {
    fetchData();
  }, [selectedTab, subTab]);

  async function fetchData() {
    setLoading(true);
    const table = selectedTab;

    const { data, error } = await supabase.from(table).select("*");

    if (error) {
      console.error(`Error fetching ${table}:`, error);
    } else {
      setData(data || []);
    }

    setLoading(false);
  }

  async function handleAddEntry() {
    const table = selectedTab;
    
    const { data, error } = await supabase.from(table).insert([formData]);

    if (error) {
      console.error(`Error adding entry to ${table}:`, error);
    } else {
      setFormData({}); // Reset form after successful submission
      fetchData(); // Refresh data
    }
  }

  return (
    <Box sx={{ p: 3, bgcolor: "#121212", minHeight: "100vh", color: "#fff" }}>
      {/* Tabs for Students, Teachers, and Attendance */}
      <Tabs
        value={selectedTab}
        onChange={(event, newValue) => setSelectedTab(newValue)}
        indicatorColor="secondary"
        textColor="inherit"
        sx={{ mb: 2 }}
      >
        <Tab label="Students" value="students" />
        <Tab label="Teachers" value="teachers" />
        <Tab label="Attendance" value="attendance" />
      </Tabs>

      {/* Sub Tabs for View / Add */}
      <Tabs
        value={subTab}
        onChange={(event, newValue) => setSubTab(newValue)}
        indicatorColor="secondary"
        textColor="inherit"
        sx={{ mb: 2 }}
      >
        <Tab label="View" value="view" />
        <Tab label="Add" value="add" />
      </Tabs>

      {/* View Data Table */}
      {subTab === "view" ? (
        loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <CircularProgress sx={{ color: "#fff" }} />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ bgcolor: "#2c2c2c" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#1E293B" }}>
                <TableRow>
                  {data.length > 0 &&
                    Object.keys(data[0]).map((key) => (
                      <TableCell key={key} sx={{ color: "#fff" }}>
                        {key.toUpperCase()}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index} sx={{ bgcolor: "#333" }}>
                    {Object.values(row).map((value, idx) => (
                      <TableCell key={idx} sx={{ color: "#fff" }}>
                        {value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      ) : (
        // Add New Entry Form
        <Box sx={{ mt: 3 }}>
          {Object.keys(formData).length === 0 && data.length > 0 ? (
            Object.keys(data[0]).map((key) => (
              <TextField
                key={key}
                label={key.toUpperCase()}
                variant="outlined"
                fullWidth
                sx={{ mb: 2, bgcolor: "#fff" }}
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
            sx={{ mt: 2 }}
            onClick={handleAddEntry}
          >
            Add Entry
          </Button>
        </Box>
      )}
    </Box>
  );
}
