import React, { useState, useEffect } from 'react';
import { FilePlus2, Edit2, Trash2, ShieldAlert, Sparkles, CheckCircle, Plus, X, Globe, Save } from 'lucide-react';
import marketplaceService from '../../services/marketplaceService';
import { DataTable, Button, Modal, Input, Textarea, Badge, ImageUpload } from '../../components/ui';

export const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editListing, setEditListing] = useState(null);
  const [deleteListingId, setDeleteListingId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Cereals');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('/ Quintal');
  const [availableQuantity, setAvailableQuantity] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [isOrganic, setIsOrganic] = useState(false);
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [minOrder, setMinOrder] = useState('1');
  const [storageInfo, setStorageInfo] = useState('');
  const [transportationDetails, setTransportationDetails] = useState('');
  const [qualityGrade, setQualityGrade] = useState('A+');
  
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageLabel, setNewImageLabel] = useState('Front View');

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const data = await marketplaceService.getMyListings();
      setListings(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const resetForm = () => {
    setName('');
    setCategory('Cereals');
    setDescription('');
    setPrice('');
    setUnit('/ Quintal');
    setAvailableQuantity('');
    setHarvestDate('');
    setIsOrganic(false);
    setLocation('');
    setDistrict('');
    setState('');
    setMinOrder('1');
    setStorageInfo('');
    setTransportationDetails('');
    setQualityGrade('A+');
    setImages([]);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, { url: newImageUrl, filename: newImageLabel }]);
      setNewImageUrl('');
      setNewImageLabel('Close View');
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const finalImages = images.length > 0 ? images : [
      { url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600', filename: 'placeholder' }
    ];
    try {
      await marketplaceService.createListing({
        name,
        category,
        description,
        price: Number(price),
        unit,
        availableQuantity: Number(availableQuantity),
        harvestDate: harvestDate || new Date(),
        isOrganic,
        images: finalImages,
        location,
        district,
        state,
        minOrder: Number(minOrder),
        storageInfo,
        transportationDetails,
        qualityGrade
      });
      setShowAddModal(false);
      resetForm();
      fetchMyListings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditOpen = (listing) => {
    setEditListing(listing);
    setName(listing.name);
    setCategory(listing.category);
    setDescription(listing.description);
    setPrice(listing.price);
    setUnit(listing.unit || '/ Quintal');
    setAvailableQuantity(listing.availableQuantity);
    setHarvestDate(listing.harvestDate ? new Date(listing.harvestDate).toISOString().split('T')[0] : '');
    setIsOrganic(listing.isOrganic || false);
    setLocation(listing.location || '');
    setDistrict(listing.district || '');
    setState(listing.state || '');
    setMinOrder(listing.minOrder || '1');
    setStorageInfo(listing.storageInfo || '');
    setTransportationDetails(listing.transportationDetails || '');
    setQualityGrade(listing.qualityGrade || 'A+');
    setImages(listing.images && listing.images.length > 0 ? listing.images : []);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const finalImages = images.length > 0 ? images : [
      { url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600', filename: 'placeholder' }
    ];
    try {
      await marketplaceService.updateListing(editListing._id || editListing.id, {
        name,
        category,
        description,
        price: Number(price),
        unit,
        availableQuantity: Number(availableQuantity),
        harvestDate: harvestDate || new Date(),
        isOrganic,
        images: finalImages,
        location,
        district,
        state,
        minOrder: Number(minOrder),
        storageInfo,
        transportationDetails,
        qualityGrade
      });
      setEditListing(null);
      resetForm();
      fetchMyListings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await marketplaceService.deleteListing(deleteListingId);
      setDeleteListingId(null);
      fetchMyListings();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Crop Batch Name',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border">
            <img src={row.images && row.images.length > 0 ? row.images[0].url : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=60'} alt={val} className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-bold text-white block text-sm">{row.name}</span>
            <span className="text-[10px] text-gray-500 block">{row.category}</span>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Procurement rate',
      sortable: true,
      render: (val, row) => <span className="font-bold text-primary">₹{val} {row.unit}</span>
    },
    {
      key: 'availableQuantity',
      label: 'Batch Quantity',
      sortable: true,
      render: (val, row) => <span className="font-medium text-white">{val} Units</span>
    },
    {
      key: 'location',
      label: 'Farm Origin',
      render: (val, row) => <span>{val}, {row.state}</span>
    },
    {
      key: 'status',
      label: 'Oversight Status',
      sortable: true,
      render: (val) => (
        <Badge className={
          val === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
          (val === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20')
        }>
          {val || 'Pending'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="p-1 px-2 border-border text-gray-400 hover:text-white rounded-lg flex items-center gap-1"
            onClick={() => handleEditOpen(row)}
            title="Edit Listings"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-1 px-2 border-border text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-lg flex items-center gap-1"
            onClick={() => setDeleteListingId(row._id || row.id)}
            title="Remove batch listing"
          >
            <Trash2 className="w-3.5 h-3.5" />
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
          <h1 className="text-2xl font-extrabold font-display text-white tracking-tight flex items-center gap-2">
            <FilePlus2 className="w-6 h-6 text-primary" />
            My Crop Listings offers
          </h1>
          <p className="text-gray-400 text-xs mt-1">Publish new harvest batches, change available rates, or edit logistics parameters.</p>
        </div>

        <Button
          className="flex items-center gap-1.5 text-xs font-semibold py-2 px-4 rounded-xl shadow-lg w-full sm:w-auto justify-center"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Publish crop batch</span>
        </Button>
      </div>

      {/* Verification notice warning */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-start gap-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-white">Listing Moderation flow</h4>
          <p className="text-gray-400 mt-1">To ensure agricultural purity, new listings or changes to existing listings will start as <strong>Pending</strong> and require review by the Super Admin before appearing in the public B2B browser catalog.</p>
        </div>
      </div>

      {/* Grid listing */}
      <div className="bg-card/30 border border-border/80 rounded-3xl p-6 backdrop-blur-md">
        <DataTable
          columns={columns}
          data={listings}
          isLoading={loading}
          emptyMessage="You have not published any crop listings yet"
          defaultPageSize={10}
        />
      </div>

      {/* CREATE LISTING MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Publish Crop Batch offering"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs max-h-[80vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Crop Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Premium Basmati Rice (Pusa 1121)"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl text-sm py-2 px-3 text-text focus:outline-none focus:border-primary/50"
              >
                <option value="Cereals">Cereals</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Pulses">Pulses</option>
                <option value="Oil Seeds">Oil Seeds</option>
                <option value="Spices">Spices</option>
                <option value="Flowers">Flowers</option>
                <option value="Organic Produce">Organic Produce</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Listing offering description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            placeholder="Explain crop grade, moisture levels, bulk parameters..."
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Est Rate (INR)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="e.g. 6800"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Pricing Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl text-sm py-2 px-3 text-text focus:outline-none focus:border-primary/50"
              >
                <option value="/ Quintal">/ Quintal</option>
                <option value="/ kg">/ kg</option>
                <option value="/ Ton">/ Ton</option>
              </select>
            </div>
            <Input
              label="Available volume"
              type="number"
              value={availableQuantity}
              onChange={(e) => setAvailableQuantity(e.target.value)}
              required
              placeholder="e.g. 250"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Harvest Date"
              type="date"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Quality Grade</label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl text-sm py-2 px-3 text-text focus:outline-none focus:border-primary/50"
              >
                <option value="A+">Grade A+</option>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
              </select>
            </div>
            <Input
              label="Min Order Limit"
              type="number"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Farm location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="Village name"
            />
            <Input
              label="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
              placeholder="e.g. Karnal"
            />
            <Input
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              placeholder="e.g. Haryana"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Warehouse Storage specifications"
              value={storageInfo}
              onChange={(e) => setStorageInfo(e.target.value)}
              placeholder="e.g. Aerated dry bags storage"
            />
            <Input
              label="Shipping/Transportation details"
              value={transportationDetails}
              onChange={(e) => setTransportationDetails(e.target.value)}
              placeholder="e.g. FOB Mandi loading available"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-text/85 hover:text-white">
            <input
              type="checkbox"
              checked={isOrganic}
              onChange={(e) => setIsOrganic(e.target.checked)}
              className="rounded bg-surface border-border text-primary cursor-pointer"
            />
            <span>This is Certified Organic Produce</span>
          </label>

          {/* Multiple Image uploads */}
          <div className="space-y-3 border-t border-border/40 pt-4">
            <span className="block font-bold text-white uppercase tracking-wider text-[9px]">Crop Batch Images</span>
            <ImageUpload images={images} onChange={setImages} maxImages={5} />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
            <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Submit batch offering
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT LISTING MODAL */}
      <Modal
        isOpen={!!editListing}
        onClose={() => setEditListing(null)}
        title="Edit Crop Batch Details"
      >
        {editListing && (
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs max-h-[80vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Crop Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl text-sm py-2 px-3 text-text focus:outline-none focus:border-primary/50"
                >
                  <option value="Cereals">Cereals</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Pulses">Pulses</option>
                  <option value="Oil Seeds">Oil Seeds</option>
                  <option value="Spices">Spices</option>
                  <option value="Flowers">Flowers</option>
                  <option value="Organic Produce">Organic Produce</option>
                </select>
              </div>
            </div>

            <Textarea
              label="Listing offering description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Est Rate (INR)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Pricing Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl text-sm py-2 px-3 text-text focus:outline-none focus:border-primary/50"
                >
                  <option value="/ Quintal">/ Quintal</option>
                  <option value="/ kg">/ kg</option>
                  <option value="/ Ton">/ Ton</option>
                </select>
              </div>
              <Input
                label="Available volume"
                type="number"
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Harvest Date"
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Quality Grade</label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl text-sm py-2 px-3 text-text focus:outline-none focus:border-primary/50"
                >
                  <option value="A+">Grade A+</option>
                  <option value="A">Grade A</option>
                  <option value="B">Grade B</option>
                </select>
              </div>
              <Input
                label="Min Order Limit"
                type="number"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Farm location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <Input
                label="District"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
              <Input
                label="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Warehouse Storage specifications"
                value={storageInfo}
                onChange={(e) => setStorageInfo(e.target.value)}
              />
              <Input
                label="Shipping/Transportation details"
                value={transportationDetails}
                onChange={(e) => setTransportationDetails(e.target.value)}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-text/85 hover:text-white">
              <input
                type="checkbox"
                checked={isOrganic}
                onChange={(e) => setIsOrganic(e.target.checked)}
                className="rounded bg-surface border-border text-primary cursor-pointer"
              />
              <span>This is Certified Organic Produce</span>
            </label>

            {/* Multiple Image uploads */}
            <div className="space-y-3 border-t border-border/40 pt-4">
              <span className="block font-bold text-white uppercase tracking-wider text-[9px]">Crop Batch Images</span>
              <ImageUpload images={images} onChange={setImages} maxImages={5} />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
              <Button type="button" variant="outline" onClick={() => setEditListing(null)}>
                Cancel
              </Button>
              <Button type="submit">
                Save details
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <Modal
        isOpen={!!deleteListingId}
        onClose={() => setDeleteListingId(null)}
        title="Confirm Listing Deletion"
      >
        <div className="space-y-4 text-xs">
          <p className="text-gray-400">Are you sure you want to delete this crop batch listing? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteListingId(null)}>Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white border-transparent" onClick={handleDelete}>Delete Listing</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default MyListings;
