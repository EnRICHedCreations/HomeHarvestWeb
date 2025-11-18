'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import type { SearchParams } from '../lib/types';
import PresetSelector from './PresetSelector';
import FilterPanel from './FilterPanel';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
}

export default function SearchForm({ onSearch, loading = false }: SearchFormProps) {
  const [location, setLocation] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | undefined>();
  const [filters, setFilters] = useState<Partial<SearchParams>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!location.trim()) {
      alert('Please enter a location');
      return;
    }

    const searchParams: SearchParams = {
      location: location.trim(),
      preset: selectedPreset,
      ...filters,
    };

    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto space-y-6">
      {/* Location Input */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          📍 Location
        </label>
        <div className="flex gap-3">
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city, state, or ZIP code (e.g., Phoenix, AZ or 85001)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !location.trim()}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">✨ Quick Start - Smart Presets</h3>
        <PresetSelector
          selected={selectedPreset}
          onSelect={setSelectedPreset}
          disabled={loading}
        />
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-lg shadow-sm">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          <span className="text-sm font-medium text-gray-700">
            🔧 Advanced Filters
          </span>
          <span className="text-gray-500 text-sm">
            {showAdvanced ? '▲ Collapse' : '▼ Expand'}
          </span>
        </button>

        {showAdvanced && (
          <div className="px-6 pb-6 border-t border-gray-100">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              disabled={loading}
            />
          </div>
        )}
      </div>

      {/* Search Stats */}
      {Object.keys(filters).length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
          <span className="font-medium">Active Filters: </span>
          {Object.keys(filters).length} filter(s) applied
          <button
            type="button"
            onClick={() => setFilters({})}
            className="ml-3 text-blue-600 hover:text-blue-800 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </form>
  );
}
