import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  Plus,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  X,
  Scale,
  Calendar,
  Layers,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { cropService } from '../services/cropService';
import { Button } from '../../components/ui';

const itemVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 350, damping: 25 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

export const MyCrops = () => {
  const location = useLocation();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'delete' | 'view' | null
  const [selectedCrop, setSelectedCrop] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    growthStage: 'Germination',
    healthStatus: 'Healthy',
    progress: 10,
    notes: ''
  });

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const res = await cropService.getCrops();
      if (res.success) {
        setCrops(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch crops catalog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  // Handle URL action trigger (?action=add)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'add') {
      openAddModal();
    }
  }, [location]);

  const openAddModal = () => {
    setFormData({
      name: '',
      area: '',
      growthStage: 'Germination',
      healthStatus: 'Healthy',
      progress: 10,
      notes: ''
    });
    setActiveModal('add');
  };

  const openEditModal = (crop) => {
    setSelectedCrop(crop);
    setFormData({
      name: crop.name,
      area: crop.area,
      growthStage: crop.growthStage,
      healthStatus: crop.healthStatus,
      progress: crop.progress || 0,
      notes: crop.notes || ''
    });
    setActiveModal('edit');
  };

  const openDeleteModal = (crop) => {
    setSelectedCrop(crop);
    setActiveModal('delete');
  };

  const openViewModal = (crop) => {
    setSelectedCrop(crop);
    setActiveModal('view');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeModal === 'add') {
        const res = await cropService.addCrop(formData);
        if (res.success) {
          setCrops(prev => [res.data, ...prev]);
        }
      } else if (activeModal === 'edit') {
        const res = await cropService.updateCrop(selectedCrop._id, formData);
        if (res.success) {
          setCrops(prev => prev.map(c => (c._id === selectedCrop._id ? res.data : c)));
        }
      }
      setActiveModal(null);
    } catch (err) {
      console.error(err);
      alert('Error updating crops database.');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await cropService.deleteCrop(selectedCrop._id);
      if (res.success) {
        setCrops(prev => prev.filter(c => c._id !== selectedCrop._id));
      }
      setActiveModal(null);
    } catch (err) {
      console.error(err);
      alert('Error deleting crop registry.');
    }
  };

  const getHealthBadgeColor = (status) => {
    switch (status) {
      case 'Healthy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Warning': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getCropEmoji = (name) => {
    const low = name.toLowerCase();
    if (low.includes('rice') || low.includes('paddy')) return '🌾';
    if (low.includes('wheat')) return '🌱';
    if (low.includes('cotton')) return '☁️';
    if (low.includes('sugarcane')) return '🎋';
    if (low.includes('corn') || low.includes('maize')) return '🌽';
    if (low.includes('potato')) return '🥔';
    if (low.includes('tomato')) return '🍅';
    return '🌱';
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">My Registered Crops</h1>
          <p className="text-xs text-text/40 font-semibold mt-1">Manage and track your seasonal sowing logs</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-dark text-xs font-semibold text-white rounded-xl transition-all shadow-lg shadow-primary/10 cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Crop</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-card rounded-2xl border border-border/55" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl font-medium">
          {error}
        </div>
      ) : crops.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center rounded-2xl max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto text-primary text-3xl">
            🌾
          </div>
          <div>
            <h3 className="font-bold text-text">No Crops Sown Yet</h3>
            <p className="text-xs text-text/40 mt-1 max-w-sm mx-auto">
              Your agricultural ledger is empty. Click below to add your first seasonal crop tracking record.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-dark transition-all cursor-pointer"
          >
            Sow First Crop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {crops.map((crop) => (
              <motion.div
                key={crop._id}
                variants={itemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="bg-card border border-border hover:border-primary/20 rounded-2xl p-5 shadow-premium flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3.5xl" role="img" aria-label="crop">
                      {getCropEmoji(crop.name)}
                    </span>
                    <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getHealthBadgeColor(crop.healthStatus)}`}>
                      {crop.healthStatus}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-display text-text">{crop.name}</h3>

                  <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-semibold text-text/50">
                    <div>
                      <span className="block text-[9px] font-bold text-text/30 uppercase tracking-wider">Area Size</span>
                      <span className="block text-text font-bold mt-0.5">{crop.area} Acres</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-text/30 uppercase tracking-wider">Growth Stage</span>
                      <span className="block text-text font-bold mt-0.5">{crop.growthStage}</span>
                    </div>
                  </div>

                  {/* Growth Progress */}
                  <div className="mt-5 space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-text/40">
                      <span>Harvest Sowing Progress</span>
                      <span>{crop.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${crop.progress || 0}%` }} />
                    </div>
                  </div>
                </div>

                {/* Operations Footer */}
                <div className="border-t border-border/50 pt-4 mt-5 flex justify-end gap-2 shrink-0">
                  <button
                    onClick={() => openViewModal(crop)}
                    className="p-1.5 hover:bg-surface text-text/60 hover:text-text rounded-lg border border-border/30 transition-all cursor-pointer"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(crop)}
                    className="p-1.5 hover:bg-surface text-text/60 hover:text-primary rounded-lg border border-border/30 transition-all cursor-pointer"
                    title="Edit Crop"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(crop)}
                    className="p-1.5 hover:bg-surface text-text/60 hover:text-red-400 rounded-lg border border-border/30 transition-all cursor-pointer"
                    title="Delete Crop"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* CRUD Overlays */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setActiveModal(null)}
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-card border border-border w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative z-10 p-6 text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute right-4 top-4 p-1 rounded-lg text-text/40 hover:text-text hover:bg-surface transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              {activeModal === 'add' && <h3 className="text-lg font-bold font-display text-text mb-4">Sow New Crop Batch</h3>}
              {activeModal === 'edit' && <h3 className="text-lg font-bold font-display text-text mb-4">Edit Crop Registry</h3>}
              {activeModal === 'delete' && <h3 className="text-lg font-bold font-display text-text mb-2">Delete Crop Confirmation</h3>}
              {activeModal === 'view' && <h3 className="text-lg font-bold font-display text-text mb-4">Crop Registry Ledger</h3>}

              {/* Form for Add / Edit */}
              {(activeModal === 'add' || activeModal === 'edit') && (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text/60 uppercase tracking-wider">Crop Common Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Basmati Rice, Sharbati Wheat"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text/60 uppercase tracking-wider">Area Size (Acres)</label>
                      <input
                        type="number"
                        required
                        min="0.1"
                        step="0.1"
                        placeholder="e.g. 5.5"
                        value={formData.area}
                        onChange={(e) => setFormData(prev => ({ ...prev, area: parseFloat(e.target.value) || '' }))}
                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text/60 uppercase tracking-wider">Growth Stage</label>
                      <select
                        value={formData.growthStage}
                        onChange={(e) => setFormData(prev => ({ ...prev, growthStage: e.target.value }))}
                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-primary/50 cursor-pointer"
                      >
                        <option value="Germination">Germination</option>
                        <option value="Vegetative">Vegetative</option>
                        <option value="Flowering">Flowering</option>
                        <option value="Harvesting">Harvesting</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text/60 uppercase tracking-wider">Health Status</label>
                      <select
                        value={formData.healthStatus}
                        onChange={(e) => setFormData(prev => ({ ...prev, healthStatus: e.target.value }))}
                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-primary/50 cursor-pointer"
                      >
                        <option value="Healthy">Healthy (Optimal)</option>
                        <option value="Warning">Warning (Needs care)</option>
                        <option value="Critical">Critical (Disease Alert)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-text/60 uppercase tracking-wider flex justify-between">
                        <span>Progress</span>
                        <span>{formData.progress}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-surface h-2 rounded-lg appearance-none cursor-pointer accent-primary mt-3"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text/60 uppercase tracking-wider">Farming Notes / Fertilizers</label>
                    <textarea
                      placeholder="Specify irrigation schedules or soil treatment notes here..."
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows="3"
                      className="w-full bg-surface border border-border rounded-xl p-3 text-sm text-text focus:outline-none focus:border-primary/50 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="flex-1 py-2.5 border border-border rounded-xl hover:bg-surface text-xs font-bold transition-all text-center cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-xs font-bold text-white rounded-xl transition-all shadow-lg shadow-primary/10 text-center cursor-pointer"
                    >
                      {activeModal === 'add' ? 'Sow Crop Batch' : 'Save Details'}
                    </button>
                  </div>
                </form>
              )}

              {/* Form for Delete */}
              {activeModal === 'delete' && selectedCrop && (
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-3 font-semibold">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span>Warning: This will permanently remove the crop batch registry and history metrics from your profile.</span>
                  </div>
                  <p className="text-xs text-text/60 leading-relaxed font-semibold">
                    Are you sure you want to delete crop batch <strong className="text-text">"{selectedCrop.name}"</strong>?
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="flex-1 py-2.5 border border-border rounded-xl hover:bg-surface text-xs font-bold transition-all text-center cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      className="flex-1 py-2.5 bg-red-550 bg-red-500 hover:bg-red-650 hover:bg-red-600 text-xs font-bold text-white rounded-xl transition-all text-center cursor-pointer"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              )}

              {/* View Crop Detail panel */}
              {activeModal === 'view' && selectedCrop && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center gap-4 bg-surface/50 border border-border/40 p-4 rounded-xl">
                    <span className="text-4xl">{getCropEmoji(selectedCrop.name)}</span>
                    <div>
                      <h4 className="font-extrabold text-base text-text">{selectedCrop.name}</h4>
                      <span className={`inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border mt-1.5 ${getHealthBadgeColor(selectedCrop.healthStatus)}`}>
                        {selectedCrop.healthStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4 mt-2">
                    <div className="space-y-1">
                      <span className="block text-[9px] font-bold text-text/30 uppercase tracking-wider flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5" /> Area Size
                      </span>
                      <span className="block text-text font-bold text-sm">{selectedCrop.area} Acres</span>
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[9px] font-bold text-text/30 uppercase tracking-wider flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" /> Sowing Stage
                      </span>
                      <span className="block text-text font-bold text-sm">{selectedCrop.growthStage}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4">
                    <div className="space-y-1">
                      <span className="block text-[9px] font-bold text-text/30 uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Registered Date
                      </span>
                      <span className="block text-text font-bold">{new Date(selectedCrop.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[9px] font-bold text-text/30 uppercase tracking-wider flex items-center gap-1">
                        <ClipboardList className="w-3.5 h-3.5" /> Growth progress
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-surface h-1.5 rounded-full overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: `${selectedCrop.progress}%` }} />
                        </div>
                        <span className="font-bold text-text">{selectedCrop.progress}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/40 pt-4 space-y-1">
                    <span className="block text-[9px] font-bold text-text/30 uppercase tracking-wider">Farming Notes / Directives</span>
                    <p className="p-3 bg-surface/30 border border-border/20 rounded-lg text-text/80 leading-relaxed font-semibold">
                      {selectedCrop.notes || 'No custom irrigation or pesticide details have been specified yet.'}
                    </p>
                  </div>

                  <div className="border-t border-border/40 pt-4">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="w-full py-2.5 bg-surface border border-border hover:bg-border rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MyCrops;
