"use client";

import React, { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { ComplaintForm } from "./complaintForm";
import ComplaintTable from "./complaintTable";
import { IComplaint } from "@/models/Complaint";

export const ComplaintApp: React.FC = () => {
  const [activeView, setActiveView] = useState<"user" | "admin">("user");
  const [complaint, setComplaint] = useState<IComplaint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComplaint = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("api/complaints");
      if (!response.ok) {
        throw new Error(`Failed to fetch complaints: ${response.statusText}`);
      }

      const data: IComplaint[] = await response.json();
      const sortedData = data.sort(
        (a, b) =>
          new Date(b.dateSubmitted).getTime() -
          new Date(a.dateSubmitted).getTime()
      );

      setComplaint(sortedData)
    } catch (e:unknown) {
      console.error('Fetching Error:', e);
      setError('An error occurred while fetching data. Check your API and MongoDB connection.');
    }finally{
      setIsLoading(false)
    }
  }, []);

  useEffect(()=>{
    if(activeView == 'admin'){
      fetchComplaint()
    }
  },[activeView,fetchComplaint]);

  return(
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
    <Navbar active={activeView} setActive={setActiveView} />
    <main className="mt-8">
        {/* CONDITIONAL SWITCHING LOGIC */}
        {activeView === 'user' ? (
          // USER VIEW:
          <ComplaintForm 
            onSuccess={()=>{}} 
          />
        ) : (
          // ADMIN VIEW:
          <ComplaintTable 
            complaints={complaint}
            isLoading={isLoading}
            fetchComplaints={fetchComplaint}
          />
        )}
      </main>
    </div>
  )
};