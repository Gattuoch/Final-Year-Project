import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidevar/Sidebar'; // existing folder path 'Sidevar'

const CampAdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar fixed to the left */}
      <Sidebar />
      
      {/* Main content area takes up remaining space */}
      <main className="flex-1 overflow-y-auto flex flex-col">
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
