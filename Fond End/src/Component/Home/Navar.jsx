import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import logo from "../../assets/EthioCampGround header.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  const Navlinks = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/camps", label: "Camps" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
        
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="EthioCampGround" className="h-20 w-auto object-contain" />
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white border-t border-gray-100 shadow-md md:hidden">
            <div className="flex flex-col p-5 space-y-4">
              {Navlinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className={`text-gray-700 hover:text-green-900 ${
                    activeLink === link.href ? "font-semibold text-green-950" : ""
                  }`}
                  onClick={() => {
                    setActiveLink(link.href);
                    setIsMenuOpen(false);
                  }}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Login Button */}
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="bg-green-950 text-white text-center py-2 rounded-lg hover:bg-green-900"
              >
                Login
              </Link>
            </div>
          </div>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {Navlinks.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className={`hover:text-green-900 ${
                activeLink === link.href ? "text-green-950 font-semibold" : "text-gray-700"
              }`}
              onClick={() => setActiveLink(link.href)}
            >
              {link.label}
            </Link>
          ))}

          {/* Desktop Login Button */}
          <Link
            to="/login"
            className="bg-green-950 text-white px-5 py-2 rounded-lg hover:bg-green-900 transition"
          >
            Login
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
