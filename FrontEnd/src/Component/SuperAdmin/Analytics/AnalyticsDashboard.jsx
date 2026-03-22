import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import { FiPieChart, FiBarChart2, FiActivity, FiMap } from "react-icons/fi";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, AreaChart, Area
} from 'recharts';

const COLORS = ['#10B981', '#8B5CF6', '#3B82F6', '#F97316', '#EC4899'];

const mockData = {
  "Last 30 Days": {
    acquisition: [
      { name: 'Week 1', active: 4000, new: 2400 },
      { name: 'Week 2', active: 3000, new: 1398 },
      { name: 'Week 3', active: 2000, new: 9800 },
      { name: 'Week 4', active: 2780, new: 3908 },
    ],
    demographics: [
      { name: '18-24', value: 400 },
      { name: '25-34', value: 300 },
      { name: '35-44', value: 300 },
      { name: '45+', value: 200 },
    ],
    funnel: [
      { name: 'Site Visit', count: 4000 },
      { name: 'Search', count: 3000 },
      { name: 'Checkout', count: 2000 },
      { name: 'Booking', count: 1500 },
    ],
    regions: [
      { name: 'Addis Ababa', value: 400 },
      { name: 'Amhara', value: 300 },
      { name: 'Oromiaia', value: 250 },
      { name: 'South of Nation', value: 100 },
      { name: 'Gambella', value: 100 },
      { name: 'Tigray', value: 100 },
      { name: 'Somali', value: 100 },
      { name: 'Tigray', value: 100 },
    ],
    metrics: [
      { label: "Bounce Rate", value: "32.4%", change: "-2.1%" },
      { label: "Avg Session Duration", value: "4m 12s", change: "+14s" },
      { label: "Pages per Session", value: "4.8", change: "+0.2" },
      { label: "Return Visitor %", value: "45.8%", change: "+5.1%" },
    ]
  },
  "Last 90 Days": {
    acquisition: [
      { name: 'Month 1', active: 12000, new: 7400 },
      { name: 'Month 2', active: 15000, new: 8398 },
      { name: 'Month 3', active: 18000, new: 9800 },
    ],
    demographics: [
      { name: '18-24', value: 1200 },
      { name: '25-34', value: 900 },
      { name: '35-44', value: 700 },
      { name: '45+', value: 500 },
    ],
    funnel: [
      { name: 'Site Visit', count: 12000 },
      { name: 'Search', count: 8000 },
      { name: 'Checkout', count: 6000 },
      { name: 'Booking', count: 4500 },
    ],
    regions: [
     { name: 'Addis Ababa', value: 400 },
      { name: 'Amhara', value: 300 },
      { name: 'Oromiaia', value: 250 },
      { name: 'South of Nation', value: 100 },
      { name: 'Gambella', value: 100 },
      { name: 'Tigray', value: 100 },
      { name: 'Somali', value: 100 },
      { name: 'Tigray', value: 100 },
    ],
    metrics: [
      { label: "Bounce Rate", value: "30.1%", change: "-4.4%" },
      { label: "Avg Session Duration", value: "5m 02s", change: "+1m 04s" },
      { label: "Pages per Session", value: "5.2", change: "+0.6" },
      { label: "Return Visitor %", value: "48.2%", change: "+7.5%" },
    ]
  },
  "This Year": {
    acquisition: [
      { name: 'Q1', active: 30000, new: 15000 },
      { name: 'Q2', active: 35000, new: 18000 },
      { name: 'Q3', active: 42000, new: 22000 },
      { name: 'Q4', active: 50000, new: 28000 },
    ],
    demographics: [
      { name: '18-24', value: 4000 },
      { name: '25-34', value: 3500 },
      { name: '35-44', value: 2500 },
      { name: '45+', value: 1500 },
    ],
    funnel: [
      { name: 'Site Visit', count: 50000 },
      { name: 'Search', count: 32000 },
      { name: 'Checkout', count: 24000 },
      { name: 'Booking', count: 18000 },
    ],
    regions: [
      { name: 'Addis Ababa', value: 400 },
      { name: 'Amhara', value: 300 },
      { name: 'Oromiaia', value: 250 },
      { name: 'South of Nation', value: 100 },
      { name: 'Gambella', value: 100 },
      { name: 'Tigray', value: 100 },
      { name: 'Somali', value: 100 },
      { name: 'Tigray', value: 100 },
      
    ],
    metrics: [
      { label: "Bounce Rate", value: "28.5%", change: "-6.0%" },
      { label: "Avg Session Duration", value: "5m 45s", change: "+1m 47s" },
      { label: "Pages per Session", value: "6.1", change: "+1.5" },
      { label: "Return Visitor %", value: "55.0%", change: "+14.3%" },
    ]
  },
  "All Time": {
    acquisition: [
      { name: '2022', active: 100000, new: 80000 },
      { name: '2023', active: 150000, new: 90000 },
      { name: '2024', active: 250000, new: 120000 },
      { name: '2025', active: 350000, new: 150000 },
    ],
    demographics: [
      { name: '18-24', value: 12000 },
      { name: '25-34', value: 10000 },
      { name: '35-44', value: 8000 },
      { name: '45+', value: 5000 },
    ],
    funnel: [
      { name: 'Site Visit', count: 150000 },
      { name: 'Search', count: 90000 },
      { name: 'Checkout', count: 60000 },
      { name: 'Booking', count: 45000 },
    ],
    regions: [
      { name: 'North America', value: 1200 },
      { name: 'Europe', value: 900 },
      { name: 'Asia', value: 600 },
      { name: 'South America', value: 300 },
    ],
    metrics: [
      { label: "Bounce Rate", value: "29.2%", change: "--" },
      { label: "Avg Session Duration", value: "5m 10s", change: "--" },
      { label: "Pages per Session", value: "5.5", change: "--" },
      { label: "Return Visitor %", value: "50.5%", change: "--" },
    ]
  }
};

const AnalyticsCard = ({ title, children, className = "" }) => (
  <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col ${className}`}>
    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
      {title}
    </h3>
    <div className="flex-1 w-full min-h-[300px]">
      {children || "Chart Placeholder"}
    </div>
  </div>
);

const AnalyticsDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeframe, setTimeframe] = useState("Last 30 Days");

  const currentData = mockData[timeframe];

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden font-sans">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 w-full relative">
        <Header setSidebarOpen={setSidebarOpen} />

        <div className="p-4 md:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
              <p className="text-gray-500 text-sm mt-1">Deep insights into user behavior and platform growth.</p>
            </div>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer transition-all"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
              <option value="This Year">This Year</option>
              <option value="All Time">All Time</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Main Growth Chart */}
            <AnalyticsCard title={<><FiActivity className="text-green-600" /> User Acquisition Trends</>} className="lg:col-span-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData.acquisition} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" dataKey="active" name="Active Users" stroke="#10B981" fillOpacity={1} fill="url(#colorActive)" />
                  <Area type="monotone" dataKey="new" name="New Signups" stroke="#3B82F6" fillOpacity={1} fill="url(#colorNew)" />
                </AreaChart>
              </ResponsiveContainer>
            </AnalyticsCard>

            {/* Demographics */}
            <AnalyticsCard title={<><FiPieChart className="text-purple-600" /> User Demographics</>}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentData.demographics}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {currentData.demographics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </AnalyticsCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Conversion Funnel */}
            <AnalyticsCard title={<><FiBarChart2 className="text-blue-600" /> Booking Conversion Funnel</>}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={currentData.funnel}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }} />
                  <RechartsTooltip
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" name="Users" fill="#3B82F6" radius={[0, 4, 4, 0]}>
                    {currentData.funnel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </AnalyticsCard>

            {/* Geographic Performance */}
            <AnalyticsCard title={<><FiMap className="text-orange-600" /> Top Performing Regions</>}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={currentData.regions}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
                  <RechartsTooltip
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" name="Activity Score" fill="#F97316" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </AnalyticsCard>
          </div>

          {/* Key Metrics Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {currentData.metrics.map((metric, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 text-center shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-500 text-sm mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className={`text-xs font-medium mt-1 ${metric.change.startsWith('-') ? 'text-red-500' : metric.change === '--' ? 'text-gray-400' : 'text-green-600'}`}>
                  {metric.change} vs last period
                </p>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
