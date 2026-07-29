import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MessageSquare,
  Plus,
  Pin,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  BookMarked,
  Sparkles,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import aiService from '../../services/aiService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui';

export const Sidebar = ({
  sessions,
  activeSessionId,
  setActiveSessionId,
  fetchSessions
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleNewChat = () => {
    setActiveSessionId(null);
    navigate('/assistant');
  };

  const handleStartEditing = (session, e) => {
    e.stopPropagation();
    setEditingId(session._id);
    setEditTitle(session.title);
  };

  const handleSaveRename = async (id, e) => {
    e.stopPropagation();
    if (!editTitle.trim()) return;

    try {
      const res = await aiService.renameSession(id, editTitle.trim());
      if (res.success || id.startsWith('mock-')) {
        addToast('Conversation renamed', 'success');
        setEditingId(null);
        fetchSessions();
      }
    } catch (err) {
      addToast('Failed to rename conversation', 'error');
    }
  };

  const handleTogglePin = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await aiService.togglePinSession(id);
      if (res.success || id.startsWith('mock-')) {
        fetchSessions();
      }
    } catch (err) {
      addToast('Failed to toggle pin', 'error');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await aiService.deleteSession(id);
      if (res.success || id.startsWith('mock-')) {
        addToast('Conversation deleted', 'success');
        if (activeSessionId === id) {
          setActiveSessionId(null);
        }
        fetchSessions();
      }
    } catch (err) {
      addToast('Failed to delete conversation', 'error');
    }
  };

  // Grouping utility
  const groupSessions = (list) => {
    const groups = {
      pinned: [],
      today: [],
      yesterday: [],
      last7Days: [],
      older: []
    };

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    const startOf7DaysAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);

    list.forEach(session => {
      if (session.isPinned) {
        groups.pinned.push(session);
        return;
      }

      const itemDate = new Date(session.lastUpdated || session.updatedAt || session.createdAt);
      
      if (itemDate >= startOfToday) {
        groups.today.push(session);
      } else if (itemDate >= startOfYesterday) {
        groups.yesterday.push(session);
      } else if (itemDate >= startOf7DaysAgo) {
        groups.last7Days.push(session);
      } else {
        groups.older.push(session);
      }
    });

    return groups;
  };

  // Filter list by search query
  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const grouped = groupSessions(filteredSessions);

  const renderSessionItem = (s) => {
    const isActive = activeSessionId === s._id;
    const isEditing = editingId === s._id;

    return (
      <div
        key={s._id}
        onClick={() => {
          if (!isEditing) {
            setActiveSessionId(s._id);
            navigate('/assistant');
          }
        }}
        className={`group flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer select-none text-[11px] font-semibold ${
          isActive
            ? 'bg-primary/10 border border-primary/20 text-primary'
            : 'border border-transparent text-gray-400 hover:bg-surface/50 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
          {isEditing ? (
            <input
              type="text"
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-primary/30 text-white text-[11px] rounded px-1 py-0.5 outline-none w-full"
            />
          ) : (
            <span className="truncate">{s.title}</span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
          {isEditing ? (
            <>
              <button
                onClick={(e) => handleSaveRename(s._id, e)}
                className="p-1 hover:text-emerald-400 text-gray-400"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                className="p-1 hover:text-rose-400 text-gray-400"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => handleTogglePin(s._id, e)}
                className={`p-1 hover:text-white ${s.isPinned ? 'text-primary opacity-100' : 'text-gray-500'}`}
                title={s.isPinned ? 'Unpin Chat' : 'Pin Chat'}
              >
                <Pin className="w-3 h-3 fill-current" />
              </button>
              <button
                onClick={(e) => handleStartEditing(s, e)}
                className="p-1 hover:text-white text-gray-500"
                title="Rename Chat"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => handleDelete(s._id, e)}
                className="p-1 hover:text-rose-400 text-gray-500"
                title="Delete Chat"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderSection = (title, items) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-1.5 pt-4">
        <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-600 px-2 block">{title}</span>
        <div className="space-y-1">
          {items.map(s => renderSessionItem(s))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col justify-between h-full shrink-0 select-none">
      
      {/* Upper Section */}
      <div className="p-4 flex flex-col gap-4 overflow-hidden flex-1">
        
        {/* Title branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-glow-primary">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-xs tracking-tight">KrishiMitra AI</h3>
              <span className="text-[9px] text-primary font-bold uppercase tracking-widest block">Assistant</span>
            </div>
          </div>
        </div>

        {/* Actions panel */}
        <Button
          onClick={handleNewChat}
          className="w-full text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> New Conversation
        </Button>

        {/* Search */}
        <div className="relative shrink-0">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search chat history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 bg-surface/50 border border-border/80 text-[10px] rounded-xl focus:outline-none text-white focus:border-primary/45 w-full font-semibold placeholder-text/30"
          />
        </div>

        {/* Date Grouped Chat History Logs */}
        <div className="flex-1 overflow-y-auto scrollbar-thin pr-1 -mr-2 space-y-1">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-[10px] font-semibold italic">
              No conversations started.
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-[10px] font-semibold italic">
              No matches found.
            </div>
          ) : (
            <>
              {renderSection('Pinned Chats', grouped.pinned)}
              {renderSection('Today', grouped.today)}
              {renderSection('Yesterday', grouped.yesterday)}
              {renderSection('Last 7 Days', grouped.last7Days)}
              {renderSection('Older', grouped.older)}
            </>
          )}
        </div>

      </div>

      {/* Footer Navigation section */}
      <div className="p-3 border-t border-border/60 bg-surface/20 space-y-1 shrink-0 text-xs">
        
        <button
          onClick={() => navigate('/assistant/saved')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-transparent font-bold text-gray-400 hover:text-white hover:bg-surface/40 transition-colors text-[11px] cursor-pointer ${
            location.pathname === '/assistant/saved' ? 'bg-primary/5 text-primary border-primary/10' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-indigo-400" />
            <span>Saved Replies</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </button>

        <button
          onClick={() => navigate('/assistant/suggestions')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-transparent font-bold text-gray-400 hover:text-white hover:bg-surface/40 transition-colors text-[11px] cursor-pointer ${
            location.pathname === '/assistant/suggestions' ? 'bg-primary/5 text-primary border-primary/10' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Advice Grid</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </button>

        <button
          onClick={() => navigate('/farmer')}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-surface/30 transition-colors text-[11px] cursor-pointer mt-2 border-t border-border/20 pt-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Assistant</span>
        </button>

      </div>

    </div>
  );
};
