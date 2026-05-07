import React, { useState } from 'react';
import {
  Search,
  Bell,
  Users,
  UserCheck,
  UserPlus,
  UserX,
  Eye,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../../services/api';

const initialUsersList = [
  {
    id: '#USR-001',
    name: 'Abebe Kebede',
    email: 'abebe.kebede@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Abebe+Kebede&background=random',
    role: 'Camper',
    joined: 'Jan 12, 2026',
    status: 'Active',
  },
  {
    id: '#USR-002',
    name: 'Tigist Alemu',
    email: 'tigist.a@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Tigist+Alemu&background=random',
    role: 'Camper',
    joined: 'Feb 05, 2026',
    status: 'Inactive',
  },
  {
    id: '#USR-003',
    name: 'Dawit Tadesse',
    email: 'dawit.t@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Dawit+Tadesse&background=random',
    role: 'Camper',
    joined: 'Mar 10, 2026',
    status: 'Active',
  },
  {
    id: '#USR-004',
    name: 'Selamawit Bekele',
    email: 'selam@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Selamawit+Bekele&background=random',
    role: 'Camper',
    joined: 'Mar 15, 2026',
    status: 'Banned',
  },
  {
    id: '#USR-005',
    name: 'Ephrem Assefa',
    email: 'ephrem.assefa@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Ephrem+Assefa&background=random',
    role: 'Camper',
    joined: 'Mar 20, 2026',
    status: 'Active',
  }
];

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('All Users');
  const [usersData, setUsersData] = useState(initialUsersList);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({ name: '', email: '', status: 'Active' });

  // Stats Calculation
  const totalUsers = usersData.length;
  const activeUsersCount = usersData.filter(u => u.status === 'Active').length;
  const bannedUsersCount = usersData.filter(u => u.status === 'Banned').length;

  const stats = [
    { label: 'Total Users', value: totalUsers, subtext: '+12% from last month', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { label: 'Active Users', value: activeUsersCount, subtext: 'Logged in last 30 days', icon: UserCheck, color: 'text-green-500', bgColor: 'bg-green-50' },
    { label: 'New Signups', value: '145', subtext: 'Joined this week', icon: UserPlus, color: 'text-teal-600', bgColor: 'bg-teal-50' },
    { label: 'Banned Users', value: bannedUsersCount, subtext: 'Account restricted', icon: UserX, color: 'text-red-500', bgColor: 'bg-red-50' },
  ];

  const tabs = ['All Users', 'Active', 'Inactive', 'Banned'];

  // Filtering Logic
  const filteredUsers = usersData.filter(user => {
    const matchesTab = activeTab === 'All Users' || user.status === activeTab;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Actions
  const openView = (user) => { setSelectedUser(user); setIsViewModalOpen(true); };
  const openEdit = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, status: user.status });
    setIsEditModalOpen(true);
  };
  const openDelete = (user) => { setSelectedUser(user); setIsDeleteModalOpen(true); };
  const openAdd = () => { setFormData({ name: '', email: '', status: 'Active' }); setIsAddModalOpen(true); };

  const handleDelete = () => {
    setUsersData(usersData.filter(u => u.id !== selectedUser.id));
    setIsDeleteModalOpen(false);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setUsersData(usersData.map(u =>
      u.id === selectedUser.id ? { ...u, name: formData.name, email: formData.email, status: formData.status } : u
    ));
    setIsEditModalOpen(false);
  };

  const handleAddSave = (e) => {
    e.preventDefault();
    const newUser = {
      id: `#USR-00${usersData.length + 1}`,
      name: formData.name,
      email: formData.email,
      avatar: `https://ui-avatars.com/api/?name=${formData.name.replace(' ', '+')}&background=random`,
      role: 'Camper',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: formData.status,
    };
    setUsersData([...usersData, newUser]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 font-sans overflow-y-auto w-full relative">

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-64 bg-white shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition-colors bg-white shadow-sm">
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={openAdd}
              className="flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
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

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col flex-1">
        {/* Table Header & Filters */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 bg-slate-100/50 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-1 sm:flex-none text-center ${activeTab === tab
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="w-full md:w-auto flex gap-3">
            <select className="w-full md:w-auto border border-slate-200 bg-white text-slate-700 text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-sm">
              <option>All Campers</option>
              <option>Recent Guests</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-teal-600">{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full shadow-sm" />
                      <span className="font-bold text-slate-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{user.email}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{user.joined}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={user.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        const oldStatus = user.status;
                        
                        // Optimistically update the UI instantly
                        setUsersData(usersData.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
                        
                        // Attempt API call to the newly created backend endpoint
                        try {
                          // Checking if it's a real MongoDB ID before making the request
                          if (!user.id.startsWith('#')) {
                            await API.put(`/usersadmin/${user.id}/status`, { status: newStatus });
                            toast.success(`User marked as ${newStatus}`);
                          } else {
                            // Mock mode:
                            toast.success(`[Mock] User marked as ${newStatus}`);
                          }
                        } catch (err) {
                          // Revert on failure
                          setUsersData(usersData.map(u => u.id === user.id ? { ...u, status: oldStatus } : u));
                          toast.error('Failed to change user status.');
                          console.error(err);
                        }
                      }}
                      className={`px-3 py-1 pr-7 text-xs font-bold rounded-full cursor-pointer outline-none appearance-none bg-no-repeat border ${
                          user.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' :
                          user.status === 'Inactive' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                          'bg-red-100 text-red-700 border-red-200'
                      }`}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Banned">Banned</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-3 text-slate-400">
                      <button onClick={() => openView(user)} className="hover:text-teal-600 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => openEdit(user)} className="hover:text-blue-600 transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => openDelete(user)} className="hover:text-red-600 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-slate-500 font-medium">No users found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* View Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">User Details</h2>
              <button onClick={() => setIsViewModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <img src={selectedUser.avatar} alt="avatar" className="w-16 h-16 rounded-full shadow-sm" />
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{selectedUser.name}</h3>
                  <p className="text-sm text-slate-500">{selectedUser.email}</p>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between"><span className="text-slate-500 font-medium">User ID</span><span className="font-bold text-slate-800">{selectedUser.id}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Role</span><span className="font-bold text-slate-800">{selectedUser.role}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Joined Date</span><span className="font-bold text-slate-800">{selectedUser.joined}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-medium">Status</span>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${selectedUser.status === 'Active' ? 'bg-green-100 text-green-700' :
                      selectedUser.status === 'Inactive' ? 'bg-slate-100 text-slate-700' :
                        'bg-red-100 text-red-700'
                    }`}>{selectedUser.status}</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setIsViewModalOpen(false)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-medium rounded-lg transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Edit User</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleEditSave}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Banned">Banned</option>
                  </select>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-red-50">
              <h2 className="text-lg font-bold text-red-700 flex items-center gap-2"><Trash2 className="w-5 h-5" /> Confirm Deletion</h2>
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-red-400 hover:text-red-600 p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <p className="text-slate-600 text-sm">Are you sure you want to delete user <strong>{selectedUser.name}</strong>? This action cannot be undone.</p>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">Delete User</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Add New Camper</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddSave}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" required placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" required placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Initial Status</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
