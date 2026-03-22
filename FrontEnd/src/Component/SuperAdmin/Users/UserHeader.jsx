import React, { useState } from "react";
import { FiMenu, FiPlus } from "react-icons/fi";
import AddUserModal from "./AddUserModal";

const CampHeader = ({ setSidebarOpen, refreshUsers }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="bg-white px-4 sm:px-6 py-4 shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-2xl text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu />
            </button>

            <div>
              <h1 className="text-xl font-semibold">User Management</h1>
              <p className="hidden sm:block text-gray-500">
                Manage all users across the platform
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <FiPlus /> Add New User
          </button>
        </div>
      </header>

      {open && (
        <AddUserModal
          onClose={() => setOpen(false)}
          onSuccess={refreshUsers}
        />
      )}
    </>
  );
};

export default CampHeader;
