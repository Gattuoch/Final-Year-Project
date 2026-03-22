import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import Logo from "../../assets/EthioCampGround footer.png"

export default function Footer() {
  return (
    <footer className="bg-[#0F1624] text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">

        {/* BRAND */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            {/* Logo */}
                    <Link to="/" className="flex items-center">
                      <img src={Logo} alt="EthioCampGround" className="h-20 w-auto object-contain" />
                    </Link>
          </div>

          <p className="text-gray-400 leading-relaxed mb-6">
            Your trusted platform for discovering and booking the best
            camping experiences across Ethiopia.
          </p>

          <div className="flex gap-5 text-2xl text-gray-300">
            <FaFacebook className="hover:text-white cursor-pointer" />
            <FaTwitter className="hover:text-white cursor-pointer" />
            <FaInstagram className="hover:text-white cursor-pointer" />
            <FaLinkedin className="hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3 text-gray-400">
            <a href="/"><li className="hover:text-white cursor-pointer">Home</li></a>
            <a href="/about"><li className="hover:text-white cursor-pointer">About Us</li></a>
            <a href="/camps"><li className="hover:text-white cursor-pointer">Browse Camps</li></a>
            <a href="/"><li className="hover:text-white cursor-pointer">How It Works</li></a>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="hover:text-white cursor-pointer">Help Center</li>
            <li className="hover:text-white cursor-pointer">Terms of Service</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <a href="/contact"><li className="hover:text-white cursor-pointer">Contact Us</li></a>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>

          <ul className="space-y-4 text-gray-400">
            <li className="flex items-center gap-3">
              <HiOutlineMail className="text-xl" />
              info@ethiocamp.com
            </li>

            <li className="flex items-center gap-3">
              <HiOutlinePhone className="text-xl" />
              +251 11 123 4567
            </li>

            <li className="flex items-center gap-3">
              <HiOutlineLocationMarker className="text-xl" />
              Addis Ababa, Ethiopia
            </li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-500">
        © 2025 EthioCampGround. All rights reserved.
      </div>
    </footer>
  );
}
