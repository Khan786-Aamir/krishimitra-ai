import React, { useState, useEffect } from 'react';
import { Star, ShieldAlert, Award, FileText, CheckCircle, XCircle, Search } from 'lucide-react';
import adminService from '../../services/adminService';
import { DataTable, Button, Modal, Badge } from '../../components/ui';

export const AdminExperts = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [verifyActionExpert, setVerifyActionExpert] = useState(null); // { expert, action: 'Approve' | 'Reject' }

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const data = await adminService.getExperts();
      setExperts(data || []);
    } catch (err) {
      console.error('Error fetching experts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const handleVerify = async () => {
    try {
      await adminService.verifyExpert(verifyActionExpert.expert.id, verifyActionExpert.action);
      setVerifyActionExpert(null);
      setSelectedExpert(null);
      fetchExperts();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredExperts = experts.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      label: 'Expert Name',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-xs uppercase">
            {row.name[0]}
          </div>
          <div>
            <span className="font-bold text-white block">{row.name}</span>
            <span className="text-[10px] text-gray-500 block font-mono">{row.email}</span>
          </div>
        </div>
      )
    },
    { key: 'qualification', label: 'Qualification', sortable: true },
    { key: 'specialization', label: 'Specialization', sortable: true },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-1 font-bold text-amber-400">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{val}</span>
        </div>
      )
    },
    { key: 'consultationsCount', label: 'Consultations', sortable: true },
    {
      key: 'isVerified',
      label: 'Verification',
      sortable: true,
      render: (val) => (
        <Badge className={val ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}>
          {val ? 'Certified Expert' : 'Pending Review'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-border text-gray-400 hover:text-white rounded-lg text-xs"
            onClick={() => setSelectedExpert(row)}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Profile</span>
          </Button>
          {!row.isVerified ? (
            <Button
              variant="outline"
              size="sm"
              className="py-1 px-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs rounded-lg font-bold"
              onClick={() => setVerifyActionExpert({ expert: row, action: 'Approve' })}
            >
              Verify
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="py-1 px-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs rounded-lg font-bold"
              onClick={() => setVerifyActionExpert({ expert: row, action: 'Reject' })}
            >
              Revoke
            </Button>
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
            <Award className="w-6 h-6 text-amber-400" />
            Agriculture Advisory Panel
          </h1>
          <p className="text-gray-400 text-xs mt-1">Verify agricultural researchers, agronomists, and disease analysts.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-text/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search experts name, specialization..."
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
          data={filteredExperts}
          isLoading={loading}
          emptyMessage="No registered expert profiles match query"
          defaultPageSize={10}
        />
      </div>

      {/* DETAILED VIEW MODAL */}
      <Modal
        isOpen={!!selectedExpert}
        onClose={() => setSelectedExpert(null)}
        title="Expert Advisory Profile"
      >
        {selectedExpert && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 pb-4 border-b border-border/40">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-xl font-bold">
                {selectedExpert.name[0]}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">{selectedExpert.name}</h3>
                <span className="text-gray-400 font-medium block mt-0.5">{selectedExpert.email}</span>
                <span className="text-gray-500 font-mono block mt-0.5">ID: {selectedExpert.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Highest Degree
                </span>
                <span className="text-white text-sm font-bold">{selectedExpert.qualification}</span>
              </div>
              <div className="space-y-1">
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  Granting Institute
                </span>
                <span className="text-white text-sm font-bold">{selectedExpert.institute}</span>
              </div>
              <div className="space-y-1">
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Experience Tier
                </span>
                <span className="text-white text-sm font-bold">{selectedExpert.experience}</span>
              </div>
              <div className="space-y-1">
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" />
                  Ecosystem Rating
                </span>
                <span className="text-white text-sm font-bold text-amber-400 flex items-center gap-0.5">
                  ★ {selectedExpert.rating} ({selectedExpert.consultationsCount} Reviews)
                </span>
              </div>
            </div>

            <div className="border-t border-border/40 pt-3 space-y-2">
              <h4 className="font-bold text-white text-[10px] uppercase tracking-wider">Expert Specializations</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedExpert.specialization.split(',').map((spec, idx) => (
                  <Badge key={idx} className="bg-amber-500/10 text-amber-400 border border-amber-500/20 py-1 px-2.5 rounded-lg text-[10px]">
                    {spec.trim()}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border-t border-border/40 pt-4 flex justify-between items-center">
              <div className="flex gap-2">
                {!selectedExpert.isVerified ? (
                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white border-transparent"
                    onClick={() => setVerifyActionExpert({ expert: selectedExpert, action: 'Approve' })}
                  >
                    Approve Expert
                  </Button>
                ) : (
                  <Button
                    className="bg-rose-500 hover:bg-rose-600 text-white border-transparent"
                    onClick={() => setVerifyActionExpert({ expert: selectedExpert, action: 'Reject' })}
                  >
                    Revoke Verification
                  </Button>
                )}
              </div>
              <Button variant="outline" onClick={() => setSelectedExpert(null)}>Close Profile</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* VERIFY CONFIRM MODAL */}
      <Modal
        isOpen={!!verifyActionExpert}
        onClose={() => setVerifyActionExpert(null)}
        title="Expert Verification Review"
      >
        {verifyActionExpert && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Ecosystem Verification Request</p>
                <p className="mt-1">
                  Are you sure you want to <strong>{verifyActionExpert.action === 'Approve' ? 'Approve' : 'Revoke'}</strong> verification for <strong>{verifyActionExpert.expert.name}</strong>?
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setVerifyActionExpert(null)}>
                Cancel
              </Button>
              <Button
                className={verifyActionExpert.action === 'Approve' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-rose-500 hover:bg-rose-600 text-white'}
                onClick={handleVerify}
              >
                Confirm {verifyActionExpert.action === 'Approve' ? 'Approve' : 'Revoke'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminExperts;
