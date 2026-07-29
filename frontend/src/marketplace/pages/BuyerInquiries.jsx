import React, { useState, useEffect } from 'react';
import { Inbox, CheckCircle, XCircle, Clock, ShieldAlert, Phone, RefreshCw, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import marketplaceService from '../../services/marketplaceService';
import { DataTable, Button, Modal, Badge } from '../../components/ui';

export const BuyerInquiries = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const isFarmer = user?.role === 'Farmer';

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const data = await marketplaceService.getInquiries();
      setInquiries(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await marketplaceService.updateInquiryStatus(id, status);
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      key: 'listing',
      label: 'Target Crop Batch',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-white block truncate max-w-[150px]">
          {val?.name || 'Crop Listing'}
        </span>
      )
    },
    {
      key: isFarmer ? 'buyerName' : 'farmer',
      label: isFarmer ? 'Inquiring Buyer' : 'Producer/Farmer',
      render: (val, row) => (
        <span className="text-gray-300 font-medium">
          {isFarmer ? row.buyerName : (row.farmer?.name || 'Farmer')}
        </span>
      )
    },
    {
      key: 'requiredQuantity',
      label: 'Qty Demanded',
      sortable: true,
      render: (val, row) => <span className="font-bold text-white">{val} {row.listing?.unit || 'Quintals'}</span>
    },
    {
      key: 'expectedPrice',
      label: 'Expected rate',
      sortable: true,
      render: (val, row) => <span className="font-bold text-primary">₹{val} {row.listing?.unit || 'Quintals'}</span>
    },
    {
      key: 'inquiryType',
      label: 'Type',
      sortable: true,
      render: (val) => (
        <Badge className={
          val === 'Urgent Requirement' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
          (val === 'Bulk Purchase' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20')
        }>
          {val}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <Badge className={
          val === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
          (val === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20')
        }>
          {val}
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
          className="p-1 px-3 border-border text-gray-400 hover:text-white rounded-lg text-xs"
          onClick={() => setSelectedInquiry(row)}
        >
          View Specs
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-white tracking-tight flex items-center gap-2">
            <Inbox className="w-6 h-6 text-primary" />
            Buyer Inquiries Console
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            {isFarmer 
              ? 'Accept or reject B2B procurement inquiries from wholesalers and retail buyers.' 
              : 'Monitor the status of your crop procurement inquiries sent to growers.'}
          </p>
        </div>
        <Button variant="outline" className="border-border text-gray-400 hover:text-white" onClick={fetchInquiries}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Grid listing */}
      <div className="bg-card/30 border border-border/80 rounded-3xl p-6 backdrop-blur-md">
        <DataTable
          columns={columns}
          data={inquiries}
          isLoading={loading}
          emptyMessage="No crop marketplace inquiries recorded"
          defaultPageSize={10}
        />
      </div>

      {/* INQUIRY DETAILED VIEW MODAL */}
      <Modal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="B2B Crop Inquiry Details"
      >
        {selectedInquiry && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between pb-3 border-b border-border/40">
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[8px]">Target Listing</span>
                <span className="text-base font-extrabold text-white">{selectedInquiry.listing?.name || 'Crop offering'}</span>
              </div>
              <Badge className={
                selectedInquiry.inquiryType === 'Urgent Requirement' 
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] h-fit' 
                  : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] h-fit'
              }>
                {selectedInquiry.inquiryType}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[8px] mb-0.5">Demanded Quantity</span>
                <span className="text-white font-extrabold text-sm">{selectedInquiry.requiredQuantity} {selectedInquiry.listing?.unit || 'Units'}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[8px] mb-0.5">Expected Price Rate</span>
                <span className="text-primary font-extrabold text-sm">₹{selectedInquiry.expectedPrice} {selectedInquiry.listing?.unit || 'Units'}</span>
              </div>
            </div>

            {/* Buyer Contact details */}
            <div className="p-3 bg-surface border border-border/40 rounded-xl space-y-2">
              <span className="block text-gray-500 font-bold uppercase tracking-wider text-[8px]">Procurer Profile Contact</span>
              <div className="flex justify-between items-center text-white font-medium">
                <span>{isFarmer ? selectedInquiry.buyerName : (selectedInquiry.farmer?.name || 'Farmer')}</span>
                <div className="flex gap-2">
                  <a href={`tel:${isFarmer ? selectedInquiry.phone : selectedInquiry.farmer?.phone}`} className="p-1 px-2 border border-border bg-card rounded-md hover:text-primary hover:border-primary/40 flex items-center gap-1 transition-colors">
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                  <a href={`mailto:${isFarmer ? selectedInquiry.buyer?.email : selectedInquiry.farmer?.email}`} className="p-1 px-2 border border-border bg-card rounded-md hover:text-primary hover:border-primary/40 flex items-center gap-1 transition-colors">
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="block text-gray-500 font-bold uppercase tracking-wider text-[8px]">Inquiry Message</span>
              <p className="p-3 bg-surface/50 border border-border/40 rounded-xl text-gray-300 font-medium leading-relaxed">
                "{selectedInquiry.message}"
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
              <div className="flex gap-2 mr-auto">
                {isFarmer && selectedInquiry.status === 'Pending' && (
                  <>
                    <Button
                      className="bg-emerald-500 hover:bg-emerald-600 text-white border-transparent flex items-center gap-1.5"
                      onClick={() => handleUpdateStatus(selectedInquiry._id || selectedInquiry.id, 'Accepted')}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Accept Procurement Offer</span>
                    </Button>
                    <Button
                      className="bg-rose-500 hover:bg-rose-600 text-white border-transparent flex items-center gap-1.5"
                      onClick={() => handleUpdateStatus(selectedInquiry._id || selectedInquiry.id, 'Rejected')}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Offer</span>
                    </Button>
                  </>
                )}
              </div>
              <Button variant="outline" onClick={() => setSelectedInquiry(null)}>Close Window</Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default BuyerInquiries;
