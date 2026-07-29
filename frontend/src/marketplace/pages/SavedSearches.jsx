import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, ArrowUpRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import marketplaceService from '../../services/marketplaceService';
import { DataTable, Button, Badge } from '../../components/ui';

export const SavedSearches = () => {
  const navigate = useNavigate();
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSearches = async () => {
    try {
      setLoading(true);
      const data = await marketplaceService.getSavedSearches();
      setSearches(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearches();
  }, []);

  const handleDelete = async (id) => {
    try {
      await marketplaceService.deleteSavedSearch(id);
      fetchSearches();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = (filters) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    navigate(`/marketplace/browse?${params.toString()}`);
  };

  const columns = [
    {
      key: 'searchName',
      label: 'Search Template Name',
      sortable: true,
      render: (val) => <span className="font-bold text-white">{val}</span>
    },
    {
      key: 'filters',
      label: 'Applied Parameters',
      render: (val) => {
        if (!val) return 'No filters';
        const parts = [];
        if (val.search) parts.push(`Keyword: "${val.search}"`);
        if (val.category && val.category !== 'all') parts.push(`Category: ${val.category}`);
        if (val.organic) parts.push('Organic Only');
        if (val.state) parts.push(`State: ${val.state}`);
        if (val.minQuantity) parts.push(`Min Qty: ${val.minQuantity} Qtl`);
        return (
          <div className="flex flex-wrap gap-1 max-w-sm">
            {parts.map((p, i) => (
              <Badge key={i} className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 text-[10px]">
                {p}
              </Badge>
            ))}
            {parts.length === 0 && <span className="text-gray-500">All Crops</span>}
          </div>
        );
      }
    },
    {
      key: 'createdAt',
      label: 'Saved Date',
      sortable: true,
      render: (val) => new Date(val).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Execution',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex items-center gap-1 text-[10px] font-bold rounded-lg py-1 px-2.5"
            onClick={() => handleApply(row.filters)}
          >
            <span>Run Search</span>
            <ArrowUpRight className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-1 px-2 border-border text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-lg"
            onClick={() => handleDelete(row._id || row.id)}
            title="Delete Search Template"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold font-display text-white tracking-tight flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-primary" />
          Saved B2B Search Queries
        </h1>
        <p className="text-gray-400 text-xs mt-1">Run complex crop filtering presets saved in MongoDB with a single click.</p>
      </div>

      {/* Grid listing */}
      <div className="bg-card/30 border border-border/80 rounded-3xl p-6 backdrop-blur-md">
        <DataTable
          columns={columns}
          data={searches}
          isLoading={loading}
          emptyMessage="No saved search query templates cataloged"
          defaultPageSize={10}
        />
      </div>
    </div>
  );
};

export default SavedSearches;
