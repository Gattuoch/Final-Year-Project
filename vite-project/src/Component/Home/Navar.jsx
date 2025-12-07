import React, { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import logo from "../../assets/EthioCampGround header.png"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");

  const Navlinks = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/camps", label: "Camps" },
    { href: "/about", label: "About" },
    { href: "/Contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 md:h-20 h-16">
        
        {/* Logo / Title */}
        <Link to="/" className="text-2xl font-bold text-green-950 ">
         <img src={logo} alt="EthioCampGround" />
        </Link>

        {/* Mobile Menu Button */}
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
            <div className="flex flex-col p-4 space-y-2">
              {Navlinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className={`hover:text-green-900 ${
                    activeLink === link.href ? "text-shadow-green-950 font-semibold" : ""
                  }`}
                  onClick={() => {
                    setActiveLink(link.href);
                    setIsMenuOpen(false);
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 space-x-6 mr-4">
          {Navlinks.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className={`hover:text-green-900 ${
                activeLink === link.href ? "text-green-950 font-semibold" : ""
              }`}
              onClick={() => setActiveLink(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </div>
        {/*  login Botton */}
         <button className="bg-green-950 text-white px-4 py-2 w-40 rounded-lg hover:bg-green-900">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;