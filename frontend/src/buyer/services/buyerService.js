import api from '../../services/api';

// Rich Mock Data for Fallback & Offline Resilience
const MOCK_PRODUCTS = [
  {
    id: 'crop-101',
    name: 'Sharbati Organic Wheat',
    farmerName: 'Gurpreet Singh',
    location: 'Ludhiana, Punjab',
    availableQuantity: '250 Quintals',
    price: 2850,
    priceUnit: '/ Quintal',
    qualityGrade: 'A+',
    isOrganic: true,
    isVerified: true,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600',
    description: '100% Organically grown Sharbati Wheat, harvested naturally without synthetic pesticides. High protein content and golden luster.'
  },
  {
    id: 'crop-102',
    name: '1121 Super Basmati Rice',
    farmerName: 'Ramesh Patel',
    location: 'Karnal, Haryana',
    availableQuantity: '400 Quintals',
    price: 4900,
    priceUnit: '/ Quintal',
    qualityGrade: 'A',
    isOrganic: false,
    isVerified: true,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
    description: 'Aged extra long grain 1121 Basmati Rice. High aroma and elongation ratio post cooking. Direct harvest from prime fields.'
  },
  {
    id: 'crop-103',
    name: 'Desi Red Onions',
    farmerName: 'Sunil Deshmukh',
    location: 'Nashik, Maharashtra',
    availableQuantity: '180 Quintals',
    price: 1850,
    priceUnit: '/ Quintal',
    qualityGrade: 'A',
    isOrganic: true,
    isVerified: true,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=600',
    description: 'Sorted medium size fresh red onions with long shelf life. Cured naturally under sun shade.'
  },
  {
    id: 'crop-104',
    name: 'Golden Sweet Corn',
    farmerName: 'Anil Kumar',
    location: 'Mandya, Karnataka',
    availableQuantity: '120 Quintals',
    price: 1450,
    priceUnit: '/ Quintal',
    qualityGrade: 'B+',
    isOrganic: false,
    isVerified: true,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=600',
    description: 'Freshly harvested sweet corn cobs packed in breathable mesh crates. Ideal for freezing and canning plants.'
  },
  {
    id: 'crop-105',
    name: 'Kashmiri Saffron Grade 1',
    farmerName: 'Ghulam Nabi',
    location: 'Pampore, Jammu & Kashmir',
    availableQuantity: '15 kg',
    price: 165000,
    priceUnit: '/ kg',
    qualityGrade: 'A+',
    isOrganic: true,
    isVerified: true,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600',
    description: 'GI Tagged Pure Kashmiri Lacha Saffron. Deep red filaments with high crocin content for intense aroma and deep golden hue.'
  },
  {
    id: 'crop-106',
    name: 'Organic Turmeric Fingers',
    farmerName: 'Venkatesh Rao',
    location: 'Nizamabad, Telangana',
    availableQuantity: '300 Quintals',
    price: 7200,
    priceUnit: '/ Quintal',
    qualityGrade: 'A',
    isOrganic: true,
    isVerified: true,
    rating: 4.85,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
    description: 'Polished natural turmeric fingers with >4.5% curcumin content. Tested for heavy metals and purity.'
  }
];

const MOCK_FARMERS = [
  {
    id: 'farmer-201',
    name: 'Gurpreet Singh',
    location: 'Ludhiana, Punjab',
    primaryCrops: ['Sharbati Wheat', 'Basmati Rice', 'Mustard'],
    rating: 4.9,
    reviewsCount: 38,
    isVerified: true,
    experienceYears: 14,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    phone: '+91 98765 43210',
    farmSize: '28 Acres',
    certifications: ['FSSAI Organic', 'GlobalGAP']
  },
  {
    id: 'farmer-202',
    name: 'Ramesh Patel',
    location: 'Karnal, Haryana',
    primaryCrops: ['Basmati Rice', 'Durum Wheat'],
    rating: 4.8,
    reviewsCount: 45,
    isVerified: true,
    experienceYears: 19,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    phone: '+91 98123 76543',
    farmSize: '45 Acres',
    certifications: ['ISO 22000']
  },
  {
    id: 'farmer-203',
    name: 'Sunil Deshmukh',
    location: 'Nashik, Maharashtra',
    primaryCrops: ['Red Onions', 'Table Grapes', 'Pomegranate'],
    rating: 4.7,
    reviewsCount: 29,
    isVerified: true,
    experienceYears: 11,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    phone: '+91 97654 32109',
    farmSize: '18 Acres',
    certifications: ['NPOP Certified']
  },
  {
    id: 'farmer-204',
    name: 'Venkatesh Rao',
    location: 'Nizamabad, Telangana',
    primaryCrops: ['Turmeric', 'Chilli', 'Maize'],
    rating: 4.85,
    reviewsCount: 52,
    isVerified: true,
    experienceYears: 16,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    phone: '+91 94401 88990',
    farmSize: '32 Acres',
    certifications: ['Spices Board India', 'FSSAI']
  }
];

const MOCK_MARKET_PRICES = [
  { crop: 'Sharbati Wheat', todayPrice: 2850, yesterdayPrice: 2780, unit: '₹/Qtl', location: 'Khanna Mandi, Punjab', trend: 'up', changePct: '+2.5%' },
  { crop: '1121 Basmati Rice', todayPrice: 4900, yesterdayPrice: 4950, unit: '₹/Qtl', location: 'Karnal Mandi, Haryana', trend: 'down', changePct: '-1.0%' },
  { crop: 'Desi Red Onions', todayPrice: 1850, yesterdayPrice: 1720, unit: '₹/Qtl', location: 'Lasalgaon Mandi, Nashik', trend: 'up', changePct: '+7.5%' },
  { crop: 'Sweet Corn', todayPrice: 1450, yesterdayPrice: 1450, unit: '₹/Qtl', location: 'Azadpur Mandi, Delhi', trend: 'flat', changePct: '0.0%' },
  { crop: 'Organic Turmeric', todayPrice: 7200, yesterdayPrice: 7050, unit: '₹/Qtl', location: 'Erode Mandi, Tamil Nadu', trend: 'up', changePct: '+2.1%' },
  { crop: 'Teja Red Chilli', todayPrice: 19500, yesterdayPrice: 19100, unit: '₹/Qtl', location: 'Guntur Mandi, AP', trend: 'up', changePct: '+2.09%' }
];

const MOCK_ANALYTICS = {
  monthlyPurchases: [
    { month: 'Jan', amount: 120000, qty: 150 },
    { month: 'Feb', amount: 180000, qty: 220 },
    { month: 'Mar', amount: 210000, qty: 260 },
    { month: 'Apr', amount: 165000, qty: 190 },
    { month: 'May', amount: 240000, qty: 310 },
    { month: 'Jun', amount: 285000, qty: 380 }
  ],
  priceTrend: [
    { month: 'Jan', wheat: 2600, rice: 4600, onion: 1500 },
    { month: 'Feb', wheat: 2650, rice: 4700, onion: 1600 },
    { month: 'Mar', wheat: 2700, rice: 4750, onion: 1550 },
    { month: 'Apr', wheat: 2750, rice: 4800, onion: 1680 },
    { month: 'May', wheat: 2800, rice: 4850, onion: 1750 },
    { month: 'Jun', wheat: 2850, rice: 4900, onion: 1850 }
  ],
  categoryDistribution: [
    { name: 'Cereals & Grains', value: 45, color: '#10B981' },
    { name: 'Spices & Condiments', value: 25, color: '#F59E0B' },
    { name: 'Vegetables & Tubers', value: 20, color: '#3B82F6' },
    { name: 'Pulses & Legumes', value: 10, color: '#8B5CF6' }
  ],
  orderStatus: [
    { name: 'Completed', value: 24 },
    { name: 'Pending Delivery', value: 3 },
    { name: 'Cancelled', value: 1 }
  ]
};

export const buyerService = {
  getDashboard: async () => {
    try {
      const response = await api.get('/buyer/dashboard');
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend API /buyer/dashboard unavailable, utilizing mock fallback.');
    }
    return {
      stats: {
        availableProducts: 48,
        verifiedFarmers: 18,
        pendingOrders: 3,
        completedOrders: 24,
        wishlistItems: 7,
        monthlySpending: 285000
      },
      profile: {
        companyName: 'AgriCorp Trading Co.',
        businessType: 'Wholesaler',
        gstNumber: '06AAAAC1234H1Z5',
        phone: '+91 98765 00000',
        address: { street: 'GT Road Wholesale Hub', city: 'Karnal', state: 'Haryana', pincode: '132001' },
        preferredCrops: ['Basmati Rice', 'Durum Wheat', 'Organic Turmeric'],
        savedLocations: [
          { label: 'Central Distribution Hub', addressString: 'Karnal Industrial Area, Sector 3, Haryana', isDefault: true },
          { label: 'Sub-Depot West', addressString: 'Azadpur Terminal Yard, New Delhi', isDefault: false }
        ]
      },
      todayMarketSummary: {
        totalVolume: '14,250 Quintals',
        activeMandis: 42,
        priceTrendAvg: '+3.4%',
        topGainer: 'Organic Wheat (Grade A+)'
      },
      featuredProducts: MOCK_PRODUCTS.slice(0, 3)
    };
  },

  getProducts: async (filters = {}) => {
    try {
      const response = await api.get('/buyer/products');
      if (response.data && response.data.data && response.data.data.length > 0) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend API /buyer/products unavailable, utilizing mock fallback.');
    }
    return MOCK_PRODUCTS;
  },

  getFarmers: async () => {
    try {
      const response = await api.get('/buyer/farmers');
      if (response.data && response.data.data && response.data.data.length > 0) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend API /buyer/farmers unavailable, utilizing mock fallback.');
    }
    return MOCK_FARMERS;
  },

  getWishlist: async () => {
    try {
      const response = await api.get('/buyer/wishlist');
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend API /buyer/wishlist unavailable, utilizing mock fallback.');
    }
    return MOCK_PRODUCTS.slice(0, 3).map((crop, idx) => ({
      _id: `wish-${idx + 1}`,
      cropData: crop,
      createdAt: new Date().toISOString()
    }));
  },

  addToWishlist: async (cropData) => {
    try {
      const response = await api.post('/buyer/wishlist', { cropData });
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend API POST /buyer/wishlist unavailable, simulating local add.');
    }
    return {
      _id: `wish-${Date.now()}`,
      cropData,
      createdAt: new Date().toISOString()
    };
  },

  removeFromWishlist: async (id) => {
    try {
      const response = await api.delete(`/buyer/wishlist/${id}`);
      return response.data;
    } catch (err) {
      console.warn('Backend API DELETE /buyer/wishlist unavailable, simulating local remove.');
      return { success: true };
    }
  },

  getMarketPrices: async () => {
    return MOCK_MARKET_PRICES;
  },

  getAnalytics: async () => {
    return MOCK_ANALYTICS;
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/buyer/profile', profileData);
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend API PUT /buyer/profile unavailable, returning simulated updated profile.');
    }
    return profileData;
  }
};

export default buyerService;
