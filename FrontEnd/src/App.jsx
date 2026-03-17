import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./context/UserContext";

/* ================= HOME COMPONENTS ================= */

import Navbar from "./Component/Home/Navar";
import Footer from "./Component/Home/Footer";
import Home from "./Component/Home/Home";
import Hero from "./Component/Home/Hero";
import FeaturedCamps from "./Component/Home/FeaturedCamps";
import WhyChoose from "./Component/Home/WhyChoose";
import HowItWorks from "./Component/Home/HowItWorks";
import Testimonials from "./Component/Home/Testimonials";
import CTASection from "./Component/Home/CTASection";

/* ================= FEATURE PAGE ================= */

import PlatformFeatures from "./Component/Home/PlatformFeatures";
import Experience from "./Component/Home/Experience";
import BrowseCamps from "./Component/Home/BrowseCamps";

/* ================= CAMPS PAGE ================= */

import BrowseALLCamps from "./Component/Home/BrowseCamps";

/* ================= ABOUT PAGE ================= */

import About from "./Component/Home/About";
import CoreValues from "./Component/Home/CoreValues";
import { GrowingCommunity } from "./Component/Home/GrowingCommunity";

/* ================= CONTACT PAGE ================= */

import GetInTouch from "./Component/Home/Contact/GetIntouch";
import FormContact from "./Component/Home/Contact/FormContact2";

/* ================= AUTH ================= */

import { Login } from "./Component/Auth/Login";
import SignUp from "./Component/Auth/SignUp";
import OTPVerification from "./Component/Auth/OTPVerification";
import { RequestPasswordReset } from "./Component/Auth/RequestPasswordReset";
import { ResetPassword } from "./Component/Auth/ResetPassword";

/* ================= SUPER ADMIN ================= */

import Dashboard from "./Component/SuperAdmin/pages/Dashboard";
import CampManagement from "./Component/SuperAdmin/Camps/CampManagement";
import UserManagement from "./Component/SuperAdmin/Users/UserManagement";

import PlatformSettings from "./Component/SuperAdmin/Setting/PlatformSettings";
import PaymentSettings from "./Component/SuperAdmin/Setting/PaymentSettings";
import NotificationSettings from "./Component/SuperAdmin/Setting/NotificationSettings";
import GeneralSettings from "./Component/SuperAdmin/Setting/GeneralSettings";
import SecuritySettings from "./Component/SuperAdmin/Setting/SecuritySettings";
import EmailSettings from "./Component/SuperAdmin/Setting/EmailSettings";
import CreateSystemAdmin from "./Component/SuperAdmin/CreateSystemAdmin/CreateSystemAdmin";

/* ================= CAMPER DASHBOARD ================= */

import CamperDashboard from "./Component/Camper/Main/CamperDashboard";
import MyReservations from "./Component/Camper/Bookings/MyReservations";
import Booking from "./Component/Camper/Bookings/Booking";
import Confirmation from "./Component/Camper/Bookings/Confirmation";
import CampsiteDirectory from "./Component/Camper/Bookings/CampsiteDirectory";

import Payments from "./Component/Camper/Activity/Payments";
import MyProfile from "./Component/Camper/Main/MyProfile";

import Notifications from "./Component/Camper/UPDATES/Notifications";
import NotificationPreferences from "./Component/Camper/UPDATES/NotificationPreferences";

import SettingsPage from "./Component/Camper/Activity/SettingsPage";
import SecurityPassword from "./Component/Camper/Activity/SecurityPassword";

import ContactSupport from "./Component/Camper/Support/ContactSupport";

import Chapa from "./Component/Camper/Activity/Chapa";
import DayVisitTickets from "./Component/Camper/Bookings/DayVisitTickets";

function App() {
  return (
    <UserProvider>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: "14px",
          },
        }}
      />

      <Routes>

        {/* ================= HOME ================= */}

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

        {/* ================= FEATURES ================= */}

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

        {/* ================= CAMPS ================= */}

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

        {/* ================= ABOUT ================= */}

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

        {/* ================= CONTACT ================= */}

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

        {/* ================= AUTH ================= */}

        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/verify" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<RequestPasswordReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ================= SUPER ADMIN ================= */}

        <Route path="/super-admin" element={<Dashboard />} />
        <Route path="/super-admin/camps" element={<CampManagement />} />
        <Route path="/super-admin/users" element={<UserManagement />} />

        {/* ADMIN SETTINGS */}

        <Route path="/super-admin/settings" element={<GeneralSettings />} />
        <Route path="/super-admin/settings/platform" element={<PlatformSettings />} />
        <Route path="/super-admin/settings/payment" element={<PaymentSettings />} />
        <Route path="/super-admin/settings/notifications" element={<NotificationSettings />} />
        <Route path="/super-admin/settings/security" element={<SecuritySettings />} />
        <Route path="/super-admin/settings/email" element={<EmailSettings />} />

        <Route
          path="/super-admin/create-system-admin"
          element={<CreateSystemAdmin />}
        />

        {/* ================= CAMPER DASHBOARD ================= */}

        <Route path="/camper-dashboard" element={<CamperDashboard />} />

        <Route
          path="/camper-dashboard/reservations"
          element={<MyReservations />}
        />

        <Route
          path="/camper-dashboard/campsite-directory"
          element={<CampsiteDirectory />}
        />

        <Route
          path="/camper-dashboard/book/:id"
          element={<Booking />}
        />

        <Route
          path="/camper-dashboard/reservations/confirm-booking"
          element={<Confirmation />}
        />

        <Route
          path="/camper-dashboard/reservations/confirm-booking/chapa"
          element={<Chapa />}
        />

        <Route
          path="/camper-dashboard/payments"
          element={<Payments />}
        />

        <Route
          path="/camper-dashboard/profile"
          element={<MyProfile />}
        />

        <Route
          path="/camper-dashboard/notifications"
          element={<Notifications />}
        />

        <Route
          path="/camper-dashboard/settings"
          element={<SettingsPage />}
        />

        <Route
          path="/camper-dashboard/settings/security-password"
          element={<SecurityPassword />}
        />

        <Route
          path="/camper-dashboard/settings/notification"
          element={<NotificationPreferences />}
        />

        <Route
          path="/camper-dashboard/tickets"
          element={<DayVisitTickets />}
        />

        <Route
          path="/camper-dashboard/support"
          element={<ContactSupport />}
        />

      </Routes>

    </UserProvider>
  );
}

export default App;