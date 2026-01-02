import React, { useState } from "react";
import {
  HiMail,
  HiLockClosed,
  HiEye,
  HiShieldCheck,
  HiUsers,
} from "react-icons/hi";
import Logo from "../../assets/signUp-image.png";
import { SignUpformUser } from "./SignUpformUser";
import ManagerSignUpForm from "./managerSignUpForm";
import { HomeIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";

const SignUp = () => {
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignUpManager, setOpenSignUpManager] = useState(false);

  // ---------- OPEN ONE → CLOSE THE OTHER ----------
  const handleOpenUser = () => {
    setOpenSignUp(true);
    setOpenSignUpManager(false);
  };

  const handleOpenManager = () => {
    setOpenSignUpManager(true);
    setOpenSignUp(false);
  };

  return (
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* ------------ LEFT SIDE ------------ */}
      <div className="bg-[#097D5A] text-white flex flex-col items-center justify-center">
        <img src={Logo} alt="signup" className="w-full h-full object-contain" />
      </div>

      {/* ------------ RIGHT SIDE ------------ */}
      <div className="flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
          
          {/* Title */}
          <h1 className="text-3xl font-semibold text-center">Create Account</h1>
          <p className="text-center text-gray-500 mt-1">
            Choose your account type
          </p>

          {/* ---------------- Camper Account ---------------- */}
          <button
            className="w-full mt-8 rounded-xl p-5 flex items-center gap-4 hover:bg-gray-50 hover:border-green-700 transition cursor-pointer border focus:bg-green-50 focus:border-green-600"
            onClick={handleOpenUser}
          >
            <HomeIcon className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Camper Account</h3>
              <p className="text-gray-500 text-sm">
                Book and enjoy camping experiences
              </p>
            </div>
          </button>

          {/* ---------------- Camp Manager ---------------- */}
          <button
            className="w-full mt-4 border rounded-xl p-5 flex items-center gap-4 hover:bg-gray-50 hover:border-green-700 transition cursor-pointer focus:bg-green-50 focus:border-green-600"
            onClick={handleOpenManager}
          >
            <BuildingOfficeIcon className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Camp Manager</h3>
              <p className="text-gray-500 text-sm">
                Manage and list your camping sites
              </p>
            </div>
          </button>

          {/* ---------- CONDITIONAL FORMS ---------- */}
          {openSignUp && (
            <SignUpformUser onSignUp={() => setOpenSignUp(false)} />
          )}

          {openSignUpManager && (
            <ManagerSignUpForm onSignUp={() => setOpenSignUpManager(false)} />
          )}

          {/* Sign In Link */}
{!openSignUp && !openSignUpManager && (
  <p className="text-center text-gray-600 mt-6">
    Already have an account?{" "}
    <a href="/login" className="text-green-600 font-medium hover:underline">
      Sign in
    </a>
  </p>
)}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
