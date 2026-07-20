import api from '../../services/api';

export const weatherService = {
  getWeather: async (location) => {
    const query = location ? `?location=${encodeURIComponent(location)}` : '';
    const response = await api.get(`/weather${query}`);
    return response.data;
  }
};

export default weatherService;
