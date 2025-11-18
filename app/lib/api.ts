import type {
  SearchParams,
  SearchResponse,
  AgentAnalysisResponse,
  PresetsResponse,
  Property
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Search for properties
 */
export async function searchProperties(params: SearchParams): Promise<SearchResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.error || 'Failed to search properties',
        response.status
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

/**
 * Get available presets
 */
export async function getPresets(): Promise<PresetsResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/scrape/presets`);
    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.error || 'Failed to fetch presets',
        response.status
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

/**
 * Analyze agents from properties
 */
export async function analyzeAgents(
  properties: Property[],
  minListings: number = 2
): Promise<AgentAnalysisResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/agents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties,
        min_listings: minListings,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.error || 'Failed to analyze agents',
        response.status
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

/**
 * Export properties to CSV
 */
export function exportToCSV(properties: Property[], filename: string = 'properties.csv') {
  // Convert properties to CSV
  if (properties.length === 0) return;

  const headers = Object.keys(properties[0]);
  const csvContent = [
    headers.join(','),
    ...properties.map(prop =>
      headers.map(header => {
        const value = prop[header as keyof Property];
        // Handle arrays and objects
        if (Array.isArray(value)) return `"${value.join('; ')}"`;
        if (typeof value === 'object' && value !== null) return `"${JSON.stringify(value)}"`;
        // Escape quotes in strings
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
        return value ?? '';
      }).join(',')
    )
  ].join('\n');

  // Download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Export agents to CSV
 */
export function exportAgentsToCSV(agents: any[], filename: string = 'agents.csv') {
  if (agents.length === 0) return;

  const headers = Object.keys(agents[0]);
  const csvContent = [
    headers.join(','),
    ...agents.map(agent =>
      headers.map(header => {
        const value = agent[header];
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
        return value ?? '';
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
