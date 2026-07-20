import api from '../../services/api';

export const cropService = {
  getCrops: async () => {
    const response = await api.get('/farmer/crops');
    return response.data;
  },

  addCrop: async (cropData) => {
    const response = await api.post('/farmer/crops', cropData);
    return response.data;
  },

  updateCrop: async (id, cropData) => {
    const response = await api.put(`/farmer/crops/${id}`, cropData);
    return response.data;
  },

  deleteCrop: async (id) => {
    const response = await api.delete(`/farmer/crops/${id}`);
    return response.data;
  }
};

export default cropService;
