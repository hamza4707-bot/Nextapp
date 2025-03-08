"use client"; // Needed for useState in Next.js

import { useState } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react"; // Hero UI (NextUI)
import { Calendar } from "react-date-range"; // Calendar
import "react-date-range/dist/styles.css"; // Calendar styles
import "react-date-range/dist/theme/default.css"; // Default theme

export default function FilterSection() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const handleReset = () => {
    if (search || location || category || type || selectedDate) {
      setSearch("");
      setLocation("");
      setCategory("");
      setType("");
      setSelectedDate("");
    }
  };

  return (
  <div className="container mx-auto mt-10 px-4">
  <h1 className="text-3xl font-bold mb-6 text-center text-black">Find Events</h1>

  {/* First Row - Search Filters */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
    <Input
      label="Search"
      placeholder="Enter keywords..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <Input
      label="Location"
      placeholder="Enter location..."
      value={location}
      onChange={(e) => setLocation(e.target.value)}
    />
  </div>

  {/* Second Row - Dropdowns & Filters */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
    {/* Date Picker Dropdown */}
    <div className="relative">
      <Button
        variant="bordered"
        className="w-full"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        {selectedDate || "Select Date"}
      </Button>
      {showCalendar && (
        <div className="absolute z-10 bg-white shadow-md rounded mt-2 p-4">
          <Calendar
            date={new Date()}
            onChange={(date) => setSelectedDate(date.toDateString())}
          />
          <div className="mt-2 space-y-1">
            {["Today", "Tomorrow", "This Month", "Next Month"].map((option) => (
              <Button
                key={option}
                fullWidth
                variant="light"
                onClick={() => {
                  setSelectedDate(option);
                  setShowCalendar(false);
                }}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Category Dropdown */}
    <Select
      label="Category"
      placeholder="Select category"
      selectedKeys={category ? [category] : []}
      onChange={(e) => setCategory(e.target.value)}
    >
      <SelectItem key="business">Business</SelectItem>
      <SelectItem key="technology">Technology</SelectItem>
      <SelectItem key="health">Health</SelectItem>
    </Select>

    {/* Type Dropdown */}
    <Select
      label="Type"
      placeholder="Select type"
      selectedKeys={type ? [type] : []}
      onChange={(e) => setType(e.target.value)}
    >
      <SelectItem key="free">Free</SelectItem>
      <SelectItem key="paid">Paid</SelectItem>
    </Select>
  </div>

  {/* Third Row - Buttons */}
  <div className="flex gap-4">
    <Button color="primary" onClick={() => fetchEvents(true)}>Search</Button>
    <Button
      color="danger"
      onClick={handleReset}
      isDisabled={!search && !location && !category && !type && !selectedDate}
    >
      Reset
    </Button>
  </div>
</div>
          
  );
}