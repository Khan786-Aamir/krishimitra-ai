require('dotenv').config();

const aiConfig = {
  activeProvider: process.env.AI_PROVIDER || 'gemini', // 'gemini' | 'openai' | 'claude'
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-3.6-flash' // default fallback model
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
  },
  claude: {
    apiKey: process.env.CLAUDE_API_KEY || '',
    model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-latest'
  }
};

module.exports = aiConfig;
