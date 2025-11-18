'use client';

import { useState } from 'react';
import { Home, Download, TrendingUp, Users } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SearchForm from './components/SearchForm';
import PropertyCard from './components/PropertyCard';
import { searchProperties, exportToCSV, analyzeAgents, exportAgentsToCSV } from './lib/api';
import type { SearchParams, Property, MarketStats, Agent } from './lib/types';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [marketStats, setMarketStats] = useState<MarketStats>({});
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeView, setActiveView] = useState<'properties' | 'agents'>('properties');

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setProperties([]);
    setMarketStats({});
    setAgents([]);
    setActiveView('properties');

    try {
      toast.loading('Searching properties...', { id: 'search' });

      const result = await searchProperties(params);

      if (result.success) {
        setProperties(result.properties);
        setMarketStats(result.market_stats);

        toast.success(`Found ${result.count} properties!`, { id: 'search' });

        // Analyze agents if we have properties with agent data
        if (result.properties.length > 0) {
          try {
            const agentResult = await analyzeAgents(result.properties);
            if (agentResult.success) {
              setAgents(agentResult.agents);
              console.log(`Found ${agentResult.count} wholesale-friendly agents`);
            }
          } catch (error) {
            console.warn('Agent analysis failed:', error);
          }
        }
      } else {
        toast.error('Search failed', { id: 'search' });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(error instanceof Error ? error.message : 'Search failed', { id: 'search' });
    } finally {
      setLoading(false);
    }
  };

  const handleExportProperties = () => {
    if (properties.length === 0) {
      toast.error('No properties to export');
      return;
    }

    try {
      const filename = `properties_${new Date().toISOString().split('T')[0]}.csv`;
      exportToCSV(properties, filename);
      toast.success(`Exported ${properties.length} properties`);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const handleExportAgents = () => {
    if (agents.length === 0) {
      toast.error('No agents to export');
      return;
    }

    try {
      const filename = `agents_${new Date().toISOString().split('T')[0]}.csv`;
      exportAgentsToCSV(agents, filename);
      toast.success(`Exported ${agents.length} agents`);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">HomeHarvest Elite</h1>
                <p className="text-sm text-gray-600">Professional Real Estate Data Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                70+ Features
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                AI-Powered
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-3 py-8">
          <h2 className="text-4xl font-bold text-gray-900">Find Your Next Real Estate Deal</h2>
          <p className="text-lg text-gray-600">
            Search millions of properties with advanced filters and AI-powered investment analysis
          </p>
        </div>

        {/* Search Form */}
        <SearchForm onSearch={handleSearch} loading={loading} />

        {/* Results Section */}
        {properties.length > 0 && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {properties.length} Properties Found
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveView('properties')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeView === 'properties'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Properties ({properties.length})
                    </div>
                  </button>
                  {agents.length > 0 && (
                    <button
                      onClick={() => setActiveView('agents')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeView === 'agents'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Agents ({agents.length})
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Market Stats */}
              {activeView === 'properties' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {marketStats.avg_price && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Avg Price</div>
                      <div className="text-xl font-bold text-gray-900">
                        ${marketStats.avg_price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  )}
                  {marketStats.median_price && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Median Price</div>
                      <div className="text-xl font-bold text-gray-900">
                        ${marketStats.median_price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  )}
                  {marketStats.avg_price_per_sqft && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Avg $/Sqft</div>
                      <div className="text-xl font-bold text-gray-900">
                        ${marketStats.avg_price_per_sqft.toFixed(0)}
                      </div>
                    </div>
                  )}
                  {marketStats.avg_days_on_market && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Avg DOM</div>
                      <div className="text-xl font-bold text-gray-900">
                        {marketStats.avg_days_on_market.toFixed(0)} days
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Export Button */}
              <div className="mt-4 flex gap-2">
                {activeView === 'properties' && (
                  <button
                    onClick={handleExportProperties}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export Properties CSV
                  </button>
                )}
                {activeView === 'agents' && agents.length > 0 && (
                  <button
                    onClick={handleExportAgents}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export Agents CSV
                  </button>
                )}
              </div>
            </div>

            {/* Properties Grid */}
            {activeView === 'properties' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property, idx) => (
                  <PropertyCard key={property.property_id || idx} property={property} />
                ))}
              </div>
            )}

            {/* Agents List */}
            {activeView === 'agents' && agents.length > 0 && (
              <div className="space-y-4">
                {agents.map((agent, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{agent.agent_name}</h4>
                        <p className="text-sm text-gray-600">{agent.broker_name}</p>
                      </div>
                      <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold text-sm">
                        Score: {agent.wholesale_score.toFixed(0)}/100
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Listings</div>
                        <div className="font-semibold text-gray-900">{agent.listing_count}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Avg Price</div>
                        <div className="font-semibold text-gray-900">
                          {agent.avg_price ? `$${agent.avg_price.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Category</div>
                        <div className="font-semibold text-gray-900">{agent.price_category || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Contact</div>
                        <div className="font-semibold text-gray-900">
                          {agent.agent_email ? '📧' : ''} {agent.agent_phone ? '📞' : ''}
                        </div>
                      </div>
                    </div>

                    {agent.agent_email && (
                      <div className="mt-3 text-sm text-gray-600">
                        📧 {agent.agent_email}
                      </div>
                    )}
                    {agent.agent_phone && (
                      <div className="mt-1 text-sm text-gray-600">
                        📞 {agent.agent_phone}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Home className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Yet</h3>
            <p className="text-gray-600">
              Enter a location and select your search criteria to find properties
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-600">
          <p>Powered by <strong>HomeHarvest Elite</strong> • 70+ Features • Real-Time MLS Data</p>
        </div>
      </footer>
    </div>
  );
}
