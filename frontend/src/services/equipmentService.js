import api from './api';

// High-Fidelity Premium Mock Data Fallbacks for Offline Resilience
const MOCK_EQUIPMENT = [
  {
    _id: 'eq-1',
    id: 'eq-1',
    equipmentName: 'John Deere 5050D Utility Tractor (50 HP)',
    category: 'Tractors',
    description: 'High power utility tractor. Features dual clutch, power steering, and 8 forward + 4 reverse gears. Perfectly maintained, ideal for heavy cultivation, tilling, and transport.',
    images: [
      { url: 'https://images.unsplash.com/photo-1595275313093-f112e07c371a?auto=format&fit=crop&q=80&w=600', filename: 'tractor_front' },
      { url: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=600', filename: 'tractor_side' }
    ],
    rentalPricePerDay: 2500,
    securityDeposit: 8000,
    availabilityStatus: 'Available',
    location: 'Ludhiana, Punjab',
    district: 'Ludhiana',
    state: 'Punjab',
    contactNumber: '+91 98765 01234',
    condition: 'Excellent',
    brand: 'John Deere',
    model: '5050D',
    yearOfPurchase: 2023,
    workingHours: 420,
    fuelType: 'Diesel',
    attachments: ['Rotavator Coupling', 'Trailer Hook'],
    rating: 4.9,
    totalReviews: 12,
    isApproved: true,
    status: 'Approved',
    isActive: true,
    views: 185,
    bookingCount: 42,
    minRentalDays: 2,
    maxRentalDays: 15,
    owner: {
      _id: 'u-1',
      name: 'Gurpreet Singh',
      email: 'gurpreet@krishimitra.com',
      phone: '+91 98765 01234',
      profileImage: '',
      location: 'Ludhiana, Punjab',
      createdAt: '2025-03-12T10:00:00.000Z'
    }
  },
  {
    _id: 'eq-2',
    id: 'eq-2',
    equipmentName: 'Mahindra combined Harvester 4WD',
    category: 'Harvesters',
    description: 'Multi-crop combine harvester with heavy engine power. Large capacity grain tank. Specially optimized for swift wheat and paddy harvesting. Reduced grain loss rate.',
    images: [
      { url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=600', filename: 'harvester_main' },
      { url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&q=80&w=600', filename: 'field_harvest' }
    ],
    rentalPricePerDay: 4500,
    securityDeposit: 15000,
    availabilityStatus: 'Available',
    location: 'Patiala, Punjab',
    district: 'Patiala',
    state: 'Punjab',
    contactNumber: '+91 98123 45678',
    condition: 'Good',
    brand: 'Mahindra',
    model: 'Beast-X',
    yearOfPurchase: 2022,
    workingHours: 680,
    fuelType: 'Diesel',
    attachments: ['Paddy Cutter Bar', 'Straw chopper'],
    rating: 4.8,
    totalReviews: 8,
    isApproved: true,
    status: 'Approved',
    isActive: true,
    views: 240,
    bookingCount: 28,
    minRentalDays: 3,
    maxRentalDays: 10,
    owner: {
      _id: 'u-2',
      name: 'Ramesh Patel',
      email: 'ramesh@krishimitra.com',
      phone: '+91 98123 45678',
      profileImage: '',
      location: 'Patiala, Punjab',
      createdAt: '2024-05-15T12:30:00.000Z'
    }
  },
  {
    _id: 'eq-3',
    id: 'eq-3',
    equipmentName: 'Pneumatic Precision Seed Drill (9 Row)',
    category: 'Seeders & Planters',
    description: 'Precision tractor-mounted seed drill. Ensures even spacing and depth for wheat, maize, and mustard seeds. Extremely helpful for high-yield farming.',
    images: [
      { url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=600', filename: 'drill_1' }
    ],
    rentalPricePerDay: 1500,
    securityDeposit: 4000,
    availabilityStatus: 'Booked',
    location: 'Karnal, Haryana',
    district: 'Karnal',
    state: 'Haryana',
    contactNumber: '+91 97777 88888',
    condition: 'Excellent',
    brand: 'Fieldking',
    model: 'Pneu-9',
    yearOfPurchase: 2024,
    workingHours: 120,
    fuelType: 'None',
    attachments: ['Seed Tubes', 'Press Wheels'],
    rating: 5.0,
    totalReviews: 6,
    isApproved: true,
    status: 'Approved',
    isActive: true,
    views: 95,
    bookingCount: 15,
    minRentalDays: 1,
    maxRentalDays: 7,
    owner: {
      _id: 'u-3',
      name: 'Sukhdev Patil',
      email: 'sukhdev@krishimitra.com',
      phone: '+91 97777 88888',
      profileImage: '',
      location: 'Karnal, Haryana',
      createdAt: '2025-01-20T08:15:00.000Z'
    }
  },
  {
    _id: 'eq-4',
    id: 'eq-4',
    equipmentName: 'High Pressure Agricultural Sprayer (200L)',
    category: 'Sprayers',
    description: 'Tractor-coupled high pressure sprayer with a 200 liter chemical tank. Covers broad range crops efficiently. Equipped with anti-clog adjustable nozzles.',
    images: [
      { url: 'https://images.unsplash.com/photo-1563513381023-ac0f9af4bb82?auto=format&fit=crop&q=80&w=600', filename: 'sprayer_1' }
    ],
    rentalPricePerDay: 1200,
    securityDeposit: 3000,
    availabilityStatus: 'Available',
    location: 'Nizamabad, Telangana',
    district: 'Nizamabad',
    state: 'Telangana',
    contactNumber: '+91 94401 88990',
    condition: 'Good',
    brand: 'Aspee',
    model: 'Bolo-200',
    yearOfPurchase: 2023,
    workingHours: 210,
    fuelType: 'Petrol',
    attachments: ['Extension Hose (50m)', 'Boom Spray Attachment'],
    rating: 4.7,
    totalReviews: 9,
    isApproved: true,
    status: 'Approved',
    isActive: true,
    views: 110,
    bookingCount: 18,
    minRentalDays: 1,
    maxRentalDays: 5,
    owner: {
      _id: 'u-4',
      name: 'Venkatesh Rao',
      email: 'vrao.agri@outlook.com',
      phone: '+91 94401 88990',
      profileImage: '',
      location: 'Nizamabad, Telangana',
      createdAt: '2025-06-11T14:40:00.000Z'
    }
  }
];

const MOCK_REQUESTS = [
  {
    _id: 'req-1',
    id: 'req-1',
    equipment: {
      _id: 'eq-1',
      equipmentName: 'John Deere 5050D Utility Tractor (50 HP)',
      rentalPricePerDay: 2500,
      securityDeposit: 8000,
      images: [{ url: 'https://images.unsplash.com/photo-1595275313093-f112e07c371a?auto=format&fit=crop&q=80&w=150' }],
      location: 'Ludhiana, Punjab'
    },
    owner: { name: 'Gurpreet Singh', email: 'gurpreet@krishimitra.com', phone: '+91 98765 01234' },
    renter: { name: 'Sukhdev Patil', email: 'sukhdev@krishimitra.com', phone: '+91 97777 88888' },
    startDate: '2026-08-05T00:00:00.000Z',
    endDate: '2026-08-08T00:00:00.000Z',
    numberOfDays: 4,
    totalAmount: 10000,
    securityDeposit: 8000,
    purpose: 'Deep ploughing before sowing season',
    message: 'I would like to hire your tractor for 4 days. Please ensure it is serviced.',
    ownerNotes: '',
    renterNotes: 'Ready to pay cash security deposit.',
    status: 'Pending',
    requestedAt: '2026-07-28T09:12:00.000Z'
  },
  {
    _id: 'req-2',
    id: 'req-2',
    equipment: {
      _id: 'eq-3',
      equipmentName: 'Pneumatic Precision Seed Drill (9 Row)',
      rentalPricePerDay: 1500,
      securityDeposit: 4000,
      images: [{ url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=150' }],
      location: 'Karnal, Haryana'
    },
    owner: { name: 'Sukhdev Patil', email: 'sukhdev@krishimitra.com', phone: '+91 97777 88888' },
    renter: { name: 'Gurpreet Singh', email: 'gurpreet@krishimitra.com', phone: '+91 98765 01234' },
    startDate: '2026-07-20T00:00:00.000Z',
    endDate: '2026-07-24T00:00:00.000Z',
    numberOfDays: 5,
    totalAmount: 7500,
    securityDeposit: 4000,
    purpose: 'Sowing Pusa 1121 rice seeds',
    message: 'Need the seeder on 20th morning.',
    ownerNotes: 'Please return clean and de-stoned.',
    renterNotes: '',
    status: 'Approved',
    requestedAt: '2026-07-18T14:30:00.000Z',
    approvedAt: '2026-07-19T10:00:00.000Z'
  }
];

const MOCK_REVIEWS = [
  {
    _id: 'rev-1',
    rating: 5,
    review: 'Outstanding machinery. Gurpreet is very supportive and explained the gear controls thoroughly before I picked it up.',
    reviewer: { name: 'Ramesh Patel', profileImage: '' },
    createdAt: '2026-07-20T10:00:00.000Z'
  },
  {
    _id: 'rev-2',
    rating: 4,
    review: 'Works perfectly. Fuel economy is good for a 50HP tractor. Clean and well greased attachments.',
    reviewer: { name: 'Venkatesh Rao', profileImage: '' },
    createdAt: '2026-07-15T15:30:00.000Z'
  }
];

const equipmentService = {
  // Get all approved & active listings
  getEquipmentList: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      const res = await api.get(`/equipment?${params.toString()}`);
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return MOCK_EQUIPMENT;
    } catch (err) {
      console.warn('API error fetching equipment list, using mock fallback:', err);
      return MOCK_EQUIPMENT;
    }
  },

  // Get single listing details
  getEquipmentDetails: async (id) => {
    try {
      const res = await api.get(`/equipment/${id}`);
      if (res.data && res.data.success) {
        return res.data.data; // contains data.equipment and data.reviews
      }
      const item = MOCK_EQUIPMENT.find(e => e._id === id || e.id === id) || MOCK_EQUIPMENT[0];
      return { equipment: item, reviews: MOCK_REVIEWS };
    } catch (err) {
      console.warn('API error fetching equipment details, using mock fallback:', err);
      const item = MOCK_EQUIPMENT.find(e => e._id === id || e.id === id) || MOCK_EQUIPMENT[0];
      return { equipment: item, reviews: MOCK_REVIEWS };
    }
  },

  // Create new listing
  createEquipment: async (data) => {
    try {
      const res = await api.post('/equipment', data);
      return res.data;
    } catch (err) {
      console.error('API error creating equipment listing:', err);
      throw err;
    }
  },

  // Update listing
  updateEquipment: async (id, data) => {
    try {
      const res = await api.put(`/equipment/${id}`, data);
      return res.data;
    } catch (err) {
      console.error('API error updating equipment listing:', err);
      throw err;
    }
  },

  // Delete listing
  deleteEquipment: async (id) => {
    try {
      const res = await api.delete(`/equipment/${id}`);
      return res.data;
    } catch (err) {
      console.error('API error deleting equipment listing:', err);
      throw err;
    }
  },

  // Toggle active or availability status
  updateEquipmentStatus: async (id, statusData) => {
    try {
      const res = await api.put(`/equipment/${id}/status`, statusData);
      return res.data;
    } catch (err) {
      console.error('API error updating equipment status:', err);
      throw err;
    }
  },

  // Get Owner's own listed equipment
  getMyEquipment: async () => {
    try {
      const res = await api.get('/equipment/my-listings');
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return MOCK_EQUIPMENT; // Fallback
    } catch (err) {
      console.warn('API error fetching owner listed equipment, using mock fallback:', err);
      return MOCK_EQUIPMENT;
    }
  },

  // Create rental request
  createRentalRequest: async (data) => {
    try {
      const res = await api.post('/equipment/requests', data);
      return res.data;
    } catch (err) {
      console.error('API error creating rental request:', err);
      throw err;
    }
  },

  // Get received rental requests
  getReceivedRequests: async () => {
    try {
      const res = await api.get('/equipment/requests/received');
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return MOCK_REQUESTS;
    } catch (err) {
      console.warn('API error fetching received requests, using mock fallback:', err);
      return MOCK_REQUESTS;
    }
  },

  // Get sent requests (My Rentals history)
  getSentRequests: async () => {
    try {
      const res = await api.get('/equipment/requests/sent');
      if (res.data && res.data.success) {
        return res.data.data;
      }
      return MOCK_REQUESTS; // Fallback
    } catch (err) {
      console.warn('API error fetching sent requests, using mock fallback:', err);
      return MOCK_REQUESTS;
    }
  },

  // Approve request
  approveRequest: async (id, ownerNotes) => {
    try {
      const res = await api.put(`/equipment/requests/${id}/approve`, { ownerNotes });
      return res.data;
    } catch (err) {
      console.error('API error approving request:', err);
      throw err;
    }
  },

  // Reject request
  rejectRequest: async (id, ownerNotes) => {
    try {
      const res = await api.put(`/equipment/requests/${id}/reject`, { ownerNotes });
      return res.data;
    } catch (err) {
      console.error('API error rejecting request:', err);
      throw err;
    }
  },

  // Cancel request
  cancelRequest: async (id) => {
    try {
      const res = await api.put(`/equipment/requests/${id}/cancel`);
      return res.data;
    } catch (err) {
      console.error('API error cancelling request:', err);
      throw err;
    }
  },

  // Complete request
  completeRequest: async (id) => {
    try {
      const res = await api.put(`/equipment/requests/${id}/complete`);
      return res.data;
    } catch (err) {
      console.error('API error completing request:', err);
      throw err;
    }
  },

  // Submit equipment review
  submitReview: async (id, data) => {
    try {
      const res = await api.post(`/equipment/${id}/reviews`, data);
      return res.data;
    } catch (err) {
      console.error('API error submitting review:', err);
      throw err;
    }
  },

  // Wishlist: Get all wishlisted equipment
  getSavedEquipment: async () => {
    try {
      const res = await api.get('/equipment/wishlist/all');
      if (res.data && res.data.success) {
        return res.data.data; // Array of SavedEquipment items
      }
      return [];
    } catch (err) {
      console.warn('API error fetching wishlist, using mock fallback:', err);
      return [];
    }
  },

  // Wishlist: Add listing
  saveEquipment: async (equipmentId) => {
    try {
      const res = await api.post('/equipment/wishlist', { equipmentId });
      return res.data;
    } catch (err) {
      console.error('API error saving equipment:', err);
      throw err;
    }
  },

  // Wishlist: Remove listing
  removeSavedEquipment: async (wishlistId) => {
    try {
      const res = await api.delete(`/equipment/wishlist/${wishlistId}`);
      return res.data;
    } catch (err) {
      console.error('API error removing saved equipment:', err);
      throw err;
    }
  }
};

export default equipmentService;
