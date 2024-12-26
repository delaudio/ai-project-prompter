import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useFileStore } from '../../store/useFileStore';

export const Search = () => {
  const { searchQuery, setSearchQuery } = useFileStore();

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search files..."
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};