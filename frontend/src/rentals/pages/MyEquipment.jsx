import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, Plus, Wrench, Edit, Trash2, ShieldCheck, AlertCircle, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import equipmentService from '../../services/equipmentService';
import { Button, Badge, DataTable, Loader, ConfirmationDialog } from '../../components/ui';

export const MyEquipment = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [myFleet, setMyFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchFleet = async () => {
    try {
      setLoading(true);
      const data = await equipmentService.getMyEquipment();
      setMyFleet(data || []);
    } catch (err) {
      console.error('Error loading fleet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  const handleToggleActive = async (id, currentActive) => {
    try {
      const res = await equipmentService.updateEquipmentStatus(id, { isActive: !currentActive });
      if (res.success) {
        addToast(`Listing successfully ${!currentActive ? 'Activated' : 'Deactivated'}`, 'success');
        setMyFleet(prev => prev.map(item => item._id === id ? { ...item, isActive: !currentActive } : item));
      }
    } catch (err) {
      addToast('Failed to update listing state', 'error');
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Available' ? 'Unavailable' : 'Available';
    try {
      const res = await equipmentService.updateEquipmentStatus(id, { availabilityStatus: nextStatus });
      if (res.success) {
        addToast(`Availability updated to ${nextStatus}`, 'success');
        setMyFleet(prev => prev.map(item => item._id === id ? { ...item, availabilityStatus: nextStatus } : item));
      }
    } catch (err) {
      addToast('Failed to update availabilityStatus', 'error');
    }
  };

  const handleDeleteTrigger = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await equipmentService.deleteEquipment(selectedId);
      addToast('Listing deleted successfully', 'success');
      setMyFleet(prev => prev.filter(item => item._id !== selectedId));
    } catch (err) {
      addToast('Failed to delete equipment listing', 'error');
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  const columns = [
    {
      key: 'equipmentName',
      label: 'Machinery Name',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-border bg-surface">
            <img
              src={row.images && row.images.length > 0 ? row.images[0].url : 'https://images.unsplash.com/photo-1595275313093-f112e07c371a?auto=format&fit=crop&q=80&w=150'}
              alt={val}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-extrabold text-white block text-xs">{val}</span>
            <span className="text-[10px] text-gray-500 font-semibold">{row.category}</span>
          </div>
        </div>
      )
    },
    {
      key: 'rentalPricePerDay',
      label: 'Rate / Day',
      sortable: true,
      render: (val) => <span className="font-bold text-primary text-xs">₹{val?.toLocaleString()}</span>
    },
    {
      key: 'availabilityStatus',
      label: 'Availability',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <Badge className={
            val === 'Available'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : (val === 'Booked' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20')
          }>
            {val}
          </Badge>
          {val !== 'Booked' && (
            <button
              onClick={() => handleToggleAvailability(row._id, val)}
              className="text-[10px] font-bold text-gray-400 hover:text-white border border-border/80 px-2 py-1 rounded-lg bg-surface/50 hover:bg-surface cursor-pointer"
            >
              Toggle
            </button>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Admin Status',
      sortable: true,
      render: (val) => (
        <Badge className={
          val === 'Approved'
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : (val === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20')
        }>
          {val}
        </Badge>
      )
    },
    {
      key: 'isActive',
      label: 'Listing Active',
      sortable: true,
      render: (val, row) => (
        <button
          onClick={() => handleToggleActive(row._id, val)}
          className="text-text/70 hover:text-white transition-colors cursor-pointer"
        >
          {val ? (
            <ToggleRight className="w-8 h-8 text-primary" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-gray-500" />
          )}
        </button>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/rentals/edit-equipment/${row._id}`)}
            className="flex items-center gap-1 border-border text-gray-400 hover:text-white rounded-lg text-xs"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteTrigger(row._id)}
            className="flex items-center gap-1 border-red-500/20 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
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
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            <Tractor className="w-6 h-6 text-primary" /> My Machinery Fleet
          </h1>
          <p className="text-xs text-text/40 font-semibold mt-1">
            Manage your listed vehicles, modify rates, and toggle availability.
          </p>
        </div>

        <Button onClick={() => navigate('/rentals/add-equipment')} className="flex items-center gap-1.5 text-xs font-bold py-2.5 rounded-xl shadow-lg shadow-primary/10">
          <Plus className="w-4 h-4" /> Add Equipment
        </Button>
      </div>

      {/* Fleet list */}
      <div className="bg-card/30 border border-border/85 rounded-3xl p-6 backdrop-blur-md">
        <DataTable
          columns={columns}
          data={myFleet}
          isLoading={loading}
          emptyMessage="You have not listed any equipment for lease yet."
          defaultPageSize={10}
        />
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Equipment Listing"
        message="Are you sure you want to permanently delete this equipment listing? This action cannot be undone and will delete related requests and reviews."
      />
    </div>
  );
};
