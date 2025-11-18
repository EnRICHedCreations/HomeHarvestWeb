# 🏠 HomeHarvest Elite Web App

**Professional Real Estate Data Intelligence Platform**

A full-featured web application built on HomeHarvest Elite - search millions of properties with 70+ advanced features, AI-powered investment scoring, and wholesale agent intelligence.

![HomeHarvest Elite](https://img.shields.io/badge/HomeHarvest-Elite-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Python](https://img.shields.io/badge/Python-3.9-yellow)

---

## 🚀 Features

### 🔍 **Advanced Property Search**
- **Location Search** - City, state, or ZIP code
- **24 Smart Presets** - Pre-configured investment strategies
  - Investor Friendly, Luxury, Fixer Upper, Starter Home
  - Waterfront, Golf Course, Mountain View, Urban, Gated Community
  - Pool Home, No HOA, Eco Friendly, New Construction
  - And 10+ more specialized presets
- **Advanced Filters** - 18+ filter types
  - Price, beds, baths, square footage, lot size
  - HOA fees, stories, garage spaces
  - Year built, property features
  - Time-based filters (hourly precision)

### 🎯 **AI-Powered Intelligence**
- **Investment Scoring** (0-100 scale)
  - Price per sqft analysis
  - Price discount from estimated value
  - Days on market evaluation
  - Lot size optimization
- **Market Statistics**
  - Average & median prices
  - Price per sqft trends
  - Days on market averages
  - High-potential property counts

### 👥 **Wholesale Agent Intelligence**
- **Wholesale Score** (0-100 scale)
  - Identifies motivated agents
  - Multiple listings analysis
  - Price category specialization
- **Agent Profiles**
  - Contact information (email & phone)
  - Listing count & average prices
  - Broker & office details
  - Specialization categories (Budget, Mid-Range, Luxury)

### 📊 **Data Export**
- **CSV Export** - Full property data
- **Agent Export** - CRM-ready contact lists
- **Custom Fields** - 75+ data points per property

### 🎨 **Beautiful UI/UX**
- Responsive design (mobile, tablet, desktop)
- Property cards with photos
- Market statistics dashboard
- Real-time search status
- Toast notifications
- Clean, professional interface

---

## 📦 Installation

### **Prerequisites**
- Node.js 18+ and npm
- Python 3.9+
- Git

### **1. Clone Repository**
```bash
git clone <your-repo-url>
cd HomeHarvest-Web
```

### **2. Install Frontend Dependencies**
```bash
npm install
```

### **3. Install Backend Dependencies**
```bash
pip install -r api/requirements.txt
```

### **4. Environment Setup**
```bash
cp .env.example .env.local
```

Optional: Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=
```

### **5. Run Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🏗️ Project Structure

```
HomeHarvest-Web/
├── app/                          # Next.js App Router
│   ├── components/              # React Components
│   │   ├── SearchForm.tsx       # Main search interface
│   │   ├── PresetSelector.tsx   # 24 preset buttons
│   │   ├── FilterPanel.tsx      # Advanced filters
│   │   └── PropertyCard.tsx     # Property display
│   ├── lib/
│   │   ├── types.ts             # TypeScript types
│   │   └── api.ts               # API client
│   ├── page.tsx                 # Main page
│   └── layout.tsx               # Root layout
│
├── api/                         # Python Backend
│   ├── homeharvest/            # HomeHarvest Elite library
│   ├── scrape.py               # Property search endpoint
│   ├── agents.py               # Agent analysis endpoint
│   └── requirements.txt
│
├── public/                      # Static assets
├── vercel.json                  # Vercel config
├── package.json
└── README.md
```

---

## 🔧 API Endpoints

### **POST /api/scrape**
Search for properties with advanced filters.

**Request Body:**
```json
{
  "location": "Phoenix, AZ",
  "preset": "investor_friendly",
  "price_max": 500000,
  "beds_min": 3,
  "has_pool": true,
  "limit": 100,
  "include_analytics": true
}
```

**Response:**
```json
{
  "success": true,
  "count": 150,
  "properties": [...],
  "market_stats": {
    "avg_price": 425000,
    "median_price": 410000,
    "avg_price_per_sqft": 185,
    "avg_days_on_market": 45,
    "avg_investment_score": 68
  },
  "scraped_at": "2025-01-20T14:30:00Z"
}
```

### **GET /api/scrape/presets**
Get available presets.

**Response:**
```json
{
  "success": true,
  "presets": {
    "investor_friendly": "Low HOA, good lot size, rental potential",
    "luxury": "$500k+, 2500+ sqft, premium amenities",
    ...
  }
}
```

### **POST /api/agents**
Analyze wholesale-friendly agents from property data.

**Request Body:**
```json
{
  "properties": [...],
  "min_listings": 2
}
```

**Response:**
```json
{
  "success": true,
  "count": 25,
  "agents": [
    {
      "agent_name": "John Smith",
      "agent_email": "john@realty.com",
      "agent_phone": "555-1234",
      "wholesale_score": 85,
      "listing_count": 12,
      "avg_price": 185000,
      "price_category": "Budget"
    },
    ...
  ]
}
```

---

## 🎯 Usage Examples

### **Basic Search**
1. Enter a location (e.g., "Phoenix, AZ")
2. Click "Search"
3. View results in property cards
4. Export to CSV

### **Using Presets**
1. Select a preset (e.g., "Investor Friendly")
2. Optionally add custom filters
3. Search
4. Results are pre-filtered based on preset

### **Advanced Filtering**
1. Expand "Advanced Filters"
2. Set price range, beds, baths, etc.
3. Toggle features (pool, garage, waterfront)
4. Set time-based filters (last 24 hours)
5. Search

### **Agent Intelligence**
1. After searching properties
2. Click "Agents" tab
3. View wholesale-friendly agents
4. Export agent list to CSV

---

## 🚀 Deployment

### **Deploy to Vercel** (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js

3. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Vercel builds frontend & Python serverless functions
   - Live URL provided

### **Environment Variables (Vercel)**
Add in Vercel dashboard under "Settings > Environment Variables":
```
NEXT_PUBLIC_API_URL=
```

---

## 💡 Key Technologies

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications
- **Recharts** - Data visualization (ready for analytics)

### **Backend**
- **Python 3.9** - Backend language
- **HomeHarvest Elite** - Property scraping library
- **Pandas** - Data analysis
- **Vercel Serverless** - Python serverless functions

### **Data Source**
- **Realtor.com GraphQL API** - Live MLS data
- No API keys required (built-in OAuth)

---

## 📊 Available Presets

| Category | Presets |
|----------|---------|
| **Investment** | investor_friendly, fixer_upper |
| **Lifestyle** | luxury, family_friendly, retirement, starter_home |
| **Location** | waterfront, golf_course, mountain_view, urban, gated_community |
| **Features** | pool_home, no_hoa, eco_friendly, new_construction, open_floor_plan |
| **Property Type** | horse_property, acreage, guest_house |
| **Lot Features** | corner_lot, cul_de_sac, quiet_neighborhood |
| **Parking** | rv_parking, big_garage |

---

## 🏁 Quick Start Summary

```bash
# 1. Install dependencies
npm install
pip install -r api/requirements.txt

# 2. Run development server
npm run dev

# 3. Open browser
# http://localhost:3000

# 4. Search properties!
```

**That's it!** 🎉

Start searching for properties, analyzing investments, and finding wholesale-friendly agents with HomeHarvest Elite Web App!

---

## 📄 License

MIT License - Same as HomeHarvest Elite

---

## 🙏 Credits

**Built on [HomeHarvest Elite](../HomeHarvest%20copy/)** - Professional real estate data intelligence library with 70+ advanced features.

**Original HomeHarvest** by Zachary Hampton
