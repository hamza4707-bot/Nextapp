import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function pol() {
  
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const table = "students";
    const { data, error } = await supabase.from(table).select("*");

   

    setLoading(false);
  }

  

  return (
    <div className="flex h-screen">
      
      {/* Main Content */}
      <div className="flex-1 p-5">
        <h1 className="text-2xl font-bold mb-4">Students </h1>

  
       
        {/* List */}
        {loading ? <p>Loading...</p> : (
          <ul className="space-y-3">
            {data.map((item) => (
              <li key={item.firstname} className="flex items-center justify-between bg-white p-3 rounded shadow">
 {key}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}