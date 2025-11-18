'use client';

import { ExternalLink, MapPin, Home, Ruler, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import type { Property } from '../lib/types';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const {
    full_street_line,
    city,
    state,
    zip_code,
    list_price,
    price_per_sqft,
    beds,
    full_baths,
    sqft,
    lot_sqft,
    year_built,
    days_on_mls,
    investment_score,
    primary_photo,
    property_url,
    tags = [],
  } = property;

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return `$${price.toLocaleString()}`;
  };

  const formatNumber = (num?: number) => {
    if (!num) return 'N/A';
    return num.toLocaleString();
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Property Image */}
      <div className="relative h-48 bg-gray-200">
        {primary_photo ? (
          <img
            src={primary_photo}
            alt={full_street_line || 'Property'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Home className="w-16 h-16" />
          </div>
        )}

        {/* Investment Score Badge */}
        {investment_score !== undefined && (
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full font-bold text-sm ${getScoreColor(investment_score)}`}>
            ⭐ {investment_score.toFixed(0)}/100
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4 space-y-3">
        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">{formatPrice(list_price)}</div>
            {price_per_sqft && (
              <div className="text-sm text-gray-500">${price_per_sqft.toFixed(0)}/sqft</div>
            )}
          </div>
          {property_url && (
            <a
              href={property_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-gray-700">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            {full_street_line && <div>{full_street_line}</div>}
            <div>{city}, {state} {zip_code}</div>
          </div>
        </div>

        {/* Property Stats */}
        <div className="grid grid-cols-3 gap-2 py-2 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{beds || '—'}</div>
            <div className="text-xs text-gray-500">Beds</div>
          </div>
          <div className="text-center border-x border-gray-100">
            <div className="text-lg font-semibold text-gray-900">{full_baths || '—'}</div>
            <div className="text-xs text-gray-500">Baths</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{formatNumber(sqft)}</div>
            <div className="text-xs text-gray-500">Sqft</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
          {year_built && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Built {year_built}
            </div>
          )}
          {lot_sqft && (
            <div className="flex items-center gap-1">
              <Ruler className="w-3 h-3" />
              {(lot_sqft / 43560).toFixed(2)} acres
            </div>
          )}
          {days_on_mls !== undefined && (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {days_on_mls} days on MLS
            </div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
            {tags.slice(0, 5).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {tag.replace(/_/g, ' ')}
              </span>
            ))}
            {tags.length > 5 && (
              <span className="px-2 py-1 text-gray-500 text-xs">
                +{tags.length - 5} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
