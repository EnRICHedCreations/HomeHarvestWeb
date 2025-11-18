'use client';

import { useState } from 'react';
import type { SearchParams } from '../lib/types';

interface FilterPanelProps {
  filters: Partial<SearchParams>;
  onChange: (filters: Partial<SearchParams>) => void;
  disabled?: boolean;
}

export default function FilterPanel({ filters, onChange, disabled = false }: FilterPanelProps) {
  const [activeTab, setActiveTab] = useState<'price' | 'property' | 'features' | 'time'>('price');

  const updateFilter = (key: keyof SearchParams, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof SearchParams) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onChange(newFilters);
  };

  return (
    <div className="space-y-4 pt-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['price', 'property', 'features', 'time'].map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab as any)}
            disabled={disabled}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Price & Size Filters */}
      {activeTab === 'price' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">💰 Price Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.price_min || ''}
                onChange={(e) => updateFilter('price_min', e.target.value ? Number(e.target.value) : undefined)}
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.price_max || ''}
                onChange={(e) => updateFilter('price_max', e.target.value ? Number(e.target.value) : undefined)}
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🛏️ Bedrooms</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.beds_min || ''}
                onChange={(e) => updateFilter('beds_min', e.target.value ? Number(e.target.value) : undefined)}
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.beds_max || ''}
                onChange={(e) => updateFilter('beds_max', e.target.value ? Number(e.target.value) : undefined)}
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🚿 Bathrooms</label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.5"
                placeholder="Min"
                value={filters.baths_min || ''}
                onChange={(e) => updateFilter('baths_min', e.target.value ? Number(e.target.value) : undefined)}
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                step="0.5"
                placeholder="Max"
                value={filters.baths_max || ''}
                onChange={(e) => updateFilter('baths_max', e.target.value ? Number(e.target.value) : undefined)}
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📐 Square Feet</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.sqft_min || ''}
                onChange={(e) => updateFilter('sqft_min', e.target.value ? Number(e.target.value) : undefined)}
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.sqft_max || ''}
                onChange={(e) => updateFilter('sqft_max', e.target.value ? Number(e.target.value) : undefined)}
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Property Details */}
      {activeTab === 'property' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🏗️ Year Built</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.year_built_min || ''}
                onChange={(e) => updateFilter('year_built_min', e.target.value ? Number(e.target.value) : undefined)}
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.year_built_max || ''}
                onChange={(e) => updateFilter('year_built_max', e.target.value ? Number(e.target.value) : undefined)}
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🌳 Lot Size (sqft)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.lot_sqft_min || ''}
                onChange={(e) => updateFilter('lot_sqft_min', e.target.value ? Number(e.target.value) : undefined)}
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.lot_sqft_max || ''}
                onChange={(e) => updateFilter('lot_sqft_max', e.target.value ? Number(e.target.value) : undefined)}
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🏠 HOA Fee ($/month)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Max"
                value={filters.hoa_fee_max || ''}
                onChange={(e) => updateFilter('hoa_fee_max', e.target.value ? Number(e.target.value) : undefined)}
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🏢 Stories</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.stories_min || ''}
                onChange={(e) => updateFilter('stories_min', e.target.value ? Number(e.target.value) : undefined)}
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.stories_max || ''}
                onChange={(e) => updateFilter('stories_max', e.target.value ? Number(e.target.value) : undefined)}
                disabled={disabled}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      {activeTab === 'features' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.has_pool || false}
                onChange={(e) => updateFilter('has_pool', e.target.checked || undefined)}
                disabled={disabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">🏊 Pool</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.has_garage || false}
                onChange={(e) => updateFilter('has_garage', e.target.checked || undefined)}
                disabled={disabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">🚗 Garage</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.waterfront || false}
                onChange={(e) => updateFilter('waterfront', e.target.checked || undefined)}
                disabled={disabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">🌊 Waterfront</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.has_view || false}
                onChange={(e) => updateFilter('has_view', e.target.checked || undefined)}
                disabled={disabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">🏔️ Views</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🚗 Garage Spaces</label>
            <input
              type="number"
              placeholder="Minimum spaces"
              value={filters.garage_spaces_min || ''}
              onChange={(e) => updateFilter('garage_spaces_min', e.target.value ? Number(e.target.value) : undefined)}
              disabled={disabled}
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Time-based Filters */}
      {activeTab === 'time' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">⏱️ Listed in Past Hours</label>
            <input
              type="number"
              placeholder="e.g., 24 for last 24 hours"
              value={filters.past_hours || ''}
              onChange={(e) => updateFilter('past_hours', e.target.value ? Number(e.target.value) : undefined)}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📅 Listed in Past Days</label>
            <input
              type="number"
              placeholder="e.g., 30 for last 30 days"
              value={filters.past_days || ''}
              onChange={(e) => updateFilter('past_days', e.target.value ? Number(e.target.value) : undefined)}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
