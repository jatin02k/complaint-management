"use client";
import React, { useState } from "react";

interface FormState {
  title: string;
  description: string;
  category: string;
  priority: string;
}

interface complaintFormProps {
  onSuccess: () => void;
}

const CATEGORIES = ["Product", "Service", "Support"];
const PRIORITIES = ["Low", "Medium", "High"];

export const ComplaintForm: React.FC<complaintFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<FormState>({
    title: "",
    description: "",
    category: CATEGORIES[0],
    priority: PRIORITIES[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setMessage({
        text: "Please fill in both the Title and Description.",
        type: "error",
      });
      return;
    }
    setIsSubmitting(true);
    setMessage(null);

    const payload = {
      ...formData,
      dateSubmitted: new Date().toISOString(),
    };

    try {
      const response = await fetch("api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Submission failed with status: ${response.status}`
        );
      }
      setMessage({ text: "Complaint Submitted Succesfully!", type: "success" });

      setFormData({
        title: "",
        description: "",
        category: CATEGORIES[0],
        priority: PRIORITIES[0],
      });
      onSuccess();

    } catch (e:unknown) {
        const errorText = e instanceof Error ? e.message : 'Submission Error!';
        console.error('Submission Error',e);
        setMessage({ text: `Error: ${errorText}`, type: 'error' });
    }finally{
        setIsSubmitting(false);
    }
  };
  return(
    <div className="w-full max-w-3xl mx-auto p-6 md:p-10 bg-white rounded-xl shadow-2xl">
      <h1 className="text-3xl font-extrabold mb-8 text-indigo-700">Raise a New Complaint</h1>
      
      {/* Feedback Message Area */}
      {message && (
        <div 
          className={`p-4 mb-6 rounded-lg font-medium text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
              : 'bg-red-100 text-red-700 border-l-4 border-red-500'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-black">
        {/* Complaint Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Complaint Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150"
            disabled={isSubmitting}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 resize-y"
            disabled={isSubmitting}
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 appearance-none bg-white"
            disabled={isSubmitting}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Priority Radio Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <div className="flex space-x-6">
            {PRIORITIES.map(prio => (
              <div key={prio} className="flex items-center">
                <input
                  type="radio"
                  id={`priority-${prio}`}
                  name="priority"
                  value={prio}
                  checked={formData.priority === prio}
                  onChange={handleChange}
                  required
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  disabled={isSubmitting}
                />
                <label htmlFor={`priority-${prio}`} className="ml-2 text-sm font-medium text-gray-700">
                  {prio}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 shadow-lg ${
            isSubmitting
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  )
};
