import api from '../../services/api';

const MOCK_REVIEWS = [
  {
    id: 'rev-301',
    farmerName: 'Baldev Singh',
    cropName: 'Sharbati Wheat',
    disease: 'Yellow Rust (Puccinia striiformis)',
    confidence: 94,
    severity: 'Severe',
    symptoms: ['Bright yellow pustules on upper leaf surface', 'Stripe pattern along leaf veins', 'Powdery spores on touch'],
    aiRecommendation: 'Apply Propiconazole 25% EC @ 1ml per liter of water immediately. Maintain field drainage to reduce humidity.',
    leafImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600',
    status: 'Pending',
    createdAt: '2026-07-20T10:30:00Z'
  },
  {
    id: 'rev-302',
    farmerName: 'Ramesh Patel',
    cropName: 'Basmati Paddy',
    disease: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
    confidence: 89,
    severity: 'Moderate',
    symptoms: ['Water-soaked lesions on leaf margins', 'Yellowing wavy margins extending towards leaf sheath'],
    aiRecommendation: 'Spray Streptocycline @ 6g + Copper Oxychloride @ 500g in 200L water per acre.',
    leafImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
    status: 'Pending',
    createdAt: '2026-07-20T08:15:00Z'
  },
  {
    id: 'rev-303',
    farmerName: 'Sunil Deshmukh',
    cropName: 'Red Onion',
    disease: 'Purple Blotch (Alternaria porri)',
    confidence: 91,
    severity: 'Mild',
    symptoms: ['Small water-soaked sunken lesions with purple centers', 'Leaf tip dieback'],
    aiRecommendation: 'Foliar spray of Mancozeb 75% WP @ 2.5g/L of water at 10-day intervals.',
    leafImage: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=600',
    status: 'Pending',
    createdAt: '2026-07-19T14:45:00Z'
  }
];

const MOCK_CONSULTATIONS = [
  {
    id: 'con-101',
    farmerName: 'Harpreet Gill',
    crop: 'Cotton (Bt)',
    issue: 'Sudden wilting and leaf reddening after recent rain spells.',
    priority: 'Urgent',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=600',
    status: 'Pending',
    requestedAt: '2026-07-20T11:00:00Z'
  },
  {
    id: 'con-102',
    farmerName: 'Suresh Kumar',
    crop: 'Sugarcane',
    issue: 'Top borer infestation observed in 4-month crop stand.',
    priority: 'High',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
    status: 'Accepted',
    requestedAt: '2026-07-20T09:30:00Z'
  },
  {
    id: 'con-103',
    farmerName: 'Mohan Lal',
    crop: 'Mustard',
    issue: 'White rust patches appearing on lower leaves.',
    priority: 'Medium',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600',
    status: 'Completed',
    requestedAt: '2026-07-19T16:00:00Z'
  }
];

const MOCK_APPOINTMENTS = [
  {
    id: 'app-501',
    farmerName: 'Gurpreet Singh',
    crop: 'Sharbati Wheat Inspection',
    date: 'Today, 2:30 PM',
    timeSlot: '02:30 PM - 03:00 PM',
    status: 'Upcoming'
  },
  {
    id: 'app-502',
    farmerName: 'Venkatesh Rao',
    crop: 'Organic Turmeric Curing Session',
    date: 'Today, 4:00 PM',
    timeSlot: '04:00 PM - 04:30 PM',
    status: 'Upcoming'
  },
  {
    id: 'app-503',
    farmerName: 'Anil Kumar',
    crop: 'Sweet Corn Field Assessment',
    date: 'Yesterday',
    timeSlot: '11:00 AM - 11:30 AM',
    status: 'Completed'
  }
];

const MOCK_ANALYTICS = {
  monthlyConsultations: [
    { month: 'Jan', count: 42, resolved: 38 },
    { month: 'Feb', count: 58, resolved: 54 },
    { month: 'Mar', count: 75, resolved: 70 },
    { month: 'Apr', count: 68, resolved: 65 },
    { month: 'May', count: 90, resolved: 86 },
    { month: 'Jun', count: 112, resolved: 108 }
  ],
  diseaseCategories: [
    { name: 'Fungal Blights', value: 40, color: '#10B981' },
    { name: 'Bacterial Wilts', value: 25, color: '#F59E0B' },
    { name: 'Pest Infestation', value: 20, color: '#EF4444' },
    { name: 'Nutrient Deficiency', value: 15, color: '#6366F1' }
  ],
  farmerSatisfaction: [
    { rating: '5 Stars', count: 110 },
    { rating: '4 Stars', count: 28 },
    { rating: '3 Stars', count: 4 }
  ]
};

export const expertService = {
  getDashboard: async () => {
    try {
      const response = await api.get('/expert/dashboard');
      if (response.data && response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend API /expert/dashboard unavailable, utilizing mock fallback.');
    }
    return {
      stats: {
        pendingReviews: 8,
        todayConsultations: 5,
        appointments: 12,
        farmerRequests: 14,
        rating: 4.9,
        totalConsultations: 142
      },
      hasProfile: true,
      profile: {
        qualification: 'Ph.D. in Plant Pathology',
        institute: 'Punjab Agricultural University (PAU), Ludhiana',
        experienceYears: 14,
        specializations: ['Cereal Crop Diseases', 'Organic Bio-Pesticides', 'Hydroponics & Precision Farming'],
        languages: ['English', 'Punjabi', 'Hindi'],
        consultationFee: 750,
        workingHours: '09:00 AM - 05:00 PM (Mon - Sat)',
        phone: '+91 98765 11223',
        bio: 'Senior Agronomist specializing in early-stage crop disease diagnostics, integrated pest management (IPM), and sustainable organic harvest optimization.',
        rating: 4.9,
        totalConsultations: 142
      }
    };
  },

  getProfile: async () => {
    try {
      const response = await api.get('/expert/profile');
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend API /expert/profile unavailable, returning mock profile.');
    }
    return {
      qualification: 'Ph.D. in Plant Pathology',
      institute: 'Punjab Agricultural University (PAU), Ludhiana',
      experienceYears: 14,
      specializations: ['Cereal Crop Diseases', 'Organic Bio-Pesticides', 'Hydroponics & Precision Farming'],
      languages: ['English', 'Punjabi', 'Hindi'],
      consultationFee: 750,
      workingHours: '09:00 AM - 05:00 PM (Mon - Sat)',
      phone: '+91 98765 11223',
      bio: 'Senior Agronomist specializing in early-stage crop disease diagnostics, integrated pest management (IPM), and sustainable organic harvest optimization.'
    };
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/expert/profile', profileData);
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend API PUT /expert/profile unavailable, simulating local profile update.');
    }
    return profileData;
  },

  getReviews: async () => {
    try {
      const response = await api.get('/expert/reviews');
      if (response.data && response.data.data && response.data.data.length > 0) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend API /expert/reviews unavailable, returning mock reviews.');
    }
    return MOCK_REVIEWS;
  },

  getConsultations: async () => {
    try {
      const response = await api.get('/expert/consultations');
      if (response.data && response.data.data && response.data.data.length > 0) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend API /expert/consultations unavailable, returning mock consultations.');
    }
    return MOCK_CONSULTATIONS;
  },

  acceptConsultation: async (id) => {
    try {
      const response = await api.post(`/expert/consultation/${id}/accept`);
      return response.data;
    } catch (err) {
      console.warn('Backend POST accept consultation simulation.');
      return { success: true };
    }
  },

  rejectConsultation: async (id) => {
    try {
      const response = await api.post(`/expert/consultation/${id}/reject`);
      return response.data;
    } catch (err) {
      console.warn('Backend POST reject consultation simulation.');
      return { success: true };
    }
  },

  completeConsultation: async (id) => {
    try {
      const response = await api.post(`/expert/consultation/${id}/complete`);
      return response.data;
    } catch (err) {
      console.warn('Backend POST complete consultation simulation.');
      return { success: true };
    }
  },

  getAppointments: async () => {
    try {
      const response = await api.get('/expert/appointments');
      if (response.data && response.data.data && response.data.data.length > 0) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend API /expert/appointments unavailable, returning mock appointments.');
    }
    return MOCK_APPOINTMENTS;
  },

  getAnalytics: async () => {
    return MOCK_ANALYTICS;
  }
};

export default expertService;
