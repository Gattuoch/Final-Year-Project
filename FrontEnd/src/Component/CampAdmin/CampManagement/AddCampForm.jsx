import React, { useState } from 'react';
import { X, ImagePlus, Check } from 'lucide-react';

const AddCampForm = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Add New Camp</h2>
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
            
            {/* Title & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Camp Title</label>
                <input type="text" placeholder="e.g. Bale Mountains - A1" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Camp Type</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors appearance-none cursor-pointer">
                  <option>Mountain Tent</option>
                  <option>Glamping</option>
                  <option>RV Site</option>
                  <option>Lodge Room</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input type="text" placeholder="e.g. Bale Mountains National Park" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors" />
            </div>

            {/* Capacity & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Capacity (Persons)</label>
                <input type="number" placeholder="e.g. 4" min="1" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price per Night (ETB)</label>
                <input type="number" placeholder="e.g. 12000" min="0" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors" />
              </div>
            </div>

            {/* Image Upload Area */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Featured Image</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-3">
                  <ImagePlus className="w-6 h-6 text-teal-600" />
                </div>
                <p className="text-sm font-medium text-slate-700">Click to upload an image</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea rows="4" placeholder="Describe the camp features and amenities..." className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white transition-colors resize-none"></textarea>
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
            <Check className="w-4 h-4" /> Save Camp
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddCampForm;
