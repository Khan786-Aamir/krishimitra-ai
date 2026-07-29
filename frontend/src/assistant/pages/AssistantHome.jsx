import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Trash2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share2,
  BookMarked,
  RefreshCw,
  XCircle,
  Download,
  AlertCircle,
  Globe,
  Bot,
  User,
  Tags
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import aiService from '../../services/aiService';
import { Button, Loader, Badge, Modal } from '../../components/ui';

export const AssistantHome = () => {
  const {
    activeSessionId,
    setActiveSessionId,
    fetchSessions
  } = useOutletContext();

  const { addToast } = useToast();
  const location = useLocation();

  // Page States
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionTitle, setSessionTitle] = useState('New Conversation');
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'
  const [persona, setPersona] = useState('general'); // 'crop' | 'soil' | 'irrigation' | 'organic' | 'scheme' | 'general'

  // Stop generation flag
  const abortFlagRef = useRef(false);

  // Bookmark Modal
  const [bookmarkMessage, setBookmarkMessage] = useState(null);
  const [bookmarkTags, setBookmarkTags] = useState('');
  const [bookmarkFav, setBookmarkFav] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);

  const messagesEndRef = useRef(null);

  // Suggested Prompts
  const quickPrompts = [
    { label: 'Recommend Kharif crops', text: 'Recommend crops for rainy season.' },
    { label: 'Increase wheat yield', text: 'How can I increase wheat production?' },
    { label: 'Rice fertilizer dosage', text: 'How much fertilizer should I use for rice?' },
    { label: 'Sugarcane drip method', text: 'Best irrigation method for sugarcane.' },
    { label: 'Tomato leaf curl cure', text: 'How to prevent tomato leaf curl?' },
    { label: 'Schemes for farmers', text: 'Government schemes for farmers.' }
  ];

  // Personas mapping
  const personaLabels = {
    general: 'General Assistant',
    crop: 'Crop Expert',
    soil: 'Soil Specialist',
    irrigation: 'Water Expert',
    organic: 'Organic Advisor',
    scheme: 'Scheme Assistant'
  };

  // Trigger auto prompt if navigated with a state payload
  useEffect(() => {
    if (location.state && location.state.autoPrompt) {
      const autoText = location.state.autoPrompt;
      // Clear history state to avoid loops on page refreshing
      window.history.replaceState({}, document.title);
      handleSendMessage(autoText);
    }
  }, [location.state]);

  // Load session messages
  useEffect(() => {
    const loadSession = async () => {
      if (!activeSessionId) {
        setMessages([]);
        setSessionTitle('New Conversation');
        return;
      }

      try {
        setLoading(true);
        const res = await aiService.getSession(activeSessionId);
        if (res.success && res.data) {
          setMessages(res.data.messages || []);
          setSessionTitle(res.data.title || 'Conversation');
        }
      } catch (err) {
        addToast('Failed to load conversation history', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, [activeSessionId]);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const prompt = textToSend || inputText;
    if (!prompt.trim()) return;

    abortFlagRef.current = false;
    setInputText('');

    // Prepend user message instantly
    const userMsg = {
      id: `temp-u-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await aiService.chat(prompt, activeSessionId, persona, language);
      
      if (abortFlagRef.current) {
        addToast('Generation stopped', 'info');
        setLoading(false);
        return;
      }

      if (res.success) {
        const modelMsg = {
          id: res.messageId || `temp-m-${Date.now()}`,
          role: 'model',
          content: res.reply,
          model: res.model || 'gemini-2.5-flash',
          responseTime: res.responseTime || 0,
          isBookmarked: false,
          timestamp: res.timestamp ? new Date(res.timestamp) : new Date()
        };

        setMessages(prev => [...prev, modelMsg]);

        // If a new session was created
        if (!activeSessionId && res.sessionId) {
          setActiveSessionId(res.sessionId);
        }
        
        fetchSessions();
      } else {
        // Render error card response
        const errorMsg = {
          id: `err-${Date.now()}`,
          role: 'model',
          content: `⚠️ **AI Query Failed**\n\n${res.message || 'We encountered an error connecting to the generative servers. Please retry.'}`,
          isError: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (err) {
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `⚠️ **Network Connection Failed**\n\nFailed to establish server handshake. Please check your internet connectivity.`,
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleStopGenerating = () => {
    abortFlagRef.current = true;
    setLoading(false);
  };

  const handleRegenerate = () => {
    // Find last user message
    const userMsgs = messages.filter(m => m.role === 'user');
    if (userMsgs.length === 0) return;
    const lastUserPrompt = userMsgs[userMsgs.length - 1].content;
    handleSendMessage(lastUserPrompt);
  };

  // Feedback votes
  const handleFeedback = async (messageId, type) => {
    if (!activeSessionId) return;
    try {
      const res = await aiService.toggleFeedback(activeSessionId, messageId, type);
      if (res.success) {
        addToast(`Feedback registered`, 'success');
        setMessages(prev =>
          prev.map(m => {
            if (m.id === messageId) {
              return {
                ...m,
                isLiked: type === 'like',
                isDisliked: type === 'dislike'
              };
            }
            return m;
          })
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Copy response
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    addToast('Response copied to clipboard', 'success');
  };

  // Share response (copies mock shareable link)
  const handleShare = (msg) => {
    const shareUrl = `${window.location.origin}/share/ai-reply/${msg.id}`;
    navigator.clipboard.writeText(shareUrl);
    addToast('Shareable link copied to clipboard!', 'success');
  };

  // Open Bookmark Modal
  const handleOpenBookmark = (msg) => {
    setBookmarkMessage(msg);
    setBookmarkTags('');
    setBookmarkFav(false);
    setShowBookmarkModal(true);
  };

  // Confirm Bookmark Save
  const handleSaveBookmark = async (e) => {
    e.preventDefault();
    if (!bookmarkMessage) return;

    const splitTags = bookmarkTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '');

    const userPrompt = messages.find((m, idx) => {
      const modelIdx = messages.indexOf(bookmarkMessage);
      return idx === modelIdx - 1;
    })?.content || 'General Inquiry';

    try {
      const res = await aiService.createBookmark({
        prompt: userPrompt,
        response: bookmarkMessage.content,
        tags: splitTags,
        isFavorite: bookmarkFav,
        chatSessionId: activeSessionId,
        messageId: bookmarkMessage.id
      });

      if (res.success) {
        addToast('Reply bookmarked successfully!', 'success');
        setMessages(prev =>
          prev.map(m => m.id === bookmarkMessage.id ? { ...m, isBookmarked: true } : m)
        );
      }
    } catch (err) {
      addToast('Failed to bookmark response', 'error');
    } finally {
      setShowBookmarkModal(false);
      setBookmarkMessage(null);
    }
  };

  // Export conversation history to file
  const handleExport = (format) => {
    if (messages.length === 0) return;
    let fileContent = '';
    let fileName = `KrishiMitra_Chat_${activeSessionId || 'new'}`;

    if (format === 'text') {
      fileContent = `KrishiMitra AI Assistant - Conversation Log\nExported: ${new Date().toLocaleDateString()}\n\n`;
      messages.forEach(m => {
        fileContent += `[${m.role.toUpperCase()}] - ${m.timestamp}\n${m.content}\n\n`;
      });
      fileName += '.txt';
    } else {
      fileContent = JSON.stringify(messages, null, 2);
      fileName += '.json';
    }

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Chat exported successfully', 'success');
  };

  // Clear current chat messages
  const handleClearChat = async () => {
    if (activeSessionId) {
      try {
        await aiService.deleteSession(activeSessionId);
        setActiveSessionId(null);
        setMessages([]);
        fetchSessions();
        addToast('Conversation cleared', 'success');
      } catch (err) {
        addToast('Failed to clear conversation', 'error');
      }
    } else {
      setMessages([]);
      addToast('Conversation cleared', 'success');
    }
  };

  // Markdown inline formatting parser
  const parseInlineMarkdown = (text) => {
    if (!text) return '';
    const parts = text.split('**');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-extrabold text-white">{part}</strong>;
      }
      const subParts = part.split('`');
      return subParts.map((sub, sIdx) => {
        if (sIdx % 2 === 1) {
          return <code key={sIdx} className="bg-surface border border-border px-1.5 py-0.5 rounded font-mono text-primary text-[10px]">{sub}</code>;
        }
        return sub;
      });
    });
  };

  // Markdown block formatting renderer
  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Escape raw HTML tags (Strict Markdown Only)
      const safeLine = line.replace(/</g, '&lt;').replace(/>/g, '&gt;');

      if (safeLine.startsWith('### ')) {
        return <h3 key={i} className="text-xs font-black text-white mt-3 mb-1.5 font-display">{safeLine.replace('### ', '')}</h3>;
      }
      if (safeLine.startsWith('## ')) {
        return <h2 key={i} className="text-sm font-black text-white mt-4 mb-2 font-display">{safeLine.replace('## ', '')}</h2>;
      }
      if (safeLine.startsWith('# ')) {
        return <h1 key={i} className="text-base font-black text-white mt-5 mb-2.5 font-display">{safeLine.replace('# ', '')}</h1>;
      }
      if (safeLine.trim().startsWith('- ') || safeLine.trim().startsWith('* ')) {
        const content = safeLine.replace(/^[\s-*]+/, '');
        return (
          <li key={i} className="ml-4 list-disc text-gray-300 leading-relaxed my-1">
            {parseInlineMarkdown(content)}
          </li>
        );
      }
      if (/^\d+\.\s/.test(safeLine.trim())) {
        const content = safeLine.replace(/^\d+\.\s+/, '');
        return (
          <li key={i} className="ml-4 list-decimal text-gray-300 leading-relaxed my-1">
            {parseInlineMarkdown(content)}
          </li>
        );
      }
      return (
        <p key={i} className="text-gray-300 leading-relaxed my-1 min-h-[1px]">
          {parseInlineMarkdown(safeLine)}
        </p>
      );
    });
  };

  // Keyboard controls
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col justify-between max-w-4xl mx-auto relative select-none">
      
      {/* Title Header with expert controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-border/60 shrink-0">
        <div>
          <h2 className="text-sm font-extrabold text-white font-display tracking-tight flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" /> {sessionTitle}
          </h2>
          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
            Active Expert: <span className="text-primary font-bold">{personaLabels[persona]}</span>
          </p>
        </div>

        {/* Filters and selectors */}
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Persona selector */}
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="bg-card border border-border/80 text-[10px] font-bold rounded-xl py-1.5 px-2.5 text-text focus:outline-none focus:border-primary/50 cursor-pointer"
          >
            <option value="general">🌾 General Advisor</option>
            <option value="crop">🌱 Crop Expert</option>
            <option value="soil">🧪 Soil Specialist</option>
            <option value="irrigation">💧 Water Expert</option>
            <option value="organic">🍃 Organic Advisor</option>
            <option value="scheme">🏛️ Scheme Helper</option>
          </select>

          {/* Language selector */}
          <button
            onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 bg-card border border-border/80 text-[10px] font-bold rounded-xl py-1.5 px-2.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language === 'en' ? 'EN' : 'हिन्दी'}</span>
          </button>

          {/* Export button */}
          {messages.length > 0 && (
            <div className="relative group">
              <button className="p-2 bg-card border border-border/80 text-gray-400 hover:text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer">
                <Download className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-9 bg-card border border-border/80 rounded-xl p-1.5 shadow-premium hidden group-hover:block z-10 w-24 space-y-1">
                <button onClick={() => handleExport('text')} className="w-full text-left text-[10px] font-bold text-gray-400 hover:text-white hover:bg-surface/50 p-1.5 rounded-lg">Export TXT</button>
                <button onClick={() => handleExport('json')} className="w-full text-left text-[10px] font-bold text-gray-400 hover:text-white hover:bg-surface/50 p-1.5 rounded-lg">Export JSON</button>
              </div>
            </div>
          )}

          {/* Clear button */}
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="p-2 bg-red-500/10 border border-red-500/20 text-rose-400 hover:bg-red-500/20 rounded-xl transition-all cursor-pointer"
              title="Clear Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main chat window screen */}
      <div className="flex-1 overflow-y-auto pr-1 -mr-2 my-4 space-y-4 scrollbar-thin">
        {messages.length === 0 ? (
          /* Welcome Banner State */
          <div className="flex flex-col justify-center items-center py-10 space-y-6 text-center max-w-lg mx-auto h-full">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-indigo-500/10 border border-primary/20 text-primary rounded-3xl shadow-glow-primary animate-pulse">
              <Sparkles className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white font-display tracking-tight leading-tight">
                Ask KrishiMitra AI Assistant
              </h1>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed mt-2 max-w-sm">
                Get instant expert details on crop rotations, precise soil fertilization rates, drip irrigation layouts, and organic biological sprays.
              </p>
            </div>

            {/* Quick Suggestions Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.text)}
                  className="p-3 bg-card border border-border/80 rounded-2xl hover:border-primary/20 text-left transition-all hover:-translate-y-0.5 cursor-pointer shadow-premium"
                >
                  <span className="block text-[10px] font-bold text-gray-400 leading-relaxed truncate">{p.label}</span>
                  <span className="block text-[9px] text-gray-600 font-semibold mt-1 truncate">{p.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message log list */
          <div className="space-y-4">
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              
              return (
                <motion.div
                  key={msg.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 items-start text-xs font-semibold leading-relaxed ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Robot Avatar */}
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 border border-white/15 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  {/* Bubble body */}
                  <div className={`p-4 rounded-2xl max-w-2xl border ${
                    isUser
                      ? 'bg-primary/10 border-primary/20 text-white rounded-br-none'
                      : 'bg-card border-border/80 text-gray-300 rounded-bl-none'
                  }`}>
                    {/* Content text */}
                    <div className="space-y-1">
                      {renderMarkdown(msg.content)}
                    </div>

                    {/* Metadata controls for Model message */}
                    {!isUser && !msg.isError && (
                      <div className="flex justify-between items-center gap-6 mt-3 pt-2.5 border-t border-border/40 text-[9px] font-bold text-gray-500 select-none">
                        <span className="font-mono">
                          {msg.model} | response: {msg.responseTime}ms
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          {/* Like */}
                          <button
                            onClick={() => handleFeedback(msg.id, 'like')}
                            className={`p-1 rounded hover:text-white transition-colors cursor-pointer ${msg.isLiked ? 'text-primary' : ''}`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          
                          {/* Dislike */}
                          <button
                            onClick={() => handleFeedback(msg.id, 'dislike')}
                            className={`p-1 rounded hover:text-white transition-colors cursor-pointer ${msg.isDisliked ? 'text-rose-400' : ''}`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Copy */}
                          <button
                            onClick={() => handleCopy(msg.content)}
                            className="p-1 rounded hover:text-white transition-colors cursor-pointer"
                            title="Copy reply text"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Share */}
                          <button
                            onClick={() => handleShare(msg)}
                            className="p-1 rounded hover:text-white transition-colors cursor-pointer"
                            title="Share reply link"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Bookmark */}
                          <button
                            onClick={() => handleOpenBookmark(msg)}
                            className={`p-1 rounded hover:text-white transition-colors cursor-pointer ${msg.isBookmarked ? 'text-indigo-400' : ''}`}
                            title="Bookmark response"
                          >
                            <BookMarked className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Typing Loader */}
            {loading && (
              <div className="flex gap-3 items-start justify-start text-xs font-semibold">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 border border-white/15 flex items-center justify-center text-white shrink-0 mt-0.5 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 bg-card border border-border/80 rounded-2xl rounded-bl-none text-gray-500 flex items-center gap-1.5">
                  <span className="text-[10px] italic">Gemini is analyzing</span>
                  <Loader size="xs" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input panel & dynamic controls */}
      <div className="space-y-3 shrink-0 pt-2 border-t border-border/40 select-none">
        
        {/* Dynamic regenerate or cancel triggers */}
        <div className="flex justify-center gap-2 text-xs">
          {loading && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStopGenerating}
              className="border-red-500/20 text-rose-400 hover:bg-red-500/10 rounded-xl text-[10px] font-bold py-1 px-3"
            >
              <XCircle className="w-3.5 h-3.5" /> Stop Generating
            </Button>
          )}

          {!loading && messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              className="border-border hover:bg-surface text-gray-400 hover:text-white rounded-xl text-[10px] font-bold py-1 px-3"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Regenerate Response
            </Button>
          )}
        </div>

        {/* Input box */}
        <div className="relative flex items-center gap-3">
          <textarea
            rows="1"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={loading ? 'Gemini is processing...' : 'Ask about fertilizers, plant curl virus, or organic sprays...'}
            disabled={loading}
            className="flex-1 bg-card border border-border/80 rounded-2xl py-3.5 pl-4 pr-14 text-xs font-semibold text-white placeholder-text/30 outline-none focus:border-primary/50 resize-none h-11 scrollbar-none"
          />

          {/* Character counter */}
          <span className="absolute right-12 bottom-3.5 text-[8px] text-gray-600 font-black">
            {inputText.length} / 2000
          </span>

          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !inputText.trim()}
            className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer ${
              inputText.trim() && !loading
                ? 'bg-primary text-white shadow-lg shadow-primary/10'
                : 'bg-surface/50 text-gray-500 border border-border/50'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[8px] text-gray-600 text-center leading-relaxed font-bold">
          Enter to Send | Shift + Enter for new line. Assistant content represents guidance and should be verified locally.
        </p>
      </div>

      {/* Bookmark Save Modal */}
      <Modal
        isOpen={showBookmarkModal}
        onClose={() => setShowBookmarkModal(false)}
        title="Bookmark Reply Details"
      >
        <form onSubmit={handleSaveBookmark} className="space-y-4 text-xs font-semibold">
          <div className="p-3 bg-surface border border-border/80 rounded-xl space-y-1">
            <span className="block text-[9px] uppercase font-bold text-gray-500 tracking-wider">AI response body preview</span>
            <p className="text-gray-300 line-clamp-3 leading-relaxed">{bookmarkMessage?.content}</p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase tracking-wider block">Add Tags (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Wheat, Fertilizer, Pest Control"
              value={bookmarkTags}
              onChange={(e) => setBookmarkTags(e.target.value)}
              className="w-full bg-surface border border-border/80 rounded-xl py-2 px-3 text-text outline-none placeholder-text/30"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={bookmarkFav}
              onChange={(e) => setBookmarkFav(e.target.checked)}
              className="accent-primary w-4 h-4 rounded border-border"
            />
            <span>Mark as Favorite Bookmark</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowBookmarkModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2 font-bold"
            >
              Save Bookmark
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
