import React, { useRef, useState, useEffect } from "react";
import API from "../services/api";

const ViewProfile = () => {
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    fullName: "",
    email: "",
    role: "",
    memberSince: "",
    avatar: "https://i.pravatar.cc/150?img=12",
  });

  const [tempProfile, setTempProfile] = useState(profile);

  /* ---------------- Handlers ---------------- */

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);

    // Persist to localStorage and notify header to update immediately
    try {
      const data = {
        fullName: tempProfile.name || tempProfile.fullName || tempProfile.name,
        email: tempProfile.email,
        role: tempProfile.role,
        avatar: tempProfile.avatar,
        memberSince: tempProfile.memberSince,
      };
      localStorage.setItem("profile", JSON.stringify(data));
      window.dispatchEvent(new CustomEvent("profileUpdated", { detail: data }));
    } catch (err) {
      console.error("Failed to save profile to storage", err);
    }

    // Optional: if you later implement a backend update endpoint, call it here
    // API.put('/users/profile', data).catch(e => console.error(e));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    if (isEditing) fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setTempProfile((prev) => ({ ...prev, avatar: preview }));
  };

  // Fetch profile from API on mount
  useEffect(() => {
    const load = async () => {
      try {
        const cached = localStorage.getItem("profile");
        if (cached) {
          const p = JSON.parse(cached);
          setProfile({
            name: p.fullName || p.name || "",
            fullName: p.fullName || p.name || "",
            email: p.email || "",
            role: p.role || "",
            memberSince: p.memberSince || "",
            avatar: p.avatar || "https://i.pravatar.cc/150?img=12",
          });
          setTempProfile((prev) => ({ ...prev, ...p }));
        }
      } catch (e) {}

      try {
        const res = await API.get("/auth/profile");
        const u = res.data?.user;
        if (u) {
          const p = {
            name: u.fullName || u.name || "",
            fullName: u.fullName || u.name || "",
            email: u.email || "",
            role: u.role || "",
            memberSince: new Date(u.createdAt).toLocaleDateString(),
            avatar: u.avatar || (u.email ? `https://i.pravatar.cc/150?u=${u.email}` : "https://i.pravatar.cc/150?img=12"),
          };
          setProfile(p);
          setTempProfile(p);
        }
      } catch (err) {
        // ignore - user might be unauthenticated
      }
    };

    load();
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div className="w-full bg-white px-6 py-6 sm:px-8 sm:py-8">

      {/* Avatar */}
      <div className="flex flex-col items-center">
        <div
          onClick={handleAvatarClick}
          className={`w-28 h-28 rounded-full overflow-hidden ring-4 ring-blue-100 shadow-sm ${
            isEditing ? "cursor-pointer hover:opacity-90" : ""
          }`}
        >
          <img
            src={isEditing ? tempProfile.avatar : profile.avatar}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {isEditing && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <button
              onClick={handleAvatarClick}
              className="mt-4 px-5 py-2 text-sm font-semibold text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition"
            >
              Change Picture
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="mt-8 space-y-5">

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            Full Name
          </label>

          {isEditing ? (
            <input
              type="text"
              name="name"
              value={tempProfile.name}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
            />
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium">
              {profile.name}
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            Email Address
          </label>

          {isEditing ? (
            <input
              type="email"
              name="email"
              value={tempProfile.email}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
            />
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium">
              {profile.email}
            </div>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
            Current Role
          </label>
          <span className="inline-flex px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
            {profile.role}
          </span>
        </div>

        {/* Member Since */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            Member Since
          </label>
          <p className="text-gray-700 font-medium">
            {profile.memberSince}
          </p>
        </div>
      </div>

      <div className="border-t my-8" />

      {/* Actions */}
      {isEditing ? (
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="w-full py-3 rounded-2xl border border-gray-300 font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <button
          onClick={handleEdit}
          className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          Edit Profile Details
        </button>
      )}
    </div>
  );
};

export default ViewProfile;
