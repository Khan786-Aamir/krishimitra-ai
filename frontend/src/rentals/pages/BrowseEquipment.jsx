import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Grid, AlertCircle, Loader } from 'lucide-react';
import equipmentService from '../../services/equipmentService';
import { EquipmentPreviewCard } from './EquipmentHome';
import { Button, Input, Select, CardSkeleton } from '../../components/ui';

export const BrowseEquipment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // URL search params processing
  const getQueryParam = (name) => {
    return new URLSearchParams(location.search).get(name) || '';
  };

  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for search and filter selections
  const [search, setSearch] = useState(getQueryParam('search'));
  const [category, setCategory] = useState(getQueryParam('category') || 'All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [condition, setCondition] = useState('All');
  const [fuelType, setFuelType] = useState('All');
  const [availabilityStatus, setAvailabilityStatus] = useState('All');
  const [sort, setSort] = useState('Newest');

  // Load list on change of queries/filters
  const fetchFilteredEquipment = async () => {
    try {
      setLoading(true);
      const filters = {
        search,
        category: category === 'All' ? '' : category,
        minPrice,
        maxPrice,
        state,
        district,
        condition: condition === 'All' ? '' : condition,
        fuelType: fuelType === 'All' ? '' : fuelType,
        availabilityStatus: availabilityStatus === 'All' ? '' : availabilityStatus,
        sort
      };
      const data = await equipmentService.getEquipmentList(filters);
      setEquipmentList(data || []);
    } catch (err) {
      console.error('Error fetching filtered equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredEquipment();
  }, [category, sort, location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFilteredEquipment();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setState('');
    setDistrict('');
    setCondition('All');
    setFuelType('All');
    setAvailabilityStatus('All');
    setSort('Newest');
    navigate('/rentals/browse');
  };

  const categories = [
    'All',
    'Tractors',
    'Harvesters',
    'Tillers & Cultivators',
    'Seeders & Planters',
    'Irrigation Equipment',
    'Sprayers',
    'Hand Tools',
    'Other'
  ];

  const sortingOptions = [
    'Newest',
    'Price Low → High',
    'Price High → Low',
    'Highest Rated',
    'Most Booked'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">Browse Fleet</h1>
        <p className="text-xs text-text/40 font-semibold mt-1">
          Explore and filter agricultural vehicles, machinery, and tillage equipment catalog.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Filter Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-premium space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <h3 className="font-bold text-xs uppercase tracking-wider text-text flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" /> Filters
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-[10px] text-primary hover:underline font-bold"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface border border-border/80 text-xs rounded-xl py-2 px-3 focus:outline-none focus:border-primary/50 text-text"
              >
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Pricing range */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Daily Rate (₹)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-surface border border-border/80 text-xs rounded-xl py-2 px-3 text-text placeholder-text/30 focus:outline-none focus:border-primary/50"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-surface border border-border/80 text-xs rounded-xl py-2 px-3 text-text placeholder-text/30 focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            {/* Condition Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-surface border border-border/80 text-xs rounded-xl py-2 px-3 focus:outline-none focus:border-primary/50 text-text"
              >
                <option value="All">All Conditions</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full bg-surface border border-border/80 text-xs rounded-xl py-2 px-3 focus:outline-none focus:border-primary/50 text-text"
              >
                <option value="All">All Fuels</option>
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="Electric">Electric</option>
                <option value="CNG">CNG</option>
                <option value="Manual">Manual</option>
                <option value="None">None</option>
              </select>
            </div>

            {/* Location (State/District) */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" /> Location
              </label>
              <input
                type="text"
                placeholder="State (e.g. Punjab)"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-surface border border-border/80 text-xs rounded-xl py-2 px-3 text-text placeholder-text/30 focus:outline-none"
              />
              <input
                type="text"
                placeholder="District (e.g. Patiala)"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-surface border border-border/80 text-xs rounded-xl py-2 px-3 text-text placeholder-text/30 focus:outline-none"
              />
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Availability</label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value)}
                className="w-full bg-surface border border-border/80 text-xs rounded-xl py-2 px-3 focus:outline-none focus:border-primary/50 text-text"
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            <Button onClick={fetchFilteredEquipment} className="w-full text-xs font-bold py-2.5 rounded-xl mt-2 flex justify-center items-center">
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Right Search, Sorting, and Grid content */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-text/30 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by keyword, brand, or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-card border border-border text-xs rounded-xl py-2.5 pl-9 pr-20 text-text placeholder-text/30 focus:outline-none focus:border-primary/40 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary text-white text-[10px] font-bold rounded-lg px-3 flex items-center cursor-pointer hover:bg-primary-dark transition-all"
              >
                Search
              </button>
            </form>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Sort By</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-card border border-border text-xs rounded-xl py-2 px-3 text-text focus:outline-none focus:border-primary/40"
              >
                {sortingOptions.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid listing */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : equipmentList.length === 0 ? (
            <div className="bg-card border border-border rounded-3xl p-12 text-center max-w-lg mx-auto mt-6">
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl w-fit mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-white font-extrabold text-lg leading-tight">No machinery matched</h3>
              <p className="text-gray-500 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
                Adjust search queries or expand filters (price limit, location states, fuel types) to locate machinery listings.
              </p>
              <Button onClick={handleResetFilters} variant="outline" className="border-border hover:bg-surface text-xs font-bold px-5 py-2.5 rounded-xl mt-6">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {equipmentList.map(item => (
                <EquipmentPreviewCard
                  key={item._id}
                  equipment={item}
                  onView={(id) => navigate(`/rentals/listings/${id}`)}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
