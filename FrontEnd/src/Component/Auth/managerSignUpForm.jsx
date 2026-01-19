import React, { useState, useRef } from "react";
import axios from "axios";
import { 
  HiMail, HiPhone, HiLockClosed, HiUser, HiOutlineOfficeBuilding, 
  HiEye, HiEyeOff, HiCheckCircle, HiExclamationCircle, HiArrowLeft,
  HiCloudUpload, HiDocumentText, HiLocationMarker, HiIdentification
} from "react-icons/hi";
import { motion } from "framer-motion";

const ManagerSignUpForm = ({ onBack }) => {
  const licenseRef = useRef(null);
  const govIdRef = useRef(null);

  const [formData, setFormData] = useState({ 
    fullName: "", email: "", phone: "", businessName: "", 
    password: "", confirmPassword: "", location: "", description: "" 
  });
  
  const [licenseFile, setLicenseFile] = useState(null);
  const [govIdFile, setGovIdFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [agreed, setAgreed] = useState(false); 

  const validations = {
    length: formData.password.length >= 12,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*]/.test(formData.password),
    match: formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword
  };

  const handleChange = (e) => { 
  const value = e.target.name === "phone" ? e.target.value.replace(/\D/g, "") : e.target.value;
  setFormData({ ...formData, [e.target.name]: value }); 
};

  // Find the handleSubmit function and update it:
const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  if (!licenseFile || !govIdFile) {
    return setMessage("Error: Please upload both License and ID.");
  }
  if (!agreed) return setMessage("Error: Please agree to the terms.");

  setLoading(true);
  try {
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    data.append("license", licenseFile);
    data.append("govId", govIdFile);
    data.append("role", "camp_manager");
    data.append("contactEmail", formData.email); 

    localStorage.setItem("pendingTarget", formData.phone);
    
    const res = await axios.post("http://localhost:5000/api/auth/register", data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    
    // LOGICAL UPDATE: Store the manager data
    if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("role", "camp_manager");
        // Trigger navbar update
        window.dispatchEvent(new Event("storage"));
    }
    
    window.location.href = "/verify";
  } catch (err) { 
    setMessage(err.response?.data?.error || "Error: Signup failed"); 
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full max-w-md mx-auto py-2">
      <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white mb-4 text-xs font-black tracking-widest transition-all group">
        <HiArrowLeft className="group-hover:-translate-x-1" /> BACK
      </button>

      <header className="mb-6">
        <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Manager Signup</h2>
        <p className="text-sky-300/60 text-[10px] mt-2 font-bold tracking-widest uppercase">Business & Identity Verification</p>
      </header>

      {message && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mb-4 p-3 border-l-4 text-white text-[11px] font-bold flex gap-2 rounded-r-xl ${message.includes("Error") ? 'bg-red-500/20 border-red-400' : 'bg-emerald-500/20 border-emerald-400'}`}>
          <HiExclamationCircle className="text-lg shrink-0" /> {message}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Core Info */}
        <div className="grid grid-cols-2 gap-3">
          <InputGroup icon={<HiUser />} name="fullName" placeholder="Full Name" onChange={handleChange} />
          <InputGroup icon={<HiOutlineOfficeBuilding />} name="businessName" placeholder="Camp Name" onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InputGroup icon={<HiMail />} name="email" type="email" placeholder="Business Email" onChange={handleChange} />
          <InputGroup icon={<HiPhone />} name="phone" type="tel" placeholder="Phone Number" onChange={handleChange} />
        </div>

        {/* Location & Description */}
        <InputGroup icon={<HiLocationMarker />} name="location" placeholder="Business Location (e.g. Addis Ababa)" onChange={handleChange} />
        
        <div className="relative group">
          <textarea 
            name="description"
            placeholder="Short Business Description..." 
            className="w-full bg-white/5 border border-white/20 rounded-2xl pl-4 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:bg-white/10 focus:border-sky-400 text-sm h-20 resize-none" 
            onChange={handleChange}
            required
          />
        </div>

        {/* Two Upload Fields */}
        <div className="grid grid-cols-2 gap-3">
          <UploadZone 
            file={licenseFile} 
            setFile={setLicenseFile} 
            inputRef={licenseRef} 
            label="Business License" 
            icon={<HiDocumentText />} 
          />
          <UploadZone 
            file={govIdFile} 
            setFile={setGovIdFile} 
            inputRef={govIdRef} 
            label="Government ID" 
            icon={<HiIdentification />} 
          />
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative group">
            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-300 text-lg z-10" />
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="w-full bg-white/5 border border-white/20 rounded-2xl pl-11 py-3.5 text-white placeholder:text-white/30 outline-none focus:bg-white/10 focus:border-sky-400 text-sm" onChange={handleChange} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">{showPassword ? <HiEyeOff size={16} /> : <HiEye size={16} />}</button>
          </div>
          <div className="relative group">
            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-300 text-lg z-10" />
            <input type={showPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm" className="w-full bg-white/5 border border-white/20 rounded-2xl pl-11 py-3.5 text-white placeholder:text-white/30 outline-none focus:bg-white/10 focus:border-sky-400 text-sm" onChange={handleChange} required />
          </div>
        </div>

        {/* Validation & Agreement */}
        <div className="grid grid-cols-3 gap-y-1.5 p-3 bg-black/10 rounded-2xl border border-white/5">
          {Object.entries(validations).map(([key, val]) => (
            <ValidationItem key={key} label={key === 'length' ? '12+ Chars' : key} isValid={val} />
          ))}
        </div>

        <div className="flex items-center gap-2 py-1 px-1">
          <input type="checkbox" id="m-agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 rounded-md accent-sky-400" />
          <label htmlFor="m-agree" className="text-[10px] text-white/60 font-medium">I verify all information and documents are valid.</label>
        </div>

        <motion.button 
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading} 
          className="w-full bg-white text-[#007ba7] font-black py-4 rounded-2xl shadow-xl hover:bg-sky-50 transition-all uppercase tracking-widest text-xs"
        >
          {loading ? "Registering Account..." : "Submit Application"}
        </motion.button>
      </form>
    </div>
  );
};

// Sub-components for cleaner code
const InputGroup = ({ icon, ...props }) => (
  <div className="relative group flex-1">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-300 text-lg z-10 transition-colors group-focus-within:text-white">
      {icon}
    </div>
    <input 
      {...props}
      className="w-full bg-white/5 border border-white/20 rounded-2xl pl-11 py-3.5 text-white placeholder:text-white/30 outline-none focus:bg-white/10 focus:border-sky-400 text-sm" 
      required 
    />
  </div>
);

const UploadZone = ({ file, setFile, inputRef, label, icon }) => (
  <div 
    onClick={() => inputRef.current.click()}
    className={`relative cursor-pointer group border border-dashed rounded-2xl p-3 transition-all flex flex-col items-center justify-center text-center gap-1 ${file ? 'border-sky-400 bg-sky-400/10' : 'border-white/20 bg-white/5 hover:border-white/40'}`}
  >
    <input type="file" ref={inputRef} onChange={(e) => setFile(e.target.files[0])} className="hidden" />
    <div className={`${file ? 'text-sky-300' : 'text-white/30'} text-xl group-hover:scale-110 transition-transform`}>
      {file ? <HiCheckCircle /> : icon}
    </div>
    <p className="text-white text-[10px] font-bold truncate max-w-full px-1">{file ? file.name : label}</p>
    {!file && <p className="text-white/20 text-[8px] uppercase">Upload</p>}
  </div>
);

const ValidationItem = ({ label, isValid }) => (
  <div className={`flex items-center gap-1 transition-colors ${isValid ? "text-sky-300" : "text-white/10"}`}>
    <HiCheckCircle className="text-xs" />
    <span className="text-[8px] font-black uppercase tracking-tight">{label}</span>
  </div>
);

export default ManagerSignUpForm;