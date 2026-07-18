import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { SearchInput } from '../forms/SearchInput';
import { Button } from '../buttons/Button';

export const DataTable = ({
  columns = [],
  data = [],
  searchPlaceholder = 'Search records...',
  searchKey,
  actions,
  emptyMessage = 'No records found',
  isLoading = false,
  pageSizeOptions = [5, 10, 20, 50],
  defaultPageSize = 10,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter((item) => {
      if (searchKey) {
        const value = typeof searchKey === 'function' ? searchKey(item) : item[searchKey];
        return String(value || '').toLowerCase().includes(searchTerm.toLowerCase());
      }
      return columns.some((col) => {
        const val = item[col.key];
        return String(val || '').toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, searchKey, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    
    const sorted = [...filteredData].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (typeof valA === 'string') {
        return sortConfig.direction === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [filteredData, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="w-full space-y-4">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
          />
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>

      {/* Responsive Wrapper */}
      <div className="w-full overflow-x-auto rounded-custom border border-border bg-card/30 backdrop-blur-md">
        <table className="w-full border-collapse text-left text-sm text-text/80">
          <thead>
            <tr className="border-b border-border bg-surface/50 text-text font-semibold">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-4 ${col.sortable ? 'cursor-pointer select-none hover:text-primary transition-colors' : ''} ${col.className || ''}`}
                  onClick={() => col.sortable && requestSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {col.sortable && sortConfig.key === col.key && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />
                    )}
                    {col.sortable && sortConfig.key !== col.key && (
                      <ChevronDown className="w-4 h-4 opacity-30 hover:opacity-100" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="p-4">
                      <div className="h-4 bg-surface rounded-md w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-text/40">
                  <div className="flex flex-col items-center justify-center space-y-2 py-8">
                    <svg className="w-12 h-12 text-text/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <p className="text-sm font-semibold">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, rIdx) => (
                <tr key={item.id || rIdx} className="hover:bg-surface/20 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={`p-4 align-middle ${col.className || ''}`}>
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {!isLoading && sortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text/50">
          <div className="flex items-center gap-4">
            <span className="whitespace-nowrap">
              Showing <span className="font-semibold text-text">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-semibold text-text">
                {Math.min(currentPage * pageSize, sortedData.length)}
              </span>{' '}
              of <span className="font-semibold text-text">{sortedData.length}</span> records
            </span>
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-surface border border-border rounded-lg text-text px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size} className="bg-surface">
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="p-1 rounded-lg"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="p-1 rounded-lg"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="px-3 text-sm text-text/70">
              Page <span className="font-semibold text-text">{currentPage}</span> of{' '}
              <span className="font-semibold text-text">{totalPages}</span>
            </span>

            <Button
              variant="outline"
              size="sm"
              className="p-1 rounded-lg"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="p-1 rounded-lg"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
