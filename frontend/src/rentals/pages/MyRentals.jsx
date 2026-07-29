import React, { useState, useEffect } from 'react';
import { History, AlertCircle, XCircle, Star, Calendar } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import equipmentService from '../../services/equipmentService';
import { Button, Badge, DataTable, Modal, Textarea } from '../../components/ui';

export const MyRentals = () => {
  const { addToast } = useToast();

  const [myRentals, setMyRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review states
  const [selectedReviewEq, setSelectedReviewEq] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const data = await equipmentService.getSentRequests();
      setMyRentals(data || []);
    } catch (err) {
      console.error('Error loading my rentals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleCancel = async (id) => {
    try {
      const res = await equipmentService.cancelRequest(id);
      if (res.success) {
        addToast('Rental request cancelled successfully', 'success');
        setMyRentals(prev => prev.map(r => r._id === id ? { ...r, status: 'Cancelled' } : r));
      }
    } catch (err) {
      addToast(err.error?.message || 'Failed to cancel rental request', 'error');
    }
  };

  const handleOpenReviewModal = (equipmentId) => {
    setSelectedReviewEq(equipmentId);
    setRating(5);
    setReviewText('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedReviewEq) return;

    try {
      setSubmittingReview(true);
      const res = await equipmentService.submitReview(selectedReviewEq, {
        rating,
        review: reviewText
      });
      if (res.success) {
        addToast('Review submitted successfully! Thank you.', 'success');
        setSelectedReviewEq(null);
      }
    } catch (err) {
      addToast(err.error?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

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
      label: 'Machinery Details',
      render: (val) => (
        <div>
          <span className="font-extrabold text-white block text-xs">{val?.equipmentName || 'Machine'}</span>
          <span className="text-[10px] text-gray-500 font-semibold">Location: {val?.location}</span>
        </div>
      )
    },
    {
      key: 'owner',
      label: 'Owner / Lender',
      render: (val) => (
        <div>
          <span className="font-bold text-gray-300 block text-xs">{val?.name || 'Gurpreet Singh'}</span>
          <span className="text-[10px] text-gray-500 font-semibold">{val?.phone || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'startDate',
      label: 'Dates',
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
      label: 'Fees',
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
      render: (_, row) => {
        const showCancel = row.status === 'Pending' || row.status === 'Approved';
        const showReview = row.status === 'Completed';
        
        return (
          <div className="flex gap-2">
            {showCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancel(row._id)}
                className="flex items-center gap-1 border-red-500/25 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs font-bold"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </Button>
            )}

            {showReview && (
              <Button
                size="sm"
                onClick={() => handleOpenReviewModal(row.equipment?._id || row.equipment?.id)}
                className="flex items-center gap-1 text-xs font-bold bg-primary hover:bg-primary-dark text-white rounded-lg px-2.5 py-1"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Review</span>
              </Button>
            )}

            {!showCancel && !showReview && (
              <span className="text-[10px] text-gray-500 italic">No actions</span>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
          <History className="w-6 h-6 text-primary" /> My Rental Bookings
        </h1>
        <p className="text-xs text-text/40 font-semibold mt-1">
          Review lease history, track pending booking requests, and post reviews for machinery you rented.
        </p>
      </div>

      {/* Rentals table */}
      <div className="bg-card/30 border border-border/85 rounded-3xl p-6 backdrop-blur-md">
        <DataTable
          columns={columns}
          data={myRentals}
          isLoading={loading}
          emptyMessage="You have not requested any machinery rentals yet."
          defaultPageSize={10}
        />
      </div>

      {/* Review Submission Modal */}
      <Modal
        isOpen={!!selectedReviewEq}
        onClose={() => setSelectedReviewEq(null)}
        title="Write Machinery Review"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4 text-xs font-semibold">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-wider block">Rating Score</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setRating(val)}
                  className={`p-1 hover:scale-110 transition-transform cursor-pointer ${
                    rating >= val ? 'text-amber-400' : 'text-gray-600'
                  }`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase tracking-wider block">Detailed Review</label>
            <textarea
              required
              rows="4"
              placeholder="What did you like or dislike about the machinery? Was it clean, fueled, and fully working?"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl py-2 px-3 text-text placeholder-text/30 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedReviewEq(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submittingReview}
              className="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2"
            >
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
