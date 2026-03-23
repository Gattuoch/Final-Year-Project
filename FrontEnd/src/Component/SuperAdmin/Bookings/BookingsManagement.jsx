import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import API from "../services/api.js";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, FiFilter, FiDownload, FiCheckCircle, 
  FiXCircle, FiClock, FiMoreHorizontal, FiCalendar,
  FiMapPin, FiCreditCard, FiUser, FiEye, FiMessageSquare, FiFileText,
  FiX, FiSend
} from "react-icons/fi";

const BookingsManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("Any");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("All");
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [activeModal, setActiveModal] = useState(null); // 'Details', 'Logs', 'Message'
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Message Form State
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await API.get("/usersuperadmindashboard/bookings", { params: { limit: 100, sort: "-createdAt" } });
        const data = res.data || [];
        
        const formatted = data.map((b, idx) => ({
          id: b.bookingId || b._id?.substring(0, 8) || `BKG-${idx}`,
          user: b.visitor?.fullName || b.visitor || b.email?.split('@')[0] || "Guest User",
          email: b.visitor?.email || b.email || "No Email Provided",
          phone: b.visitor?.phone || b.phone || "No Phone",
          camp: b.camp?.name || b.campName || "Platform Event",
          type: b.accommodationType || "Standard Ticket",
          duration: b.duration ? `${b.duration} Nights` : "Day Visit",
          guests: b.tickets ? `${b.tickets} Guests` : "1 Guest",
          date: b.checkInDate ? new Date(b.checkInDate).toLocaleDateString() : (b.time ? new Date(b.time).toLocaleDateString() : "Flexible"),
          bookedOn: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "Recently",
          amount: b.amount ? `${b.currency || 'ETB'} ${b.amount}` : "N/A",
          paymentMethod: b.paymentMethod || "Online",
          status: b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : "Pending",
          avatar: b.visitor?.avatar || `https://ui-avatars.com/api/?name=${b.visitor?.fullName || b.visitor || b.email || 'User'}&background=random`
        }));
        
        setBookings(formatted);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b => {
    // 1. Tab Match
    const matchesTab = activeTab === 'All' || b.status === activeTab;
    
    // 2. Search Match
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      b.id.toLowerCase().includes(searchLower) || 
      b.user.toLowerCase().includes(searchLower) || 
      b.camp.toLowerCase().includes(searchLower);
      
    // 3. Date Match
    let matchesDate = true;
    if (dateFilter !== "Any") {
       const today = new Date();
       const bDate = new Date(b.date);
       if (dateFilter === "Next 7 Days") {
          const nextWeek = new Date();
          nextWeek.setDate(today.getDate() + 7);
          matchesDate = bDate >= today && bDate <= nextWeek;
       } else if (dateFilter === "This Month") {
          matchesDate = bDate.getMonth() === today.getMonth() && bDate.getFullYear() === today.getFullYear();
       } else if (dateFilter === "Past Bookings") {
          matchesDate = bDate < today;
       }
    }
    
    // 4. Payment Method Match 
    const matchesPayment = selectedPaymentMethod === "All" || b.paymentMethod.toLowerCase().includes(selectedPaymentMethod.toLowerCase());

    return matchesTab && matchesSearch && matchesDate && matchesPayment;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Confirmed': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"><FiCheckCircle className="text-[10px]" /> Confirmed</span>;
      case 'Pending': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200"><FiClock className="text-[10px]" /> Pending</span>;
      case 'Cancelled': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200"><FiXCircle className="text-[10px]" /> Cancelled</span>;
      default: return null;
    }
  };

  // Summary Metrics
  const summaryMetrics = [
    { label: "Total Bookings", value: bookings.length.toString(), icon: FiCalendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Revenue", value: `ETB ${bookings.reduce((sum, b) => sum + (parseFloat(b.amount?.replace(/[^0-9.]/g, '')) || 0), 0).toLocaleString()}`, icon: FiCreditCard, color: "text-green-600", bg: "bg-green-50" },
    { label: "Pending Approvals", value: bookings.filter(b => b.status === "Pending").length.toString(), icon: FiClock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Cancellations", value: bookings.filter(b => b.status === "Cancelled").length.toString(), icon: FiXCircle, color: "text-red-600", bg: "bg-red-50" },
  ];

  /* Action Handlers */
  const handleAction = (action, bookingId) => {
     const booking = bookings.find(b => b.id === bookingId);
     if (booking) {
        setSelectedBooking(booking);
        if (action === 'View Details') setActiveModal('Details');
        else if (action === 'View Logs') setActiveModal('Logs');
        else if (action === 'Message User') {
           setMessageSubject(`Update regarding your booking ${booking.id}`);
           setMessageBody("");
           setActiveModal('Message');
        }
     }
  };

  const closeModal = () => {
     setActiveModal(null);
     setTimeout(() => setSelectedBooking(null), 300); // clear after animate out
  };

  const handleSendMessage = async () => {
     if (!messageBody.trim()) {
       alert("Please enter a message to send.");
       return;
     }

     try {
       setSendingMessage(true);
       // Assuming your API has an email/message sending route
       await API.post(`/usersadmin/send-message`, {
         userId: selectedBooking.user, 
         email: selectedBooking.email,
         subject: messageSubject,
         body: messageBody,
         bookingId: selectedBooking.id
       });
       
       alert("Message sent successfully!");
       closeModal();
     } catch (error) {
       console.error("Failed to send message:", error);
       alert("Failed to send message. Please try again.");
     } finally {
       setSendingMessage(false);
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
              <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
              <p className="text-gray-500 text-sm mt-1">Comprehensive view and control over all reservations.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
                <FiDownload /> Export CSV
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {summaryMetrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${metric.bg} ${metric.color}`}>
                  <metric.icon className="text-xl" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{metric.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-sm">
            {/* Tabs */}
            <div className="border-b border-gray-100 px-4 flex gap-6 overflow-x-auto scollbar-hide">
               {['All', 'Confirmed', 'Pending', 'Cancelled'].map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 font-medium text-sm whitespace-nowrap transition-colors relative ${activeTab === tab ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                 >
                   {tab}
                   {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-t-full"></div>}
                 </button>
               ))}
            </div>

            {/* Table Header/Tools */}
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between bg-white items-center">
              <div className="relative w-full md:w-96 input-wrapper">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by ID, User, or Location..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-inner text-sm"
                />
              </div>
              <div className="flex gap-3 w-full md:w-auto mt-3 md:mt-0 relative">
                 <select 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm outline-none focus:ring-2 focus:ring-green-500/20"
                 >
                    <option value="Any">Date Range (Any)</option>
                    <option value="Next 7 Days">Next 7 Days</option>
                    <option value="This Month">This Month</option>
                    <option value="Past Bookings">Past Bookings</option>
                 </select>
                 
                 <button 
                  onClick={() => setShowMoreFilters(!showMoreFilters)}
                  className={`px-4 py-2.5 bg-white border rounded-xl text-sm font-medium transition flex items-center gap-2 shadow-sm whitespace-nowrap ${showMoreFilters ? 'border-green-500 text-green-700 bg-green-50' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                 >
                    <FiFilter className={showMoreFilters ? "text-green-600" : "text-gray-400"} /> More Filters
                 </button>
                 
                 {/* More Filters Dropdown */}
                 {showMoreFilters && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 p-4">
                       <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Filter By Payment</h3>
                       <div className="space-y-2">
                          {['All', 'Online', 'Bank Transfer', 'Stripe', 'Chapa'].map(method => (
                             <label key={method} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="paymentMethod" 
                                  value={method} 
                                  checked={selectedPaymentMethod === method}
                                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                  className="text-green-600 focus:ring-green-500" 
                                />
                                {method}
                             </label>
                          ))}
                       </div>
                       <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                          <button 
                            onClick={() => { setSelectedPaymentMethod("All"); setShowMoreFilters(false); }}
                            className="text-xs font-medium text-green-600 hover:text-green-700"
                          >
                            Clear Filters
                          </button>
                       </div>
                    </div>
                 )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-gray-50/80 text-gray-500 font-semibold text-xs tracking-wider border-b border-gray-100">
                    <th className="px-5 py-4">Booking Info</th>
                    <th className="px-5 py-4">Customer Details</th>
                    <th className="px-5 py-4">Stay Details</th>
                    <th className="px-5 py-4">Payment Info</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-10 text-center text-gray-500">
                         <div className="flex flex-col items-center justify-center gap-3">
                            <div className="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
                            <p>Loading bookings...</p>
                         </div>
                      </td>
                    </tr>
                  ) : filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/60 transition-colors group">
                      
                      {/* Booking Info */}
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                               <FiCalendar className="text-lg" />
                           </div>
                           <div>
                              <div className="font-bold text-gray-900">{booking.id}</div>
                              <div className="text-xs text-gray-500 mt-0.5">Booked on {booking.bookedOn}</div>
                           </div>
                        </div>
                      </td>

                      {/* Customer Details */}
                      <td className="px-5 py-4 align-top">
                         <div className="flex items-center gap-3">
                           <img src={booking.avatar} alt={booking.user} className="w-9 h-9 rounded-full border shadow-sm object-cover" />
                           <div>
                              <div className="font-semibold text-gray-900">{booking.user}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{booking.email}</div>
                              <div className="text-xs text-gray-500 select-all">{booking.phone}</div>
                           </div>
                         </div>
                      </td>

                      {/* Stay Details */}
                      <td className="px-5 py-4 align-top">
                        <div className="font-medium text-gray-900 flex items-center gap-1.5"><FiMapPin className="text-gray-400 shrink-0" /> <span className="line-clamp-1">{booking.camp}</span></div>
                        <div className="text-xs text-gray-600 mt-1 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>{booking.type} • {booking.duration}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5"><FiUser className="text-gray-400 shrink-0" /> {booking.guests}</div>
                        <div className="text-xs text-gray-500 mt-1.5 font-medium bg-gray-100 px-2 py-0.5 rounded-md inline-block">{booking.date}</div>
                      </td>

                      {/* Payment Info */}
                      <td className="px-5 py-4 align-top">
                        <div className="font-bold text-gray-900 text-base">{booking.amount}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5"><FiCreditCard className="text-gray-400 shrink-0" /> {booking.paymentMethod}</div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 align-top pt-5">
                          {getStatusBadge(booking.status)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 align-top pt-4">
                        <div className="flex items-center justify-center gap-2 text-lg">
                           <button onClick={() => handleAction('View Details', booking.id)} title="View Booking Details" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"><FiEye /></button>
                           <button onClick={() => handleAction('View Logs', booking.id)} title="View Audit Logs" className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-transparent hover:border-purple-100"><FiFileText /></button>
                           <button onClick={() => handleAction('Message User', booking.id)} title="Message User" className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"><FiMessageSquare /></button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredBookings.length === 0 && (
                <div className="p-10 text-center text-gray-500">
                  No bookings found for this category.
                </div>
              )}
            </div>

             {/* Pagination */}
             <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-gray-500 bg-gray-50/50 text-sm">
                <span>Showing <span className="font-semibold text-gray-900">{filteredBookings.length > 0 ? 1 : 0}</span> to <span className="font-semibold text-gray-900">{filteredBookings.length}</span> of <span className="font-semibold text-gray-900">{bookings.length}</span> results</span>
                <div className="flex gap-2">
                   <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 font-medium transition-colors shadow-sm disabled:opacity-50">Previous</button>
                   <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 font-medium transition-colors shadow-sm disabled:opacity-50">Next</button>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Modals using Framer Motion */}
      <AnimatePresence>
        {activeModal && selectedBooking && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               transition={{ duration: 0.2, ease: "easeOut" }}
               className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
             >
               {/* Modal Header */}
               <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
                  <h2 className="text-xl font-bold text-gray-900">
                    {activeModal === 'Details' && `Booking ${selectedBooking.id}`}
                    {activeModal === 'Logs' && `Audit Logs for ${selectedBooking.id}`}
                    {activeModal === 'Message' && `Message ${selectedBooking.user}`}
                  </h2>
                  <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                     <FiX className="text-xl" />
                  </button>
               </div>

               {/* Modal Body - Scrollable */}
               <div className="p-6 overflow-y-auto w-full custom-scrollbar">
                  
                  {/* View Details Content */}
                  {activeModal === 'Details' && (
                     <div className="space-y-8">
                       {/* Top Summary */}
                       <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="flex items-center gap-4">
                             <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-green-600 text-2xl">
                               <FiCalendar />
                             </div>
                             <div>
                               <div className="text-sm text-gray-500 font-medium">Booked on {selectedBooking.bookedOn}</div>
                               <div className="text-lg font-bold text-gray-900 mt-0.5">{selectedBooking.date}</div>
                             </div>
                          </div>
                          <div className="text-right">
                             {getStatusBadge(selectedBooking.status)}
                             <div className="text-2xl font-bold text-gray-900 mt-2">{selectedBooking.amount}</div>
                          </div>
                       </div>

                       {/* Split Data */}
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          {/* Customer Base */}
                          <div className="space-y-4">
                             <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2"><FiUser className="text-gray-400" /> Customer Data</h3>
                             <div className="flex items-center gap-4">
                               <img src={selectedBooking.avatar} alt={selectedBooking.user} className="w-12 h-12 rounded-full shadow-sm object-cover border border-gray-100" />
                               <div>
                                  <div className="font-semibold text-gray-900">{selectedBooking.user}</div>
                                  <div className="text-sm text-gray-500">{selectedBooking.email}</div>
                                  <div className="text-sm text-gray-500">{selectedBooking.phone}</div>
                               </div>
                             </div>
                          </div>
                          
                          {/* Stay Base */}
                          <div className="space-y-4">
                             <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2"><FiMapPin className="text-gray-400" /> Stay Information</h3>
                             <div className="space-y-2">
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Camp:</span> <span className="font-medium text-gray-900">{selectedBooking.camp}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Accommodation:</span> <span className="font-medium text-gray-900">{selectedBooking.type}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Duration:</span> <span className="font-medium text-gray-900">{selectedBooking.duration}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Guests:</span> <span className="font-medium text-gray-900">{selectedBooking.guests}</span></div>
                             </div>
                          </div>
                       </div>
                       
                       {/* Payment Base */}
                       <div className="space-y-4">
                         <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2"><FiCreditCard className="text-gray-400" /> Payment & Receipt</h3>
                         <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                 <FiCreditCard />
                               </div>
                               <div>
                                  <div className="font-medium text-gray-900">{selectedBooking.paymentMethod}</div>
                                  <div className="text-xs text-gray-500">Paid in full securely.</div>
                               </div>
                            </div>
                            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors">
                              Download Invoice
                            </button>
                         </div>
                       </div>
                     </div>
                  )}

                  {/* View Logs Content */}
                  {activeModal === 'Logs' && (
                     <div className="relative border-l-2 border-gray-100 ml-3 md:ml-6 space-y-8 pb-4">
                        <div className="relative pl-6">
                           <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 ring-4 ring-white"></div>
                           <p className="text-xs font-semibold text-gray-500 mb-1">Right Now</p>
                           <h4 className="font-medium text-gray-900">Current Status: {selectedBooking.status}</h4>
                        </div>
                        <div className="relative pl-6">
                           <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white"></div>
                           <p className="text-xs font-semibold text-gray-500 mb-1">A few days ago</p>
                           <h4 className="font-medium text-gray-900">Payment Processed</h4>
                           <p className="text-sm text-gray-600 mt-1">Payment of {selectedBooking.amount} secured via {selectedBooking.paymentMethod}.</p>
                        </div>
                        <div className="relative pl-6">
                           <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-400 ring-4 ring-white"></div>
                           <p className="text-xs font-semibold text-gray-500 mb-1">{selectedBooking.bookedOn}</p>
                           <h4 className="font-medium text-gray-900">Booking Initialized</h4>
                           <p className="text-sm text-gray-600 mt-1">User generated the booking code {selectedBooking.id}.</p>
                        </div>
                     </div>
                  )}

                  {/* Message Content */}
                  {activeModal === 'Message' && (
                     <div className="space-y-5">
                       <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm mb-2 flex items-start gap-3 border border-blue-100">
                          <FiMessageSquare className="shrink-0 mt-0.5" />
                          <p>You are about to send an email to <strong>{selectedBooking.email}</strong>. This message will be recorded in the system logs.</p>
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                         <input 
                           type="text" 
                           value={messageSubject}
                           onChange={(e) => setMessageSubject(e.target.value)}
                           className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors" 
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1.5">Message Body</label>
                         <textarea 
                           rows={5} 
                           value={messageBody}
                           onChange={(e) => setMessageBody(e.target.value)}
                           placeholder="Type your message here..." 
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors resize-none"
                         ></textarea>
                       </div>
                     </div>
                  )}
               </div>

               {/* Modal Footer (only needed really for Message) */}
               {activeModal === 'Message' && (
                 <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
                    <button onClick={closeModal} disabled={sendingMessage} className="px-5 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50">Cancel</button>
                    <button 
                       onClick={handleSendMessage}
                       disabled={sendingMessage}
                       className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                       {sendingMessage ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                       ) : (
                          <FiSend />
                       )}
                       {sendingMessage ? "Sending..." : "Send Message"}
                    </button>
                 </div>
               )}
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingsManagement;
