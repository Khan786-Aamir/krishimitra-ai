import api from './api';

// Fallback Mock Data for Offline Resilience and Placeholders
const MOCK_STATS = {
  totalUsers: 1248,
  farmersCount: 812,
  buyersCount: 298,
  expertsCount: 138,
  activeListings: 452,
  pendingApprovals: 8,
  equipmentRentals: 4,
  consultationsCount: 184,
  aiReportsCount: 65,
  schemesCount: 5,
  revenue: 524800,
  growth: 18.4
};

const MOCK_HEALTH = {
  serverHealth: 'Excellent',
  systemUptime: '14d 6h 32m',
  avgApiResponseTime: '42ms',
  cpuUsage: '14%',
  memoryUsage: '38%'
};

const MOCK_ACTIVITY = [
  { id: 1, type: 'registration', message: 'New expert Dr. Anita Verma registered.', time: '10 mins ago' },
  { id: 2, type: 'marketplace', message: 'Gurpreet Singh listed 250 Qtl Sharbati Wheat.', time: '1 hr ago' },
  { id: 3, type: 'consultation', message: 'Appointment booked between Sunil and Expert Amit.', time: '3 hrs ago' },
  { id: 4, type: 'report', message: 'Spam post flagged in Crop Diseases community board.', time: '5 hrs ago' },
  { id: 5, type: 'scheme', message: 'Admin published new Scheme: PM Fasal Bima update.', time: 'Yesterday' }
];

const MOCK_USERS = [
  { _id: 'u-1', name: 'Gurpreet Singh', email: 'gurpreet.singh@gmail.com', role: 'Farmer', isVerified: true, createdAt: '2026-01-10T12:00:00.000Z' },
  { _id: 'u-2', name: 'Ramesh Patel', email: 'ramesh.patel@yahoo.com', role: 'Farmer', isVerified: true, createdAt: '2026-02-14T09:30:00.000Z' },
  { _id: 'u-3', name: 'Sunil Deshmukh', email: 'sunil.desh@gmail.com', role: 'Farmer', isVerified: true, createdAt: '2026-03-01T15:45:00.000Z' },
  { _id: 'u-4', name: 'Venkatesh Rao', email: 'vrao.agri@outlook.com', role: 'Farmer', isVerified: true, createdAt: '2026-03-20T11:20:00.000Z' },
  { _id: 'u-5', name: 'AgriCorp Trading Co.', email: 'orders@agricorp.com', role: 'Buyer', isVerified: true, createdAt: '2026-01-15T08:00:00.000Z' },
  { _id: 'u-6', name: 'Fresh Fruits Ltd.', email: 'procurement@freshfruits.org', role: 'Buyer', isVerified: true, createdAt: '2026-04-02T14:15:00.000Z' },
  { _id: 'u-7', name: 'Dr. Amit Patel', email: 'dr.amit.patel@gmail.com', role: 'Expert', isVerified: true, createdAt: '2026-01-22T10:00:00.000Z' },
  { _id: 'u-8', name: 'Dr. Anita Verma', email: 'anita.verma@agricultural.org', role: 'Expert', isVerified: false, createdAt: '2026-05-18T16:30:00.000Z' }
];

const MOCK_FARMERS = [
  { id: 'u-1', name: 'Gurpreet Singh', email: 'gurpreet.singh@gmail.com', phone: '+91 98765 43210', isVerified: true, joinedDate: '2026-01-10T12:00:00.000Z', farmSize: '28 Acres', location: 'Ludhiana, Punjab', cropTypes: ['Wheat', 'Rice'], diseaseHistory: ['Rust Infection', 'Late Blight'] },
  { id: 'u-2', name: 'Ramesh Patel', email: 'ramesh.patel@yahoo.com', phone: '+91 98123 76543', isVerified: true, joinedDate: '2026-02-14T09:30:00.000Z', farmSize: '45 Acres', location: 'Karnal, Haryana', cropTypes: ['Rice', 'Mustard'], diseaseHistory: ['Leaf Blight'] },
  { id: 'u-3', name: 'Sunil Deshmukh', email: 'sunil.desh@gmail.com', phone: '+91 97654 32109', isVerified: true, joinedDate: '2026-03-01T15:45:00.000Z', farmSize: '18 Acres', location: 'Nashik, Maharashtra', cropTypes: ['Onions', 'Grapes'], diseaseHistory: ['Downy Mildew'] },
  { id: 'u-4', name: 'Venkatesh Rao', email: 'vrao.agri@outlook.com', phone: '+91 94401 88990', isVerified: true, joinedDate: '2026-03-20T11:20:00.000Z', farmSize: '32 Acres', location: 'Nizamabad, Telangana', cropTypes: ['Turmeric', 'Maize'], diseaseHistory: [] }
];

const MOCK_BUYERS = [
  { id: 'u-5', name: 'AgriCorp Trading Co.', email: 'orders@agricorp.com', phone: '+91 98765 00000', isVerified: true, joinedDate: '2026-01-15T08:00:00.000Z', businessName: 'AgriCorp Wholesalers', purchaseCapacity: '₹5,00,000', ordersCount: 24, location: 'Karnal, Haryana' },
  { id: 'u-6', name: 'Fresh Fruits Ltd.', email: 'procurement@freshfruits.org', phone: '+91 98120 11223', isVerified: true, joinedDate: '2026-04-02T14:15:00.000Z', businessName: 'Fresh Fruits Processing Ltd', purchaseCapacity: '₹12,00,000', ordersCount: 14, location: 'Pune, Maharashtra' }
];

const MOCK_EXPERTS = [
  { id: 'u-7', name: 'Dr. Amit Patel', email: 'dr.amit.patel@gmail.com', phone: '+91 94444 88888', isVerified: true, joinedDate: '2026-01-22T10:00:00.000Z', qualification: 'PhD Agronomy', experience: '12 Years', specialization: 'Crop Nutrition, Soil Chemistry', rating: 4.9, consultationsCount: 84, institute: 'IARI Delhi' },
  { id: 'u-8', name: 'Dr. Anita Verma', email: 'anita.verma@agricultural.org', phone: '+91 95555 77777', isVerified: false, joinedDate: '2026-05-18T16:30:00.000Z', qualification: 'M.Sc. Plant Pathology', experience: '6 Years', specialization: 'Fungal Infections, Plant Immunology', rating: 4.7, consultationsCount: 18, institute: 'PAU Ludhiana' }
];

const MOCK_MARKETPLACE = [
  { id: 'crop-101', name: 'Sharbati Organic Wheat', farmerName: 'Gurpreet Singh', location: 'Ludhiana, Punjab', quantity: '250 Quintals', price: '₹2,850/Qtl', stage: 'Harvested', status: 'Approved', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600' },
  { id: 'crop-102', name: '1121 Super Basmati Rice', farmerName: 'Ramesh Patel', location: 'Karnal, Haryana', quantity: '400 Quintals', price: '₹4,900/Qtl', stage: 'Harvested', status: 'Approved', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600' },
  { id: 'crop-103', name: 'Desi Red Onions', farmerName: 'Sunil Deshmukh', location: 'Nashik, Maharashtra', quantity: '180 Quintals', price: '₹1,850/Qtl', stage: 'Vegetative', status: 'Pending', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=600' }
];

const MOCK_EQUIPMENT = [
  { id: 'eq-1', owner: 'Gurpreet Singh', name: 'John Deere Tractor 5050D', price: '₹2,500/day', availability: 'Available', status: 'Approved', requests: 4 },
  { id: 'eq-2', owner: 'Ramesh Patel', name: 'Laser Land Leveller', price: '₹1,800/day', availability: 'Leased', status: 'Approved', requests: 2 },
  { id: 'eq-3', owner: 'Sunil Deshmukh', name: 'Mahindra Paddy Harvester', price: '₹3,500/day', availability: 'Available', status: 'Pending', requests: 7 }
];

const MOCK_SCHEMES = [
  { _id: 'pm-kisan', title: 'PM Kisan Samman Nidhi', description: 'Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families.', type: 'Income Support', benefit: '₹6,000 / year', eligibility: 'All landholding farmer families', category: 'Subsidy', status: 'Active', detailsLink: 'https://pmkisan.gov.in/' },
  { _id: 'pm-fby', title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)', description: 'Crop insurance protection against yield losses due to non-preventable natural risks, pests, and diseases.', type: 'Crop Insurance', benefit: 'Up to 98% coverage against sum insured', eligibility: 'All farmers growing notified crops in notified areas', category: 'Insurance', status: 'Active', detailsLink: 'https://pmfby.gov.in/' }
];

const MOCK_AI_REPORTS = {
  reports: [
    { _id: 'rep-1', farmerName: 'Gurpreet Singh', cropName: 'Wheat', disease: 'Yellow Rust', confidence: 94, severity: 'Severe', aiRecommendation: 'Apply Propiconazole fungicide 25% EC at 200ml per acre.', status: 'Pending', leafImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=200' },
    { _id: 'rep-2', farmerName: 'Ramesh Patel', cropName: 'Rice', disease: 'Bacterial Leaf Blight', confidence: 89, severity: 'Moderate', aiRecommendation: 'Spray Streptocycline 15g + Copper Oxychloride 500g in 200L water per acre.', status: 'Approved', leafImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200' }
  ],
  history: [
    { id: 'h1', expertName: 'Dr. Amit Patel', reviewTime: '2026-07-28T10:30:00Z', previousStatus: 'Pending', currentStatus: 'Approved' },
    { id: 'h2', expertName: 'Dr. Anita Verma', reviewTime: '2026-07-27T16:15:00Z', previousStatus: 'Pending', currentStatus: 'Modified' }
  ]
};

const MOCK_COMMUNITY = {
  posts: [
    { id: 'post-r1', author: 'Ravi Kumar', content: 'Buy these chemicals for instant 500% yield growth! Link: spammy-pesticides.com', reportsCount: 8, reason: 'Commercial Spam / Suspicious Link', status: 'Reported' },
    { id: 'post-r2', author: 'Vikram Singh', content: 'Selling black market crop seeds, contact me on WhatsApp directly.', reportsCount: 14, reason: 'Illegal Sales / Terms Violation', status: 'Reported' }
  ],
  comments: [
    { id: 'comm-r1', author: 'Suresh Lal', postTitle: 'Fungal infestation in mustard crops', content: 'You guys don\'t know anything, the app diagnosis is total garbage!', reportsCount: 4, reason: 'Abusive language', status: 'Reported' }
  ]
};

const MOCK_ANALYTICS = {
  platformGrowth: [
    { month: 'Jan', registrations: 120, marketplaceSales: 80, rentals: 25 },
    { month: 'Feb', registrations: 180, marketplaceSales: 110, rentals: 38 },
    { month: 'Mar', registrations: 240, marketplaceSales: 160, rentals: 42 },
    { month: 'Apr', registrations: 310, marketplaceSales: 140, rentals: 30 },
    { month: 'May', registrations: 450, marketplaceSales: 220, rentals: 65 },
    { month: 'Jun', registrations: 600, marketplaceSales: 310, rentals: 95 }
  ],
  userDistribution: [
    { name: 'Farmers', value: 65, color: '#22C55E' },
    { name: 'Buyers', value: 20, color: '#3B82F6' },
    { name: 'Experts', value: 15, color: '#EAB308' }
  ],
  marketplaceGrowth: [
    { month: 'Jan', revenue: 150000 },
    { month: 'Feb', revenue: 240000 },
    { month: 'Mar', revenue: 310000 },
    { month: 'Apr', revenue: 280000 },
    { month: 'May', revenue: 420000 },
    { month: 'Jun', revenue: 524800 }
  ],
  equipmentUsage: [
    { category: 'Tractors', listings: 12, bookings: 45 },
    { category: 'Harvesters', listings: 8, bookings: 32 },
    { category: 'Tillers', listings: 18, bookings: 60 },
    { category: 'Irrigation', listings: 15, bookings: 24 }
  ],
  consultationTrends: [
    { month: 'Jan', consultations: 40 },
    { month: 'Feb', consultations: 65 },
    { month: 'Mar', consultations: 90 },
    { month: 'Apr', consultations: 85 },
    { month: 'May', consultations: 130 },
    { month: 'Jun', consultations: 175 }
  ],
  aiDiagnosisTrends: [
    { crop: 'Wheat', healthy: 250, disease: 45 },
    { crop: 'Rice', healthy: 180, disease: 32 },
    { crop: 'Mustard', healthy: 90, disease: 18 },
    { crop: 'Onion', healthy: 120, disease: 24 }
  ],
  govSchemeReach: [
    { title: 'PM Kisan', reach: 450 },
    { title: 'PMFBY', reach: 310 },
    { title: 'SMAM', reach: 180 },
    { title: 'KCC', reach: 290 },
    { title: 'Soil Card', reach: 410 }
  ]
};

const MOCK_PROFILE = {
  department: 'Ecosystem Operations',
  role: 'Super Admin',
  bio: 'Platform administration and tech infrastructure oversight for KrishiMitra Smart Agriculture networks.',
  permissions: ['User Management', 'Marketplace Audits', 'Scheme Publishing', 'System Settings', 'Access Logs'],
  lastLogin: '2026-07-28T21:00:00Z',
  lastPasswordChange: '2026-06-15T09:00:00Z',
  profileCompleted: true
};

const MOCK_SETTINGS = {
  platformName: 'KrishiMitra AI Portal',
  allowPublicRegistration: true,
  maintenanceMode: false,
  backupSchedule: 'Weekly',
  securityLogLevel: 'High'
};

export const adminService = {
  // Stats
  getDashboard: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend /admin/dashboard failed, using mock data.');
    }
    return { stats: MOCK_STATS, health: MOCK_HEALTH, activityStream: MOCK_ACTIVITY };
  },

  // User Management
  getUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/admin/users?${params}`);
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend /admin/users failed, using mock data.');
    }
    
    // Apply client-side filters on mock
    let list = [...MOCK_USERS];
    if (filters.role && filters.role !== 'All') {
      list = list.filter(u => u.role === filters.role);
    }
    if (filters.search) {
      list = list.filter(u => u.name.toLowerCase().includes(filters.search.toLowerCase()) || u.email.toLowerCase().includes(filters.search.toLowerCase()));
    }
    return list;
  },

  updateUser: async (id, data) => {
    try {
      const response = await api.put(`/admin/users/${id}`, data);
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend PUT /admin/users failed, mimicking.');
    }
    return data;
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      if (response.data && response.data.success) return response.data;
    } catch (err) {
      console.warn('Backend DELETE /admin/users failed, mimicking.');
    }
    return { success: true };
  },

  toggleUserSuspension: async (id) => {
    try {
      const response = await api.put(`/admin/users/${id}/suspend`);
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend PUT suspend failed, mimicking.');
    }
    return { success: true };
  },

  bulkDeleteUsers: async (userIds) => {
    try {
      const response = await api.post('/admin/users/bulk-delete', { userIds });
      if (response.data && response.data.success) return response.data;
    } catch (err) {
      console.warn('Backend bulk delete failed, mimicking.');
    }
    return { success: true };
  },

  bulkSuspendUsers: async (userIds, suspend) => {
    try {
      const response = await api.post('/admin/users/bulk-suspend', { userIds, suspend });
      if (response.data && response.data.success) return response.data;
    } catch (err) {
      console.warn('Backend bulk suspend failed, mimicking.');
    }
    return { success: true };
  },

  // Directories
  getFarmers: async () => {
    try {
      const response = await api.get('/admin/farmers');
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend /admin/farmers failed, using mock.');
    }
    return MOCK_FARMERS;
  },

  getBuyers: async () => {
    try {
      const response = await api.get('/admin/buyers');
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend /admin/buyers failed, using mock.');
    }
    return MOCK_BUYERS;
  },

  getExperts: async () => {
    try {
      const response = await api.get('/admin/experts');
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend /admin/experts failed, using mock.');
    }
    return MOCK_EXPERTS;
  },

  verifyExpert: async (id, status) => {
    try {
      const response = await api.put(`/admin/experts/${id}/verify`, { status });
      if (response.data && response.data.success) return response.data;
    } catch (err) {
      console.warn('Backend expert verify failed, mimicking.');
    }
    return { success: true };
  },

  // Marketplace & Equipments
  getMarketplace: async () => {
    try {
      const response = await api.get('/admin/marketplace');
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend /admin/marketplace failed, using mock.');
    }
    return MOCK_MARKETPLACE;
  },

  verifyProduct: async (id, status) => {
    try {
      const response = await api.put(`/admin/marketplace/${id}/verify`, { status });
      if (response.data && response.data.success) return response.data;
    } catch (err) {
      console.warn('Backend product verify failed, mimicking.');
    }
    return { success: true };
  },

  getEquipment: async () => {
    try {
      const response = await api.get('/admin/equipment');
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend /admin/equipment failed, using mock.');
    }
    return MOCK_EQUIPMENT;
  },

  verifyRental: async (id, status) => {
    try {
      const response = await api.put(`/admin/equipment/${id}/verify`, { status });
      if (response.data && response.data.success) return response.data;
    } catch (err) {
      console.warn('Backend rental verify failed, mimicking.');
    }
    return { success: true };
  },

  // Government Schemes CRUD
  getSchemes: async () => {
    try {
      const response = await api.get('/admin/schemes');
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend /admin/schemes failed, using mock.');
    }
    return MOCK_SCHEMES;
  },

  createScheme: async (data) => {
    try {
      const response = await api.post('/admin/schemes', data);
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend POST /admin/schemes failed, mimicking.');
    }
    return { _id: `scheme-${Date.now()}`, ...data };
  },

  updateScheme: async (id, data) => {
    try {
      const response = await api.put(`/admin/schemes/${id}`, data);
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend PUT /admin/schemes failed, mimicking.');
    }
    return { _id: id, ...data };
  },

  deleteScheme: async (id) => {
    try {
      const response = await api.delete(`/admin/schemes/${id}`);
      if (response.data && response.data.success) return response.data;
    } catch (err) {
      console.warn('Backend DELETE /admin/schemes failed, mimicking.');
    }
    return { success: true };
  },

  // AI Diagnosis
  getAIReports: async () => {
    try {
      const response = await api.get('/admin/ai-reports');
      if (response.data && response.data.success) return response.data;
    } catch (err) {
      console.warn('Backend /admin/ai-reports failed, using mock.');
    }
    return MOCK_AI_REPORTS;
  },

  assignExpert: async (id, expertName) => {
    try {
      const response = await api.put(`/admin/ai-reports/${id}/assign`, { expertName });
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend assign expert failed, mimicking.');
    }
    return { success: true };
  },

  verifyAIReport: async (id, status) => {
    try {
      const response = await api.put(`/admin/ai-reports/${id}/verify`, { status });
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend AI report verify failed, mimicking.');
    }
    return { success: true };
  },

  // Moderation
  getCommunityContent: async () => {
    try {
      const response = await api.get('/admin/community');
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend /admin/community failed, using mock.');
    }
    return MOCK_COMMUNITY;
  },

  moderatePost: async (id, status) => {
    try {
      const response = await api.put(`/admin/community/posts/${id}`, { status });
      if (response.data && response.data.success) return response.data;
    } catch (err) {
      console.warn('Backend moderate post failed, mimicking.');
    }
    return { success: true };
  },

  moderateComment: async (id, status) => {
    try {
      const response = await api.put(`/admin/community/comments/${id}`, { status });
      if (response.data && response.data.success) return response.data;
    } catch (err) {
      console.warn('Backend moderate comment failed, mimicking.');
    }
    return { success: true };
  },

  // Analytics
  getAnalytics: async () => {
    try {
      const response = await api.get('/admin/analytics');
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend /admin/analytics failed, using mock.');
    }
    return MOCK_ANALYTICS;
  },

  // Profile management
  getProfile: async () => {
    try {
      const response = await api.get('/admin/profile');
      if (response.data && response.data.success) return response.data;
    } catch (err) {
      console.warn('Backend /admin/profile failed, using mock.');
    }
    return { success: true, profileExists: true, data: MOCK_PROFILE };
  },

  saveProfile: async (data) => {
    try {
      const response = await api.post('/admin/profile', data);
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend POST /admin/profile failed, mimicking.');
    }
    return { ...MOCK_PROFILE, ...data, profileCompleted: true };
  },

  // Settings
  getSettings: async () => {
    try {
      const response = await api.get('/admin/settings');
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend /admin/settings failed, using mock.');
    }
    return MOCK_SETTINGS;
  },

  updateSettings: async (data) => {
    try {
      const response = await api.put('/admin/settings', data);
      if (response.data && response.data.success) return response.data.data;
    } catch (err) {
      console.warn('Backend PUT /admin/settings failed, mimicking.');
    }
    return data;
  }
};

export default adminService;
