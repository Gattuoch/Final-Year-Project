import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Tent,
  Calendar,
  CreditCard,
  Users,
  BarChart,
  Bell,
  Settings,
  LogOut,
  MoreVertical,
  X
} from "lucide-react";
import LogoutConfirm from "./LogoutConfirm";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const mainMenu = [
    { name: "Admin Dashboard", href: "/manager-dashboard/dashboard", icon: LayoutDashboard },
    { name: "Camp Management", href: "/manager-dashboard/camps", icon: Tent },
    { name: "Reservation Mgmt", href: "/manager-dashboard/reservations", icon: Calendar },
    { name: "Payment Mgmt", href: "/manager-dashboard/payments", icon: CreditCard },
  ];

  const adminMenu = [
    { name: "User Management", href: "/manager-dashboard/users", icon: Users },
    { name: "Report & Analytics", href: "/manager-dashboard/analytics", icon: BarChart },
    { name: "Notification Mgmt", href: "/manager-dashboard/notifications", icon: Bell, badge: 3 },
    { name: "System Settings", href: "/manager-dashboard/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar (Fixed on Mobile, Relative on Desktop) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 h-full bg-white border-r border-slate-100 flex flex-col pt-6 font-sans transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo Section */}
        <div className="flex items-center justify-between px-6 mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Tent className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-teal-800">EthioCamp</span>
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 overflow-y-auto px-4 pb-4">
          
          {/* Main Menu */}
          <div className="mb-6">
            <h3 className="px-3 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Main Menu</h3>
            <div className="space-y-1">
              {mainMenu.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen && setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-teal-50 text-teal-700" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Administration Menu */}
          <div>
            <h3 className="px-3 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Administration</h3>
            <div className="space-y-1">
              {adminMenu.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen && setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-teal-50 text-teal-700" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* User Card at the Bottom */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden cursor-pointer" onClick={() => setShowLogout(true)}>
                {/* Fallback avatar if logout text isn't clicked */}
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 leading-none">Dawit Tadesse</p>
                <p className="text-xs text-slate-500 mt-1">Camp Manager</p>
              </div>
            </div>
            <button 
              onClick={() => setShowLogout(true)}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Dialog (Retained from original) */}
      <LogoutConfirm
        open={showLogout}
        onClose={() => setShowLogout(false)}
      />
    </>
  );
}
