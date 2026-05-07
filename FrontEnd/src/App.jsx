import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
<<<<<<< HEAD
import { UserProvider } from "./context/UserContext";
import { LanguageProvider } from "./context/LanguageContext";
import AICopilot from "./Component/CampAdmin/AICopilot";
import CamperAICopilot from "./Component/Camper/CamperAICopilot";

/* ================= HOME COMPONENTS ================= */

import Navbar from "./Component/Home/Navar";
=======
import { useState, useEffect } from "react";
import { UserProvider, useUser } from "./context/UserContext";

/* ================= HOME COMPONENTS ================= */
import Navbar from "./Component/Home/Navar.jsx"; // CORRECTED
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8
import Footer from "./Component/Home/Footer";
import Home from "./Component/Home/Home";
import Hero from "./Component/Home/Hero";
import FeaturedCamps from "./Component/Home/FeaturedCamps";
import WhyChoose from "./Component/Home/WhyChoose";
import HowItWorks from "./Component/Home/HowItWorks";
import Testimonials from "./Component/Home/Testimonials";
import CTASection from "./Component/Home/CTASection";

/* ================= FEATURE PAGE ================= */
<<<<<<< HEAD

=======
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8
import PlatformFeatures from "./Component/Home/PlatformFeatures";
import Experience from "./Component/Home/Experience";
import BrowseCamps from "./Component/Home/BrowseCamps";

/* ================= CAMPS PAGE ================= */
import BrowseALLCamps from "./Component/Home/BrowseCamps.jsx";

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

<<<<<<< HEAD
// Camp Admin Components
=======
/* ================= SUPER ADMIN ================= */
import Dashboard from "./Component/SuperAdmin/pages/Dashboard.jsx";
import CampManagement from "./Component/SuperAdmin/Camps/CampManagement.jsx";
import UserManagement from "./Component/SuperAdmin/Users/UserManagement.jsx";
import PlatformSettings from "./Component/SuperAdmin/Setting/PlatformSettings.jsx";
import PaymentSettings from "./Component/SuperAdmin/Setting/PaymentSettings.jsx";
import NotificationSettings from "./Component/SuperAdmin/Setting/NotificationSettings.jsx";
import GeneralSettings from "./Component/SuperAdmin/Setting/GeneralSettings.jsx";
import SecuritySettings from "./Component/SuperAdmin/Setting/SecuritySettings.jsx";
import EmailSettings from "./Component/SuperAdmin/Setting/EmailSettings.jsx";
import IntegrationSettings from "./Component/SuperAdmin/Setting/IntegrationSettings.jsx";
import BackupSettings from "./Component/SuperAdmin/Setting/BackupSettings.jsx";
import CreateSystemAdmin from "./Component/SuperAdmin/CreateSystemAdmin/CreateSystemAdmin.jsx";
import EventsManagement from "./Component/SuperAdmin/Events/EventsManagement.jsx";
import BookingsManagement from "./Component/SuperAdmin/Bookings/BookingsManagement.jsx";
import FinanceManagement from "./Component/SuperAdmin/Finance/FinanceManagement.jsx";
import AnalyticsDashboard from "./Component/SuperAdmin/Analytics/AnalyticsDashboard.jsx";

/* ================= CAMP ADMIN ================= */
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8
import CampAdminCampManagement from "./Component/CampAdmin/CampManagement/CampManagement.jsx";
import CampAdminLayout from "./Component/CampAdmin/CampAdminLayout.jsx";
import CampAdminDashboard from "./Component/CampAdmin/Dashboard/AdminDashboard.jsx";
import ReservationManagement from "./Component/CampAdmin/Reservations/ReservationManagement.jsx";
import PaymentsManagement from "./Component/CampAdmin/Payments/PaymentsManagement.jsx";
import SystemSettings from "./Component/CampAdmin/Settings/SystemSettings.jsx";
import NotificationManagement from "./Component/CampAdmin/Notifications/NotificationManagement.jsx";
import CampAdminUserManagement from "./Component/CampAdmin/Users/UserManagement.jsx";
import CampAdminAnalyticsDashboard from "./Component/CampAdmin/Analytics/AnalyticsDashboard.jsx";

/* ================= CAMPER DASHBOARD ================= */
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

<<<<<<< HEAD
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
=======
// Helper: role → dashboard path
const getDashboardPath = (role) => {
  switch (role) {
    case "camper":
      return "/camper-dashboard";
    case "manager":
    case "camp_manager":
      return "/manager-dashboard";
    case "ticket_officer":
      return "/ticket-dashboard";
    case "admin":
    case "system_admin":
    case "super_admin":
      return "/super-admin";
    case "security_officer":
      return "/security_officer";
    default:
      return "/";
  }
};

// Component that guards the home page
const HomeLayout = () => {
  const { user, loadingUser } = useUser();
  const [fetchTimeout, setFetchTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadingUser) {
        setFetchTimeout(true);
        console.warn("User fetch timed out – check your server or network.");
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [loadingUser]);

  if (loadingUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007ba7] mb-4" />
        <p className="text-gray-600">Loading your session...</p>
        {fetchTimeout && (
          <p className="text-red-500 text-sm mt-2">
            Taking too long. Check your internet or try refreshing.
          </p>
        )}
      </div>
    );
  }

  if (user) {
    const dashboardPath = getDashboardPath(user.role);
    return <Navigate to={dashboardPath} replace />;
  }

  return (
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
  );
};

function App() {
  return (
    <UserProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: { fontSize: "14px" },
        }}
      />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<HomeLayout />} />
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8

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

<<<<<<< HEAD
       
        {/* ======================================================== */}
        {/* CAMP ADMIN ROUTES                      */}
        {/* ======================================================== */}
=======
        {/* SUPER ADMIN */}
        <Route path="/super-admin" element={<Dashboard />} />
        <Route path="/super-admin/camps" element={<CampManagement />} />
        <Route path="/super-admin/events" element={<EventsManagement />} />
        <Route path="/super-admin/bookings" element={<BookingsManagement />} />
        <Route path="/super-admin/users" element={<UserManagement />} />
        <Route path="/super-admin/finance" element={<FinanceManagement />} />
        <Route path="/super-admin/analytics" element={<AnalyticsDashboard />} />

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
          path="/super-admin/settings/Integration"
          element={<IntegrationSettings />}
        />
        <Route
          path="/super-admin/settings/backup"
          element={<BackupSettings />}
        />
        <Route
          path="/super-admin/create-system-admin"
          element={<CreateSystemAdmin />}
        />

        {/* CAMP ADMIN */}
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8
        <Route path="/manager-dashboard" element={<CampAdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CampAdminDashboard />} />
          <Route path="camps" element={<CampAdminCampManagement />} />
          <Route path="reservations" element={<ReservationManagement />} />
          <Route path="payments" element={<PaymentsManagement />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="notifications" element={<NotificationManagement />} />
<<<<<<< HEAD
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
=======
        </Route>

        {/* CAMPER DASHBOARD */}
        <Route path="/camper-dashboard" element={<CamperDashboard />} />
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8
        <Route
          path="/camper-dashboard/reservations"
          element={<MyReservations />}
        />
        <Route
          path="/camper-dashboard/campsite-directory"
          element={<CampsiteDirectory />}
        />
<<<<<<< HEAD

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
=======
        <Route path="/camper-dashboard/book/:id" element={<Booking />} />
        <Route
          path="/camper-dashboard/reservations/confirm-booking"
          element={<Confirmation />}
        />
        <Route
          path="/camper-dashboard/reservations/confirm-booking/chapa"
          element={<Chapa />}
        />
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8
        <Route path="/camper-dashboard/payments" element={<Payments />} />
        <Route path="/camper-dashboard/profile" element={<MyProfile />} />
        <Route path="/camper-dashboard/notifications" element={<Notifications />} />
        <Route path="/camper-dashboard/settings" element={<SettingsPage />} />
<<<<<<< HEAD
        <Route path="/camper-dashboard/settings/security-password" element={<SecurityPassword />} />
        <Route path="/camper-dashboard/settings/notification" element={<NotificationPreferences />} />


        {/* 6. profile  */}
        <Route path="/camper-dashboard/profile" element={<MyProfile />} />
        <Route path="/camper-dashboard/tickets" element={<DayVisitTickets />} />
        <Route path="/camper-dashboard/support" element={<ContactSupport />} />

      </Routes>
      </LanguageProvider>
=======
        <Route
          path="/camper-dashboard/settings/security-password"
          element={<SecurityPassword />}
        />
        <Route
          path="/camper-dashboard/settings/notification"
          element={<NotificationPreferences />}
        />
        <Route path="/camper-dashboard/tickets" element={<DayVisitTickets />} />
        <Route path="/camper-dashboard/support" element={<ContactSupport />} />
      </Routes>
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8
    </UserProvider>
  );
}

export default App;