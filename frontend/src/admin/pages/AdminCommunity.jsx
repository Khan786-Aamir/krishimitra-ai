import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertTriangle, CheckCircle, XCircle, Trash2, Search, Eye } from 'lucide-react';
import adminService from '../../services/adminService';
import { DataTable, Button, Modal, Badge } from '../../components/ui';

export const AdminCommunity = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'comments'
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'post'|'comment', item, action: 'Approve'|'Delete'|'Hide' }

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCommunityContent();
      if (data) {
        setPosts(data.posts || []);
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleModeration = async () => {
    try {
      const { type, item, action } = confirmAction;
      if (type === 'post') {
        await adminService.moderatePost(item.id, action);
        setPosts(prev => prev.map(p => p.id === item.id ? { ...p, status: action } : p));
      } else {
        await adminService.moderateComment(item.id, action);
        setComments(prev => prev.map(c => c.id === item.id ? { ...c, status: action } : c));
      }
      setConfirmAction(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = posts.filter(p => 
    p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredComments = comments.filter(c => 
    c.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const postColumns = [
    { key: 'author', label: 'Author Name', sortable: true },
    {
      key: 'content',
      label: 'Post Content Snippet',
      render: (val) => <span className="max-w-md block truncate font-medium text-white">{val}</span>
    },
    {
      key: 'reportsCount',
      label: 'Reports',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-rose-400">
          {val} Reports
        </span>
      )
    },
    { key: 'reason', label: 'Primary Violation Reason' },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <Badge className={
          val === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
          (val === 'Hidden' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400')
        }>
          {val}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Moderation Actions',
      render: (_, row) => (
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="p-1 px-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold"
            onClick={() => setConfirmAction({ type: 'post', item: row, action: 'Approved' })}
          >
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-1 px-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-bold"
            onClick={() => setConfirmAction({ type: 'post', item: row, action: 'Hidden' })}
          >
            Hide
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-1 px-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-bold"
            onClick={() => setConfirmAction({ type: 'post', item: row, action: 'Deleted' })}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  const commentColumns = [
    { key: 'author', label: 'Commenter', sortable: true },
    { key: 'postTitle', label: 'Target Forum Post', sortable: true },
    {
      key: 'content',
      label: 'Comment Content',
      render: (val) => <span className="max-w-xs block truncate text-white">{val}</span>
    },
    {
      key: 'reportsCount',
      label: 'Reports',
      sortable: true,
      render: (val) => <span className="font-bold text-rose-400">{val} Reports</span>
    },
    { key: 'reason', label: 'Flag Reason' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <Badge className={val === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}>
          {val}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Moderation Actions',
      render: (_, row) => (
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="p-1 px-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold"
            onClick={() => setConfirmAction({ type: 'comment', item: row, action: 'Approved' })}
          >
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-1 px-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-bold"
            onClick={() => setConfirmAction({ type: 'comment', item: row, action: 'Deleted' })}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            Ecosystem Content Moderation
          </h1>
          <p className="text-gray-400 text-xs mt-1">Audit flagged messages, spam links, or abusive posts reported in community hubs.</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-text/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search author, content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border text-xs rounded-xl py-2.5 pl-9 pr-4 text-text placeholder-text/30 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface border border-border/80 p-1 rounded-xl self-start w-fit">
        <button
          onClick={() => {
            setActiveTab('posts');
            setSearchQuery('');
          }}
          className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'posts'
              ? 'bg-primary text-white shadow-lg shadow-primary/10'
              : 'text-text/60 hover:text-white'
          }`}
        >
          Flagged Posts
        </button>
        <button
          onClick={() => {
            setActiveTab('comments');
            setSearchQuery('');
          }}
          className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'comments'
              ? 'bg-primary text-white shadow-lg shadow-primary/10'
              : 'text-text/60 hover:text-white'
          }`}
        >
          Flagged Comments
        </button>
      </div>

      {/* Moderation list */}
      <div className="bg-card/30 border border-border/80 rounded-3xl p-6 backdrop-blur-md">
        {activeTab === 'posts' ? (
          <DataTable
            columns={postColumns}
            data={filteredPosts}
            isLoading={loading}
            emptyMessage="No reported forum posts listed"
            defaultPageSize={10}
          />
        ) : (
          <DataTable
            columns={commentColumns}
            data={filteredComments}
            isLoading={loading}
            emptyMessage="No reported post comments listed"
            defaultPageSize={10}
          />
        )}
      </div>

      {/* CONFIRMATION DIALOG MODAL */}
      <Modal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title="Confirm Moderation Override"
      >
        {confirmAction && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Ecosystem Moderation Rule</p>
                <p className="mt-1">
                  Are you sure you want to change status of this {confirmAction.type} to <strong>{confirmAction.action}</strong>?
                </p>
              </div>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-border/40 font-mono text-[10px] break-words text-gray-300">
              "{confirmAction.item.content}"
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
              <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
              <Button onClick={handleModeration}>Confirm Moderate</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminCommunity;
