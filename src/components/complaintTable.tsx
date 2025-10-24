'use client';
import { IComplaint } from '@/models/Complaint';
import React, { useState, useMemo, useCallback } from 'react';

interface ComplaintTableProps {
  complaints: IComplaint[];
  isLoading: boolean;
  fetchComplaints: () => void;
}

const PRIORITIES = ["All", "Low", "Medium", "High"];
const STATUSES = ["All", "Pending", "In Progress", "Resolved"];

const STATUS_COLORS: Record<IComplaint['status'], string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800',
};

const ComplaintTable: React.FC<ComplaintTableProps> = ({ complaints: incomingComplaints, isLoading, fetchComplaints }) => {
  
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const complaints = Array.isArray(incomingComplaints) ? incomingComplaints : [];

  const filteredComplaints = useMemo(() => {
    return complaints.filter(complaint => {
      const statusMatch = filterStatus === 'All' || complaint.status === filterStatus;
      const priorityMatch = filterPriority === 'All' || complaint.priority === filterPriority;
      return statusMatch && priorityMatch;
    });
  }, [complaints, filterStatus, filterPriority]);

  const handleStatusChange = useCallback(async (id: string, newStatus: IComplaint['status']) => {
    setIsActionLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/complaints/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status.');
      }
      
      // if Success: Re-fetch all updated data
      fetchComplaints(); 
      setMessage({ text: `Status updated to ${newStatus} for complaint ${id}.`, type: 'success' });

    } catch (e: unknown) {
      console.error('Status Update Error:', e);
      setMessage({ text: 'Error updating complaint status.', type: 'error' });
    } finally {
      setIsActionLoading(false);
    }
  }, [fetchComplaints]);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this complaint?")) {
      return;
    }

    setIsActionLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/complaints/${id}`, {
        method: 'DELETE',
      });

      if (response.status !== 204) { 
        throw new Error('Failed to delete complaint.');
      }

      // if Success: Re-fetch all data after deletion
      fetchComplaints();
      setMessage({ text: `Complaint ${id} successfully deleted.`, type: 'success' });

    } catch (e: unknown) {
      console.error('Delete Error:', e);
      setMessage({ text: 'Error deleting complaint.', type: 'error' });
    } finally {
      setIsActionLoading(false);
    }
  }, [fetchComplaints]);

  // rendering conditons
  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center p-10 text-indigo-600 font-medium">Loading complaints...</p>;
    }

    if (complaints.length === 0) {
      return <p className="text-center p-10 text-gray-500">No complaints have been submitted yet.</p>;
    }
    
    if (filteredComplaints.length === 0) {
      return <p className="text-center p-10 text-gray-500">No complaints match the current filters.</p>;
    }

    // Main Table Display
    return (
      <div className="overflow-x-auto shadow-xl rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredComplaints.map((complaint) => (
              <tr key={String(complaint._id)} className="hover:bg-indigo-50/50 transition-colors">
                
                {/* Title */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate">
                    {complaint.title}
                    {/* Optional: Show full description in a tooltip or modal */}
                </td>
                
                {/* Category */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.category}</td>
                
                {/* Priority */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.priority}</td>
                
                {/* Date Submitted */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(complaint.dateSubmitted).toLocaleDateString()}
                </td>
                
                {/* Status Dropdown (PATCH) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(String(complaint._id), e.target.value as IComplaint['status'])}
                    disabled={isActionLoading}
                    className={`block w-full rounded-md border-gray-300 shadow-sm py-1.5 px-2 text-sm font-medium ${STATUS_COLORS[complaint.status]}`}
                  >
                    {STATUSES.slice(1).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>

                {/* Actions (DELETE) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(String(complaint._id))}
                    disabled={isActionLoading}
                    className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                    title="Delete Complaint"
                  >
                    {/* Trash Icon (using a placeholder for lucide-react, replace with actual icon) */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M15 3a2 2 0 0 0-2-2H11a2 2 0 0 0-2 2v3h6z"></path></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 bg-white rounded-xl shadow-2xl space-y-6">
      <h1 className="text-3xl font-extrabold text-blue-700">Admin Management Panel</h1>

      {/* Feedback Message Area */}
      {message && (
        <div 
          className={`p-4 rounded-lg font-medium text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
              : 'bg-red-100 text-red-700 border-l-4 border-red-500'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Filter and Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-gray-50 rounded-lg shadow-inner">
        <p className="text-sm font-semibold text-gray-700">
          Showing {filteredComplaints.length} of {complaints.length} total complaints
          {isActionLoading && <span className="ml-3 text-indigo-600"> (Processing...)</span>}
        </p>

        <div className="flex gap-4 w-full sm:w-auto text-black">
          {/* Status Filter */}
          <h2 className=' pt-2 '>Status:</h2>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-40 border border-gray-300 rounded-lg py-2 px-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none bg-white"
          >
            {STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <h2 className=' pt-2 '>Priority:</h2>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full sm:w-40 border border-gray-300 rounded-lg py-2 px-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none bg-white"
          >
            {PRIORITIES.map(prio => (
              <option key={prio} value={prio}>{prio}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Render the Table Content */}
      {renderContent()}
    </div>
  );
};

export default ComplaintTable;