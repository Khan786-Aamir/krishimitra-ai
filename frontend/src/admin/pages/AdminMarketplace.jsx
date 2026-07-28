import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Eye, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';
import adminService from '../../services/adminService';
import { Button, Modal, Badge } from '../../components/ui';

export const AdminMarketplace = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('Pending'); // 'Pending', 'Approved', 'Rejected'

  const fetchListings = async () => {
    try {
      setLoading(true);
      const data = await adminService.getMarketplace();
      setListings(data || []);
    } catch (err) {
      console.error('Error fetching marketplace listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await adminService.verifyProduct(id, status);
      setSelectedProduct(null);
      // Simulate status change in local state since backend mock is local
      setListings(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredListings = useMemo(() => {
    return listings.filter(item => item.status === activeTab);
  }, [listings, activeTab]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold font-display text-white tracking-tight flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-primary" />
          Marketplace Audits
        </h1>
        <p className="text-gray-400 text-xs mt-1">Approve, reject, or preview crop batch listings uploaded by farmers.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface border border-border/80 p-1 rounded-xl self-start w-fit">
        {['Pending', 'Approved', 'Rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab
                ? 'bg-primary text-white shadow-lg shadow-primary/10'
                : 'text-text/60 hover:text-white'
            }`}
          >
            {tab} Listings
          </button>
        ))}
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-card rounded-2xl" />
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="p-12 text-center bg-card/25 border border-border/80 rounded-3xl backdrop-blur-md">
          <ShoppingBag className="w-12 h-12 text-text/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-text/50">No {activeTab.toLowerCase()} listings currently active.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-premium transition-all flex flex-col justify-between"
            >
              <div className="h-44 bg-surface overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <Badge className={`absolute top-3 right-3 ${
                  item.status === 'Approved' ? 'bg-primary/90 text-white' : (item.status === 'Rejected' ? 'bg-rose-500/90 text-white' : 'bg-amber-500/90 text-white')
                }`}>
                  {item.status}
                </Badge>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white tracking-tight leading-tight">{item.name}</h3>
                  <span className="text-[10px] text-gray-500 font-medium">Farmer: {item.farmerName} • {item.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-surface/50 p-3 border border-border/40 rounded-xl">
                  <div>
                    <span className="block text-gray-500 font-bold uppercase tracking-wider text-[8px] mb-0.5">Crop Quantity</span>
                    <span className="text-white font-bold">{item.quantity}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 font-bold uppercase tracking-wider text-[8px] mb-0.5">Offered Price</span>
                    <span className="text-primary font-bold">{item.price}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-xs py-2 rounded-xl flex items-center justify-center gap-1 border-border"
                    onClick={() => setSelectedProduct(item)}
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Product</span>
                  </Button>
                  
                  {item.status === 'Pending' && (
                    <>
                      <button
                        className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-xl transition-all"
                        onClick={() => handleAction(item.id, 'Approved')}
                        title="Approve Listing"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl transition-all"
                        onClick={() => handleAction(item.id, 'Rejected')}
                        title="Reject Listing"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILED VIEW MODAL */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title="Marketplace Listing Review"
      >
        {selectedProduct && (
          <div className="space-y-4 text-xs">
            <div className="h-48 bg-surface rounded-xl overflow-hidden">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="pb-3 border-b border-border/40">
              <h3 className="text-base font-extrabold text-white">{selectedProduct.name}</h3>
              <p className="text-gray-400 font-medium mt-1">Listed by {selectedProduct.farmerName} in {selectedProduct.location}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Crop Stage</span>
                <span className="text-white text-sm font-bold">{selectedProduct.stage || 'Harvested'}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Offered Quantity</span>
                <span className="text-white text-sm font-bold">{selectedProduct.quantity}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Target Listing Price</span>
                <span className="text-primary text-sm font-bold">{selectedProduct.price}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-bold uppercase tracking-wider text-[9px] mb-0.5">Verification Status</span>
                <span className={`text-sm font-bold ${
                  selectedProduct.status === 'Approved' ? 'text-emerald-400' : (selectedProduct.status === 'Rejected' ? 'text-rose-400' : 'text-amber-400')
                }`}>
                  {selectedProduct.status}
                </span>
              </div>
            </div>

            <div className="p-3 bg-surface/50 border border-border/40 rounded-xl">
              <h4 className="font-bold text-white text-[9px] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" />
                Auditor Diagnostics
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Verify that crop moisture is within acceptable metrics (&lt;14%), details matches standard grain classifications, and price parameters sit within current Mandi averages.
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border/40">
              <div className="flex gap-2">
                {selectedProduct.status === 'Pending' ? (
                  <>
                    <Button
                      className="bg-emerald-500 hover:bg-emerald-600 text-white border-transparent"
                      onClick={() => handleAction(selectedProduct.id, 'Approved')}
                    >
                      Approve listing
                    </Button>
                    <Button
                      className="bg-rose-500 hover:bg-rose-600 text-white border-transparent"
                      onClick={() => handleAction(selectedProduct.id, 'Rejected')}
                    >
                      Reject listing
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5 text-gray-500 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Audit complete. No further action needed.</span>
                  </div>
                )}
              </div>
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminMarketplace;
