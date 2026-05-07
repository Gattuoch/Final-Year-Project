import React from 'react';
import { X, Check } from 'lucide-react';

const NewBookingForm = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">New Reservation</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form className="space-y-6">
            
            {/* Guest Info */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Guest Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" placeholder="e.g. Abebe Kebede" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input type="email" placeholder="e.g. abebe@example.com" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input type="tel" placeholder="e.g. +251 911 234 567" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors" />
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div>
               <h3 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Booking Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-slate-700 mb-1">Select Camp</label>
                   <select className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors appearance-none cursor-pointer">
                     <option>Bale Mountains - A1 (Mountain Tent)</option>
                     <option>Simien Lodge - S3 (Lodge Room)</option>
                     <option>Lake Tana Resort (Glamping)</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Check-in Date</label>
                   <input type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors text-slate-700" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Check-out Date</label>
                   <input type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors text-slate-700" />
                 </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Number of Guests</label>
                  <input type="number" min="1" placeholder="e.g. 2" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors" />
                 </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Payment Status</label>
                   <select className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors appearance-none cursor-pointer">
                     <option>Pending (Pay on Arrival)</option>
                     <option>Paid (Bank Transfer)</option>
                     <option>Paid (Cash)</option>
                   </select>
                 </div>
               </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Special Requests</label>
              <textarea rows="3" placeholder="Any dietary requirements, extra beds, or accessibility needs..." className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors resize-none"></textarea>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50 mt-auto rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Create Booking
          </button>
        </div>

      </div>
    </div>
  );
};

export default NewBookingForm;
