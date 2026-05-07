import React, { useState } from 'react';
import {
  Search, Bell, Download, ChevronDown,
  TrendingUp, TrendingDown, Eye, MoreHorizontal,
  DollarSign, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

const PaymentsManagement = () => {
  const [activeTab, setActiveTab] = useState('All Payments');
  const [selectedMethod, setSelectedMethod] = useState('All Methods');
  const [selectedDateRange, setSelectedDateRange] = useState('All Time');

  // Revenue Chart Data
  const revenueData = [
    { name: 'Jan', revenue: 120000, bookings: 45 },
    { name: 'Feb', revenue: 150000, bookings: 55 },
    { name: 'Mar', revenue: 180000, bookings: 80 },
    { name: 'Apr', revenue: 140000, bookings: 50 },
    { name: 'May', revenue: 210000, bookings: 90 },
    { name: 'Jun', revenue: 250000, bookings: 110 },
    { name: 'Jul', revenue: 280000, bookings: 125 },
  ];

  // Stats Data
  const stats = [
    {
      title: 'Total Revenue',
      amount: 'ETB 2.4M',
      subtext: '+12.5% from last month',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgClass: 'bg-emerald-50'
    },
    {
      title: 'Pending Payments',
      amount: 'ETB 180K',
      subtext: '23 transactions',
      trend: 'none',
      icon: Clock,
      color: 'text-amber-500',
      bgClass: 'bg-amber-50'
    },
    {
      title: 'Completed',
      amount: 'ETB 2.2M',
      subtext: '156 transactions',
      trend: 'none',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgClass: 'bg-blue-50'
    },
    {
      title: 'Failed/Refunded',
      amount: 'ETB 45K',
      subtext: '8 transactions',
      trend: 'down',
      icon: AlertCircle,
      color: 'text-red-500',
      bgClass: 'bg-red-50'
    }
  ];

  // Table Data
  const transactions = [
    {
      id: '#TXN-2401',
      guest: 'Abebe Kebede',
      campSite: 'Bale Mountains - A1',
      amount: 'ETB 36,000',
      method: 'Bank Transfer',
      date: 'Mar 15, 2026',
      status: 'Completed'
    },
    {
      id: '#TXN-2400',
      guest: 'Tigist Alemu',
      campSite: 'Simien Lodge - S3',
      amount: 'ETB 24,000',
      method: 'Mobile Money',
      date: 'Mar 14, 2026',
      status: 'Pending'
    },
    {
      id: '#TXN-2399',
      guest: 'Yohannes Haile',
      campSite: 'Danakil - D2',
      amount: 'ETB 48,000',
      method: 'Credit Card',
      date: 'Mar 13, 2026',
      status: 'Completed'
    },
    {
      id: '#TXN-2398',
      guest: 'Meron Tesfaye',
      campSite: 'Bale Mountains - A5',
      amount: 'ETB 12,000',
      method: 'Cash',
      date: 'Mar 12, 2026',
      status: 'Completed'
    },
    {
      id: '#TXN-2397',
      guest: 'Tsegaye Assefa',
      campSite: 'Simien Lodge - S1',
      amount: 'ETB 18,000',
      method: 'Mobile Money',
      date: 'Mar 11, 2026',
      status: 'Completed'
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">Completed</span>;
      case 'Pending':
        return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">Pending</span>;
      case 'Failed':
      case 'Refunded':
        return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200">{status}</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">{status}</span>;
    }
  };

  const tabs = ['All Payments', 'Completed', 'Pending', 'Failed'];
  const paymentMethods = ['All Methods', 'Bank Transfer', 'Mobile Money', 'Credit Card', 'Cash'];
  const dateRanges = ['All Time', 'Last 7 Days', 'Last 30 Days', 'This Month'];

  const filteredTransactions = transactions.filter(tx => {
    // 1. Tab Filter
    const matchesTab = activeTab === 'All Payments' || tx.status === activeTab || (activeTab === 'Failed' && tx.status === 'Refunded');
    
    // 2. Method Filter
    const matchesMethod = selectedMethod === 'All Methods' || tx.method === selectedMethod;
    
    // 3. Date Filter
    let matchesDate = true;
    if (selectedDateRange !== 'All Time') {
      const txDate = new Date(tx.date);
      const now = new Date('March 20, 2026'); // Standardizing to the mock environment date
      const diffTime = Math.abs(now - txDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (selectedDateRange === 'Last 7 Days') {
        matchesDate = diffDays <= 7;
      } else if (selectedDateRange === 'Last 30 Days') {
        matchesDate = diffDays <= 30;
      } else if (selectedDateRange === 'This Month') {
        matchesDate = txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      }
    }
    
    return matchesTab && matchesMethod && matchesDate;
  });

  return (
    <div className="flex flex-col min-h-full bg-slate-50 p-6 font-sans">

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payment Management</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor revenue, view transactions, and manage payments.</p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-auto flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search camps..."
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent w-full sm:w-64 bg-white transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 bg-white shadow-sm">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.amount}</h3>
              </div>
              <div className={`w-10 h-10 rounded-full ${stat.bgClass} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-center text-sm">
              {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500 mr-1" />}
              {stat.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500 mr-1" />}
              <span className={`${stat.trend === 'up' ? 'text-green-600 font-medium' : stat.trend === 'down' ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
                {stat.subtext}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Overview Chart Area */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-slate-800">Revenue Overview</h3>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <select 
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="appearance-none border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 pr-10 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent cursor-pointer w-full"
              >
                {dateRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                dx={-10} 
                tickFormatter={(value) => `ETB ${value / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`ETB ${value.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col mb-8 overflow-hidden">

        {/* Toolbar: Tabs & Filters */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-1 sm:flex-none text-center ${activeTab === tab
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
             <div className="relative w-full sm:w-auto">
               <select 
                 value={selectedMethod}
                 onChange={(e) => setSelectedMethod(e.target.value)}
                 className="appearance-none border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 pr-10 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent cursor-pointer w-full sm:min-w-[140px]"
               >
                 {paymentMethods.map(method => (
                   <option key={method} value={method}>{method}</option>
                 ))}
               </select>
               <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
             </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Guest Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Camp</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-900">{tx.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-slate-800">{tx.guest}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-600">{tx.campSite}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-slate-800">{tx.amount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-500">{tx.method}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-500">{tx.date}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors border border-transparent" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors border border-transparent" title="Download Receipt">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder (simple) */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <span className="text-sm text-slate-500">Showing <span className="font-medium text-slate-700">{filteredTransactions.length > 0 ? 1 : 0}</span> to <span className="font-medium text-slate-700">{filteredTransactions.length}</span> of <span className="font-medium text-slate-700">{filteredTransactions.length}</span> results</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm bg-teal-600 text-white font-medium">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 bg-white hover:bg-slate-50">2</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-600 bg-white hover:bg-slate-50">3</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm text-slate-500 bg-white hover:bg-slate-50">Next</button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default PaymentsManagement;
