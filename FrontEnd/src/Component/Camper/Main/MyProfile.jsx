import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Camera, Share2, QrCode } from "lucide-react";
import { ShieldCheckIcon, TrophyIcon } from "@heroicons/react/24/outline";
import Sidebar from "../Sidebar/Sidebar";
import MyProfileHeader from "./MyProfileHeader";

export default function MyProfile() {
  const [pageLoading, setPageLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState("https://i.pravatar.cc/150");
  const [coverPreview, setCoverPreview] = useState(null);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    trustScore: 0,
    role: "Camper",
    _id: ""
  });

  // ---- FETCH CAMPER DATA ON LOGIN ----
  useEffect(() => {
    const fetchCamperProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (!token || !storedUser) {
          setPageLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const camperId = parsedUser._id || parsedUser.id;

        const res = await axios.get(`http://localhost:5000/api/users/${camperId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const dbUser = res.data.data;
        if (dbUser) {
          setProfile({
            firstName: dbUser.firstName || "",
            lastName: dbUser.lastName || "",
            email: dbUser.email || "",
            phoneNumber: dbUser.phoneNumber || "",
            dateOfBirth: dbUser.dateOfBirth ? dbUser.dateOfBirth.split("T")[0] : "",
            gender: dbUser.gender || "Male",
            trustScore: dbUser.trustScore || 0,
            role: dbUser.role || "Camper",
            _id: dbUser._id || camperId
          });

          if (dbUser.profilePicture) setAvatarPreview(dbUser.profilePicture);
          if (dbUser.coverPicture) setCoverPreview(dbUser.coverPicture);
        }
      } catch (err) {
        console.error("Failed to fetch camper data:", err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchCamperProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // ---- SAVE PROFILE ----
  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("firstName", profile.firstName);
      formData.append("lastName", profile.lastName);
      formData.append("phoneNumber", profile.phoneNumber);
      formData.append("dateOfBirth", profile.dateOfBirth);
      formData.append("gender", profile.gender);

      if (avatarInputRef.current.files[0]) formData.append("profilePicture", avatarInputRef.current.files[0]);
      if (coverInputRef.current.files[0]) formData.append("coverPicture", coverInputRef.current.files[0]);

      const res = await axios.patch(
        `http://localhost:5000/api/users/${profile._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify({ ...JSON.parse(localStorage.getItem("user")), ...res.data.data }));
        setAvatarPreview(res.data.data.profilePicture || avatarPreview);
        setCoverPreview(res.data.data.coverPicture || coverPreview);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setSaveLoading(false);
    }
  };

  if (pageLoading) return <div className="flex h-screen justify-center items-center">Loading camper profile...</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <MyProfileHeader onSave={handleSave} loading={saveLoading} user={profile} />

        {/* Cover Image */}
        <div className="relative bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl h-52 mb-20 overflow-hidden shadow-sm"
          style={{ backgroundImage: coverPreview ? `url(${coverPreview})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
          <button className="absolute top-4 right-4 flex items-center gap-2 bg-black/30 hover:bg-black/40 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition"
            onClick={() => coverInputRef.current.click()}>
            <Camera size={18} /> Edit Cover
          </button>
          <input type="file" ref={coverInputRef} hidden accept="image/*" onChange={(e) => setCoverPreview(URL.createObjectURL(e.target.files[0]))} />
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 -mt-32 relative mx-4 sm:mx-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="relative group">
                <img src={avatarPreview} alt="profile" className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-white" />
                <button className="absolute -bottom-2 -right-2 bg-emerald-600 p-2 rounded-full text-white hover:bg-emerald-700 shadow-sm transition"
                  onClick={() => avatarInputRef.current.click()}>
                  <Camera size={16} />
                </button>
                <input type="file" ref={avatarInputRef} hidden accept="image/*" onChange={(e) => setAvatarPreview(URL.createObjectURL(e.target.files[0]))} />
              </div>
              <div className="mb-2">
                <h2 className="text-2xl font-bold text-gray-900 capitalize">{profile.firstName} {profile.lastName}</h2>
                <p className="text-gray-500 text-sm">{profile.role} • {profile.email}</p>
                <div className="flex items-center justify-center sm:justify-start gap-4 mt-3">
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                    <TrophyIcon className="w-3 h-3" /> {profile.trustScore} Trust Points
                  </span>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                    <ShieldCheckIcon className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button onClick={() => setShowQR(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium transition">
                <QrCode size={18} /> QR Code
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition">
                <Share2 size={18} /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Personal Info Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-50">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">First Name</label>
                <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none font-medium text-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Last Name</label>
                <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none font-medium text-gray-700" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
                <input type="email" value={profile.email} disabled className="w-full px-4 py-3 rounded-lg bg-gray-100 border-transparent text-gray-500 cursor-not-allowed font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone Number</label>
                <input type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none font-medium text-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Date of Birth</label>
                <input type="date" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none font-medium text-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Gender</label>
                <select name="gender" value={profile.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none font-medium text-gray-700 cursor-pointer">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* QR Modal */}
        {showQR && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-2">My Camper Pass</h3>
              <p className="text-gray-500 text-sm mb-6">Scan to share your profile</p>
              <div className="w-48 h-48 mx-auto bg-gray-900 flex items-center justify-center rounded-2xl mb-6 shadow-inner">
                <QrCode size={120} className="text-white" />
              </div>
              <p className="text-xs text-gray-400 font-mono mb-6 uppercase">{profile._id}</p>
              <button onClick={() => setShowQR(false)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition">Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
