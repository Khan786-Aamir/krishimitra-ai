import api from './api';

/**
 * Maps the frontend role representation to the backend-accepted string.
 * Frontend displays "Agriculture Expert", backend expects "Expert".
 */
const mapRoleToBackend = (role) => {
  if (role === 'Agriculture Expert') return 'Expert';
  return role;
};

const authService = {
  /**
   * Registers a new user.
   * @param {Object} userData - User registration data
   * @param {string} userData.name
   * @param {string} userData.email
   * @param {string} userData.phone
   * @param {string} userData.password
   * @param {string} userData.role
   */
  register: async ({ name, email, phone, password, role }) => {
    const backendRole = mapRoleToBackend(role);
    return api.post('/auth/register', {
      name,
      email,
      phone,
      password,
      role: backendRole,
    });
  },

  /**
   * Logs in a user.
   * @param {string} email
   * @param {string} password
   */
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  /**
   * Logs out the user.
   */
  logout: async () => {
    return api.post('/auth/logout');
  },

  /**
   * Retrieves the current logged in user details.
   */
  getCurrentUser: async () => {
    return api.get('/auth/me');
  },
};

export default authService;
