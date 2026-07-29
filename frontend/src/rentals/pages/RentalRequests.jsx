import React, { useState, useEffect } from 'react';
import { Inbox, Search, AlertCircle, FileText, CheckCircle, XCircle, Play } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import equipmentService from '../../services/equipmentService';
import { Button, Badge, DataTable, Modal, Textarea } from '../../components/ui';

export const RentalRequests = () => {
  const { addToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal actions
  const [selectedReq, setSelectedReq] = useState(null);
  const [actionType, setActionType] = useState(''); // 'approve', 'reject', 'details'
  const [ownerNotes, setOwnerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await equipmentService.getReceivedRequests();
      setRequests(data || []);
    } catch (err) {
      console.error('Error loading received requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleActionClick = (req, type) => {
    setSelectedReq(req);
    setActionType(type);
    setOwnerNotes(req.ownerNotes || '');
  };

  const handleActionConfirm = async () => {
    if (!selectedReq) return;

    try {
      setSubmitting(true);
      if (actionType === 'approve') {
        const res = await equipmentService.approveRequest(selectedReq._id, ownerNotes);
        if (res.success) {
          addToast('Rental request approved successfully!', 'success');
          setRequests(prev => prev.map(r => r._id === selectedReq._id ? { ...r, status: 'Approved', approvedAt: new Date(), ownerNotes } : r));
        }
      } else if (actionType === 'reject') {
        const res = await equipmentService.rejectRequest(selectedReq._id, ownerNotes);
        if (res.success) {
          addToast('Rental request rejected.', 'success');
          setRequests(prev => prev.map(r => r._id === selectedReq._id ? { ...r, status: 'Rejected', ownerNotes } : r));
        }
      } else if (actionType === 'complete') {
        const res = await equipmentService.completeRequest(selectedReq._id);
        if (res.success) {
          addToast('Rental marked as Completed!', 'success');
          setRequests(prev => prev.map(r => r._id === selectedReq._id ? { ...r, status: 'Completed', completedAt: new Date() } : r));
        }
      }
    } catch (err) {
      addToast(err.error?.message || 'Failed to perform request action', 'error');
    } finally {
      setSubmitting(false);
      setSelectedReq(null);
      setActionType('');
      setOwnerNotes('');
    }
  };

  // Filter requests
  const filteredRequests = requests.filter(req => {
    const matchesSearch =
      (req.equipment?.equipmentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.renter?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const badgeColors = {
    Pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    Approved: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    Rejected: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    Completed: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    Cancelled: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
    Expired: 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
  };

  const columns = [
    {
      key: 'equipment',
      label: 'Equipment Details',
      render: (val) => (
        <div>
          <span className="font-extrabold text-white block text-xs">{val?.equipmentName || 'Machine'}</span>
          <span className="text-[10px] text-gray-500 font-semibold">Rate: ₹{val?.rentalPricePerDay?.toLocaleString()}/day</span>
        </div>
      )
    },
    {
      key: 'renter',
      label: 'Renter Farmer',
      render: (val) => (
        <div>
          <span className="font-bold text-gray-300 block text-xs">{val?.name || 'Gurpreet Singh'}</span>
          <span className="text-[10px] text-gray-500 font-semibold">{val?.phone || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'startDate',
      label: 'Rental Duration',
      render: (_, row) => {
        const start = new Date(row.startDate).toLocaleDateString();
        const end = new Date(row.endDate).toLocaleDateString();
        return (
          <div>
            <span className="text-white block text-xs">{start} - {end}</span>
            <span className="text-[10px] text-primary font-bold">{row.numberOfDays} Days Lease</span>
          </div>
        );
      }
    },
    {
      key: 'totalAmount',
      label: 'Est. Revenue',
      render: (val, row) => (
        <div>
          <span className="font-black text-emerald-400 block text-xs">₹{val?.toLocaleString()}</span>
          <span className="text-[9px] text-gray-500 font-semibold">Deposit: ₹{row.securityDeposit}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <Badge className={badgeColors[val] || badgeColors.Pending}>
          {val}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleActionClick(row, 'details')}
            className="flex items-center gap-1 border-border text-gray-400 hover:text-white rounded-lg text-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit</span>
          </Button>

          {row.status === 'Pending' && (
            <>
              <button
                onClick={() => handleActionClick(row, 'approve')}
                className="p-1 px-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-lg transition-all text-xs font-bold"
              >
                Approve
              </button>
              <button
                onClick={() => handleActionClick(row, 'reject')}
                className="p-1 px-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg transition-all text-xs font-bold"
              >
                Reject
              </button>
            </>
          )}

          {row.status === 'Approved' && (
            <button
              onClick={() => handleActionClick(row, 'complete')}
              className="p-1 px-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 rounded-lg transition-all text-xs font-bold"
            >
              Complete
            </button>
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
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            <Inbox className="w-6 h-6 text-primary" /> Lease Requests Received
          </h1>
          <p className="text-xs text-text/40 font-semibold mt-1">
            Audit and approve peer-to-peer heavy machinery reservations requested by regional farmers.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-text/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search renter name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-card border border-border text-xs rounded-xl focus:outline-none text-text focus:border-primary/45 w-full sm:w-48"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-card border border-border text-xs rounded-xl py-2 px-3 text-text focus:outline-none focus:border-primary/45"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Requests table */}
      <div className="bg-card/30 border border-border/85 rounded-3xl p-6 backdrop-blur-md">
        <DataTable
          columns={columns}
          data={filteredRequests}
          isLoading={loading}
          emptyMessage="No received rental requests match criteria."
          defaultPageSize={10}
        />
      </div>

      {/* Action / Detail Modal */}
      <Modal
        isOpen={!!selectedReq}
        onClose={() => {
          setSelectedReq(null);
          setActionType('');
        }}
        title={
          actionType === 'approve'
            ? 'Approve Rental Booking'
            : actionType === 'reject'
            ? 'Reject Rental Booking'
            : 'Rental Booking Audit Details'
        }
      >
        {selectedReq && (
          <div className="space-y-4 text-xs font-semibold">
            {/* Header info */}
            <div className="flex items-center gap-3 pb-3 border-b border-border/40">
              <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary shrink-0">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-extrabold">{selectedReq.equipment?.equipmentName}</h4>
                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Rented by: {selectedReq.renter?.name}</p>
              </div>
            </div>

            {/* Dates grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-gray-500 text-[9px] uppercase tracking-wider font-bold">Start Date</span>
                <span className="text-white text-xs">{new Date(selectedReq.startDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-[9px] uppercase tracking-wider font-bold">End Date</span>
                <span className="text-white text-xs">{new Date(selectedReq.endDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-[9px] uppercase tracking-wider font-bold">Total Duration</span>
                <span className="text-primary text-xs">{selectedReq.numberOfDays} Days Lease</span>
              </div>
              <div>
                <span className="block text-gray-500 text-[9px] uppercase tracking-wider font-bold">Est. Earnings</span>
                <span className="text-emerald-400 text-xs font-black">₹{selectedReq.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Notes */}
            <div className="p-3 bg-surface/80 border border-border/60 rounded-xl space-y-1">
              <span className="block text-gray-500 text-[9px] uppercase tracking-wider font-bold">Purpose of Booking</span>
              <p className="text-gray-300 font-semibold">{selectedReq.purpose || 'Not provided'}</p>
            </div>

            {selectedReq.message && (
              <div className="p-3 bg-surface/80 border border-border/60 rounded-xl space-y-1">
                <span className="block text-gray-500 text-[9px] uppercase tracking-wider font-bold">Message from Renter</span>
                <p className="text-gray-300 font-semibold">{selectedReq.message}</p>
              </div>
            )}

            {selectedReq.renterNotes && (
              <div className="p-3 bg-surface/80 border border-border/60 rounded-xl space-y-1">
                <span className="block text-gray-500 text-[9px] uppercase tracking-wider font-bold">Renter Handover Notes</span>
                <p className="text-gray-300 font-semibold">{selectedReq.renterNotes}</p>
              </div>
            )}

            {/* Action Text Area */}
            {(actionType === 'approve' || actionType === 'reject') && (
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider">Owner Notes (Handover/Pickup details)</label>
                <textarea
                  rows="3"
                  placeholder="Provide instructions on pickup location, fuel status, or required documents..."
                  value={ownerNotes}
                  onChange={(e) => setOwnerNotes(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl py-2 px-3 text-text placeholder-text/30 focus:outline-none"
                />
              </div>
            )}

            {actionType === 'details' && selectedReq.ownerNotes && (
              <div className="p-3 bg-surface/80 border border-border/60 rounded-xl space-y-1">
                <span className="block text-gray-500 text-[9px] uppercase tracking-wider font-bold">Your Handover Instructions</span>
                <p className="text-gray-300 font-semibold">{selectedReq.ownerNotes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedReq(null);
                  setActionType('');
                }}
              >
                Close
              </Button>
              {actionType === 'approve' && (
                <Button
                  onClick={handleActionConfirm}
                  disabled={submitting}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2"
                >
                  Confirm Approval
                </Button>
              )}
              {actionType === 'reject' && (
                <Button
                  onClick={handleActionConfirm}
                  disabled={submitting}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2"
                >
                  Confirm Rejection
                </Button>
              )}
              {actionType === 'complete' && (
                <Button
                  onClick={handleActionConfirm}
                  disabled={submitting}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-4 py-2"
                >
                  Complete Rental
                </Button>
              )}
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
};
