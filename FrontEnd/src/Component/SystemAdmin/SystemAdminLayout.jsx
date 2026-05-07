import React, { useState, useEffect } from "react";
import {Link } from "react-router";
import Sidebar from "./sidebar/Sidebar";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { Tent, Menu, X, Loader2 } from "lucide-react";
import { cn } from "./ui/utils";
import { useUser } from "../../context/UserContext";

const SystemAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, loadingUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingUser && !user) {
      navigate("/login");
    }
  }, [user, loadingUser, navigate]);

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
          <p className="text-gray-500 font-medium tracking-wide">Securing Admin Portal...</p>
        </div>
      </div>
    );
  }

  // Double check role
  const allowedRoles = ["system_admin", "admin", "super_admin"];
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-20 h-16">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <Tent className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="font-semibold text-lg">EthioCampGround</h1>
                <p className="text-xs text-gray-500">System Administrator</p>
              </div>
            </div>
          </div>
           <Link to="/super-admin/profile" className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors">
          <div className="flex items-center gap-3">
           
            <div className="text-right">
              <p className="text-sm font-medium">{user.fullName || "Admin User"}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
              {(user.fullName || "A")[0].toUpperCase()}
            </div>
            
          </div>
          </Link>
        </div>
      </header>

      <div className="flex pt-16">
        <Sidebar sidebarOpen={sidebarOpen} />

        <main className={cn(
          "flex-1 transition-all duration-300 min-h-[calc(100vh-64px)]",
          sidebarOpen ? "md:ml-64" : "ml-0"
        )}>

          <div className="p-8 lg:p-10 pb-28 md:pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SystemAdminLayout;

