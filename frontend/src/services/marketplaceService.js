import api from './api';

// Premium Mock Data fallbacks for AgriTech B2B B2C Marketplace
const MOCK_LISTINGS = [
  {
    _id: 'ml-1',
    id: 'ml-1',
    name: 'Premium Basmati Rice (Pusa 1121)',
    category: 'Cereals',
    description: 'Extra long grain Sharbati Basmati rice. Freshly harvested, sorted, and moisture-controlled at 12%. Suitable for premium packaging and export.',
    price: 6800,
    unit: '/ Quintal',
    availableQuantity: 250,
    harvestDate: '2026-07-15T00:00:00.000Z',
    isOrganic: true,
    isFreshHarvest: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600', filename: 'front' },
      { url: 'https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=600', filename: 'close' },
      { url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600', filename: 'harvest' }
    ],
    location: 'Karnal, Haryana',
    district: 'Karnal',
    state: 'Haryana',
    minOrder: 10,
    storageInfo: 'Aerate dry warehousing with standard pest treatment',
    transportationDetails: 'FOB delivery at regional Mandi warehouses',
    qualityGrade: 'A+',
    status: 'Approved',
    averageRating: 4.9,
    totalReviews: 24,
    farmerName: 'Gurpreet Singh',
    farmerPhone: '+91 98765 01234'
  },
  {
    _id: 'ml-2',
    id: 'ml-2',
    name: 'Organic Turmeric (Salem Finger)',
    category: 'Spices',
    description: 'High curcumin content (>5.5%). Sun-dried under hygienic conditions. Rich golden color and intense aroma. Perfect for pharmaceutical and extraction industries.',
    price: 8500,
    unit: '/ Quintal',
    availableQuantity: 80,
    harvestDate: '2026-06-20T00:00:00.000Z',
    isOrganic: true,
    isFreshHarvest: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600', filename: 'front' },
      { url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=600', filename: 'close' }
    ],
    location: 'Salem, Tamil Nadu',
    district: 'Salem',
    state: 'Tamil Nadu',
    minOrder: 5,
    storageInfo: 'Moisture-proof gunny bags in cool dry shade',
    transportationDetails: 'Ex-farm gate loading',
    qualityGrade: 'A+',
    status: 'Approved',
    averageRating: 4.8,
    totalReviews: 16,
    farmerName: 'Karthik Raja',
    farmerPhone: '+91 98765 05678'
  },
  {
    _id: 'ml-3',
    id: 'ml-3',
    name: 'Red Onions (Nashik Quality)',
    category: 'Vegetables',
    description: 'Medium sizeNashik red onions, fully dried skins, firm bulb structure. High durability and long shelf life. Excellent for wholesalers.',
    price: 2400,
    unit: '/ Quintal',
    availableQuantity: 500,
    harvestDate: '2026-07-22T00:00:00.000Z',
    isOrganic: false,
    isFreshHarvest: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1508747703725-719ae257c14a?auto=format&fit=crop&q=80&w=600', filename: 'front' },
      { url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600', filename: 'packaging' }
    ],
    location: 'Nashik, Maharashtra',
    district: 'Nashik',
    state: 'Maharashtra',
    minOrder: 50,
    storageInfo: 'Traditional Nashik Kanda Chawl well-ventilated open storage',
    transportationDetails: 'Truck load transport arranged on request',
    qualityGrade: 'A',
    status: 'Approved',
    averageRating: 4.6,
    totalReviews: 42,
    farmerName: 'Ramesh Patil',
    farmerPhone: '+91 98765 09988'
  },
  {
    _id: 'ml-4',
    id: 'ml-4',
    name: 'Desi Gram Pulses (Chana)',
    category: 'Pulses',
    description: 'High-protein brown chickpea seed stock. Mechanically cleaned and de-stoned. Perfect for milling or wholesaling.',
    price: 5200,
    unit: '/ Quintal',
    availableQuantity: 120,
    harvestDate: '2026-07-01T00:00:00.000Z',
    isOrganic: false,
    isFreshHarvest: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=600', filename: 'front' }
    ],
    location: 'Indore, Madhya Pradesh',
    district: 'Indore',
    state: 'Madhya Pradesh',
    minOrder: 15,
    storageInfo: 'Silo grain bin storage',
    transportationDetails: 'FOB Indore Railway Siding',
    qualityGrade: 'A',
    status: 'Approved',
    averageRating: 4.7,
    totalReviews: 8,
    farmerName: 'Vijay Sharma',
    farmerPhone: '+91 98765 07766'
  },
  {
    _id: 'ml-5',
    id: 'ml-5',
    name: 'Fresh Nagpur Seedless Oranges',
    category: 'Fruits',
    description: 'Sweet Nagpur seedless oranges. Direct orchard pick, washed and waxed for gloss and freshness. Juicy texture, optimal citric-sweet ratio.',
    price: 4500,
    unit: '/ Quintal',
    availableQuantity: 150,
    harvestDate: '2026-07-25T00:00:00.000Z',
    isOrganic: true,
    isFreshHarvest: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=600', filename: 'front' },
      { url: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&q=80&w=600', filename: 'close' }
    ],
    location: 'Nagpur, Maharashtra',
    district: 'Nagpur',
    state: 'Maharashtra',
    minOrder: 20,
    storageInfo: 'Cold room stored at 5-8 degrees Celsius',
    transportationDetails: 'Reefer truck transport recommended',
    qualityGrade: 'A+',
    status: 'Approved',
    averageRating: 4.9,
    totalReviews: 30,
    farmerName: 'Sunil Deshmukh',
    farmerPhone: '+91 98765 01122'
  }
];

const MOCK_INQUIRIES = [
  {
    _id: 'inq-1',
    id: 'inq-1',
    listing: {
      _id: 'ml-1',
      name: 'Premium Basmati Rice (Pusa 1121)',
      price: 6800,
      unit: '/ Quintal',
      images: [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=150' }],
      qualityGrade: 'A+'
    },
    buyer: { name: 'AgriCorp Wholesalers', email: 'buyer@agricorp.com', phone: '+91 98111 22233' },
    farmer: { name: 'Gurpreet Singh', email: 'farmer@krishimitra.com', phone: '+91 98765 01234' },
    buyerName: 'AgriCorp Wholesalers',
    phone: '+91 98111 22233',
    requiredQuantity: 100,
    expectedPrice: 6500,
    inquiryType: 'Bulk Purchase',
    message: 'We are interested in purchasing 100 Quintals. Can you lower the rate to ₹6,500/Quintal for FOB delivery?',
    status: 'Pending',
    createdAt: '2026-07-28T14:32:00.000Z'
  },
  {
    _id: 'inq-2',
    id: 'inq-2',
    listing: {
      _id: 'ml-3',
      name: 'Red Onions (Nashik Quality)',
      price: 2400,
      unit: '/ Quintal',
      images: [{ url: 'https://images.unsplash.com/photo-1508747703725-719ae257c14a?auto=format&fit=crop&q=80&w=150' }],
      qualityGrade: 'A'
    },
    buyer: { name: 'Sohan Lal & Sons', email: 'sohan@mandi.com', phone: '+91 99333 44455' },
    farmer: { name: 'Ramesh Patel', email: 'ramesh@krishimitra.com', phone: '+91 98765 09988' },
    buyerName: 'Sohan Lal & Sons',
    phone: '+91 99333 44455',
    requiredQuantity: 200,
    expectedPrice: 2400,
    inquiryType: 'Urgent Requirement',
    message: 'Need 200 Quintals Nashik onions delivered to Delhi Mandi by Friday. Ready to pay full listed price.',
    status: 'Accepted',
    createdAt: '2026-07-27T08:15:00.000Z'
  }
];

const MOCK_SAVED_SEARCHES = [
  {
    _id: 'ss-1',
    id: 'ss-1',
    searchName: 'Organic Grains Haryana',
    filters: { search: '', category: 'Cereals', organic: true, state: 'Haryana' },
    createdAt: '2026-07-28T10:00:00.000Z'
  },
  {
    _id: 'ss-2',
    id: 'ss-2',
    searchName: 'Nashik Onions Wholesaler',
    filters: { search: 'Onion', category: 'Vegetables', state: 'Maharashtra', minQuantity: 50 },
    createdAt: '2026-07-26T12:30:00.000Z'
  }
];

const MOCK_INSIGHTS = {
  trendingCrops: [
    { name: 'Sharbati Wheat', rate: '₹3,100/Quintal', trend: '+3.8%' },
    { name: 'Organic Ginger', rate: '₹9,800/Quintal', trend: '+5.4%' },
    { name: 'Nagpur Oranges', rate: '₹4,500/Quintal', trend: '+2.1%' },
    { name: 'Mustard Seeds', rate: '₹5,800/Quintal', trend: '-1.2%' }
  ],
  highestDemand: [
    { name: 'Cereals', volume: '18,500 Quintals', growth: 'High' },
    { name: 'Fruits', volume: '9,400 Quintals', growth: 'Very High' },
    { name: 'Organic Produce', volume: '5,200 Quintals', growth: 'High' }
  ],
  popularCategories: ['Cereals', 'Vegetables', 'Fruits', 'Organic Produce']
};

const marketplaceService = {
  // Get listings with filters
  getListings: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      const res = await api.get(`/marketplace/listings?${params.toString()}`);
      if (res.data && res.data.success && res.data.count > 0) {
        return res.data.data;
      }
      return MOCK_LISTINGS;
    } catch (err) {
      console.warn('API error fetching listings, falling back to mock data:', err);
      return MOCK_LISTINGS;
    }
  },

  // Get single listing details
  getListingDetails: async (id) => {
    try {
      const res = await api.get(`/marketplace/listings/${id}`);
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return MOCK_LISTINGS.find(l => l._id === id || l.id === id) || MOCK_LISTINGS[0];
    } catch (err) {
      console.warn('API error fetching listing details, falling back to mock:', err);
      return MOCK_LISTINGS.find(l => l._id === id || l.id === id) || MOCK_LISTINGS[0];
    }
  },

  // Create listing
  createListing: async (data) => {
    try {
      const res = await api.post('/marketplace/listings', data);
      return res.data;
    } catch (err) {
      console.error('API error creating listing:', err);
      throw err;
    }
  },

  // Update listing
  updateListing: async (id, data) => {
    try {
      const res = await api.put(`/marketplace/listings/${id}`, data);
      return res.data;
    } catch (err) {
      console.error('API error updating listing:', err);
      throw err;
    }
  },

  // Delete listing
  deleteListing: async (id) => {
    try {
      const res = await api.delete(`/marketplace/listings/${id}`);
      return res.data;
    } catch (err) {
      console.error('API error deleting listing:', err);
      throw err;
    }
  },

  // Toggle listing status/availability
  toggleListingAvailability: async (id, status) => {
    try {
      const res = await api.put(`/marketplace/listings/${id}/status`, { status });
      return res.data;
    } catch (err) {
      console.error('API error toggling listing status:', err);
      throw err;
    }
  },

  // Get Farmer's own listings
  getMyListings: async () => {
    try {
      const res = await api.get('/marketplace/my-listings');
      if (res.data && res.data.success && res.data.count > 0) {
        return res.data.data;
      }
      return MOCK_LISTINGS; // Fallback
    } catch (err) {
      console.warn('API error fetching farmer listings, falling back to mock:', err);
      return MOCK_LISTINGS;
    }
  },

  // Submit buyer inquiry
  sendInquiry: async (data) => {
    try {
      const res = await api.post('/marketplace/inquiries', data);
      return res.data;
    } catch (err) {
      console.error('API error sending inquiry:', err);
      throw err;
    }
  },

  // Get Inquiries (sent or received)
  getInquiries: async () => {
    try {
      const res = await api.get('/marketplace/inquiries');
      if (res.data && res.data.success && res.data.count > 0) {
        return res.data.data;
      }
      return MOCK_INQUIRIES;
    } catch (err) {
      console.warn('API error fetching inquiries, falling back to mock:', err);
      return MOCK_INQUIRIES;
    }
  },

  // Accept/Reject inquiry
  updateInquiryStatus: async (id, status) => {
    try {
      const res = await api.put(`/marketplace/inquiries/${id}`, { status });
      return res.data;
    } catch (err) {
      console.error('API error updating inquiry status:', err);
      throw err;
    }
  },

  // Wishlist: Get items
  getWishlist: async () => {
    try {
      const res = await api.get('/marketplace/wishlist');
      if (res.data && res.data.success && res.data.count > 0) {
        return res.data.data;
      }
      return []; // Return empty list or map mock if needed
    } catch (err) {
      console.warn('API error fetching wishlist, returning empty array:', err);
      return [];
    }
  },

  // Wishlist: Add item
  addToWishlist: async (listingId) => {
    try {
      const res = await api.post('/marketplace/wishlist', { listingId });
      return res.data;
    } catch (err) {
      console.error('API error adding to wishlist:', err);
      throw err;
    }
  },

  // Wishlist: Remove item
  removeFromWishlist: async (id) => {
    try {
      const res = await api.delete(`/marketplace/wishlist/${id}`);
      return res.data;
    } catch (err) {
      console.error('API error removing from wishlist:', err);
      throw err;
    }
  },

  // Saved Searches: Get searches
  getSavedSearches: async () => {
    try {
      const res = await api.get('/marketplace/saved-searches');
      if (res.data && res.data.success && res.data.count > 0) {
        return res.data.data;
      }
      return MOCK_SAVED_SEARCHES;
    } catch (err) {
      console.warn('API error fetching saved searches, falling back to mock:', err);
      return MOCK_SAVED_SEARCHES;
    }
  },

  // Saved Searches: Create search
  saveSearch: async (searchName, filters) => {
    try {
      const res = await api.post('/marketplace/saved-searches', { searchName, filters });
      return res.data;
    } catch (err) {
      console.error('API error saving search:', err);
      throw err;
    }
  },

  // Saved Searches: Delete search
  deleteSavedSearch: async (id) => {
    try {
      const res = await api.delete(`/marketplace/saved-searches/${id}`);
      return res.data;
    } catch (err) {
      console.error('API error deleting saved search:', err);
      throw err;
    }
  },

  // Market Insights
  getMarketInsights: async () => {
    try {
      const res = await api.get('/marketplace/insights');
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return MOCK_INSIGHTS;
    } catch (err) {
      console.warn('API error fetching market insights, falling back to mock:', err);
      return MOCK_INSIGHTS;
    }
  }
};

export default marketplaceService;
