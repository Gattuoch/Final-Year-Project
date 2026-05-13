import React from "react";
import { HiSearch, HiCreditCard } from "react-icons/hi";
import { HiWallet, HiBell, HiClock, HiShieldCheck  } from "react-icons/hi2";
import { useLanguage } from "../../context/LanguageContext";

const features = [
  {
    id: 1,
    key: "advancedSearch",
    icon: (
      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
        <HiSearch className="text-3xl text-green-700" />
      </div>
    ),
  },
  {
    id: 2,
    key: "securePayments",
    icon: (
      <div className="w-14 h-14 rounded-full bg-green-200 flex items-center justify-center">
        <HiCreditCard className="text-3xl text-green-700" />
      </div>
    ),
  },
  {
    id: 3,
    key: "digitalWallet",
    icon: (
      <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center">
        <HiWallet className="text-3xl text-yellow-600" />
      </div>
    ),
  },
  {
    id: 4,
    key: "smartNotifications",
    icon: (
      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
        <HiBell className="text-3xl text-green-700" />
      </div>
    ),
  },
  {
    id: 5,
    key: "realtimeBooking",
    icon: (
      <div className="w-14 h-14 rounded-full bg-green-200 flex items-center justify-center">
        <HiClock className="text-3xl text-green-700" />
      </div>
    ),
  },
  {
    id: 6,
    key: "trustSafety",
    icon: (
      <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center">
        <HiShieldCheck className="text-3xl text-yellow-600" />
      </div>
    ),
  },
];


const WhyChoose = () => {
  const { t } = useLanguage();

  return (
    <section className="w-full py-20 bg-green-50">
      <div className="container mx-auto px-6 lg:px-16">

        {/* Title Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            {t("home.features.title") || "Why Choose EthioCampGround?"}
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            {t("home.features.subtitle") || "Experience seamless booking with advanced features"}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((item) => (
            <div
              key={item.id}
              className="bg-white p-8 rounded-3xl shadow-sm  hover:shadow-lg transition"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-6">
                {item.icon}
              </div>

              <h3 className="text-xl font-semibold text-center text-gray-900">
                {t(`home.features.${item.key}.title`)}
              </h3>

              <p className="text-gray-600 text-center mt-3">
                {t(`home.features.${item.key}.desc`)}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChoose;
