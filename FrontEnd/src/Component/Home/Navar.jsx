import React, { useState, useEffect } from "react";
import { HiMenu, HiX, HiChevronDown, HiUserCircle, HiLogout, HiUser, HiGlobeAlt } from "react-icons/hi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import logo from "../../assets/EthioCampGround header.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { language, changeLanguage, t } = useLanguage();
  const [activeLink, setActiveLink] = useState("/");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetches user from local storage to display profile info
  const fetchUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  // Sync navbar state with localStorage and URL path
  useEffect(() => {
    fetchUser();
    setActiveLink(location.pathname);
    
    // Listen for the 'storage' event triggered by OTPVerification
    window.addEventListener("storage", fetchUser);
    return () => window.removeEventListener("storage", fetchUser);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsMenuOpen(false);
    setIsAccountOpen(false);
    navigate("/login");
  };

  const Navlinks = [
    { href: "/", label: t("nav.home") || "Home" },
    { href: "/features", label: t("nav.features") || "Features" },
    { href: "/camps", label: t("nav.camps") || "Camps" },
    { href: "/about", label: t("nav.about") || "About" },
    { href: "/contact", label: t("nav.contact") || "Contact" },
  ];

  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "am", label: "አማርኛ", flag: "🇪🇹" },
    { code: "om", label: "Oromoo", flag: "🇪🇹" },
  ];

  // Logic to show the first letter of Name or Email in the profile circle
  const getInitial = () => {
    if (user?.fullName) return user.fullName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
        
        {/* LEFT: Logo */}
        <Link to="/" className="flex items-center" onClick={() => setActiveLink("/")}>
          <img src={logo} alt="EthioCampGround" className="h-14 md:h-20 w-auto object-contain" />
        </Link>

        {/* RIGHT: Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => {
                setIsAccountOpen(!isAccountOpen);
                if (isMenuOpen) setIsMenuOpen(false);
            }}
            className="p-2 flex items-center justify-center bg-gray-100 rounded-full text-green-950"
          >
            {user ? (
              <div className="w-7 h-7 bg-green-950 text-white rounded-full flex items-center justify-center font-bold text-xs">
                {getInitial()}
              </div>
            ) : (
              <HiUserCircle className="w-7 h-7" />
            )}
          </button>

          <button
            onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                if (isAccountOpen) setIsAccountOpen(false);
            }}
            className="p-2 text-gray-700 bg-gray-100 rounded-full"
          >
            {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* DESKTOP: Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {Navlinks.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className={`relative group py-2 transition-all duration-500 ease-in-out hover:scale-110 ${
                activeLink === link.href ? "text-green-950 font-bold" : "text-gray-600 font-medium"
              }`}
              onClick={() => setActiveLink(link.href)}
            >
              {link.label}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-green-950 transition-all duration-300 ${activeLink === link.href ? "w-full" : "w-0 group-hover:w-full"}`}></span>
            </Link>
          ))}

          {/* DESKTOP: Language Switcher */}
          <div className="relative ml-4">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              onBlur={() => setTimeout(() => setIsLanguageOpen(false), 200)}
              className="flex items-center gap-2 text-gray-600 hover:text-green-950 font-medium transition-colors"
            >
              <HiGlobeAlt className="w-5 h-5" />
              <span>{languages.find(l => l.code === language)?.label || "English"}</span>
              <HiChevronDown className={`transition-transform duration-300 ${isLanguageOpen ? "rotate-180" : ""}`} />
            </button>

            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-[80] animate-in fade-in zoom-in-95 duration-200">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setIsLanguageOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                      language === lang.code ? "text-green-950 font-bold bg-green-50/50" : "text-gray-600"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DESKTOP: Account Dropdown */}
          <div className="relative ml-4">
            <button
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              onBlur={() => setTimeout(() => setIsAccountOpen(false), 200)}
              className="flex items-center gap-2 bg-green-950 text-white px-5 py-2.5 rounded-xl hover:bg-green-900 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
            >
              {user ? (
                <div className="w-6 h-6 bg-white text-green-950 rounded-full flex items-center justify-center font-black text-xs">
                  {getInitial()}
                </div>
              ) : (
                <HiUserCircle className="w-5 h-5" />
              )}
              <span className="font-bold tracking-wide">{user ? t("nav.account") : t("nav.joinUs")}</span>
              <HiChevronDown className={`transition-transform duration-300 ${isAccountOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Dropdown Menu logic */}
        {isAccountOpen && (
          <div className="absolute right-4 top-16 md:top-20 w-64 md:w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-[70] animate-in fade-in zoom-in-95 duration-200">
            {!user ? (
              <>
                <Link to="/login" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                  <HiUser className="text-green-900" /> {t("nav.login")}
                </Link>
                <Link to="/SignUp" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                  <HiUserCircle className="text-green-900" /> {t("nav.createAccount")}
                </Link>
              </>
            ) : (
              <>
                {/* Profile Header within Dropdown */}
                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                  <p className="text-[10px] uppercase font-black text-gray-400">Logged in as</p>
                  <p className="text-sm font-bold text-green-950 truncate">{user.fullName || "User"}</p>
                  <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                </div>
                <Link to="/camper-dashboard" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                  <HiUser className="text-gray-400" /> {t("nav.profile")}
                </Link>
                <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium">
                  <HiLogout /> {t("nav.signOut")}
                </button>
              </>
            )}
          </div>
        )}

        {/* Mobile Navigation List */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white border-t border-gray-100 shadow-xl md:hidden z-[60] animate-in slide-in-from-top duration-300">
            <div className="flex flex-col p-5 space-y-4">
              {Navlinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className={`text-lg font-medium transition-all duration-300 ${
                    activeLink === link.href ? "text-green-950 translate-x-2" : "text-gray-600"
                  }`}
                  onClick={() => {
                    setActiveLink(link.href);
                    setIsMenuOpen(false);
                  }}
                >
                  {link.label}
                </Link>
              ))}
            {/* Mobile Language Options */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-black text-gray-400 uppercase mb-3 px-1">Language</p>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setIsMenuOpen(false);
                    }}
                    className={`py-2 px-3 rounded-xl border text-center text-sm font-bold transition-all ${
                      language === lang.code 
                        ? "bg-green-950 text-white border-green-950" 
                        : "bg-gray-50 text-gray-600 border-gray-100"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </nav>
  );
};

export default Navbar;