import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiCreditCard, FiDownload, FiCalendar, FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

const StatCard = ({ title, amount, trend, trendValue, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm float-left w-full h-full flex flex-col justify-between group hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="text-xl" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
        {trend === 'up' ? <FiArrowUpRight /> : <FiArrowDownRight />}
        {trendValue}
      </div>
    </div>
    <div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold text-gray-900">{amount}</div>
    </div>
  </div>
);

const FinanceManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const transactions = [
    { id: "TXN-001", date: "Oct 24, 2026", type: "Booking Payment", amount: "+$350.00", status: "Completed", user: "Eleanor Pena", method: "Credit Card ending in **92" },
    { id: "TXN-002", date: "Oct 23, 2026", type: "Camp Payout", amount: "-$1,200.00", status: "Processed", user: "Lakeside Valley Campground", method: "Bank Transfer" },
    { id: "TXN-003", date: "Oct 22, 2026", type: "Subscription Fee", amount: "+$49.99", status: "Completed", user: "Jacob Jones", method: "PayPal" },
    { id: "TXN-004", date: "Oct 21, 2026", type: "Refund", amount: "-$150.00", status: "Refunded", user: "Cody Fisher", method: "Original Payment Method" },
    { id: "TXN-005", date: "Oct 20, 2026", type: "Booking Payment", amount: "+$890.00", status: "Completed", user: "Esther Howard", method: "Credit Card ending in **44" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="flex-1 w-full relative">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <div className="p-4 md:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Overview</h1>
              <p className="text-gray-500 text-sm mt-1">Monitor revenue, payouts, and transaction history.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
                <FiCalendar /> This Month
              </button>
              <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
                <FiDownload /> Report
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard title="Total Revenue" amount="$124,563.00" trend="up" trendValue="+14.5%" icon={FiDollarSign} colorClass="bg-green-100 text-green-700" />
            <StatCard title="Platform Fees" amount="$12,456.30" trend="up" trendValue="+14.5%" icon={FiTrendingUp} colorClass="bg-blue-100 text-blue-700" />
            <StatCard title="Pending Payouts" amount="$45,230.00" trend="down" trendValue="-2.4%" icon={FiCreditCard} colorClass="bg-orange-100 text-orange-700" />
            <StatCard title="Total Refunds" amount="$2,140.00" trend="down" trendValue="-0.5%" icon={FiTrendingDown} colorClass="bg-red-100 text-red-700" />
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                 <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
                 <button className="text-sm font-medium text-green-600 hover:text-green-700">View All</button>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50/50 text-gray-500">
                        <tr>
                            <th className="px-6 py-4 font-medium">Transaction ID & Date</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium">User / Entity</th>
                            <th className="px-6 py-4 font-medium">Method</th>
                            <th className="px-6 py-4 font-medium">Amount</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{tx.id}</div>
                                    <div className="text-gray-500 text-xs mt-0.5">{tx.date}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-700">{tx.type}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{tx.user}</td>
                                <td className="px-6 py-4 text-gray-500">{tx.method}</td>
                                <td className={`px-6 py-4 font-semibold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'}`}>
                                    {tx.amount}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                        tx.status === 'Completed' || tx.status === 'Processed' ? 'bg-green-50 text-green-700 border border-green-200' :
                                        tx.status === 'Refunded' ? 'bg-red-50 text-red-700 border border-red-200' :
                                        'bg-gray-100 text-gray-700 border border-gray-200'
                                    }`}>
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinanceManagement;
