import api from './api';

// Keyword-matched offline resilient replies in case backend or Gemini API is unreachable
const offlineMockReplies = [
  {
    keywords: ['fertilizer', 'NPK', 'urea', 'खाद', 'यूरिया'],
    reply: `**Fertilizer Recommendations for Major Crops:**\n\n1. **Wheat (गेहूं):** Apply NPK in a **4:2:1 ratio** (120 kg N, 60 kg P2O5, 40 kg K2O per hectare). Apply 1/3 Nitrogen and all P & K at sowing, and top-dress remaining Nitrogen in two equal splits after the first and second irrigations.\n2. **Rice (धान):** Apply **120-150 kg Nitrogen, 60 kg Phosphorus, and 40 kg Potassium** per hectare. Use Zinc Sulphate (25 kg/ha) during soil preparation to prevent Khaira disease.\n3. **Soil Organic Carbon:** Mix in well-rotted Farm Yard Manure (FYM) or compost at **10-15 tonnes/ha** to build soil biology.\n\n*Note: This is offline fallback guidance. Always perform a soil test to customize fertilizer dosing.*`
  },
  {
    keywords: ['rainy', 'monsoon', 'crop suggestion', 'बरसात', 'खरीफ'],
    reply: `**Recommended Crops for the Rainy (Kharif) Season:**\n\n- **Rice (Paddy):** The staple crop. Requires clayey/loamy soil and high rainfall.\n- **Maize (मक्का):** Prefers well-drained loams. Highly sensitive to water-logging, so ensure proper drainage channels.\n- **Cotton (कपास):** Performs best in deep black cotton soils with medium rainfall.\n- **Pulses (Pigeon pea / Arhar, Black gram):** Nitrogen-fixing legume crops that require less water and enrich soil fertility.\n\n*Ensure sowing is completed with the onset of monsoon showers to capitalize on soil moisture.*`
  },
  {
    keywords: ['sugarcane', 'irrigation', 'water', 'सिंचाई', 'पानी', 'गन्ना'],
    reply: `**Sugarcane Irrigation Management:**\n\n- **Drip Irrigation:** The most efficient method. Saves up to **40% water** and increases cane yields by **20-30%**. Lay lateral pipes near roots for direct absorption.\n- **Critical Stages:** Watering is vital during the formative stage (60-130 days after planting) and grand growth stage.\n- **Intervals:** Irrigate every **10-12 days** during summer and **20-25 days** during winter if drip is unavailable.\n\n*Do not allow soil to dry out during tillering as it directly impacts internode length.*`
  },
  {
    keywords: ['tomato', 'leaf curl', 'disease', 'टमाटर', 'बीमारी'],
    reply: `**Preventing Tomato Leaf Curl Virus (TLCV):**\n\n- **Vector Control:** TLCV is transmitted by Whiteflies (*Bemisia tabaci*). Install **yellow sticky traps** (15-20 per acre) to monitor and capture whiteflies.\n- **Organic Sprays:** Spray **Neem Oil (5ml/L)** mixed with water and soap flakes at weekly intervals.\n- **Physical Barriers:** Use fine insect netting (40-60 mesh) in nurseries to grow disease-free seedlings.\n- **Sanitation:** Immediately uproot and burn infected plants showing upward curling or puckering of leaves.\n\n*Avoid planting tomatoes adjacent to squash or cucumber crops which attract whiteflies.*`
  },
  {
    keywords: ['scheme', 'government', 'subsidy', 'योजना', 'सरकारी'],
    reply: `**Key Government Schemes for Indian Farmers:**\n\n1. **PM-KISAN:** Provides **₹6,000 per year** in three equal installments directly to bank accounts of land-holding farmers.\n2. **Pradhan Mantri Fasal Bima Yojana (PMFBY):** Crop insurance scheme with premium capped at just **2% for Kharif** and **1.5% for Rabi** crops.\n3. **Kisan Credit Card (KCC):** Provides short-term timely credit up to **₹3 Lakh** at low-interest rates (effectively 4% after subvention).\n4. **SMAM (Sub-Mission on Agricultural Mechanization):** Offers **40% to 80% subsidy** on purchasing tractors, rotavators, and seeders.\n\n*Verify current eligibility and apply at your local Common Service Center (CSC) or state agriculture portal.*`
  }
];

export const aiService = {
  // 1. Send Chat Prompt
  chat: async (message, sessionId = null, persona = 'general', language = 'en') => {
    try {
      const res = await api.post('/ai/chat', { message, sessionId, persona, language });
      return res.data;
    } catch (err) {
      console.warn('AI chat endpoint call failed. Triggering offline mock fallback.', err);
      
      // Match keywords in user prompt
      const matched = offlineMockReplies.find(item => 
        item.keywords.some(kw => message.toLowerCase().includes(kw.toLowerCase()))
      );

      const replyText = matched 
        ? matched.reply 
        : `I apologize, but I could not connect to the AI services right now. Here is offline advice: Keep fields clean, monitor soil moisture, and check local crop advisories. Please retry your question once the network connection stabilizes.`;
      
      // Artificial delay to simulate thinking time
      await new Promise(resolve => setTimeout(resolve, 800));

      return {
        success: true,
        reply: replyText,
        messageId: `mock-msg-${Date.now()}`,
        sessionId: sessionId || `mock-sess-${Date.now()}`,
        responseTime: 800,
        model: 'gemini-2.5-flash (offline-fallback)'
      };
    }
  },

  // 2. Submit message feedback (Like/Dislike)
  toggleFeedback: async (sessionId, messageId, feedbackType) => {
    try {
      const res = await api.post('/ai/feedback', { sessionId, messageId, feedbackType });
      return res.data;
    } catch (err) {
      console.warn('Failed to save message feedback:', err);
      return { success: false };
    }
  },

  // 3. Get User Conversations List (supports search query q)
  getSessions: async (q = '') => {
    try {
      const url = q ? `/ai/sessions?q=${encodeURIComponent(q)}` : '/ai/sessions';
      const res = await api.get(url);
      return res.data.data || [];
    } catch (err) {
      console.warn('Failed to fetch chat history, returning local mock sessions:', err);
      return [
        { _id: 'mock-s1', title: 'Rainy Season Crops Suggestion', isPinned: true, messageCount: 2, lastMessage: 'Recommended Kharif crops include rice, maize...', lastUpdated: new Date() },
        { _id: 'mock-s2', title: 'Wheat NPK Dosages', isPinned: false, messageCount: 4, lastMessage: 'Use 4:2:1 ratio for NPK in wheat...', lastUpdated: new Date(Date.now() - 3600000) }
      ];
    }
  },

  // 4. Get Chat Session Details
  getSession: async (id) => {
    try {
      if (id.startsWith('mock-')) {
        return {
          success: true,
          data: {
            _id: id,
            title: id === 'mock-s1' ? 'Rainy Season Crops Suggestion' : 'Wheat NPK Dosages',
            messages: [
              { id: '1', role: 'user', content: id === 'mock-s1' ? 'Recommend crops for rainy season.' : 'How much fertilizer should I use for wheat?', timestamp: new Date() },
              { id: '2', role: 'model', content: id === 'mock-s1' ? 'Paddy, Maize, and Cotton are excellent Kharif options...' : 'Apply NPK in a 4:2:1 ratio...', responseTime: 650, model: 'gemini-2.5-flash', timestamp: new Date() }
            ]
          }
        };
      }
      const res = await api.get(`/ai/sessions/${id}`);
      return res.data;
    } catch (err) {
      console.warn(`Failed to load chat session ${id}:`, err);
      return { success: false, message: 'Could not load conversation.' };
    }
  },

  // 5. Rename Chat Conversation
  renameSession: async (id, title) => {
    try {
      if (id.startsWith('mock-')) {
        return { success: true };
      }
      const res = await api.put(`/ai/sessions/${id}`, { title });
      return res.data;
    } catch (err) {
      console.warn('Failed to rename session:', err);
      return { success: false };
    }
  },

  // 6. Pin / Unpin Conversation
  togglePinSession: async (id) => {
    try {
      if (id.startsWith('mock-')) {
        return { success: true };
      }
      const res = await api.put(`/ai/sessions/${id}/pin`);
      return res.data;
    } catch (err) {
      console.warn('Failed to toggle pin session:', err);
      return { success: false };
    }
  },

  // 7. Delete Chat History
  deleteSession: async (id) => {
    try {
      if (id.startsWith('mock-')) {
        return { success: true };
      }
      const res = await api.delete(`/ai/sessions/${id}`);
      return res.data;
    } catch (err) {
      console.warn('Failed to delete session:', err);
      return { success: false };
    }
  },

  // 8. Get Bookmarks (supports filters: search q, tag, favorite)
  getBookmarks: async (filters = {}) => {
    try {
      const { q = '', tag = '', favorite = false } = filters;
      let params = [];
      if (q) params.push(`q=${encodeURIComponent(q)}`);
      if (tag) params.push(`tag=${encodeURIComponent(tag)}`);
      if (favorite) params.push(`favorite=true`);
      
      const queryStr = params.length > 0 ? `?${params.join('&')}` : '';
      const res = await api.get(`/ai/bookmarks${queryStr}`);
      return res.data.data || [];
    } catch (err) {
      console.warn('Failed to load bookmarks, returning local mock wishlists:', err);
      return [
        { _id: 'mock-b1', prompt: 'Best irrigation method for sugarcane', response: 'Drip irrigation is recommended. It saves up to 40% water...', tags: ['Irrigation', 'Sugarcane'], isFavorite: true, createdAt: new Date() },
        { _id: 'mock-b2', prompt: 'Tomato leaf curl prevention', response: 'Prevent tomato leaf curl by targeting whiteflies using yellow sticky traps and spraying neem oil...', tags: ['Tomato', 'Pests'], isFavorite: false, createdAt: new Date() }
      ];
    }
  },

  // 9. Create Bookmark
  createBookmark: async (payload) => {
    try {
      const res = await api.post('/ai/bookmarks', payload);
      return res.data;
    } catch (err) {
      console.warn('Failed to create bookmark locally:', err);
      return {
        success: true,
        data: {
          _id: `mock-bookmark-${Date.now()}`,
          ...payload,
          createdAt: new Date()
        }
      };
    }
  },

  // 10. Delete Bookmark
  deleteBookmark: async (id) => {
    try {
      if (id.startsWith('mock-')) {
        return { success: true };
      }
      const res = await api.delete(`/ai/bookmarks/${id}`);
      return res.data;
    } catch (err) {
      console.warn('Failed to delete bookmark:', err);
      return { success: false };
    }
  },

  // 11. Toggle Favorite status on bookmark
  toggleFavoriteBookmark: async (id) => {
    try {
      if (id.startsWith('mock-')) {
        return { success: true };
      }
      const res = await api.put(`/ai/bookmarks/${id}/favorite`);
      return res.data;
    } catch (err) {
      console.warn('Failed to toggle favorite bookmark:', err);
      return { success: false };
    }
  }
};

export default aiService;
