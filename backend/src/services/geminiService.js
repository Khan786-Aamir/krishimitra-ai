const { GoogleGenerativeAI } = require('@google/generative-ai');
const aiConfig = require('../config/aiConfig');
const promptTemplates = require('../utils/promptTemplates');

/**
 * Instantiates the Google Generative AI client.
 * Throws clean errors if API key is not configured.
 */
const getClient = () => {
  const apiKey = aiConfig.gemini.apiKey;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API_KEY_MISSING');
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Format custom persona instructions.
 */
const getSystemInstruction = (persona, language) => {
  const templateFn = promptTemplates[persona] || promptTemplates.general;
  return templateFn(language);
};

/**
 * Translate general chat history to Google Generative AI chat format.
 */
const formatHistoryForGemini = (history) => {
  return (history || []).map(msg => ({
    role: msg.role === 'assistant' ? 'model' : msg.role,
    parts: [{ text: msg.content }]
  }));
};

/**
 * Estimate token usage based on standard character-to-token ratio (~4 chars per token).
 */
const estimateTokens = (text) => Math.ceil((text || '').length / 4);

/**
 * Truncate history to fit within input tokens budget.
 */
const trimConversationHistory = (history, prompt, maxTokens = 6000) => {
  const promptTokens = estimateTokens(prompt);
  let trimmed = [...(history || [])];
  
  let totalTokens = promptTokens + trimmed.reduce((sum, msg) => sum + estimateTokens(msg.content), 0);
  
  // Truncate oldest exchanges (2 messages at a time to preserve context pairs)
  while (totalTokens > maxTokens && trimmed.length >= 2) {
    trimmed.shift(); // remove oldest user query
    trimmed.shift(); // remove oldest model reply
    totalTokens = promptTokens + trimmed.reduce((sum, msg) => sum + estimateTokens(msg.content), 0);
  }
  
  // Single backup shift if still too large
  if (totalTokens > maxTokens && trimmed.length > 0) {
    trimmed.shift();
  }
  
  return trimmed;
};

/**
 * Race a promise execution against a timeout interval.
 */
const runWithTimeout = (promise, ms = 20000) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('TIMEOUT_ERROR'));
    }, ms);
  });
  
  return Promise.race([
    promise.then(res => {
      clearTimeout(timeoutId);
      return res;
    }),
    timeoutPromise
  ]);
};

/**
 * Map error signatures to standard categorized system error states.
 */
const categorizeError = (error) => {
  const msg = error.message || '';
  
  if (msg === 'API_KEY_MISSING' || msg.includes('API key not valid') || msg.includes('API_KEY_INVALID') || msg.includes('key is invalid') || msg.includes('INVALID_ARGUMENT')) {
    return {
      type: 'INVALID_API_KEY',
      message: 'The AI assistant configuration has an invalid API key. Please check the backend .env setup.'
    };
  }
  
  if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429') || msg.includes('quota') || msg.includes('Quota exceeded')) {
    return {
      type: 'QUOTA_EXCEEDED',
      message: 'Gemini API quota has been exceeded. Please retry after some time.'
    };
  }
  
  if (msg === 'TIMEOUT_ERROR' || msg.includes('timeout') || msg.includes('ETIMEDOUT')) {
    return {
      type: 'TIMEOUT',
      message: 'The AI response took too long. Please verify server connectivity and retry.'
    };
  }
  
  if (msg.includes('SAFETY') || msg.includes('blocked') || msg.includes('Safety Settings') || msg === 'SAFETY_BLOCKED') {
    return {
      type: 'SAFETY_BLOCKED',
      message: 'Response blocked. The input query or AI output was flagged by content safety parameters.'
    };
  }
  
  if (msg.includes('ENOTFOUND') || msg.includes('ECONNREFUSED') || msg.includes('fetch failed')) {
    return {
      type: 'NETWORK_FAILURE',
      message: 'Network error. Failed to reach the Google AI services. Please check your internet connection.'
    };
  }
  
  return {
    type: 'GENERAL_ERROR',
    message: msg || 'An unknown error occurred while querying Gemini AI.'
  };
};

/**
 * Execute chat response generation using Gemini API with Retry Once logic.
 */
const generateResponse = async (history, prompt, options = {}) => {
  if (!prompt || prompt.trim() === '') {
    throw new Error('Prompt cannot be empty.');
  }

  const runCall = async () => {
    const startTime = Date.now();
    const client = getClient();
    
    const modelName = aiConfig.gemini.model;
    const persona = options.persona || 'general';
    const language = options.language || 'en';
    const systemInstruction = getSystemInstruction(persona, language);

    const model = client.getGenerativeModel({
      model: modelName,
      systemInstruction: systemInstruction
    });

    const trimmedHistory = trimConversationHistory(history, prompt, 6000);
    const formattedHistory = formatHistoryForGemini(trimmedHistory);

    const chat = model.startChat({
      history: formattedHistory
    });

    // Send prompt message with 20s timeout race
    const result = await runWithTimeout(chat.sendMessage(prompt), 20000);
    const response = await result.response;
    const replyText = response.text();
    const responseTime = Date.now() - startTime;

    // Check candidate finish reasons
    const candidate = response.candidates && response.candidates[0];
    if (candidate && candidate.finishReason === 'SAFETY') {
      throw new Error('SAFETY_BLOCKED');
    }

    return {
      success: true,
      reply: replyText,
      responseTime,
      model: modelName
    };
  };

  try {
    return await runCall();
  } catch (firstError) {
    console.warn('Gemini primary attempt failed, retrying once...', firstError.message);
    try {
      return await runCall();
    } catch (secondError) {
      console.error('Gemini secondary attempt failed:', secondError.message);
      // Map it and throw
      const categorized = categorizeError(secondError);
      throw categorized;
    }
  }
};

module.exports = {
  generateResponse
};
