from http.server import BaseHTTPRequestHandler
import json
import sys
import os
from datetime import datetime
import traceback
import pandas as pd
import numpy as np

# Add homeharvest to path
sys.path.insert(0, os.path.dirname(__file__))

from homeharvest import (
    scrape_property,
    rank_by_investment_potential,
    get_wholesale_friendly_agents,
    analyze_agent_specialization,
    get_all_presets_info
)

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        """Handle GET requests for metadata"""
        try:
            if self.path == '/api/scrape/presets':
                # Return available presets
                presets = get_all_presets_info()

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()

                response = {
                    'success': True,
                    'presets': presets
                }

                self.wfile.write(json.dumps(response).encode())
            else:
                self.send_error(404, "Not Found")

        except Exception as e:
            print(f"[API Error] {str(e)}")
            print(traceback.format_exc())

            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            error_response = {
                'success': False,
                'error': str(e)
            }

            self.wfile.write(json.dumps(error_response).encode())

    def do_POST(self):
        """Handle property search requests"""
        try:
            # Get request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)

            # Extract search parameters
            location = data.get('location')
            if not location:
                self.send_error(400, "Location is required")
                return

            print(f"[Search] Location: {location}")

            # Build search parameters
            search_params = {
                'location': location,
                'listing_type': data.get('listing_type', 'for_sale'),
                'mls_only': True,
                'clean_data': True,
                'add_derived_fields': True,
                'limit': data.get('limit', 200)
            }

            # Add preset if specified
            if data.get('preset'):
                search_params['preset'] = data.get('preset')
                print(f"[Search] Using preset: {data.get('preset')}")

            # Add filters
            optional_filters = [
                'price_min', 'price_max', 'beds_min', 'beds_max',
                'baths_min', 'baths_max', 'sqft_min', 'sqft_max',
                'lot_sqft_min', 'lot_sqft_max', 'year_built_min', 'year_built_max',
                'hoa_fee_min', 'hoa_fee_max', 'stories_min', 'stories_max',
                'garage_spaces_min', 'garage_spaces_max',
                'has_pool', 'has_garage', 'waterfront', 'has_view',
                'past_days', 'past_hours',
                'tag_filters', 'tag_match_type', 'tag_exclude',
                'sort_by', 'sort_direction', 'enable_advanced_sort'
            ]

            for filter_name in optional_filters:
                if filter_name in data and data[filter_name] is not None:
                    search_params[filter_name] = data[filter_name]

            # Scrape properties
            print(f"[Search] Scraping properties...")
            properties = scrape_property(**search_params)

            if properties.empty:
                print(f"[Search] No properties found")
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()

                self.wfile.write(json.dumps({
                    'success': True,
                    'count': 0,
                    'properties': [],
                    'market_stats': {},
                    'scraped_at': datetime.now().isoformat()
                }).encode())
                return

            print(f"[Search] Found {len(properties)} properties")

            # Filter out pending sales
            if 'status' in properties.columns:
                initial_count = len(properties)
                properties = properties[
                    properties['status'].isna() |
                    (~properties['status'].str.lower().isin(['pending', 'contingent', 'pending_continue_to_show']))
                ]
                filtered = initial_count - len(properties)
                if filtered > 0:
                    print(f"[Search] Filtered out {filtered} pending sales")

            # Calculate investment scores if requested
            include_analytics = data.get('include_analytics', True)
            if include_analytics and len(properties) > 0:
                print(f"[Search] Calculating investment scores...")
                properties = rank_by_investment_potential(properties)

            # Convert to dict with datetime handling
            # Convert datetime columns to ISO format strings
            for col in properties.columns:
                if pd.api.types.is_datetime64_any_dtype(properties[col]):
                    properties[col] = properties[col].dt.strftime('%Y-%m-%dT%H:%M:%S').replace('NaT', None)

            # Replace NaN with None for JSON serialization
            properties = properties.replace({np.nan: None})

            props_list = properties.to_dict('records')

            # Calculate market statistics
            market_stats = {}
            if len(properties) > 0:
                if 'list_price' in properties.columns:
                    market_stats['avg_price'] = float(properties['list_price'].mean())
                    market_stats['median_price'] = float(properties['list_price'].median())
                    market_stats['min_price'] = float(properties['list_price'].min())
                    market_stats['max_price'] = float(properties['list_price'].max())

                if 'price_per_sqft' in properties.columns:
                    market_stats['avg_price_per_sqft'] = float(properties['price_per_sqft'].mean())

                if 'days_on_mls' in properties.columns and not properties['days_on_mls'].isna().all():
                    market_stats['avg_days_on_market'] = float(properties['days_on_mls'].mean())

                if 'investment_score' in properties.columns:
                    market_stats['avg_investment_score'] = float(properties['investment_score'].mean())
                    high_score = len(properties[properties['investment_score'] >= 70])
                    market_stats['high_potential_count'] = int(high_score)

            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            response = {
                'success': True,
                'count': len(props_list),
                'properties': props_list,
                'market_stats': market_stats,
                'scraped_at': datetime.now().isoformat()
            }

            self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            print(f"[API Error] {str(e)}")
            print(traceback.format_exc())

            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            error_response = {
                'success': False,
                'error': str(e),
                'traceback': traceback.format_exc()
            }

            self.wfile.write(json.dumps(error_response).encode())
