import React, { useState, useEffect } from 'react';
import { ShoppingBag, MapPin, DollarSign, ClipboardList, CheckCircle, Search } from 'lucide-react';
import adminService from '../../services/adminService';
import { DataTable, Button, Modal, Badge } from '../../components/ui';

export const AdminBuyers = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        setLoading(true);
        const data = await adminService.getBuyers();
        setBuyers(data || []);
      } catch (err) {
        console.error('Error fetching buyers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyers();
  }, []);

  const filteredBuyers = buyers.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      label: 'Buyer Name',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-xs uppercase">
            {row.name[0]}
          </div>
          <div>
            <span className="font-bold text-white block">{row.name}</span>
            <span className="text-[10px] text-gray-500 block font-mono">{row.email}</span>
          </div>
        </div>
      )
    },
    { key: 'businessName', label: 'Company Name', sortable: true },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <span>{val}</span>
        </div>
      )
    },
    { key: 'purchaseCapacity', label: 'Purchase Capacity', sortable: true },
    { key: 'ordersCount', label: 'Completed Orders', sortable: true },
    {
      key: 'actions',
      label: 'Details',
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-border text-gray-400 hover:text-white rounded-lg text-xs"
          onClick={() => setSelectedBuyer(row)}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>View Buyer Profile</span>
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-sky-400" />
            Buyer Directory
          </h1>
          <p className="text-gray-400 text-xs mt-1">Audit purchasing agencies, verified corporate bulk traders, and location details.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-text/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search buyers name, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border text-xs rounded-xl py-2.5 pl-9 pr-4 text-text placeholder-text/30 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-card/30 border border-border/80 rounded-3xl p-6 backdrop-blur-md">
        <DataTable
          columns={columns}
          data={filteredBuyers}
          isLoading={loading}
          emptyMessage="No registered buyer profiles match query"
          defaultPageSize={10}
        />
      </div>

      {/* DETAILED VIEW MODAL */}
      <Modal
        isOpen={!!selectedBuyer}
        onClose={() => setSelectedBuyer(null)}
        title="Buyer Corporate Profile"
      >
        {selectedBuyer && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 pb-4 border-b border-border/40">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 text-xl font-bold">
                {selectedBuyer.name[0]}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">{selectedBuyer.name}</h3>
                <span className="text-gray-400 font-medium block mt-0.5">{selectedBuyer.email}</span>
                <span className="text-gray-500 font-mono block mt-0.5">ID: {selectedBuyer.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Corporate Entity
                </span>
                <span className="text-white text-sm font-bold">{selectedBuyer.businessName}</span>
              </div>
              <div className="space-y-1">
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Primary Office Hub
                </span>
                <span className="text-white text-sm font-bold">{selectedBuyer.location}</span>
              </div>
              <div className="space-y-1">
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  Ecosystem Spend Limit
                </span>
                <span className="text-white text-sm font-bold">{selectedBuyer.purchaseCapacity}</span>
              </div>
              <div className="space-y-1">
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <ClipboardList className="w-3.5 h-3.5" />
                  Completed Transactions
                </span>
                <span className="text-white text-sm font-bold">{selectedBuyer.ordersCount} Trades</span>
              </div>
            </div>

            <div className="border-t border-border/40 pt-3 space-y-2">
              <h4 className="font-bold text-white text-[10px] uppercase tracking-wider">GST Compliance Verification</h4>
              <div className="p-3 bg-surface border border-border/40 rounded-xl flex items-center justify-between">
                <div>
                  <span className="block text-gray-500 font-bold uppercase tracking-wider text-[8px] mb-0.5">GST Identification Number</span>
                  <span className="text-white font-mono font-bold text-sm">06AAAAC1234H1Z5</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>GSTIN ACTIVE</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
              <Button onClick={() => setSelectedBuyer(null)}>Close Profile</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminBuyers;
