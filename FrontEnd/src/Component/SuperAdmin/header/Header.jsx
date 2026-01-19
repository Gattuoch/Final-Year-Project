import { useState, useRef, useEffect } from "react";
import {
  Bell,
  LogOut,
  User,
  Settings,
  Repeat,
  Key,
  ChevronDown,
  Menu,
} from "lucide-react";
import ViewProfile from "./ViewProfile";
import ChangePassword from "./ChangePassword";
import SwitchRole from "./SwitchRole";
import GeneralPreferences  from "./GeneralPreferences";
import { useNavigate } from "react-router-dom";
import API from "../services/api";


export default function Header({ setSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isSwitchRoleOpen, setIsSwitchRoleOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [user, setUser] = useState(null);



  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load profile from API or localStorage
  useEffect(() => {
    const loadProfile = async () => {
      // try localStorage first (fast)
      try {
        const cached = localStorage.getItem("profile");
        if (cached) {
          setUser(JSON.parse(cached));
        }
      } catch (e) {
        // ignore
      }

      // then try API to ensure fresh data
      try {
        const res = await API.get("/auth/profile");
        const profile = res.data?.user || null;
        if (profile) {
          setUser(profile);
          try {
            localStorage.setItem("profile", JSON.stringify(profile));
          } catch (e) {}
        }
      } catch (err) {
        // not authenticated or network error - ignore here
        // console.debug("Could not fetch profile", err);
      }
    };

    loadProfile();

    // Listen for profile changes emitted by ViewProfile
    const handler = (e) => {
      const p = e.detail;
      if (p) {
        setUser(p);
        try {
          localStorage.setItem("profile", JSON.stringify(p));
        } catch (err) {}
      }
    };
    window.addEventListener("profileUpdated", handler);
    return () => window.removeEventListener("profileUpdated", handler);
  }, []);

  return (
    <header className="flex justify-between items-center bg-white px-8 py-5 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen && setSidebarOpen(true)}
          className="md:hidden p-2 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center gap-2"
          aria-label="Open menu"
          aria-expanded="false"
        >
          <Menu size={20} />
          <span className="text-sm font-medium">Menu</span>
        </button>

        <div className="hidden md:block">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Super Admin Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500">Global system overview and analytics</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6 relative">
        <Bell className="text-gray-500 cursor-pointer hover:text-indigo-600 transition" />

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src={
                user?.avatar || (user?.email ? `https://i.pravatar.cc/40?u=${user.email}` : "https://i.pravatar.cc/40")
              }
              className="w-10 h-10 rounded-full border"
              alt="admin"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {user?.fullName || user?.full_name || user?.name || user?.email || "Admin User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role ? user.role.replace(/_/g, " ") : "Super Administrator"}
              </p>
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-4 w-64 bg-white rounded-xl shadow-xl border animate-slide-fade z-50">
              <div className="px-5 py-4 border-b">
                <p className="text-sm font-semibold">{user?.fullName || user?.email || 'Admin User'}</p>
                <p className="text-xs text-gray-500">{user?.role ? user.role.replace(/_/g, ' ') : 'Super Administrator'}</p>
              </div>

              <div className="flex flex-col">
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setDropdownOpen(false);
                  }}
                  className="dropdown-item"
                >
                  <User size={18} /> View Profile
                </button>

               <button
  onClick={() => {
    setIsPasswordOpen(true);
    setDropdownOpen(false);
  }}
  className="dropdown-item flex items-center gap-2"
>
  <Key size={18} />
  Change Password
</button>

                <button
  onClick={() => {
    setIsSwitchRoleOpen(true);
    setDropdownOpen(false);
  }}
  className="dropdown-item flex items-center gap-2"
>
  <Repeat size={18} />
  Switch Role
</button>


                <button 
                onClick={() => {
    setIsSettingsOpen(true);
    setDropdownOpen(false);
  }}
                className="dropdown-item">
                  <Settings size={18} /> Settings
                </button>

                <button
  onClick={() => {
    setIsLogoutOpen(true);
    setDropdownOpen(false);
  }}
  className="dropdown-item text-red-600 border-t"
>
  <LogOut size={18} /> Logout
</button>

              </div>
            </div>
          )}
        </div>
      </div>

     {/* Profile Modal */}
{isOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
    
    {/* Modal Container */}
    <div className="w-full max-w-md animate-scale-in">
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Profile
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Personal information and account status
        </p>
      </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        

        {/* Modal Body */}
        <div className="max-h-[80vh] overflow-y-auto">
          <ViewProfile />
        </div>

      </div>
    </div>
  </div>
)}

{isPasswordOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
    
    <div className="w-full max-w-2xl animate-scale-in">
      <div className="relative bg-white rounded-3xl shadow-2xl">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Change Password
        </h2>
        <p className="text-sm text-gray-500">
          Update your password to keep your account secure
        </p>
      </div>

          <button
            onClick={() => setIsPasswordOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <ChangePassword />
        </div>

      </div>
    </div>
  </div>
)}


{isSwitchRoleOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    
    <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-scaleIn">
      
      {/* Close Button */}
      <button
        onClick={() => setIsSwitchRoleOpen(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>

      {/* Switch Role Component */}
      <SwitchRole />

    </div>
  </div>
)}


{isSettingsOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
    
    {/* Modal Container */}
    <div className="w-full max-w-md animate-scale-in">
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b">

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <GeneralPreferences />
        </div>

      </div>
    </div>
  </div>
)}

{isLogoutOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
    <div className="w-full max-w-sm animate-scale-in">
      <div className="bg-white rounded-2xl shadow-xl p-6">

        <h2 className="text-lg font-semibold text-gray-900">
          Confirm Logout
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Are you sure you want to log out of your account?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setIsLogoutOpen(false)}
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              // ✅ Clear auth data
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("role");

              // Optional: clear session storage
              sessionStorage.clear();

              // Close modal & redirect
              setIsLogoutOpen(false);
              navigate("/login", { replace: true });
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  </div>
)}



      {/* Animations */}
      <style jsx>{`
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          font-size: 0.875rem;
          color: #374151;
          transition: background 0.2s;
        }
        .dropdown-item:hover {
          background: #f3f4f6;
        }
        .animate-slide-fade {
          animation: slideFade 0.2s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out forwards;
        }
        @keyframes slideFade {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </header>
  );
}
