import React, { useState } from 'react';
import { 
  Search, Bell, Building2, CalendarDays, 
  Settings, Shield, CreditCard, Mail, Database, AlertCircle
} from 'lucide-react';

const SystemSettings = () => {
  const [autoApprove, setAutoApprove] = useState(true);
  const [sameDay, setSameDay] = useState(false);
  const [fullRefund, setFullRefund] = useState(true);
  const [partialRefund, setPartialRefund] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [ipRestrict, setIpRestrict] = useState(false);
  const [emailCustomize, setEmailCustomize] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [extStorage, setExtStorage] = useState(false);

  // Define section IDs for scrolling
  const tabs = [
    { name: 'General', id: 'general', icon: Settings },
    { name: 'Security', id: 'security', icon: Shield },
    { name: 'Payment', id: 'payment', icon: CreditCard },
    { name: 'Email & Notifications', id: 'email', icon: Mail },
    { name: 'Backup & Restore', id: 'backup', icon: Database }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 p-6 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your camp preferences, configurations, and administrative tools.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-auto flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search settings..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent w-full sm:w-64 bg-white transition-all shadow-sm"
            />
          </div>
          <div className="w-full sm:w-auto flex justify-end">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 shadow-sm">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Jump Links) */}
      <div className="flex space-x-2 overflow-x-auto pb-4 mb-8 border-b border-slate-200 hide-scrollbar sticky top-0 bg-slate-50 z-10 pt-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-800 shadow-sm"
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Main Content Areas - Single Scrollable Page */}
      <div className="flex flex-col gap-8 pb-12">
        
        {/* Section: General */}
        <div id="general" className="flex flex-col gap-8 scroll-mt-24">
          
          {/* Business Information Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Business Information</h2>
                <p className="text-sm text-slate-500 mt-0.5">Update your camp business details and branding</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Business Name</label>
                <input 
                  type="text" 
                  defaultValue="EthioCamp Ground" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Email</label>
                <input 
                  type="email" 
                  defaultValue="info@ethiocamp.et" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  defaultValue="+251 11 234 5678" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Time Zone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Time Zone</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all shadow-sm cursor-pointer appearance-none">
                  <option>East Africa Time (EAT) UTC+3</option>
                  <option>Central Africa Time (CAT) UTC+2</option>
                  <option>Greenwich Mean Time (GMT) UTC+0</option>
                </select>
              </div>

              {/* Business Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Business Address</label>
                <textarea 
                  rows={3}
                  defaultValue="Bole Road, Addis Ababa, Ethiopia"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all shadow-sm resize-none"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Save Changes
              </button>
            </div>
          </div>

          {/* Booking Configuration Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col mb-8">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Booking Configuration</h2>
                <p className="text-sm text-slate-500 mt-0.5">Configure reservation rules and policies</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Minimum Stay */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Minimum Stay (Days)</label>
                <input 
                  type="number" 
                  defaultValue={2}
                  min={1}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Maximum Stay */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Maximum Stay (Days)</label>
                <input 
                  type="number" 
                  defaultValue={30}
                  min={1}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Advance Booking */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Advance Booking (Days)</label>
                <input 
                  type="number" 
                  defaultValue={90}
                  min={0}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Toggle: Auto-Approve */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Auto-Approve Reservations</h4>
                  <p className="text-sm text-slate-500 mt-0.5">Automatically confirm bookings without manual review</p>
                </div>
                <button 
                  onClick={() => setAutoApprove(!autoApprove)}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 cursor-pointer focus:outline-none ${autoApprove ? 'bg-teal-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${autoApprove ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* Toggle: Same-Day Bookings */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Allow Same-Day Bookings</h4>
                  <p className="text-sm text-slate-500 mt-0.5">Enable guests to book for today</p>
                </div>
                <button 
                  onClick={() => setSameDay(!sameDay)}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 cursor-pointer focus:outline-none ${sameDay ? 'bg-teal-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${sameDay ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Save Configuration
              </button>
            </div>
          </div>
        </div>

        {/* Section: Security */}
        <div id="security" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col scroll-mt-24">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Security & Access</h2>
              <p className="text-sm text-slate-500 mt-0.5">Manage user permissions and security settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Admin Password Strength</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all shadow-sm cursor-pointer appearance-none">
                <option>Medium (Letters, Numbers, Min 8 chars)</option>
                <option>Strong (Letters, Numbers, Symbols, Min 12 chars)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Session Timeout (Minutes)</label>
              <input type="number" defaultValue={30} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all shadow-sm" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-lg">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Two-Factor Authentication</h4>
                <p className="text-sm text-slate-500 mt-0.5">Require 2FA for admin accounts</p>
              </div>
              <button onClick={() => setTwoFactor(!twoFactor)} className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 cursor-pointer focus:outline-none ${twoFactor ? 'bg-teal-600' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${twoFactor ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-lg">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">IP Address Restrictions</h4>
                <p className="text-sm text-slate-500 mt-0.5">Limit access to specific IP ranges</p>
              </div>
              <button onClick={() => setIpRestrict(!ipRestrict)} className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 cursor-pointer focus:outline-none ${ipRestrict ? 'bg-teal-600' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${ipRestrict ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors">Save Security Settings</button>
          </div>
        </div>

        {/* Section: Payment & Pricing */}
        <div id="payment" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col scroll-mt-24">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Payment & Pricing</h2>
                <p className="text-sm text-slate-500 mt-0.5">Configure payment methods and pricing rules</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Default Currency</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all shadow-sm cursor-pointer appearance-none">
                  <option>Ethiopian Birr (ETB)</option>
                  <option>US Dollar (USD)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Deposit Percentage (%)</label>
                <input type="number" defaultValue={30} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all shadow-sm" />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Accepted Payment Methods</label>
              <div className="flex flex-wrap gap-4">
                {['Credit Card', 'Bank Transfer', 'Mobile Money', 'Cash'].map(method => (
                  <label key={method} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="text-teal-600 focus:ring-teal-500 w-4 h-4 rounded border-slate-300" />
                    <span className="text-sm text-slate-700">{method}</span>
                  </label>
                ))}
              </div>
            </div>
          <div className="bg-slate-50 border-t border-slate-200 p-6 -mx-6 -mb-6 mt-8 rounded-b-xl">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-lg">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Cancellation Policy</h2>
                <p className="text-sm text-slate-500 mt-0.5">Define cancellation rules and refund policies</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Cancellation Window (Days)</label>
                <input type="number" defaultValue={7} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Refund Percentage (%)</label>
                <input type="number" defaultValue={80} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all shadow-sm" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Full Refund for Cancellations</h4>
                  <p className="text-sm text-slate-500 mt-0.5">Refund 100% of deposit if cancelled within 7 days</p>
                </div>
                <button onClick={() => setFullRefund(!fullRefund)} className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 cursor-pointer focus:outline-none ${fullRefund ? 'bg-teal-600' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${fullRefund ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Partial Refund for Late Cancellations</h4>
                  <p className="text-sm text-slate-500 mt-0.5">Refund 50% of deposit if cancelled after 7 days</p>
                </div>
                <button onClick={() => setPartialRefund(!partialRefund)} className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 cursor-pointer focus:outline-none ${partialRefund ? 'bg-teal-600' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${partialRefund ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors">Save Policies</button>
            </div>
          </div>
        </div>

        {/* Section: Email & Notifications */}
        <div id="email" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col scroll-mt-24">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Email & Notifications</h2>
              <p className="text-sm text-slate-500 mt-0.5">Configure email templates and notification preferences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Service Provider</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all shadow-sm cursor-pointer appearance-none">
                <option>SendGrid</option>
                <option>Mailchimp</option>
                <option>AWS SES</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">SMTP Server</label>
              <input type="text" defaultValue="smtp.ethiocamp.et" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">From Email Address</label>
              <input type="email" defaultValue="noreply@ethiocamp.et" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Port</label>
              <input type="number" defaultValue={587} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all shadow-sm" />
            </div>
          </div>

          <div className="p-4 border border-slate-100 bg-slate-50/50 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Email Templates</h4>
              <p className="text-sm text-slate-500 mt-0.5">Customize email content for different events</p>
            </div>
            <button onClick={() => setEmailCustomize(!emailCustomize)} className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 cursor-pointer focus:outline-none ${emailCustomize ? 'bg-teal-600' : 'bg-slate-300'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${emailCustomize ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
          
        </div>

        {/* Section: Backup & Restore */}
        <div id="backup" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col scroll-mt-24">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Backup & Restore</h2>
              <p className="text-sm text-slate-500 mt-0.5">Configure database backup and restore procedures</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Backup Frequency</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all shadow-sm cursor-pointer appearance-none">
                <option>Hourly</option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Retention Period (Days)</label>
              <input type="number" defaultValue={30} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all shadow-sm" />
            </div>
          </div>

          <div className="space-y-4 mb-6 border-b border-slate-100 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-lg">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Automated Backups</h4>
                <p className="text-sm text-slate-500 mt-0.5">Schedule automatic database backups</p>
              </div>
              <button onClick={() => setAutoBackup(!autoBackup)} className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 cursor-pointer focus:outline-none ${autoBackup ? 'bg-teal-600' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${autoBackup ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-lg">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Backup Location</h4>
                <p className="text-sm text-slate-500 mt-0.5">Use external storage or cloud service</p>
              </div>
              <button onClick={() => setExtStorage(!extStorage)} className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 cursor-pointer focus:outline-none ${extStorage ? 'bg-teal-600' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${extStorage ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>

          <div className="p-4 border border-slate-100 bg-slate-50/50 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Manual Operations</h4>
              <p className="text-sm text-slate-500 mt-0.5">Manually trigger a database backup or restore</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap w-full sm:w-auto text-center">
                Restore Database
              </button>
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap w-full sm:w-auto text-center">
                Run Backup Now
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SystemSettings;
