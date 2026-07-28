import React, { useState, useEffect } from 'react';
import { Award, Plus, Edit2, Trash2, Calendar, Link as LinkIcon, Search } from 'lucide-react';
import adminService from '../../services/adminService';
import { DataTable, Button, Modal, Input, Textarea, Badge } from '../../components/ui';

export const AdminSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editScheme, setEditScheme] = useState(null);
  const [deleteConfirmScheme, setDeleteConfirmScheme] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [benefit, setBenefit] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [category, setCategory] = useState('Subsidy');
  const [status, setStatus] = useState('Active');
  const [expiryDate, setExpiryDate] = useState('');
  const [detailsLink, setDetailsLink] = useState('');

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSchemes();
      setSchemes(data || []);
    } catch (err) {
      console.error('Error fetching schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('');
    setBenefit('');
    setEligibility('');
    setCategory('Subsidy');
    setStatus('Active');
    setExpiryDate('');
    setDetailsLink('');
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.createScheme({
        title,
        description,
        type,
        benefit,
        eligibility,
        category,
        status,
        expiryDate: expiryDate || undefined,
        detailsLink
      });
      setShowAddModal(false);
      resetForm();
      fetchSchemes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditOpen = (scheme) => {
    setEditScheme(scheme);
    setTitle(scheme.title);
    setDescription(scheme.description);
    setType(scheme.type || '');
    setBenefit(scheme.benefit || '');
    setEligibility(scheme.eligibility || '');
    setCategory(scheme.category);
    setStatus(scheme.status || 'Active');
    setExpiryDate(scheme.expiryDate ? new Date(scheme.expiryDate).toISOString().split('T')[0] : '');
    setDetailsLink(scheme.detailsLink || '');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateScheme(editScheme._id || editScheme.id, {
        title,
        description,
        type,
        benefit,
        eligibility,
        category,
        status,
        expiryDate: expiryDate || undefined,
        detailsLink
      });
      setEditScheme(null);
      resetForm();
      fetchSchemes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteScheme(deleteConfirmScheme._id || deleteConfirmScheme.id);
      setDeleteConfirmScheme(null);
      fetchSchemes();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSchemes = schemes.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'title',
      label: 'Scheme Directives',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-bold text-white block text-sm">{row.title}</span>
          <span className="text-[10px] text-gray-500 block max-w-sm truncate mt-0.5">{row.description}</span>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (val) => (
        <Badge className={
          val === 'Subsidy' ? 'bg-primary/10 text-primary border border-primary/20' :
          (val === 'Insurance' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
          (val === 'Equipment' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'))
        }>
          {val}
        </Badge>
      )
    },
    { key: 'benefit', label: 'Ecosystem Benefit' },
    { key: 'eligibility', label: 'Eligibility Standard' },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <Badge className={val === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}>
          {val || 'Active'}
        </Badge>
      )
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
            onClick={() => handleEditOpen(row)}
            title="Edit Directive"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-1 px-2 border-border text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-lg flex items-center gap-1"
            onClick={() => setDeleteConfirmScheme(row)}
            title="Delete Directive"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            Government Directives Manager
          </h1>
          <p className="text-gray-400 text-xs mt-1">Publish capital subsidies, low interest loans, crop insurances, or advisories.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            className="flex items-center gap-1.5 text-xs font-semibold py-2 px-4 rounded-xl shadow-lg shadow-primary/10 w-full sm:w-auto justify-center"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Directive</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
          <span>Active catalog list</span>
        </div>
        
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-text/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scheme name, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border text-xs rounded-xl py-2.5 pl-9 pr-4 text-text placeholder-text/30 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Grid listing */}
      <div className="bg-card/30 border border-border/80 rounded-3xl p-6 backdrop-blur-md">
        <DataTable
          columns={columns}
          data={filteredSchemes}
          isLoading={loading}
          emptyMessage="No government scheme directives match query"
          defaultPageSize={10}
        />
      </div>

      {/* ADD SCHEME MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Publish New Government Scheme"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <Input
            label="Scheme Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Kisan Samman Nidhi Yojana"
          />
          <Textarea
            label="Scheme description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            placeholder="Enter full details of the scheme directive..."
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Type / Classification"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g. Capital Subsidy"
            />
            <Input
              label="Ecosystem Benefit"
              value={benefit}
              onChange={(e) => setBenefit(e.target.value)}
              placeholder="e.g. ₹6,000 per year"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Eligibility Standards"
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              placeholder="e.g. All landholding families"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl text-sm py-2 px-3 text-text focus:outline-none focus:border-primary/50"
              >
                <option value="Subsidy">Subsidy</option>
                <option value="Insurance">Insurance</option>
                <option value="Equipment">Equipment</option>
                <option value="Finance">Finance</option>
                <option value="Advisory">Advisory</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
            <Input
              label="Government Portal Link"
              value={detailsLink}
              onChange={(e) => setDetailsLink(e.target.value)}
              placeholder="https://example.gov.in"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
            <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Publish Scheme
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT SCHEME MODAL */}
      <Modal
        isOpen={!!editScheme}
        onClose={() => setEditScheme(null)}
        title="Edit Scheme Directive"
      >
        {editScheme && (
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <Input
              label="Scheme Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              label="Scheme description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Type / Classification"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
              <Input
                label="Ecosystem Benefit"
                value={benefit}
                onChange={(e) => setBenefit(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Eligibility Standards"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl text-sm py-2 px-3 text-text focus:outline-none focus:border-primary/50"
                >
                  <option value="Subsidy">Subsidy</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Finance">Finance</option>
                  <option value="Advisory">Advisory</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
              <Input
                label="Government Portal Link"
                value={detailsLink}
                onChange={(e) => setDetailsLink(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Publish Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl text-sm py-2 px-3 text-text focus:outline-none focus:border-primary/50"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
              <Button type="button" variant="outline" onClick={() => setEditScheme(null)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Directives
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal
        isOpen={!!deleteConfirmScheme}
        onClose={() => setDeleteConfirmScheme(null)}
        title="Confirm Scheme Deletion"
      >
        {deleteConfirmScheme && (
          <div className="space-y-4">
            <div className="text-xs text-gray-400">
              <p>Are you sure you want to delete the government scheme <strong>{deleteConfirmScheme.title}</strong>?</p>
              <p className="mt-1">This will erase it from the platform index and make it unavailable for farmers.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDeleteConfirmScheme(null)}>
                Cancel
              </Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white border-transparent" onClick={handleDelete}>
                Delete Scheme
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminSchemes;
