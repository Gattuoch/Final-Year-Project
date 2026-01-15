import React, { useState } from "react";
import axios from "axios";
import { 
  HiMail, 
  HiLockClosed, 
  HiEye, 
  HiEyeOff, 
  HiPhone,  git status
rebase in progress; onto 7c9fbf8
You are currently rebasing branch 'main' on '7c9fbf8'.
  (fix conflicts and then run "git rebase --continue")
  (use "git rebase --skip" to skip this patch)
  (use "git rebase --abort" to check out the original branch)

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   Backend/public/images/avatars/1768478483290-532436544.png
        new file:   Backend/public/images/avatars/1768478514708-459934744.png
        new file:   Backend/public/images/avatars/1768488458110-898251899.png
        new file:   Backend/public/images/avatars/1768489467698-36210994.png
        new file:   Backend/public/images/avatars/1768493800069-394126002.png
        new file:   Backend/public/images/avatars/1768493820985-118086273.png
        new file:   Backend/public/images/avatars/1768494075036-537077064.png
        new file:   Backend/public/images/avatars/1768494102097-57661366.png
        new file:   Backend/public/images/avatars/1768494255225-243068424.png
        new file:   Backend/public/images/avatars/1768500729339-372130246.png
        new file:   Backend/scripts/setSuperAdminPassword.js
        new file:   Backend/src/controllers/CreateSystemAdmin.js
        new file:   Backend/src/controllers/admin.user.controller.js
        new file:   Backend/src/controllers/adminCamp.controller.js
        new file:   Backend/src/controllers/createuser.controller.js
        new file:   Backend/src/controllers/dashboard.controller.js
        modified:   Backend/src/controllers/user.controller.js
        new file:   Backend/src/middlewares/CreatesystemAdmin.js
        new file:   Backend/src/middlewares/roleMiddleware.js
        modified:   Backend/src/models/Booking.model.js
        new file:   Backend/src/models/EventVenue.model.js
        new file:   Backend/src/models/Refund.model.js
        new file:   Backend/src/models/Ticket.model.js
        new file:   Backend/src/routes/admin.user.routes.js
        new file:   Backend/src/routes/createSystemAdmin.js
        new file:   Backend/src/routes/createuser.controller.js
        new file:   Backend/src/routes/dashboard.routes.js
        modified:   Backend/src/utils/createSuperAdmin.js
        modified:   Backend/src/utils/jwt.js
        modified:   FondEnd/src/App.jsx
        modified:   FondEnd/src/Component/Home/BrowseAllCamp.jsx
        modified:   FondEnd/src/Component/Home/BrowseCamps.jsx
        modified:   FondEnd/src/Component/Home/CampBrowse.jsx
        modified:   FondEnd/src/Component/Home/Contact/FormContact.jsx
        new file:   FondEnd/src/Component/Home/Contact/FormContact2.jsx
        modified:   FondEnd/src/Component/Home/FeaturedCamps.jsx
        modified:   FondEnd/src/Component/Home/Hero.jsx
        modified:   FondEnd/src/Component/Home/Testimonials.jsx
        modified:   FondEnd/src/Component/SuperAdmin/Camps/CampHeader.jsx
        modified:   FondEnd/src/Component/SuperAdmin/Camps/CampManagement.jsx
        modified:   FondEnd/src/Component/SuperAdmin/CreateSystemAdmin/CreateSystemAdmin.jsx
        new file:   FondEnd/src/Component/SuperAdmin/Setting/EmailSettings.jsx
        modified:   FondEnd/src/Component/SuperAdmin/Setting/SecuritySettings.jsx
        new file:   FondEnd/src/Component/SuperAdmin/Users/AddUserModal.jsx
        new file:   FondEnd/src/Component/SuperAdmin/Users/UserAnalytics.jsx
        modified:   FondEnd/src/Component/SuperAdmin/Users/UserHeader.jsx
        modified:   FondEnd/src/Component/SuperAdmin/Users/UserManagement.jsx
        modified:   FondEnd/src/Component/SuperAdmin/charts/BookingActivityChart.jsx
        modified:   FondEnd/src/Component/SuperAdmin/charts/RefundSummaryChart.jsx
        modified:   FondEnd/src/Component/SuperAdmin/charts/RevenueChart.jsx
        modified:   FondEnd/src/Component/SuperAdmin/charts/VisitorChart.jsx
        modified:   FondEnd/src/Component/SuperAdmin/header/Header.jsx
        modified:   FondEnd/src/Component/SuperAdmin/header/ViewProfile.jsx
        modified:   FondEnd/src/Component/SuperAdmin/pages/Dashboard.jsx
        new file:   FondEnd/src/Component/SuperAdmin/services/admin.service.js
        new file:   FondEnd/src/Component/SuperAdmin/services/api.js
        modified:   FondEnd/src/Component/SuperAdmin/sidebar/Sidebar.jsx
        new file:   FondEnd/src/assets/Bale-forest.png
        new file:   FondEnd/src/assets/Danakil-desert.png
        new file:   FondEnd/src/assets/Dawit.png
        new file:   FondEnd/src/assets/Entoto-image.png
        new file:   FondEnd/src/assets/Hero-image.png
        new file:   FondEnd/src/assets/Highland-Glamping.png
        new file:   FondEnd/src/assets/Lake-tana.png
        new file:   FondEnd/src/assets/Omo.png
        new file:   FondEnd/src/assets/Simien-mountain.png

Unmerged paths:
  (use "git restore --staged <file>..." to unstage)
  (use "git add/rm <file>..." as appropriate to mark resolution)
        deleted by us:   Backend/src/app.js
        deleted by us:   Backend/src/controllers/auth.controller.js
        deleted by us:   Backend/src/controllers/campHomeController.js
        both modified:   Backend/src/controllers/dashboardController.js
        deleted by us:   Backend/src/middlewares/auth.js
        both modified:   Backend/src/middlewares/auth.middleware.js
        deleted by us:   Backend/src/middlewares/authMiddleware.js
        deleted by us:   Backend/src/models/Booking.js
        deleted by us:   Backend/src/models/Camp.js
        both modified:   Backend/src/models/Camp.model.js
        both modified:   Backend/src/models/User.model.js
        deleted by us:   Backend/src/routes/auth.js
        both modified:   Backend/src/routes/camp.routes.js
        deleted by us:   Backend/src/routes/campRoutes.js
        deleted by us:   Backend/src/routes/userRoutes.js
        both modified:   Backend/src/server.js
        both modified:   FondEnd/src/Component/Auth/Login.jsx
        deleted by us:   FondEnd/src/Component/Auth/SignUpformUser.jsx

post@post-HP-290-G3-MT-Business-PC:~/Final_Year_Project$ 
  HiUser 
} from "react-icons/hi";

export const SignUpformUser = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("https://ethio-camp-ground-backend-lega.onrender.com/api/auth/signup", {
        fullName,
        email,
        phone,
        password,
        confirmPassword,
      });

      setSuccess("Account created! Please verify your email/phone.");
      console.log("Signup response:", res.data);

      setTimeout(() => {
        window.location.href = "/verify";
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="w-full h-screen">
      <div className="flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white shadow-xl rounded-2xl p-5 w-full max-w-md">

          <form onSubmit={handleSignup} className="mt-8 flex flex-col gap-4">

            {/* Full Name */}
            <label className="text-sm font-medium">Full Name</label>
            <div className="relative">
              <HiUser className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#097D5A]"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            {/* Email */}
            <label className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <HiMail className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#097D5A]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Phone Number */}
            <label className="text-sm font-medium">Phone Number</label>
            <div className="relative">
              <HiPhone className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type="number"
                placeholder="Enter your phone number"
                className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#097D5A]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Password */}
            <label className="text-sm font-medium mt-2">Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="w-full border rounded-xl pl-10 pr-10 py-3 outline-none focus:ring-2 focus:ring-[#097D5A]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Eye Icon */}
              {showPassword ? (
                <HiEyeOff
                  className="absolute right-3 top-3.5 text-gray-400 text-lg cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <HiEye
                  className="absolute right-3 top-3.5 text-gray-400 text-lg cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>

            {/* Confirm Password */}
            <label className="text-sm font-medium mt-2">Confirm Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-3.5 text-gray-400 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="w-full border rounded-xl pl-10 pr-10 py-3 outline-none focus:ring-2 focus:ring-[#097D5A]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {/* Eye Icon */}
              {showPassword ? (
                <HiEyeOff
                  className="absolute right-3 top-3.5 text-gray-400 text-lg cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <HiEye
                  className="absolute right-3 top-3.5 text-gray-400 text-lg cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Success Message */}
            {success && <p className="text-green-600 text-sm text-center">{success}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#097D5A] text-white py-3 rounded-xl mt-4 hover:bg-green-800 transition"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create a Camper Account"}
            </button>

          </form>

          {/* Footer */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <a href="/login">
              <span className="text-blue-600 cursor-pointer hover:underline">
                Log in
              </span>
            </a>
          </p>

        </div>
      </div>
    </div>
  );
};
