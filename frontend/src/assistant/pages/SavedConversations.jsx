import React, { useState, useEffect } from 'react';
import { BookMarked, Search, Star, Trash2, Tag, Calendar, ExternalLink } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import aiService from '../../services/aiService';
import { Button, Loader, Badge } from '../../components/ui';

export const SavedConversations = () => {
  const { addToast } = useToast();

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);

  // Available tags for quick filter list
  const [allTags, setAllTags] = useState([]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const data = await aiService.getBookmarks({
        q: searchQuery,
        tag: selectedTag,
        favorite: showOnlyFavs
      });
      setBookmarks(data || []);

      // Extract unique tags
      const tagsSet = new Set();
      (data || []).forEach(b => {
        if (b.tags && Array.isArray(b.tags)) {
          b.tags.forEach(t => tagsSet.add(t));
        }
      });
      setAllTags(Array.from(tagsSet));
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when search filters update
  useEffect(() => {
    fetchBookmarks();
  }, [searchQuery, selectedTag, showOnlyFavs]);

  const handleToggleFavorite = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await aiService.toggleFavoriteBookmark(id);
      if (res.success || id.startsWith('mock-')) {
        setBookmarks(prev =>
          prev.map(b => b._id === id ? { ...b, isFavorite: !b.isFavorite } : b)
        );
        addToast('Favorite preference saved', 'success');
      }
    } catch (err) {
      addToast('Failed to update favorite status', 'error');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await aiService.deleteBookmark(id);
      if (res.success || id.startsWith('mock-')) {
        setBookmarks(prev => prev.filter(b => b._id !== id));
        addToast('Bookmark removed', 'success');
      }
    } catch (err) {
      addToast('Failed to remove bookmark', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col justify-between select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-indigo-400" /> Saved AI Answers
          </h1>
          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
            Audit and filter farm replies, guidelines, or fertilizer dosage suggestions you bookmarked.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto text-xs font-semibold">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search bookmark contents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 bg-card border border-border text-[10px] rounded-xl focus:outline-none text-white focus:border-primary/45 w-full sm:w-48 font-semibold placeholder-text/30"
            />
          </div>

          {/* Tags list dropdown */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-card border border-border text-[10px] rounded-xl py-2 px-3 text-text focus:outline-none focus:border-primary/45 font-bold cursor-pointer"
          >
            <option value="">All Tags</option>
            {allTags.map((tag, i) => (
              <option key={i} value={tag}>{tag}</option>
            ))}
          </select>

          {/* Star Filter button */}
          <button
            onClick={() => setShowOnlyFavs(f => !f)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
              showOnlyFavs
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                : 'border-border bg-card text-gray-400 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showOnlyFavs ? 'fill-current' : ''}`} />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* Main viewport */}
      <div className="flex-1 overflow-y-auto pr-1 -mr-2 my-4 space-y-4 scrollbar-thin">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="bg-card border border-border rounded-3xl p-12 text-center max-w-md mx-auto mt-10">
            <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl w-fit mx-auto mb-4">
              <BookMarked className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-white font-extrabold text-sm leading-tight">No Saved Replies</h3>
            <p className="text-gray-500 text-[10px] mt-2 leading-relaxed">
              When talking with the AI Assistant, click the bookmark icon on any reply card to save helpful guides or recipes here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookmarks.map((b) => (
              <div
                key={b._id}
                className="bg-card border border-border/80 rounded-2xl p-5 hover:border-primary/20 hover:shadow-lg transition-all flex flex-col justify-between gap-4 text-xs group"
              >
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 flex-1 min-w-0">
                    <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-400" />
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                    <h3 className="font-extrabold text-white line-clamp-1 leading-snug">
                      Q: {b.prompt}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => handleToggleFavorite(b._id, e)}
                      className={`p-2 bg-surface/50 border border-border/60 hover:text-white rounded-xl transition-colors cursor-pointer ${
                        b.isFavorite ? 'text-amber-400 border-amber-500/10 bg-amber-500/5' : 'text-gray-500'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${b.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(b._id, e)}
                      className="p-2 bg-red-500/10 border border-red-500/25 text-rose-400 hover:bg-red-500/20 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Response Preview */}
                <div className="p-4 bg-surface/40 border border-border/40 rounded-xl">
                  <p className="text-gray-300 font-semibold leading-relaxed whitespace-pre-wrap">
                    {b.response}
                  </p>
                </div>

                {/* Tags badge footer */}
                {b.tags && b.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Tag className="w-3 h-3 text-indigo-400 mr-1" />
                    {b.tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 text-[9px] py-0.5 px-2 rounded-md font-bold"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
