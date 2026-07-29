const aiConfig = require('../config/aiConfig');
const geminiService = require('./geminiService');

/**
 * Global AI Provider Abstraction Interface.
 * Allows switching the underlying LLM provider (Gemini, OpenAI, Claude, Groq)
 * without impacting the rest of the application codebase.
 */
const generateChatResponse = async (history, prompt, options = {}) => {
  const provider = options.provider || aiConfig.activeProvider;

  switch (provider.toLowerCase()) {
    case 'gemini':
      return await geminiService.generateResponse(history, prompt, options);
    
    case 'openai':
      // Demonstration placeholder for future extension
      throw new Error('OpenAI provider selected but not implemented yet. Please configure GEMINI as the active provider.');
    
    case 'claude':
      // Demonstration placeholder for future extension
      throw new Error('Claude provider selected but not implemented yet. Please configure GEMINI as the active provider.');
      
    default:
      throw new Error(`AI Provider "${provider}" is currently not supported. Please use "gemini".`);
  }
};

module.exports = {
  generateChatResponse
};
