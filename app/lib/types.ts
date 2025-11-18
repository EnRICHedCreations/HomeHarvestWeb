// Property Types
export interface Property {
  property_id: string;
  property_url?: string;
  mls?: string;
  mls_id?: string;
  status?: string;

  // Address
  full_street_line?: string;
  city?: string;
  state?: string;
  zip_code?: string;

  // Details
  beds?: number;
  full_baths?: number;
  half_baths?: number;
  sqft?: number;
  lot_sqft?: number;
  year_built?: number;
  stories?: number;
  parking_garage?: number;

  // Pricing
  list_price?: number;
  price_per_sqft?: number;
  sold_price?: number;
  estimated_value?: number;
  assessed_value?: number;

  // Dates
  list_date?: string;
  sold_date?: string;
  days_on_mls?: number;

  // Features
  hoa_fee?: number;
  tags?: string[];
  text?: string;

  // Photos
  primary_photo?: string;
  alt_photos?: string[];

  // Location
  latitude?: number;
  longitude?: number;

  // Agent/Broker
  agent_name?: string;
  agent_email?: string;
  agent_phones?: any;
  broker_name?: string;
  office_name?: string;

  // Calculated fields
  property_age?: number;
  investment_score?: number;
  price_discount?: number;
  value_per_sqft?: number;
  lot_ratio?: number;
}

// Search Parameters
export interface SearchParams {
  location: string;
  preset?: string;
  listing_type?: string;

  // Price & Size
  price_min?: number;
  price_max?: number;
  beds_min?: number;
  beds_max?: number;
  baths_min?: number;
  baths_max?: number;
  sqft_min?: number;
  sqft_max?: number;
  lot_sqft_min?: number;
  lot_sqft_max?: number;
  year_built_min?: number;
  year_built_max?: number;

  // Elite Filters
  hoa_fee_min?: number;
  hoa_fee_max?: number;
  stories_min?: number;
  stories_max?: number;
  garage_spaces_min?: number;
  garage_spaces_max?: number;
  has_pool?: boolean;
  has_garage?: boolean;
  waterfront?: boolean;
  has_view?: boolean;

  // Time-based
  past_days?: number;
  past_hours?: number;

  // Tags
  tag_filters?: string[];
  tag_match_type?: 'any' | 'all' | 'exact';
  tag_exclude?: string[];

  // Sorting
  sort_by?: string | string[];
  sort_direction?: 'asc' | 'desc' | string[];
  enable_advanced_sort?: boolean;

  // Options
  limit?: number;
  include_analytics?: boolean;
}

// Market Statistics
export interface MarketStats {
  avg_price?: number;
  median_price?: number;
  min_price?: number;
  max_price?: number;
  avg_price_per_sqft?: number;
  avg_days_on_market?: number;
  avg_investment_score?: number;
  high_potential_count?: number;
}

// Search Response
export interface SearchResponse {
  success: boolean;
  count: number;
  properties: Property[];
  market_stats: MarketStats;
  scraped_at: string;
  error?: string;
}

// Agent Types
export interface Agent {
  agent_name: string;
  agent_email?: string;
  agent_phone?: string;
  broker_name?: string;
  office_name?: string;
  wholesale_score: number;
  listing_count: number;
  avg_price?: number;
  min_price?: number;
  max_price?: number;
  price_category?: 'Budget' | 'Mid-Range' | 'Upper-Mid' | 'Luxury';
  avg_days_on_market?: number;
}

export interface AgentAnalysisResponse {
  success: boolean;
  count: number;
  agents: Agent[];
  error?: string;
}

// Preset Types
export interface PresetInfo {
  [key: string]: string;
}

export interface PresetsResponse {
  success: boolean;
  presets: PresetInfo;
}
