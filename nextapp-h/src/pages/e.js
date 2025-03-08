
import {DateRangePicker} from "@heroui/react";
import { useState } from "react";

import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";

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
    <div className="w-full max-w-xl flex flex-row gap-4">
      <DateRangePicker showMonthAndYearPickers label="Birth Date" variant="bordered" />
    </div>
  </div>

  {/* Second Row - Dropdowns & Filters */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
     <Dropdown backdrop="blur">
      <DropdownTrigger>
        <Button variant="bordered">Open Menu</Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" variant="faded">
        <DropdownItem key="new">New file</DropdownItem>
        <DropdownItem key="copy">Copy link</DropdownItem>
        <DropdownItem key="edit">Edit file</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete file
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
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