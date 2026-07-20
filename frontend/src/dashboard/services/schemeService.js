import api from '../../services/api';

export const schemeService = {
  getSchemes: async () => {
    const response = await api.get('/schemes');
    return response.data;
  }
};

export default schemeService;
