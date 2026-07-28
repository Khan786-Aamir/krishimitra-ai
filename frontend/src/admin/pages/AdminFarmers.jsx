import React, { useState, useEffect } from 'react';
import { Sprout, MapPin, Layers, Award, FileText, CheckCircle, Search } from 'lucide-react';
import adminService from '../../services/adminService';
import { DataTable, Button, Modal, Badge } from '../../components/ui';

export const AdminFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setLoading(true);
        const data = await adminService.getFarmers();
        setFarmers(data || []);
      } catch (err) {
        console.error('Error fetching farmers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  const filteredFarmers = farmers.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      label: 'Farmer Name',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
            {row.name[0]}
          </div>
          <div>
            <span className="font-bold text-white block">{row.name}</span>
            <span className="text-[10px] text-gray-500 block font-mono">{row.email}</span>
          </div>
        </div>
      )
    },
    { key: 'farmSize', label: 'Farm Size', sortable: true },
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
    {
      key: 'cropTypes',
      label: 'Primary Crops',
      render: (val) => (
        <div className="flex flex-wrap gap-1">
          {val.map((crop, idx) => (
            <Badge key={idx} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
              {crop}
            </Badge>
          ))}
        </div>
      )
    },
    {
      key: 'isVerified',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <Badge className={val ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}>
          {val ? 'Verified Farmer' : 'Unverified'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Details',
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-border text-gray-400 hover:text-white rounded-lg text-xs"
          onClick={() => setSelectedFarmer(row)}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View Farm Profile</span>
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
            <Sprout className="w-6 h-6 text-emerald-400" />
            Farmer Directory
          </h1>
          <p className="text-gray-400 text-xs mt-1">Audit agriculture farm profiles, verification states, locations, and crop records.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-text/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search farmers name, location..."
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
          data={filteredFarmers}
          isLoading={loading}
          emptyMessage="No registered farmer profiles match query"
          defaultPageSize={10}
        />
      </div>

      {/* DETAILED VIEW MODAL */}
      <Modal
        isOpen={!!selectedFarmer}
        onClose={() => setSelectedFarmer(null)}
        title="Farmer Ecosystem Profile"
      >
        {selectedFarmer && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 pb-4 border-b border-border/40">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-primary text-xl font-bold">
                {selectedFarmer.name[0]}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">{selectedFarmer.name}</h3>
                <span className="text-gray-400 font-medium block mt-0.5">{selectedFarmer.email}</span>
                <span className="text-gray-500 font-mono block mt-0.5">ID: {selectedFarmer.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  Farm Size (Acres)
                </span>
                <span className="text-white text-sm font-bold">{selectedFarmer.farmSize}</span>
              </div>
              <div className="space-y-1">
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Registered Location
                </span>
                <span className="text-white text-sm font-bold">{selectedFarmer.location}</span>
              </div>
              <div className="space-y-1">
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verification Credentials
                </span>
                <span className={`text-sm font-bold ${selectedFarmer.isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedFarmer.isVerified ? 'Fully Verified' : 'Pending Verification'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Experience Tier
                </span>
                <span className="text-white text-sm font-bold">Senior Cultivator (14+ yrs)</span>
              </div>
            </div>

            <div className="border-t border-border/40 pt-3 space-y-2">
              <h4 className="font-bold text-white text-[10px] uppercase tracking-wider">Cultivated Crop Species</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedFarmer.cropTypes.map((crop, idx) => (
                  <Badge key={idx} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-1 px-2.5 rounded-lg text-[10px]">
                    {crop}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border-t border-border/40 pt-3 space-y-2">
              <h4 className="font-bold text-white text-[10px] uppercase tracking-wider text-rose-400">Diagnosis History Reports</h4>
              <div className="space-y-1.5">
                {selectedFarmer.diseaseHistory.map((disease, idx) => (
                  <div key={idx} className="flex justify-between p-2 bg-surface rounded-lg border border-border/40">
                    <span className="text-text/80 font-medium">{disease}</span>
                    <span className="text-rose-400 font-semibold uppercase text-[9px]">Resolved</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
              <Button onClick={() => setSelectedFarmer(null)}>Close Details</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminFarmers;
