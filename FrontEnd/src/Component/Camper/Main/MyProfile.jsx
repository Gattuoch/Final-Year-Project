import { Camera, Download, Share2, QrCode, ShieldCheck } from "lucide-react";
import React, { useState, useRef } from "react";
import {
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import {
  LockClosedIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../Sidebar/Sidebar";
import MyProfileHeader from "./MyProfileHeader";

export default function MyProfile() {

  const [avatar, setAvatar] = useState("https://i.pravatar.cc/150");
  const [cover, setCover] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [profile, setProfile] = useState({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+251 911 234567",
  dob: "05/15/1990",
  gender: "Male",
});

    /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCoverChange = (e) => {
    if (e.target.files[0]) {
      setCover(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSaveProfile = () => {
    console.log("Profile saved:", profile);
    alert("Profile updated successfully ✅");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: "My Profile",
        text: "Check out my profile",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Profile link copied to clipboard 📋");
    }
  };
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
          <Sidebar />
    
          <main className="flex-1 p-4 sm:p-6  top-0">
     <MyProfileHeader/>

      {/* Cover Section */}
      <div className="relative bg-emerald-600 rounded-2xl h-52 mb-20 overflow-hidden"
      style={{
            backgroundImage: cover ? `url(${cover})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          >
        <button className="absolute top-4 right-4 flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur"
          onClick={() => coverInputRef.current.click()}
          >
          <Camera size={18} />
          Change Cover
        </button>
        <input
            type="file"
            ref={coverInputRef}
            onChange={handleCoverChange}
            hidden
            accept="image/*"
          />
      </div>

     {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 -mt-32 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={avatar}
                  alt="profile"
                  className="w-24 h-24 rounded-xl object-cover border-4 border-white"
                />
                <button
                  className="absolute bottom-1 right-1 bg-emerald-600 p-2 rounded-lg text-white"
                  onClick={() => avatarInputRef.current.click()}
                >
                  <Camera size={16} />
                </button>
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleAvatarChange}
                  hidden
                  accept="image/*"
                />
              </div>

              <div>
                <p className="text-gray-500">Member since November 2023</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-amber-500 font-medium">
                    ⭐ 156 Points
                  </span>
                  <span className="text-emerald-600 font-medium">
                    ✔ Verified Account
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-gray-50"
                onClick={() => setShowQR(true)}
              >
                <QrCode size={18} />
                My QR
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white"
                onClick={handleShare}
              >
                <Share2 size={18} />
                Share Profile
              </button>
            </div>
          </div>
        </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
         {/* ================= Personal Information ================= */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              defaultValue="John"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              defaultValue="Doe"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="john@example.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              defaultValue="+251 911 234567"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              onChange={handleChange}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="text"
                defaultValue="05/15/1990"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                onChange={handleChange}
              />
              <CalendarDaysIcon className="w-5 h-5 text-gray-400 absolute right-4 top-3.5" />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 focus:outline-none">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= Account Security ================= */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Account Security
        </h2>

        <div className="space-y-4">
          {/* Two-Factor */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                <LockClosedIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-gray-500">Enabled</p>
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700">
              <KeyIcon className="w-4 h-4" />
              Manage
            </button>
          </div>

          {/* Privacy Settings */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Privacy Settings
                </p>
                <p className="text-sm text-gray-500">Review</p>
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
              <Cog6ToothIcon className="w-4 h-4" />
              Configure
            </button>
          </div>
        </div>
      </div>
      </div>
       {/* ================= Content ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">      
        {/* ================= Profile Activity ================= */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">
            Profile Activity
          </h3>

          <div className="space-y-4">
            {/* Last Login */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <CalendarDaysIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Last Login
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <ArrowPathIcon className="w-4 h-4" />
                View
              </button>
            </div>

            {/* Reward Points */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <TrophyIcon className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Reward Points
                  </p>
                  <p className="text-xs text-gray-500">156</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700">
                Redeem
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ================= QR MODAL ================= */}
        {showQR && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-80 text-center">
              <h3 className="font-semibold mb-4">My Profile QR</h3>
              <div className="w-40 h-40 mx-auto bg-gray-100 flex items-center justify-center rounded-lg">
                QR CODE
              </div>
              <button
                onClick={() => setShowQR(false)}
                className="mt-6 w-full bg-emerald-600 text-white py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
