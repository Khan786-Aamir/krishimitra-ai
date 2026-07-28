import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  UserCheck,
  UserX,
  Trash2,
  Download,
  AlertTriangle,
  Eye,
  Edit2,
  CheckCircle,
  XCircle,
  Users
} from 'lucide-react';
import adminService from '../../services/adminService';
import { DataTable, Button, Modal, Input, Badge } from '../../components/ui';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Modals state
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [bulkAction, setBulkAction] = useState(null); // 'delete' or 'suspend' or 'activate'
  
  // Edit Form state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState('Farmer');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data || []);
      setSelectedIds([]);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users by Active Tab and Search Query
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesTab = activeTab === 'All' || u.role === activeTab;
      const matchesSearch = 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [users, activeTab, searchQuery]);

  // Selections
  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredUsers.map(u => u._id));
    } else {
      setSelectedIds([]);
    }
  };

  // Actions
  const handleView = (user) => {
    setViewUser(user);
  };

  const handleEditOpen = (user) => {
    setEditUser(user);
    setEditName(user.name);
    setEditPhone(user.phone || '');
    setEditRole(user.role);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateUser(editUser._id, {
        name: editName,
        phone: editPhone,
        role: editRole
      });
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteUser(deleteConfirmUser._id);
      setDeleteConfirmUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSuspend = async (user) => {
    try {
      await adminService.toggleUserSuspension(user._id);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Bulk Actions Handlers
  const handleBulkAction = async () => {
    try {
      if (bulkAction === 'delete') {
        await adminService.bulkDeleteUsers(selectedIds);
      } else if (bulkAction === 'suspend') {
        await adminService.bulkSuspendUsers(selectedIds, true);
      } else if (bulkAction === 'activate') {
        await adminService.bulkSuspendUsers(selectedIds, false);
      }
      setBulkAction(null);
      setSelectedIds([]);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Client-side CSV Download
  const handleExportCSV = () => {
    const headers = ['User ID', 'Name', 'Role', 'Email', 'Phone', 'Status', 'Joined Date'];
    const rows = filteredUsers.map(u => [
      u._id,
      u.name,
      u.role,
      u.email,
      u.phone || 'N/A',
      u.isVerified ? 'Active' : 'Suspended',
      new Date(u.createdAt).toLocaleDateString()
    ]);
    
    let csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `krishimitra_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Columns definition for DataTable
  const columns = [
    {
      key: 'select',
      label: (
        <input
          type="checkbox"
          checked={filteredUsers.length > 0 && selectedIds.length === filteredUsers.length}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="rounded border-border bg-surface text-primary focus:ring-primary w-4 h-4 cursor-pointer"
        />
      ),
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row._id)}
          onChange={(e) => handleSelectRow(row._id, e.target.checked)}
          className="rounded border-border bg-surface text-primary focus:ring-primary w-4 h-4 cursor-pointer"
        />
      )
    },
    {
      key: 'name',
      label: 'Profile',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
            {row.name[0]}
          </div>
          <div>
            <span className="font-bold text-white block">{row.name}</span>
            <span className="text-[10px] text-gray-500 block font-mono">{row._id}</span>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (val) => (
        <Badge
          className={
            val === 'Admin'
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : val === 'Expert'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : val === 'Buyer'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }
        >
          {val}
        </Badge>
      )
    },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'isVerified',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-1.5 font-bold">
          {val ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-xs">Active</span>
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-rose-400 text-xs">Suspended</span>
            </>
          )}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Joined Date',
      sortable: true,
      render: (val) => new Date(val).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="p-1 px-2 border-border text-gray-400 hover:text-white rounded-lg flex items-center gap-1"
            onClick={() => handleView(row)}
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-1 px-2 border-border text-gray-400 hover:text-white rounded-lg flex items-center gap-1"
            onClick={() => handleEditOpen(row)}
            title="Edit User"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`p-1 px-2 border-border rounded-lg flex items-center gap-1 ${
              row.isVerified 
                ? 'text-amber-500/80 hover:text-amber-400 hover:bg-amber-500/5' 
                : 'text-emerald-500/80 hover:text-emerald-400 hover:bg-emerald-500/5'
            }`}
            onClick={() => handleToggleSuspend(row)}
            title={row.isVerified ? 'Suspend User' : 'Activate User'}
          >
            {row.isVerified ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-1 px-2 border-border text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-lg flex items-center gap-1"
            onClick={() => setDeleteConfirmUser(row)}
            title="Delete User"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  const tabItems = ['All', 'Farmer', 'Buyer', 'Expert'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            User Management Panel
          </h1>
          <p className="text-gray-400 text-xs mt-1">Audit credentials, roles, statuses, and profiles.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-1.5 text-xs font-semibold py-2 px-4 rounded-xl border-border hover:bg-card"
            onClick={handleExportCSV}
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 border-b border-border/40 pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-surface border border-border/80 p-1 rounded-xl self-start">
          {tabItems.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedIds([]);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-lg shadow-primary/10'
                  : 'text-text/60 hover:text-white'
              }`}
            >
              {tab === 'All' ? 'All Roles' : `${tab}s`}
            </button>
          ))}
        </div>

        {/* Filter Input */}
        <div className="relative w-full lg:max-w-xs">
          <Search className="w-4 h-4 text-text/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border text-xs rounded-xl py-2.5 pl-9 pr-4 text-text placeholder-text/30 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Bulk Actions Header (visible when records are selected) */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-2xl"
        >
          <span className="text-xs font-bold text-primary">
            {selectedIds.length} users selected for bulk moderation
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="py-1 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 text-xs rounded-lg flex items-center gap-1"
              onClick={() => setBulkAction('delete')}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bulk Delete</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="py-1 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/25 text-xs rounded-lg flex items-center gap-1"
              onClick={() => setBulkAction('suspend')}
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Bulk Suspend</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="py-1 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 text-xs rounded-lg flex items-center gap-1"
              onClick={() => setBulkAction('activate')}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Bulk Activate</span>
            </Button>
          </div>
        </motion.div>
      )}

      {/* Users DataTable */}
      <div className="bg-card/30 border border-border/80 rounded-3xl p-6 backdrop-blur-md">
        <DataTable
          columns={columns}
          data={filteredUsers}
          isLoading={loading}
          emptyMessage="No users found matching requirements"
          defaultPageSize={10}
        />
      </div>

      {/* VIEW MODAL */}
      <Modal
        isOpen={!!viewUser}
        onClose={() => setViewUser(null)}
        title="User Account Details"
      >
        {viewUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-border/40">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                {viewUser.name[0]}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">{viewUser.name}</h3>
                <Badge className="bg-primary/10 text-primary border border-primary/20 mt-1">{viewUser.role}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-0.5">Email Address</span>
                <span className="text-white font-medium break-all">{viewUser.email}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-0.5">Phone Number</span>
                <span className="text-white font-medium">{viewUser.phone || 'Not Specified'}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-0.5">Database ID</span>
                <span className="text-white font-mono">{viewUser._id}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-0.5">Joined Date</span>
                <span className="text-white font-medium">{new Date(viewUser.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-0.5">Account Status</span>
                <span className={`font-semibold ${viewUser.isVerified ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {viewUser.isVerified ? 'Active' : 'Suspended'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button onClick={() => setViewUser(null)}>Close View</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit User Credentials"
      >
        {editUser && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl text-sm py-2 px-3 text-text focus:outline-none focus:border-primary/50"
              >
                <option value="Farmer">Farmer</option>
                <option value="Buyer">Buyer</option>
                <option value="Expert">Agriculture Expert</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
              <Button type="button" variant="outline" onClick={() => setEditUser(null)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal
        isOpen={!!deleteConfirmUser}
        onClose={() => setDeleteConfirmUser(null)}
        title="Confirm User Deletion"
      >
        {deleteConfirmUser && (
          <div className="space-y-4">
            <div className="p-3 bg-red-500/10 text-rose-400 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold">Warning: This action is permanent!</p>
                <p className="mt-1">Deleting user <strong>{deleteConfirmUser.name}</strong> will also erase their agricultural profiles, listings, and all database associations from MongoDB.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDeleteConfirmUser(null)}>
                Cancel
              </Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white border-transparent" onClick={handleDelete}>
                Delete User
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* BULK ACTION MODAL */}
      <Modal
        isOpen={!!bulkAction}
        onClose={() => setBulkAction(null)}
        title={`Confirm Bulk ${bulkAction === 'delete' ? 'Delete' : (bulkAction === 'suspend' ? 'Suspension' : 'Activation')}`}
      >
        <div className="space-y-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold">Ecosystem Moderation Request</p>
              <p className="mt-1">You are about to batch {bulkAction} <strong>{selectedIds.length}</strong> selected accounts. Confirm operation status request.</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setBulkAction(null)}>
              Cancel
            </Button>
            <Button 
              className={bulkAction === 'delete' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-primary hover:bg-primary-dark text-white'}
              onClick={handleBulkAction}
            >
              Confirm Bulk Action
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;
