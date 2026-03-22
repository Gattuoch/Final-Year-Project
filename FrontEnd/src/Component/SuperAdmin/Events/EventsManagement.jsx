import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import { FiCalendar, FiMapPin, FiUsers, FiPlus, FiMoreVertical, FiSearch, FiFilter, FiX, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";

const EventCard = ({ title, date, location, attendees, status, image, onEdit, onDelete, onView }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col relative">
      <div className="h-40 w-full bg-gray-200 relative">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md ${
          status === 'Upcoming' ? 'bg-green-500/90 text-white' : 
          status === 'Ongoing' ? 'bg-blue-500/90 text-white' : 'bg-gray-500/90 text-white'
        }`}>
          {status}
        </span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{title}</h3>
        <div className="mt-4 space-y-2 flex-1">
          <div className="flex items-center text-sm text-gray-500">
            <FiCalendar className="mr-2 text-gray-400" /> {date}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FiMapPin className="mr-2 text-gray-400 shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FiUsers className="mr-2 text-gray-400" /> {attendees} Expected Attendees
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center relative">
          <div className="flex -space-x-2">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 bg-center bg-cover" style={{backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`}}></div>
             ))}
             <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">+{attendees - 3}</div>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowActions(!showActions)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg focus:outline-none"
            >
              <FiMoreVertical />
            </button>
            {showActions && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowActions(false)}
                ></div>
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                  <button 
                    onClick={() => { setShowActions(false); onView(); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <FiEye className="text-gray-400" /> View Details
                  </button>
                  <button 
                    onClick={() => { setShowActions(false); onEdit(); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <FiEdit2 className="text-gray-400" /> Edit Event
                  </button>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button 
                    onClick={() => { setShowActions(false); onDelete(); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                  >
                    <FiTrash2 /> Delete Event
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EventModal = ({ isOpen, onClose, onSave, initialData = null, isViewOnly = false }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState(initialData || {
    title: "",
    date: "",
    location: "",
    attendees: "",
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800"
  });

  // Reset form when opened with new data
  React.useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {
        title: "",
        date: "",
        location: "",
        attendees: "",
        status: "Upcoming",
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800"
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, attendees: parseInt(formData.attendees) || 0 });
    setFormData({
      title: "",
      date: "",
      location: "",
      attendees: "",
      status: "Upcoming",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800"
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {isViewOnly ? "Event Details" : initialData ? "Edit Event" : "Create New Event"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
            <input required readOnly={isViewOnly} type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm ${isViewOnly ? 'opacity-75 cursor-not-allowed' : ''}`} placeholder="E.g., Summer Music Festival 2026" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input required readOnly={isViewOnly} type="text" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className={`w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm ${isViewOnly ? 'opacity-75 cursor-not-allowed' : ''}`} placeholder="E.g., Aug 15 - Aug 18, 2026" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input required readOnly={isViewOnly} type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className={`w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm ${isViewOnly ? 'opacity-75 cursor-not-allowed' : ''}`} placeholder="E.g., Lakeside Valley" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Attendees</label>
              <input required readOnly={isViewOnly} type="number" min="1" value={formData.attendees} onChange={(e) => setFormData({...formData, attendees: e.target.value})} className={`w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm ${isViewOnly ? 'opacity-75 cursor-not-allowed' : ''}`} placeholder="E.g., 500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select disabled={isViewOnly} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className={`w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm appearance-none ${isViewOnly ? 'opacity-75 cursor-not-allowed' : ''}`}>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Past">Past</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
            {!isViewOnly ? (
              <>
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-sm">
                  {initialData ? "Save Changes" : "Create Event"}
                </button>
              </>
            ) : (
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">Close</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const EventsManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create', 'edit', 'view'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const [events, setEvents] = useState([
    { title: "Summer Music Festival 2026", date: "Aug 15 - Aug 18, 2026", location: "Lakeside Valley Campground", attendees: 5000, status: "Upcoming", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800" },
    { title: "Mountain Wellness Retreat", date: "Sep 05 - Sep 10, 2026", location: "Pine Crest Peak", attendees: 120, status: "Upcoming", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" },
    { title: "Tech Innovators Offsite", date: "Jul 20 - Jul 22, 2026", location: "Redwood Forest Cabins", attendees: 350, status: "Ongoing", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800" },
    { title: "Star Gazing Night", date: "Oct 12, 2026", location: "Desert Oasis Camp", attendees: 80, status: "Upcoming", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800" },
    { title: "Trail Running Championship", date: "Nov 02 - Nov 03, 2026", location: "Eagle's Nest Trails", attendees: 1200, status: "Upcoming", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80&w=800" },
    { title: "Spring Yoga Gathering", date: "Apr 10 - Apr 12, 2026", location: "Meadow View Resort", attendees: 200, status: "Past", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800" },
  ]);

  const handleSaveEvent = (eventData) => {
    if (modalMode === 'edit' && editIndex !== null) {
      // Find the actual index in the main events array
      const filteredItem = filteredEvents[editIndex];
      const actualIndex = events.findIndex(e => e === filteredItem);
      
      const newEvents = [...events];
      newEvents[actualIndex] = eventData;
      setEvents(newEvents);
    } else {
      setEvents([eventData, ...events]);
    }
  };

  const openModal = (mode, event = null, index = null) => {
    setModalMode(mode);
    setSelectedEvent(event);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All Statuses" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteEvent = (index) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const newEvents = [...events];
      newEvents.splice(index, 1);
      setEvents(newEvents);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="flex-1 w-full relative">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <div className="p-4 md:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
              <p className="text-gray-500 text-sm mt-1">Manage and monitor all platform events.</p>
            </div>
            <button 
              onClick={() => openModal('create')}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              <FiPlus /> Create Event
            </button>
          </div>

          {/* Tools & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search events by title, location, or host..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm shadow-sm"
              />
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <FiFilter /> Filters
              </button>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 appearance-none pr-8 relative cursor-pointer min-w-[140px]"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Past">Past</option>
              </select>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, idx) => (
                  <EventCard 
                    key={idx} 
                    {...event} 
                    onDelete={() => handleDeleteEvent(idx)}
                    onEdit={() => openModal('edit', event, idx)}
                    onView={() => openModal('view', event, idx)}
                  />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                No events found matching your criteria.
              </div>
            )}
          </div>
        </div>

        <EventModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveEvent} 
          initialData={selectedEvent}
          isViewOnly={modalMode === 'view'}
        />
      </main>
    </div>
  );
};

export default EventsManagement;
