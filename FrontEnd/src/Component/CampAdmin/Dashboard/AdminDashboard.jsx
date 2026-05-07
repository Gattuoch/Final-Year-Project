import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Bell, Plus, Download, ChevronDown,
  Banknote, CalendarCheck, Tent, Users,
  TrendingUp, TrendingDown, MoreHorizontal, Eye
} from 'lucide-react';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const AdminDashboard = () => {
  const [dateFilter, setDateFilter] = useState('Today');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showNewBookingDropdown, setShowNewBookingDropdown] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  // Close dropdowns when clicking outside
  const dashboardRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dashboardRef.current && !dashboardRef.current.contains(event.target)) {
        setShowDateDropdown(false);
        setShowNewBookingDropdown(false);
        setOpenActionMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Chart Data
  const revenueData = [
    { name: 'Jan', bookings: 45, revenue: 120 },
    { name: 'Feb', bookings: 55, revenue: 150 },
    { name: 'Mar', bookings: 80, revenue: 180 },
    { name: 'Apr', bookings: 50, revenue: 140 },
    { name: 'May', bookings: 90, revenue: 210 },
    { name: 'Jun', bookings: 110, revenue: 250 },
    { name: 'Jul', bookings: 125, revenue: 280 },
  ];

  const distributionData = [
    { name: 'Mountain Tents', value: 45, color: '#0f766e' }, // dark teal
    { name: 'Lodge Rooms', value: 25, color: '#14b8a6' },    // teal
    { name: 'Glamping', value: 20, color: '#5eead4' },       // light teal
    { name: 'RV Sites', value: 10, color: '#99f6e4' },       // lightest teal
  ];

  // Table Data State
  const [reservations, setReservations] = useState([
    {
      id: '#TXN-2401',
      guest: 'Abebe Kebede',
      image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
      campSite: 'Bale Mountains - A1',
      dates: 'Mar 15 - Mar 17, 2026',
      amount: 'ETB 24,000',
      status: 'Confirmed'
    },
    {
      id: '#TXN-2402',
      guest: 'Tigist Alemu',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      campSite: 'Simien Lodge - S3',
      dates: 'Mar 14 - Mar 16, 2026',
      amount: 'ETB 36,000',
      status: 'Pending'
    },
    {
      id: '#TXN-2403',
      guest: 'Dawit Tadesse',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      campSite: 'Awash Riverside - R1',
      dates: 'Mar 12 - Mar 15, 2026',
      amount: 'ETB 15,000',
      status: 'Completed'
    },
    {
      id: '#TXN-2404',
      guest: 'Sara Hailu',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      campSite: 'Bale Mountains - A2',
      dates: 'Mar 18 - Mar 20, 2026',
      amount: 'ETB 24,000',
      status: 'Confirmed'
    },
  ]);

  const [filteredReservations, setFilteredReservations] = useState(reservations);

  // Filter effect mock
  useEffect(() => {
    if (dateFilter === 'Today') {
      setFilteredReservations(reservations.slice(0, 2));
    } else if (dateFilter === 'Yesterday') {
      setFilteredReservations(reservations.slice(2, 3));
    } else if (dateFilter === 'Last 7 Days') {
      setFilteredReservations(reservations.slice(0, 3));
    } else {
      setFilteredReservations(reservations);
    }
  }, [dateFilter, reservations]);

  // Action Functions
  const handleUpdateStatus = (id, newStatus) => {
    setReservations(prev => prev.map(res =>
      res.id === id ? { ...res, status: newStatus } : res
    ));
    setOpenActionMenuId(null);
  };

  const handleNewBooking = (type) => {
    const newId = `#TXN-240${Math.floor(Math.random() * 90) + 10}`;
    const newRes = {
      id: newId,
      guest: `${type} Guest`,
      image: `https://ui-avatars.com/api/?name=${type}+Guest&background=random`,
      campSite: 'Unassigned',
      dates: 'Pending Dates',
      amount: 'ETB 0',
      status: 'Pending'
    };
    setReservations([newRes, ...reservations]);
    setDateFilter('This Month'); // clear strict filter to see it
    setShowNewBookingDropdown(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-100 text-emerald-700';
      case 'Completed': return 'bg-blue-100 text-blue-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div ref={dashboardRef} className="flex flex-col min-h-full bg-slate-50 p-6 font-sans">

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-auto flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reservations, camps..."
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-72 bg-white"
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors shadow-sm bg-white border border-transparent hover:border-slate-200">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* New Booking Dropdown */}
            <div className="relative w-full sm:w-auto">
              {/* <button 
                onClick={() => setShowNewBookingDropdown(!showNewBookingDropdown)}
                className="flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Booking</span>
              </button> */}

              {showNewBookingDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 origin-top-right">
                  <button
                    onClick={() => handleNewBooking('Walk-in')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition-colors"
                  >
                    Walk-in Guest
                  </button>
                  <button
                    onClick={() => handleNewBooking('Phone')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition-colors"
                  >
                    Phone Reservation
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => handleNewBooking('Group')}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Group Booking
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Welcome back, Dawit! <span className="text-2xl">👋</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening at EthioCamp Ground today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button className="flex flex-1 md:flex-none justify-center items-center space-x-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

          {/* Today Filter Dropdown */}
          <div className="relative flex-1 md:flex-none">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex w-full justify-center items-center space-x-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <span>{dateFilter}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showDateDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 origin-top-right">
                {['Today', 'Yesterday', 'Last 7 Days', 'This Month'].map(option => (
                  <button
                    key={option}
                    onClick={() => { setDateFilter(option); setShowDateDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${dateFilter === option ? 'bg-teal-50 text-teal-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">ETB 450K</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
            <span className="text-emerald-500 font-medium mr-2">12.5%</span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        {/* Active Reservations */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Reservations</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">124</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
            <span className="text-emerald-500 font-medium mr-2">8.2%</span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        {/* Available Camps */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Available Camps</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">32<span className="text-lg text-slate-400 font-normal">/50</span></h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <Tent className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-auto">
            <div className="bg-amber-500 h-2 rounded-full" style={{ width: '64%' }}></div>
          </div>
        </div>

        {/* New Users */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">New Users</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">89</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-500 font-medium mr-2">2.1%</span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Revenue & Bookings Line/Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Revenue & Bookings Overview</h3>
            <button className="text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg p-1.5">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar yAxisId="right" dataKey="bookings" name="Bookings" fill="#99f6e4" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue (k)" stroke="#0f766e" strokeWidth={3} dot={{ r: 4, fill: '#0f766e', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Camp Distribution Donut Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-slate-800">Camp Distribution</h3>
            <button className="text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg p-1.5">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend for Pie Chart */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-6 mt-4 w-full">
              {distributionData.map((item, idx) => (
                <div key={idx} className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Recent Reservations Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col mb-8 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Recent Reservations</h3>
          <button className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Camp Site</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Check In/Out</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReservations.map((res, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full object-cover mr-3 border border-slate-200" src={res.image} alt="" />
                      <div>
                        <div className="text-sm font-bold text-slate-800">{res.guest}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{res.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-700">{res.campSite}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">{res.dates}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-slate-800">{res.amount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(res.status)}`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionMenuId(openActionMenuId === res.id ? null : res.id);
                      }}
                      className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors hover:bg-slate-100"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {openActionMenuId === res.id && (
                      <div className="absolute right-10 top-10 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 origin-top-right">
                        <button
                          onClick={() => setOpenActionMenuId(null)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" /> View Details
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(res.id, 'Confirmed')}
                          className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-slate-50 transition-colors"
                        >
                          Confirm Booking
                        </button>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button
                          onClick={() => handleUpdateStatus(res.id, 'Cancelled')}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 transition-colors"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
