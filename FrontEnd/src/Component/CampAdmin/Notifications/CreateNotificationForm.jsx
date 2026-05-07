import React from 'react';
import { X, Send } from 'lucide-react';

const CreateNotificationForm = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Create Notification</h2>
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
            
            {/* Notification Info */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Notification Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notification Title</label>
                  <input type="text" placeholder="e.g. Scheduled System Maintenance" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors" />
                </div>
              </div>
            </div>

            {/* Recipient & Category */}
            <div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                   <select className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors appearance-none cursor-pointer">
                     <option>System Update</option>
                     <option>Booking Alert</option>
                     <option>Payment Issue</option>
                     <option>General Announcement</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Recipient(s)</label>
                   <select className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors appearance-none cursor-pointer">
                     <option>All Users</option>
                     <option>All Campers / Guests</option>
                     <option>Specific User (by email)</option>
                     <option>Admin Staff Only</option>
                   </select>
                 </div>
               </div>
            </div>

            {/* Template Selection */}
            <div>
               <div className="grid grid-cols-1 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Use Template (Optional)</label>
                   <select className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors appearance-none cursor-pointer text-slate-700">
                     <option value="">-- None --</option>
                     <option value="maintenance">System Maintenance Alert</option>
                     <option value="promo">Special Offer / Promo</option>
                     <option value="booking">Booking Status Update</option>
                   </select>
                 </div>
               </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message Content</label>
              <textarea rows="5" placeholder="Write your notification message here..." className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors resize-none"></textarea>
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
            <Send className="w-4 h-4" /> Send Notification
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateNotificationForm;
