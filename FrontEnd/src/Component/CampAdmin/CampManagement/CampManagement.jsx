import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  Tent, 
  CheckCircle2, 
  Wrench, 
  MapPin, 
  MoreVertical, 
  Edit,
  Home
} from 'lucide-react';
import AddCampForm from './AddCampForm';

const CampManagement = () => {
  const [activeTab, setActiveTab] = useState('All Camps');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const stats = [
    { label: 'Total Camps', value: '50', icon: Tent, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { label: 'Available', value: '32', icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-50' },
    { label: 'Occupied', value: '18', icon: Home, color: 'text-orange-500', bgColor: 'bg-orange-50' },
    { label: 'Maintenance', value: '2', icon: Wrench, color: 'text-red-500', bgColor: 'bg-red-50' },
  ];

  const tabs = ['All Camps', 'Available', 'Occupied', 'Maintenance'];

  const camps = [
    {
      id: 1,
      title: 'Bale Mountains - A1',
      location: 'Bale Mountains National Park',
      capacity: '10 people',
      type: 'Mountain Tent',
      price: 'ETB 12,000/night',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=640'
    },
    {
      id: 2,
      title: 'Bale Mountains - A2',
      location: 'Bale Mountains National Park',
      capacity: '10 people',
      type: 'Mountain Tent',
      price: 'ETB 12,000/night',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=640'
    },
    {
      id: 3,
      title: 'Bale Mountains - A3',
      location: 'Bale Mountains National Park',
      capacity: '10 people',
      type: 'Mountain Tent',
      price: 'ETB 12,000/night',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=640'
    },
    {
      id: 4,
      title: 'Simien Mountains - G1',
      location: 'Simien N. Park',
      capacity: '4 people',
      type: 'Glamping',
      price: 'ETB 18,000/night',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=640'
    },
    {
      id: 5,
      title: 'Simien Mountains - G2',
      location: 'Simien N. Park',
      capacity: '4 people',
      type: 'Glamping',
      price: 'ETB 18,000/night',
      status: 'Occupied',
      image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=640'
    },
    {
      id: 6,
      title: 'Simien Mountains - G3',
      location: 'Simien N. Park',
      capacity: '4 people',
      type: 'Glamping',
      price: 'ETB 18,000/night',
      status: 'Maintenance',
      image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=640'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Camp Management</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search camps..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-64 bg-white"
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Camp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs and Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2 bg-slate-100/50 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex-1 sm:flex-none text-center whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-teal-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="w-full sm:w-auto">
          <select className="w-full sm:w-auto border border-slate-200 bg-white text-slate-700 text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-sm">
            <option>All Locations</option>
            <option>Bale Mountains</option>
            <option>Simien Mountains</option>
          </select>
        </div>
      </div>

      {/* Grid of Camps */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {camps.map(camp => (
          <div key={camp.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group">
            {/* Image Header */}
            <div className="h-48 w-full relative overflow-hidden">
              <img 
                src={camp.image} 
                alt={camp.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                  camp.status === 'Available' ? 'bg-teal-500 text-white' : 
                  camp.status === 'Occupied' ? 'bg-orange-500 text-white' : 
                  'bg-red-500 text-white'
                }`}>
                  {camp.status}
                </span>
              </div>
            </div>
            
            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-800">{camp.title}</h3>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center text-slate-500 text-sm mb-4">
                <MapPin className="w-4 h-4 mr-1 pb-0.5" />
                <span>{camp.location}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-y-3 mb-6">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Capacity</p>
                  <p className="text-sm text-slate-700 font-medium">{camp.capacity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-medium">Type</p>
                  <p className="text-sm text-slate-700 font-medium">{camp.type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Price</p>
                  <p className="text-sm font-bold text-teal-600">{camp.price}</p>
                </div>
              </div>
              
              {/* Card Footer Actions */}
              <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                <button className="flex items-center justify-center space-x-2 py-2 px-4 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button className="py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                  + Add Booking
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Camp Modal Overlay */}
      <AddCampForm 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
    </div>
  );
};

export default CampManagement;
