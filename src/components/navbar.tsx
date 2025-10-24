'use client';
import React from "react";

interface NavbarProps {
  active: "user" | "admin";
  setActive: (view: "user" | "admin") => void;
}

export default function Navbar({ active, setActive }: NavbarProps) {
  const baseClasses = "px-6 py-2 rounded-lg transition duration-200 shadow-md";
  const inactiveClasses =
    "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200";
  const activeClasses = "bg-indigo-600 text-white font-semibold";

  return (
    <header className="sticky top-0 z-10 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg mb-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between whitespace-nowrap px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 text-gray-900">
          <p className="text-lg font-bold leading-tight tracking-[-0.015em]">
            Complaint Management System
          </p>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4 sm:gap-8">
          <button
            onClick={() => setActive("user")}
            className={`${baseClasses} ${
              active === "user" ? activeClasses : inactiveClasses
            }`}
          >
            User Submission
          </button>
          <button
            onClick={() => setActive("admin")}
            className={`${baseClasses} ${
              active === "admin" ? activeClasses : inactiveClasses
            }`}
          >
            Admin Management
          </button>
        </div>
      </div>
    </header>
  );
}