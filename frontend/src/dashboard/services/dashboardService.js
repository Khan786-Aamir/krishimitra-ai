import api from '../../services/api';

export const dashboardService = {
  getDashboard: async () => {
    const response = await api.get('/farmer/dashboard');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/farmer/profile', profileData);
    return response.data;
  }
};

export default dashboardService;
