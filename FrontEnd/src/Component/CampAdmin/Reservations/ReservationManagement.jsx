import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  Calendar,
  CheckCircle2,
  Clock,
  LogOut,
  MoreVertical,
  Eye,
  Download
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Bar, ComposedChart,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function ReservationManagement() {
  const [activeTab, setActiveTab] = useState('All Reservations');

  const stats = [
    { label: 'Total Reservations', value: '342', subtext: '+8.2% from last month', icon: Calendar, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { label: 'Active Bookings', value: '127', subtext: 'Currently occupied', icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-50' },
    { label: 'Pending Approval', value: '18', subtext: 'Awaiting confirmation', icon: Clock, color: 'text-orange-500', bgColor: 'bg-orange-50' },
    { label: 'Check-ins Today', value: '12', subtext: '5 check-outs scheduled', icon: LogOut, color: 'text-teal-600', bgColor: 'bg-teal-50' },
  ];

  const tabs = ['All Reservations', 'Confirmed', 'Pending', 'Cancelled'];

  const reservations = [
    {
      id: '#RES-2401',
      guestName: 'Abebe Kebede',
      avatar: 'https://ui-avatars.com/api/?name=Abebe+Kebede&background=random',
      camp: 'Bale Mountains - A1',
      checkIn: 'Mar 15, 2026',
      checkOut: 'Mar 18, 2026',
      status: 'Confirmed',
    },
    {
      id: '#RES-2400',
      guestName: 'Tigist Alemu',
      avatar: 'https://ui-avatars.com/api/?name=Tigist+Alemu&background=random',
      camp: 'Simien Lodge - S3',
      checkIn: 'Mar 14, 2026',
      checkOut: 'Mar 17, 2026',
      status: 'Pending',
    },
    {
      id: '#RES-2399',
      guestName: 'Selamawit Bekele',
      avatar: 'https://ui-avatars.com/api/?name=Selamawit+Bekele&background=random',
      camp: 'Lake Tana Resort',
      checkIn: 'Mar 13, 2026',
      checkOut: 'Mar 15, 2026',
      status: 'Confirmed',
    },
    {
      id: '#RES-2398',
      guestName: 'Dawit Tadesse',
      avatar: 'https://ui-avatars.com/api/?name=Dawit+Tadesse&background=random',
      camp: 'Omo Valley Camp',
      checkIn: 'Mar 10, 2026',
      checkOut: 'Mar 14, 2026',
      status: 'Cancelled',
    },
     {
      id: '#RES-2397',
      guestName: 'Meron Getachew',
      avatar: 'https://ui-avatars.com/api/?name=Meron+Getachew&background=random',
      camp: 'Bale Mountains - A2',
      checkIn: 'Mar 12, 2026',
      checkOut: 'Mar 16, 2026',
      status: 'Confirmed',
    }
  ];

  const chartData = [
    { name: 'Mon', checkouts: 5, bookings: 12 },
    { name: 'Tue', checkouts: 6, bookings: 15 },
    { name: 'Wed', checkouts: 8, bookings: 18 },
    { name: 'Thu', checkouts: 6, bookings: 14 },
    { name: 'Fri', checkouts: 9, bookings: 21 },
    { name: 'Sat', checkouts: 11, bookings: 25 },
    { name: 'Sun', checkouts: 13, bookings: 28 },
  ];

  const pieData = [
    { name: 'Mountain Tents', value: 45, color: '#0d9488' }, // teal-600
    { name: 'Lodge Rooms', value: 30, color: '#14b8a6' }, // teal-500
    { name: 'Glamping', value: 15, color: '#5eead4' }, // teal-300
    { name: 'RV Sites', value: 10, color: '#ccfbf1' }, // teal-100
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 font-sans overflow-x-hidden">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Reservation Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search reservations..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-64 bg-white shadow-sm"
            />
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition-colors bg-white shadow-sm">
            <Bell className="w-5 h-5" />
          </button>
          <button className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
              <p className="text-xs text-slate-400 font-medium">{stat.subtext}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly Bookings Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-2">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-slate-800">Monthly Bookings</h3>
             <select className="border border-slate-200 bg-white text-slate-600 text-xs rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer font-medium">
               <option>March 2026</option>
               <option>February 2026</option>
               <option>January 2026</option>
             </select>
           </div>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <RechartsTooltip 
                       contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                       cursor={{ fill: '#f8fafc' }}
                    />
                    <Legend iconType="square" wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                    <Bar dataKey="checkouts" name="Check-outs" fill="#a7f3d0" radius={[4, 4, 0, 0]} barSize={30} />
                    <Area type="monotone" dataKey="bookings" name="Bookings" fill="transparent" stroke="#0d9488" strokeWidth={3} dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                 </ComposedChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Camp Occupancy Rate */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-2">
             <h3 className="text-lg font-bold text-slate-800">Camp Occupancy Rate</h3>
             <span className="text-xs font-medium text-slate-400">This Month</span>
           </div>
           <div className="h-56 w-full flex items-center justify-center relative mt-4">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={pieData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={90}
                     paddingAngle={2}
                     dataKey="value"
                     stroke="none"
                   >
                     {pieData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
               {/* Custom Legend to the right or below */}
           </div>
           <div className="grid grid-cols-2 gap-y-2 gap-x-1 mt-2">
               {pieData.map((entry, index) => (
                 <div key={index} className="flex items-center text-xs text-slate-600 font-medium">
                   <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: entry.color }}></div>
                   <span className="truncate">{entry.name}</span>
                 </div>
               ))}
           </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col flex-1">
         {/* Table Header & Filters */}
         <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2 bg-slate-100/50 p-1 rounded-lg">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? 'bg-teal-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div>
              <select className="border border-slate-200 bg-white text-slate-700 text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-sm">
                <option>All Camps</option>
                <option>Bale Mountains</option>
                <option>Simien Lodge</option>
                <option>Lake Tana Resort</option>
              </select>
            </div>
         </div>

         {/* Table Content */}
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4">Reservation ID</th>
                  <th className="px-6 py-4">Guest Name</th>
                  <th className="px-6 py-4">Camp</th>
                  <th className="px-6 py-4">Check-In</th>
                  <th className="px-6 py-4">Check-Out</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                 {reservations.map((res, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4 font-bold text-teal-600">{res.id}</td>
                       <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                             <img src={res.avatar} alt={res.guestName} className="w-8 h-8 rounded-full shadow-sm" />
                             <span className="font-bold text-slate-800">{res.guestName}</span>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-slate-600 font-medium">{res.camp}</td>
                       <td className="px-6 py-4 text-slate-600">{res.checkIn}</td>
                       <td className="px-6 py-4 text-slate-600">{res.checkOut}</td>
                       <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                             res.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                             res.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                             'bg-red-100 text-red-700'
                          }`}>
                            {res.status}
                          </span>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center justify-center space-x-3 text-slate-400">
                             <button className="hover:text-teal-600 transition-colors"><Eye className="w-4 h-4" /></button>
                             <button className="hover:text-teal-600 transition-colors"><Download className="w-4 h-4" /></button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}
