import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidevar/Sidebar'; // existing folder path 'Sidevar'
import { Menu, Tent } from 'lucide-react';

const CampAdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 relative">
      {/* Sidebar fixed to the left */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main content area takes up remaining space */}
      <main className="flex-1 overflow-y-auto flex flex-col relative w-full">

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Tent className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-teal-800">EthioCamp</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1">
          <Outlet />
        </div>

        {/* Global Footer */}
        <footer className="mt-auto px-6 py-6 border-t border-slate-200 bg-white sm:bg-transparent flex flex-col items-center justify-center">
          <p className="text-sm text-slate-500 font-medium text-center">
            © 2026 EthioCamp Ground. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default CampAdminLayout;
