import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Home Components
import Navbar from "./Component/Home/Navar";
import Footer from "./Component/Home/Footer";
import Home from "./Component/Home/Home";
import Hero from "./Component/Home/Hero";
import FeaturedCamps from "./Component/Home/FeaturedCamps";
import WhyChoose from "./Component/Home/WhyChoose";
import HowItWorks from "./Component/Home/HowItWorks";
import Testimonials from "./Component/Home/Testimonials";
import CTASection from "./Component/Home/CTASection";

// Feature Page Components
import PlatformFeatures from "./Component/Home/PlatformFeatures";
import Experience from "./Component/Home/Experience";
import BrowseCamps from "./Component/Home/BrowseCamps";

// Camps Page Components
import BrowseALLCamps from "./Component/Home/BrowseCamps.jsx";

// About Page Components
import About from "./Component/Home/About";
import CoreValues from "./Component/Home/CoreValues";
import { GrowingCommunity } from "./Component/Home/GrowingCommunity";

// Contact Page Components
import GetInTouch from "./Component/Home/Contact/GetIntouch";
import FormContact from "./Component/Home/Contact/FormContact2";

// Auth
import { Login } from "./Component/Auth/Login";
import SignUp from "./Component/Auth/SignUp";
import OTPVerification from "./Component/Auth/OTPVerification";
import { RequestPasswordReset } from "./Component/Auth/RequestPasswordReset";
import { ResetPassword } from "./Component/Auth/ResetPassword";

// Super Admin
import Dashboard from "./Component/SuperAdmin/pages/Dashboard.jsx";
import CampManagement from "./Component/SuperAdmin/Camps/CampManagement.jsx";
import UserManagement from "./Component/SuperAdmin/Users/UserManagement.jsx";
import PlatformSettings from "./Component/SuperAdmin/Setting/PlatformSettings.jsx";
import PaymentSettings from "./Component/SuperAdmin/Setting/PaymentSettings.jsx";
import NotificationSettings from "./Component/SuperAdmin/Setting/NotificationSettings.jsx";
import GeneralSettings from "./Component/SuperAdmin/Setting/GeneralSettings.jsx";
import SecuritySettings from "./Component/SuperAdmin/Setting/SecuritySettings.jsx";
import EmailSettings from "./Component/SuperAdmin/Setting/EmailSettings.jsx";
import CreateSystemAdmin from "./Component/SuperAdmin/CreateSystemAdmin/CreateSystemAdmin.jsx";

// Camper Dashboard Components
import BookingCard from "./Component/Camper/Bookings/BookingCard.jsx";
import Payments from "./Component/Camper/Activity/Payments.jsx";
import MyReservations from "./Component/Camper/Bookings/MyReservations.jsx";
import Booking from "./Component/Camper/Bookings/Booking.jsx";
import Confirmation from "./Component/Camper/Bookings/Confirmation.jsx"; 
import CampsiteDirectory from "./Component/Camper/Bookings/CampsiteDirectory.jsx";
import CamperDashboard from "./Component/Camper/main/CamperDashboard.jsx";
import MyProfile from "./Component/Camper/Main/MyProfile.jsx";

function App() {
  return (
    <>
      <Toaster />

      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Hero />
              <WhyChoose />
              <FeaturedCamps />
              <HowItWorks />
              <Testimonials />
              <CTASection />
              <Footer />
            </>
          }
        />

        {/* FEATURES */}
        <Route
          path="/features"
          element={
            <>
              <Navbar />
              <Hero />
              <PlatformFeatures />
              <Experience />
              <BrowseCamps />
              <Footer />
            </>
          }
        />

        {/* CAMPS */}
        <Route
          path="/camps"
          element={
            <>
              <Navbar />
              <Hero />
              <BrowseCamps />
              <BrowseALLCamps />
              <Footer />
            </>
          }
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <About />
              <CoreValues />
              <GrowingCommunity />
              <Footer />
            </>
          }
        />

        {/* CONTACT */}
        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <GetInTouch />
              <FormContact />
              <Footer />
            </>
          }
        />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/verify" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<RequestPasswordReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* SUPER ADMIN */}
        <Route path="/super-admin" element={<Dashboard />} />
        <Route path="/super-admin/camps" element={<CampManagement />} />
        <Route path="/super-admin/users" element={<UserManagement />} />

        {/* SETTINGS */}
        <Route path="/super-admin/settings" element={<GeneralSettings />} />
        <Route
          path="/super-admin/settings/platform"
          element={<PlatformSettings />}
        />
        <Route
          path="/super-admin/settings/payment"
          element={<PaymentSettings />}
        />
        <Route
          path="/super-admin/settings/notifications"
          element={<NotificationSettings />}
        />
        <Route
          path="/super-admin/settings/security"
          element={<SecuritySettings />}
        />
        <Route
          path="/super-admin/settings/email"
          element={<EmailSettings />}
        />

        <Route
          path="/super-admin/create-system-admin"
          element={<CreateSystemAdmin />}
        />

        {/* ======================================================== */}
        {/* CAMPER DASHBOARD ROUTES                */}
        {/* ======================================================== */}
        
        {/* 1. Dashboard Home - Updated to use CamperDashboard component */}
        <Route
          path="/camper-dashboard"
          element={<CamperDashboard />}
        />
        
        {/* 2. My Reservations List */}
        <Route path="/camper-dashboard/reservations" element={<MyReservations />} />
        
        {/* 3. Search / Directory (Clicked from "New Booking") */}
        <Route path="/camper-dashboard/campsite-directory" element={<CampsiteDirectory />} />
        
        {/* 4. Specific Camp Details & Create Booking (Dynamic ID) */}
        <Route path="/camper-dashboard/book/:id" element={<Booking />} />
        
        {/* 5. Payment / Confirmation Page */}
        <Route path="/camper-dashboard/reservations/confirm-booking" element={<Confirmation />} />
        
        {/* 6. Payments History */}
        <Route path="/camper-dashboard/payments" element={<Payments />} />

        {/* 6. profile  */}
        <Route path="/camper-dashboard/profile" element={<MyProfile/>} />

      </Routes>
    </>
  );
}

export default App;