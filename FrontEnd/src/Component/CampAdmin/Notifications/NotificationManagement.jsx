import React, { useState } from 'react';
import { 
  Search, Bell, Plus, Mail, CheckCircle2, Clock, XCircle, Calendar,
  LayoutTemplate, Settings
} from 'lucide-react';
import CreateNotificationForm from './CreateNotificationForm';

const mockTemplates = [
  { id: 1, label: 'Booking Confirmation', code_name: 'booking_confirmed', status: 'Active' },
  { id: 2, label: 'Payment Receipt', code_name: 'payment_receipt', status: 'Active' },
  { id: 3, label: 'Upcoming Reminder', code_name: 'upcoming_reminder', status: 'Active' }
];

const mockNotifications = [
  {
    id: 1,
    title: 'New booking confirmed for 2025-04-15',
    detail1: 'Guest: John Doe, Campsite: Mountain Tents',
    detail2: 'Status: Confirmed, Payment: Paid',
    timestamp: 'Sent: 2 hours ago',
    statusText: 'Delivered',
    statusColor: 'text-emerald-500',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    icon: Calendar,
    category: 'Booking'
  },
  {
    id: 2,
    title: 'Payment received for booking #12345',
    detail1: 'Amount: 1,200 ETB, Method: Bank Transfer',
    detail2: 'Status: Confirmed, Deposit: 30%',
    timestamp: 'Sent: 1 day ago',
    statusText: 'Delivered',
    statusColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    icon: CheckCircle2,
    category: 'Payment'
  },
  {
    id: 3,
    title: 'System maintenance scheduled',
    detail1: 'Server update: 2025-04-16 02:00 AM',
    detail2: 'Status: Pending, Duration: 30 minutes',
    timestamp: 'Sent: 1 day ago',
    statusText: 'Pending',
    statusColor: 'text-slate-500',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    icon: Clock,
    category: 'System'
  },
  {
    id: 4,
    title: 'Payment failed for booking #12346',
    detail1: 'Amount: 1,200 ETB, Method: Credit Card',
    detail2: 'Status: Failed, Error: Insufficient funds',
    timestamp: 'Sent: 1 day ago',
    statusText: 'Failed',
    statusColor: 'text-rose-500',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
    icon: XCircle,
    category: 'Payment'
  }
];

const NotificationManagement = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const tabs = ['All', 'Booking', 'Payment', 'System'];

  const filteredNotifications = mockNotifications.filter(notif => {
    const matchesTab = activeTab === 'All' || notif.category === activeTab;
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notif.detail1.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-full bg-slate-50 p-6 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notification & Analytics</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search notifications..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 bg-slate-50 transition-all w-full md:w-64"
            />
          </div>
          <button className="relative p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full">
        
        {/* Title and Stats Container */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-teal-600" />
              <div>
                <h2 className="text-xl font-bold text-slate-800">Notification Management</h2>
                <p className="text-sm text-slate-500">Manage system notifications and alerts</p>
              </div>
            </div>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors mt-4 sm:mt-0 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create Notification
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Sent */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Mail className="w-5 h-5 text-indigo-500" />
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full">+12%</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">1,247</h3>
                <p className="text-sm text-slate-500">Total Sent</p>
              </div>
            </div>

            {/* Delivered */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full">+8%</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">1,089</h3>
                <p className="text-sm text-slate-500">Delivered</p>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-xs font-medium rounded-full">--</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">45</h3>
                <p className="text-sm text-slate-500">Pending</p>
              </div>
            </div>

            {/* Failed */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-rose-50 rounded-lg">
                  <XCircle className="w-5 h-5 text-rose-500" />
                </div>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-xs font-medium rounded-full">+3</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">113</h3>
                <p className="text-sm text-slate-500">Failed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notifications List Area */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Recent Notifications</h2>
              <p className="text-sm text-slate-500 mt-0.5">Latest system notifications and alerts</p>
            </div>
            
            <div className="flex items-center space-x-2 bg-slate-50 p-1 border border-slate-200 rounded-lg overflow-x-auto hide-scrollbar w-full md:w-auto mt-4 md:mt-0">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? 'bg-teal-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif, index) => {
                const Icon = notif.icon;
                return (
                  <div 
                    key={notif.id} 
                    className={`p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors ${
                      index !== filteredNotifications.length - 1 ? 'border-b border-slate-100' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`p-2 rounded-full flex-shrink-0 ${notif.iconBg}`}>
                        <Icon className={`w-5 h-5 ${notif.iconColor}`} />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{notif.title}</h4>
                        <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                          <p className="truncate">{notif.detail1}</p>
                          <p className="truncate">{notif.detail2}</p>
                          <p className="truncate text-slate-400">{notif.timestamp}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex md:flex-col md:items-end justify-start pt-2 md:pt-0">
                      <span className={`text-xs font-semibold ${notif.statusColor}`}>
                        {notif.statusText}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-10 text-center text-slate-500 text-sm">
                No notifications found in this category.
              </div>
            )}
          </div>
        </div>

        {/* Notification Templates Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden mt-6">
          <div className="p-6 border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-800">Booking Confirmation</h3>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">Active</span>
            </div>
            <p className="text-sm text-slate-500 mb-3">Send to guests after booking is confirmed</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-slate-400">Template:</span>
              <code className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded font-mono border border-slate-200">booking_confirmed</code>
            </div>
            <div className="flex items-center justify-between mt-2">
              <button className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">Edit Template</button>
              <button className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">Preview</button>
            </div>
          </div>
          <div className="p-6 border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-800">Payment Receipt</h3>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">Active</span>
            </div>
            <p className="text-sm text-slate-500 mb-3">Send to guests after payment is received</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-slate-400">Template:</span>
              <code className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded font-mono border border-slate-200">payment_receipt</code>
            </div>
            <div className="flex items-center justify-between mt-2">
              <button className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">Edit Template</button>
              <button className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">Preview</button>
            </div>
          </div>
          <div className="p-6 bg-white">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-800">System Maintenance</h3>
              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-500 rounded-full">Inactive</span>
            </div>
            <p className="text-sm text-slate-500 mb-3">Send to all users about scheduled maintenance</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-slate-400">Template:</span>
              <code className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded font-mono border border-slate-200">maintenance_alert</code>
            </div>
            <div className="flex items-center justify-between mt-2">
              <button className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">Edit Template</button>
              <button className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">Preview</button>
            </div>
          </div>
        </div>

        {/* Notification Settings Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col mt-6 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-5 h-5 text-teal-700" />
              <h2 className="text-lg font-bold text-slate-800">Notification Settings</h2>
            </div>
            <p className="text-sm text-slate-500 ml-7">Configure notification preferences and delivery options</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-800">Email Service Provider</label>
              <select className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600 appearance-none">
                <option>SendGrid</option>
                <option>Mailgun</option>
                <option>Amazon SES</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-800">SMTP Server</label>
              <input type="text" defaultValue="smtp.ethiocamp.et" className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-800">From Email Address</label>
              <input type="email" defaultValue="noreply@ethiocamp.et" className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-800">Port</label>
              <input type="number" defaultValue="587" className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600" />
            </div>
          </div>
        </div>

      </div>
      <CreateNotificationForm isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};

export default NotificationManagement;
