import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "../../../context/UserContext";
import api from "../../../services/api";
import Sidebar from "../Sidebar/Sidebar";
import AccountSetting from "../Activity/AccountSetting";
import {
  CalendarIcon,
  CreditCardIcon,
  MegaphoneIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

export default function NotificationPreferences() {
  const { user, refreshUser } = useUser();
  const [preferences, setPreferences] = useState({
    booking: true,
    payment: true,
    promo: false,
    system: true,
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

<<<<<<< HEAD
  // Fetch preferences from user metadata
=======
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8
  useEffect(() => {
    if (user?.metadata?.notifications) {
      setPreferences(user.metadata.notifications);
    }
<<<<<<< HEAD
  }, [user]);

  const toggle = async (key) => {
    // Optimistic update
=======
    if (user) {
      setInitialLoading(false);
    }
  }, [user]);

  const toggle = async (key) => {
    if (loading) return;

    const previousPrefs = preferences;
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8
    const newPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPrefs);

    try {
      setLoading(true);
<<<<<<< HEAD
      const payload = {
        metadata: {
          notifications: newPrefs,
        },
      };
      const res = await api.patch("/auth/profile", payload);
      
      if (res.data.success || res.data.user) {
        await refreshUser(); // update context
        toast.success("Preferences updated! 🔔");
      }
    } catch (err) {
      console.error("Failed to save preference", err);
      // Revert on error
      setPreferences({ ...preferences, [key]: !preferences[key] });
      toast.error("Failed to update preference.");
=======

      // Use /users/me endpoint which is standard for current authenticated user
      const payload = {
        metadata: {
          ...user?.metadata,
          notifications: newPrefs,
        },
      };

      // Try the common /me endpoint first
      await api.patch("/users/me", payload);

      // If successful, refresh user context
      await refreshUser();
      toast.success("Preference updated", { duration: 2000 });
    } catch (err) {
      console.error("Failed to save preference", err);

      // If the error is 404, try fallback using ID (if available)
      if (err.response?.status === 404 && user?._id) {
        try {
          const fallbackPayload = {
            metadata: {
              ...user?.metadata,
              notifications: newPrefs,
            },
          };
          await api.patch(`/users/${user._id}`, fallbackPayload);
          await refreshUser();
          toast.success("Preference updated", { duration: 2000 });
        } catch (fallbackErr) {
          console.error("Fallback update failed", fallbackErr);
          setPreferences(previousPrefs);
          toast.error(
            fallbackErr.response?.data?.message ||
              "Failed to update preference. Please try again."
          );
        }
      } else {
        // Revert on other errors
        setPreferences(previousPrefs);
        toast.error(
          err.response?.data?.message || "Failed to update preference. Please try again."
        );
      }
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8
    } finally {
      setLoading(false);
    }
  };

  // Skeleton loader while user is loading
  if (initialLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <Toaster position="top-right" />
        <div className="flex-1 p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
            </div>
            <div className="lg:col-span-9">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100">
                  <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded w-64 mt-2 animate-pulse" />
                </div>
                <div className="divide-y divide-gray-50">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="px-8 py-6 flex justify-between">
                      <div>
                        <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
                        <div className="h-4 bg-gray-100 rounded w-56 mt-2 animate-pulse" />
                      </div>
                      <div className="w-12 h-7 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <div className="flex-1 p-4 sm:p-8 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <AccountSetting />
          </div>

          <div className="lg:col-span-9">
<<<<<<< HEAD
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Notification Preferences</h2>
                <p className="text-sm text-gray-500">Choose what we get in touch about.</p>
=======
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden transition-shadow hover:shadow-xl">
              <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">
                  Notification Preferences
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Choose what we get in touch about.
                </p>
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8
              </div>

              <div className="divide-y divide-gray-100">
                <PreferenceItem
                  icon={<CalendarIcon className="w-5 h-5 text-emerald-500" />}
                  title="Booking Notifications"
                  description="Receive updates about new bookings and schedule changes."
                  enabled={preferences.booking}
                  onToggle={() => toggle("booking")}
                  loading={loading}
                />
                <PreferenceItem
                  icon={<CreditCardIcon className="w-5 h-5 text-emerald-500" />}
                  title="Payment Updates"
                  description="Get notified when a payment is processed or failed."
                  enabled={preferences.payment}
                  onToggle={() => toggle("payment")}
                  loading={loading}
                />
                <PreferenceItem
                  icon={<MegaphoneIcon className="w-5 h-5 text-emerald-500" />}
                  title="Promotional Messages"
                  description="News about product updates and feature releases."
                  enabled={preferences.promo}
                  onToggle={() => toggle("promo")}
                  loading={loading}
                />
                <PreferenceItem
                  icon={<BellIcon className="w-5 h-5 text-emerald-500" />}
                  title="System Alerts"
                  description="Important notifications about your account status."
                  enabled={preferences.system}
                  onToggle={() => toggle("system")}
                  loading={loading}
                />
              </div>

<<<<<<< HEAD
              <div className="px-8 py-4 bg-gray-50 flex justify-end">
                <span className="text-xs text-gray-400 italic">
                  {loading ? "Saving changes..." : "Changes saved automatically"}
=======
              <div className="px-8 py-4 bg-gray-50 flex justify-end items-center gap-2">
                {loading && (
                  <div className="flex items-center gap-1 text-xs text-emerald-600">
                    <svg
                      className="animate-spin h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Saving...</span>
                  </div>
                )}
                <span className="text-xs text-gray-400 italic">
                  {loading ? "Please wait" : "Changes saved automatically"}
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
const PreferenceItem = ({ title, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between px-8 py-6 hover:bg-gray-50 transition">
    <div className="pr-8">
      <h4 className="text-sm font-bold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</p>
    </div>

    <button
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${
        enabled ? "bg-emerald-500" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);
=======
const PreferenceItem = React.memo(
  ({ icon, title, description, enabled, onToggle, loading }) => {
    return (
      <div className="flex items-center justify-between px-8 py-6 hover:bg-gray-50 transition-all duration-200 group">
        <div className="flex items-start gap-4 pr-8">
          <div className="flex-shrink-0 mt-0.5">{icon}</div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <button
          onClick={onToggle}
          disabled={loading}
          aria-label={`Toggle ${title} notification`}
          className={`
            relative inline-flex h-7 w-12 items-center rounded-full 
            transition-all duration-300 focus:outline-none focus:ring-2 
            focus:ring-emerald-500 focus:ring-offset-2
            ${enabled ? "bg-emerald-500" : "bg-gray-200"}
            ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <span
            className={`
              inline-flex items-center justify-center h-5 w-5 rounded-full 
              bg-white shadow-md transform transition-transform duration-300
              ${enabled ? "translate-x-6" : "translate-x-1"}
              ${loading ? "scale-90" : ""}
            `}
          >
            {loading && (
              <svg
                className="animate-spin h-3 w-3 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
          </span>
        </button>
      </div>
    );
  }
);
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8
