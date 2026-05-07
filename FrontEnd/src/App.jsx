import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./context/UserContext";
import { LanguageProvider } from "./context/LanguageContext";
import AICopilot from "./Component/CampAdmin/AICopilot";
import CamperAICopilot from "./Component/Camper/CamperAICopilot";

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

// Camp Admin Components
import CampAdminCampManagement from "./Component/CampAdmin/CampManagement/CampManagement.jsx";
import CampAdminLayout from "./Component/CampAdmin/CampAdminLayout.jsx";
import CampAdminDashboard from "./Component/CampAdmin/Dashboard/AdminDashboard.jsx";
import ReservationManagement from "./Component/CampAdmin/Reservations/ReservationManagement.jsx";
import PaymentsManagement from "./Component/CampAdmin/Payments/PaymentsManagement.jsx";
import SystemSettings from "./Component/CampAdmin/Settings/SystemSettings.jsx";
import NotificationManagement from "./Component/CampAdmin/Notifications/NotificationManagement.jsx";
import CampAdminUserManagement from "./Component/CampAdmin/Users/UserManagement.jsx";
import CampAdminAnalyticsDashboard from "./Component/CampAdmin/Analytics/AnalyticsDashboard.jsx";

// Camper Dashboard Components
import BookingCard from "./Component/Camper/Bookings/BookingCard.jsx";
import Payments from "./Component/Camper/Activity/Payments.jsx";
import MyReservations from "./Component/Camper/Bookings/MyReservations.jsx";
import Booking from "./Component/Camper/Bookings/Booking.jsx";
import Confirmation from "./Component/Camper/Bookings/Confirmation.jsx";
import CampsiteDirectory from "./Component/Camper/Bookings/CampsiteDirectory.jsx";
import CamperDashboard from "./Component/Camper/Main/CamperDashboard.jsx";
import MyProfile from "./Component/Camper/Main/MyProfile.jsx";
import Notifications from "./Component/Camper/UPDATES/Notifications.jsx";
import AccountSetting from "./Component/Camper/Activity/AccountSetting.jsx";
import SettingsPage from "./Component/Camper/Activity/SettingsPage.jsx";
import SecurityPassword from "./Component/Camper/Activity/SecurityPassword.jsx";
import NotificationPreferences from "./Component/Camper/UPDATES/NotificationPreferences.jsx";
import ContactSupport from "./Component/Camper/Support/ContactSupport.jsx";
import Chapa from "./Component/Camper/Activity/Chapa.jsx";
import DayVisitTickets from "./Component/Camper/Bookings/DayVisitTickets.jsx";

// System Admin Components
import SystemAdminLayout from "./Component/SystemAdmin/SystemAdminLayout.jsx";
import Dashboard from "./Component/SystemAdmin/pages/Dashboard.jsx";
import { CampManagement } from "./Component/SystemAdmin/pages/CampManagement.jsx";
import { UserManagement } from "./Component/SystemAdmin/pages/UserManagement.jsx";
import { FinancialManagement } from "./Component/SystemAdmin/pages/FinancialManagement.jsx";
import { SecurityManagement } from "./Component/SystemAdmin/pages/SecurityManagement/index.jsx";
import { DatabaseManagement } from "./Component/SystemAdmin/pages/DatabaseManagement.jsx";
import { BackupRecovery } from "./Component/SystemAdmin/pages/BackupRecovery.jsx";
import { LogsMonitoring } from "./Component/SystemAdmin/pages/LogsMonitoring.jsx";
import { ReportsAlerts } from "./Component/SystemAdmin/pages/ReportsAlerts/index.jsx";
import { FeatureManagement } from "./Component/SystemAdmin/pages/FeatureManagement.jsx";
import { SystemConfiguration } from "./Component/SystemAdmin/pages/SystemConfiguration.jsx";
import { Profile } from "./Component/SystemAdmin/pages/Profile.jsx";
import SharedReport from "./Component/SystemAdmin/pages/SharedReport.jsx";


function App() {
  return (
    <UserProvider>
      <LanguageProvider>
        <Toaster />
        <AICopilot />
        <CamperAICopilot />

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

        <Route path="/reports/shared/:hash" element={<SharedReport />} />

        {/* ================= AUTH ================= */}

        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/verify" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<RequestPasswordReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />

       
        {/* ======================================================== */}
        {/* CAMP ADMIN ROUTES                      */}
        {/* ======================================================== */}
        <Route path="/manager-dashboard" element={<CampAdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CampAdminDashboard />} />
          <Route path="camps" element={<CampAdminCampManagement />} />
          <Route path="reservations" element={<ReservationManagement />} />
          <Route path="payments" element={<PaymentsManagement />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="notifications" element={<NotificationManagement />} />
          <Route path="users" element={<CampAdminUserManagement />} />
          <Route path="analytics" element={<CampAdminAnalyticsDashboard />} />
        </Route>

        {/* ======================================================== */}
        {/* SYSTEM ADMINISTRATOR ROUTES              */}
        {/* ======================================================== */}
        <Route path="/super-admin" element={<SystemAdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="camps" element={<CampManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="/super-admin/financial" element={<FinancialManagement />} />
          <Route path="security" element={<SecurityManagement />} />
          <Route path="database" element={<DatabaseManagement />} />
          <Route path="backup" element={<BackupRecovery />} />
          <Route path="logs" element={<LogsMonitoring />} />
          <Route path="reports" element={<ReportsAlerts />} />
          <Route path="features" element={<FeatureManagement />} />
          <Route path="configuration" element={<SystemConfiguration />} />
          <Route path="profile" element={<Profile />} />

        </Route>


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
        {/* <Route path="/camper-dashboard/reservations/confirm-booking/stripe" element={<StripePaymentGateway />} /> */}
        <Route path="/camper-dashboard/reservations/confirm-booking/chapa" element={<Chapa />} />

        {/* 6. Payments History */}
        <Route path="/camper-dashboard/payments" element={<Payments />} />
        <Route path="/camper-dashboard/profile" element={<MyProfile />} />
        <Route path="/camper-dashboard/notifications" element={<Notifications />} />
        <Route path="/camper-dashboard/settings" element={<SettingsPage />} />
        <Route path="/camper-dashboard/settings/security-password" element={<SecurityPassword />} />
        <Route path="/camper-dashboard/settings/notification" element={<NotificationPreferences />} />


        {/* 6. profile  */}
        <Route path="/camper-dashboard/profile" element={<MyProfile />} />
        <Route path="/camper-dashboard/tickets" element={<DayVisitTickets />} />
        <Route path="/camper-dashboard/support" element={<ContactSupport />} />

      </Routes>
      </LanguageProvider>
    </UserProvider>
  );
}

export default App;