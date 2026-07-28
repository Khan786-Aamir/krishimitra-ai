import React, { useState, useEffect } from 'react';
import { Wrench, CheckCircle, XCircle, FileText, Search, User } from 'lucide-react';
import adminService from '../../services/adminService';
import { DataTable, Button, Modal, Badge } from '../../components/ui';

export const AdminEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const data = await adminService.getEquipment();
      setEquipment(data || []);
    } catch (err) {
      console.error('Error loading equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await adminService.verifyRental(id, status);
      setEquipment(prev => prev.map(item => item.id === id ? { ...item, status } : item));
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEquipment = equipment.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: 'name', label: 'Equipment Name', sortable: true },
    { key: 'owner', label: 'Owner Farmer', sortable: true },
    { key: 'price', label: 'Lease Rate', sortable: true },
    {
      key: 'availability',
      label: 'Availability',
      sortable: true,
      render: (val) => (
        <Badge className={val === 'Available' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}>
          {val}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Listing Verification',
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
    { key: 'requests', label: 'Active Bookings', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-border text-gray-400 hover:text-white rounded-lg text-xs"
            onClick={() => setSelectedItem(row)}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit</span>
          </Button>
          {row.status === 'Pending' && (
            <>
              <button
                className="p-1 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-lg transition-all text-xs font-bold"
                onClick={() => handleAction(row.id, 'Approved')}
              >
                Approve
              </button>
              <button
                className="p-1 px-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg transition-all text-xs font-bold"
                onClick={() => handleAction(row.id, 'Rejected')}
              >
                Reject
              </button>
            </>
          )}
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
            <Wrench className="w-6 h-6 text-primary" />
            Equipment Leases oversight
          </h1>
          <p className="text-gray-400 text-xs mt-1">Audit listing credentials for peer-to-peer heavy farming implements and tractors.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-text/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search machinery name..."
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
          data={filteredEquipment}
          isLoading={loading}
          emptyMessage="No equipment listings match filters"
          defaultPageSize={10}
        />
      </div>

      {/* AUDIT VIEW MODAL */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Equipment Rental Audit"
      >
        {selectedItem && (
          <div className="space-y-4 text-xs">
            <div className="pb-3 border-b border-border/40 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">{selectedItem.name}</h3>
                <span className="text-gray-500 font-medium block mt-0.5">Offered for lease by {selectedItem.owner}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Lease Rates</span>
                <span className="text-white text-sm font-bold">{selectedItem.price}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Availability State</span>
                <span className="text-white text-sm font-bold">{selectedItem.availability}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Pending Booking Requests</span>
                <span className="text-white text-sm font-bold">{selectedItem.requests} Bookings</span>
              </div>
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Auditing Status</span>
                <span className={`text-sm font-bold ${
                  selectedItem.status === 'Approved' ? 'text-emerald-400' : (selectedItem.status === 'Rejected' ? 'text-rose-400' : 'text-amber-400')
                }`}>
                  {selectedItem.status}
                </span>
              </div>
            </div>

            <div className="p-3 bg-surface/50 border border-border/40 rounded-xl">
              <h4 className="font-bold text-white text-[9px] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <User className="w-3.5 h-3.5 text-primary" />
                Ownership Diagnostics
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Confirm vehicle registration details, proof of insurance documentation, and safety test signatures are linked inside the farmer's inventory files before authorization.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
              <div className="flex gap-2 mr-auto">
                {selectedItem.status === 'Pending' && (
                  <>
                    <Button
                      className="bg-emerald-500 hover:bg-emerald-600 text-white border-transparent"
                      onClick={() => handleAction(selectedItem.id, 'Approved')}
                    >
                      Approve Listing
                    </Button>
                    <Button
                      className="bg-rose-500 hover:bg-rose-600 text-white border-transparent"
                      onClick={() => handleAction(selectedItem.id, 'Rejected')}
                    >
                      Reject Listing
                    </Button>
                  </>
                )}
              </div>
              <Button variant="outline" onClick={() => setSelectedItem(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminEquipment;
