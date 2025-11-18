from http.server import BaseHTTPRequestHandler
import json
import sys
import os
import traceback
import pandas as pd

# Add homeharvest to path
sys.path.insert(0, os.path.dirname(__file__))

from homeharvest import (
    get_wholesale_friendly_agents,
    analyze_agent_specialization,
    get_contact_export
)

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """Analyze agents from property data"""
        try:
            # Get request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)

            # Extract properties
            properties = data.get('properties', [])
            if not properties:
                self.send_error(400, "Properties array is required")
                return

            # Convert to DataFrame
            df = pd.DataFrame(properties)
            print(f"[Agents] Analyzing {len(df)} properties")

            # Get parameters
            min_listings = data.get('min_listings', 2)

            # Find wholesale-friendly agents
            print(f"[Agents] Finding wholesale agents (min_listings={min_listings})...")
            wholesale_agents = get_wholesale_friendly_agents(df, min_listings=min_listings)

            if wholesale_agents.empty:
                print(f"[Agents] No wholesale agents found")
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()

                self.wfile.write(json.dumps({
                    'success': True,
                    'count': 0,
                    'agents': []
                }).encode())
                return

            # Get agent specialization
            print(f"[Agents] Analyzing specializations...")
            specialization = analyze_agent_specialization(df)

            # Build agent data
            agents_list = []
            for idx, agent in wholesale_agents.iterrows():
                try:
                    agent_name = agent['agent_name']

                    # Get agent's properties
                    agent_props = df[df['agent_name'] == agent_name]

                    # Get specialization data
                    spec = specialization[specialization['agent_name'] == agent_name]

                    # Helper functions for safe data extraction
                    def safe_get(series, key, default=None):
                        try:
                            return series[key] if key in series.index and pd.notna(series[key]) else default
                        except:
                            return default

                    def safe_float(val):
                        try:
                            return float(val) if pd.notna(val) else None
                        except:
                            return None

                    def safe_int(val):
                        try:
                            return int(val) if pd.notna(val) else None
                        except:
                            return None

                    # Build agent object
                    agent_data = {
                        'agent_name': agent_name,
                        'agent_email': safe_get(agent, 'agent_email'),
                        'agent_phone': safe_get(agent, 'primary_phone'),
                        'broker_name': safe_get(agent, 'broker_name'),
                        'office_name': safe_get(agent, 'office_name'),
                        'wholesale_score': safe_float(safe_get(agent, 'wholesale_score', 0)),
                        'listing_count': safe_int(safe_get(agent, 'listing_count', 0)),
                        'avg_price': safe_float(safe_get(agent, 'avg_price')),
                        'min_price': safe_float(safe_get(agent, 'min_price')),
                        'max_price': safe_float(safe_get(agent, 'max_price')),
                        'price_category': (
                            spec.iloc[0]['price_category']
                            if not spec.empty and 'price_category' in spec.columns
                            else None
                        ),
                        'avg_days_on_market': safe_float(agent_props['days_on_mls'].mean()) if 'days_on_mls' in agent_props.columns else None
                    }

                    agents_list.append(agent_data)

                except Exception as agent_error:
                    print(f"[Agents] Error processing agent: {str(agent_error)}")
                    continue

            print(f"[Agents] Found {len(agents_list)} wholesale agents")

            # Send response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            response = {
                'success': True,
                'count': len(agents_list),
                'agents': agents_list
            }

            self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            print(f"[Agents Error] {str(e)}")
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
