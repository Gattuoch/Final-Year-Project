import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

// Image Assets
import camp0 from "../../assets/Camp.png";
import camp1 from "../../assets/camp1.png";
import camp2 from "../../assets/camp2.png";
import Navbar from "../Home/Navar";

export const Login = () => {
  const images = [camp0, camp1, camp2];
  const [currentImg, setCurrentImg] = useState(0);

  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        identifier: formData.identifier,
        password: formData.password,
      });

  // Save tokens and user info
  localStorage.setItem("accessToken", res.data.accessToken);
  localStorage.setItem("refreshToken", res.data.refreshToken);

  // server may return the role under res.data.user.role or res.data.role
  const role = res.data?.user?.role || res.data?.role || "";
  localStorage.setItem("role", role);
  localStorage.setItem("user", JSON.stringify(res.data?.user || {}));

  // Redirect based on role
  switch (role) {
        case "camper":
          window.location.href = "/camper-dashboard";
          break;
        case "camp_manager":
          window.location.href = "/manager-dashboard";
          break;
        case "ticket_officer":
          window.location.href = "/ticket-dashboard";
          break;
        case "system_admin":
          window.location.href = "/admin-dashboard";
          break;
        case "super_admin":
          window.location.href = "/super-admin";
          break;
        case "security_officer":
          window.location.href = "/security_officer";
          break;
        default:
          window.location.href = "/";
      }

    } catch (err) {
      setLoading(false);
      const status = err.response?.status;
      
      if (status === 404) {
        setError("Account does not exist. Please check your identifier.");
      } else if (status === 401) {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        setError(`Wrong password. Failed attempts: ${nextAttempts}`);
      } else if (status === 403) {
        setError(err.response?.data?.error || "Access denied.");
      } else {
        setError("Unable to reach server. Please try again later.");
      }
    }
  };

  return (
    <>
      <Navbar />
    <div className="w-full h-screen flex items-center justify-center bg-white p-4 selection:bg-blue-100">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex w-full max-w-5xl h-[650px] bg-white rounded-[48px]
        shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_30px_60px_-30px_rgba(0,123,167,0.3)] 
        border border-slate-100 overflow-hidden relative"
      >
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center text-center p-10"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}>
                <HiCheckCircle className="text-[#007ba7] text-[120px] mb-6 drop-shadow-xl" />
              </motion.div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Warm Welcome!</h1>
              <p className="text-slate-500 mt-3 text-lg font-medium">Synchronizing your adventure...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LEFT PANEL */}
        <div className="relative hidden md:flex w-1/2 h-full bg-slate-900 overflow-hidden">
          {images.map((img, index) => (
            <motion.img
            key={index}
              src={img}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentImg === index ? 1 : 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover scale-105"
              alt="Camping"
              />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/20" />
          <div className="absolute bottom-20 left-12 right-12 text-white z-10">
            <TypeAnimation
              sequence={["Your journey begins here.", 1500, "The ultimate camping experience awaits.", 1500]}
              wrapper="h2"
              speed={50}
              className="text-3xl font-extrabold tracking-tight leading-tight"
              repeat={Infinity}
              />
          </div>
        </div>

        {/* RIGHT PANEL - CERULEAN BLUE */}
        <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-12 lg:px-24 bg-[#007ba7] relative">
          <div className="w-full max-w-sm mx-auto">
            <header className="mb-10">
              <TypeAnimation
                sequence={["Welcome Back", 2000]}
                wrapper="h1"
                className="text-4xl font-black text-white tracking-[ -0.05em]"
                cursor={false}
              />
              <div className="h-1.5 w-14 bg-white/30 mt-4 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5 }}
                  className="h-full bg-white" 
                />
              </div>
              
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-3 bg-white/10 backdrop-blur-sm border-l-4 border-white rounded-r-lg flex items-center gap-2 text-white text-xs font-bold"
                  >
                    <HiExclamationCircle className="text-lg shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {!error && (
                <p className="text-blue-50/80 mt-6 font-medium text-lg leading-relaxed">
                  Enter your credentials to access your portal.
                </p>
              )}
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest ml-1">Account Identifier</label>
                <div className="relative">
                  <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-300 text-xl z-10 pointer-events-none" />
                  <input
                    type="text" name="identifier" placeholder="Email or Phone"
                    value={formData.identifier} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/20 rounded-2xl pl-12 py-4 text-white placeholder:text-white/30 outline-none focus:bg-white/10 focus:border-sky-400 transition-all font-medium"
                    required
                    />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-300 text-xl z-10 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"} name="password" placeholder="••••••••"
                    value={formData.password} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/20 rounded-2xl pl-12 pr-12 py-4 text-white placeholder:text-white/30 outline-none focus:bg-white/10 focus:border-sky-400 transition-all font-medium"
                    required
                  />
                  <button
                    type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors z-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pb-2">
                <a href="/forgot" className="text-xs font-bold text-white/70 hover:text-white transition-colors uppercase tracking-wider">
                  Reset Password?
                </a>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit" disabled={loading}
                className="w-full bg-white text-[#007ba7] font-black py-4 rounded-2xl shadow-xl shadow-black/10 flex items-center justify-center gap-3 transition-all hover:shadow-white/20"
                >
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-[3px] border-[#007ba7] border-t-transparent rounded-full" />
                ) : (
                  "AUTHENTICATE"
                )}
              </motion.button>
            </form>

            <footer className="mt-10 text-center">
              <p className="text-blue-50/60 text-sm font-medium">
                New explorer? <a href="/signUp" className="text-white font-black ml-1 hover:underline underline-offset-4 tracking-tight">Create an Account</a>
              </p>
            </footer>
          </div>
        </div>
      </motion.div>
    </div>
  </>
  );
};