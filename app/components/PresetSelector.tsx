'use client';

import { useState } from 'react';

interface PresetSelectorProps {
  selected?: string;
  onSelect: (preset: string | undefined) => void;
  disabled?: boolean;
}

const PRESETS = [
  // Investment
  { id: 'investor_friendly', name: 'Investor Friendly', icon: '🎯', category: 'Investment' },
  { id: 'fixer_upper', name: 'Fixer Upper', icon: '🔨', category: 'Investment' },

  // Lifestyle
  { id: 'luxury', name: 'Luxury', icon: '💎', category: 'Lifestyle' },
  { id: 'family_friendly', name: 'Family Friendly', icon: '👨‍👩‍👧‍👦', category: 'Lifestyle' },
  { id: 'retirement', name: 'Retirement', icon: '🌅', category: 'Lifestyle' },
  { id: 'starter_home', name: 'Starter Home', icon: '🏠', category: 'Lifestyle' },

  // Location
  { id: 'waterfront', name: 'Waterfront', icon: '🌊', category: 'Location' },
  { id: 'golf_course', name: 'Golf Course', icon: '⛳', category: 'Location' },
  { id: 'mountain_view', name: 'Mountain View', icon: '⛰️', category: 'Location' },
  { id: 'urban', name: 'Urban', icon: '🏙️', category: 'Location' },
  { id: 'gated_community', name: 'Gated Community', icon: '🚧', category: 'Location' },

  // Features
  { id: 'pool_home', name: 'Pool Home', icon: '🏊', category: 'Features' },
  { id: 'no_hoa', name: 'No HOA', icon: '🚫', category: 'Features' },
  { id: 'eco_friendly', name: 'Eco Friendly', icon: '🌱', category: 'Features' },
  { id: 'new_construction', name: 'New Construction', icon: '🏗️', category: 'Features' },
  { id: 'open_floor_plan', name: 'Open Floor Plan', icon: '📐', category: 'Features' },

  // Property Type
  { id: 'horse_property', name: 'Horse Property', icon: '🐴', category: 'Property Type' },
  { id: 'acreage', name: 'Acreage', icon: '🌾', category: 'Property Type' },
  { id: 'guest_house', name: 'Guest House', icon: '🏘️', category: 'Property Type' },

  // Lot Features
  { id: 'corner_lot', name: 'Corner Lot', icon: '📍', category: 'Lot Features' },
  { id: 'cul_de_sac', name: 'Cul-de-Sac', icon: '🔄', category: 'Lot Features' },

  // Parking
  { id: 'rv_parking', name: 'RV Parking', icon: '🚐', category: 'Parking' },
  { id: 'big_garage', name: 'Big Garage', icon: '🚗', category: 'Parking' },

  // Quiet
  { id: 'quiet_neighborhood', name: 'Quiet Neighborhood', icon: '🤫', category: 'Quiet' },
];

const CATEGORIES = [
  'All',
  'Investment',
  'Lifestyle',
  'Location',
  'Features',
  'Property Type',
  'Lot Features',
  'Parking',
  'Quiet'
];

export default function PresetSelector({ selected, onSelect, disabled = false }: PresetSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);

  const filteredPresets = selectedCategory === 'All'
    ? PRESETS
    : PRESETS.filter(p => p.category === selectedCategory);

  const displayedPresets = showAll ? filteredPresets : filteredPresets.slice(0, 8);

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(category => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            disabled={disabled}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } disabled:opacity-50`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {displayedPresets.map(preset => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(selected === preset.id ? undefined : preset.id)}
            disabled={disabled}
            className={`p-4 rounded-lg border-2 transition-all ${
              selected === preset.id
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="text-3xl mb-2">{preset.icon}</div>
            <div className="text-sm font-medium text-gray-900">{preset.name}</div>
            <div className="text-xs text-gray-500 mt-1">{preset.category}</div>
          </button>
        ))}
      </div>

      {/* Show More/Less */}
      {filteredPresets.length > 8 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          disabled={disabled}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showAll ? '▲ Show Less' : `▼ Show ${filteredPresets.length - 8} More`}
        </button>
      )}

      {/* Selected Preset Info */}
      {selected && (
        <div className="bg-blue-50 rounded-lg p-3 text-sm">
          <span className="font-medium text-blue-900">
            Selected: {PRESETS.find(p => p.id === selected)?.name}
          </span>
          <button
            type="button"
            onClick={() => onSelect(undefined)}
            className="ml-2 text-blue-600 hover:text-blue-800 underline"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
