# Bottle Tracker - Carbon Footprint Calculator

Track the carbon footprint of water bottles shipped by air freight from Seattle to cities around the world.

## Features

- **Carbon Footprint Calculator**: Calculates CO₂ emissions based on distance from Seattle using air freight emission factors
- **Global City Search**: Search any city worldwide using OpenStreetMap Nominatim geocoding
- **Real-time Statistics**: View total bottles, distance traveled, and cumulative carbon footprint
- **Admin Mode**: Add multiple bottles and manage entries
- **Shared Data**: All visitors see the same bottle submissions (stored in Azure Table Storage)

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React + SSR)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Hosting**: [Netlify](https://netlify.com) (with serverless functions)
- **Database**: [Azure Table Storage](https://azure.microsoft.com/en-us/products/storage/tables/)
- **Geocoding**: OpenStreetMap Nominatim API

## Data Storage

### Where is the data stored?

The application uses **Azure Table Storage** for persistent, shared storage:

- **Table Name**: `bottles`
- **Partition Key**: `submission`
- **Data stored**: City, country, coordinates, distance, carbon footprint, timestamp

When deployed to Netlify:
1. The frontend is served as static files from Netlify's CDN
2. API routes run as Netlify serverless functions
3. These functions connect to Azure Table Storage to read/write bottle submissions

### Why Azure Table Storage?

- **Cheap**: Pay only for what you use (< $1/month for this use case)
- **Simple**: NoSQL key-value store, perfect for simple data
- **Serverless**: No infrastructure to manage
- **Fast**: Low latency reads/writes

## Setup

### Prerequisites

- [Bun](https://bun.sh/) (or Node.js 18+)
- Azure account with a Storage Account
- Netlify account

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd bottle-tracker
bun install
```

### 2. Azure Setup

1. Create an Azure Storage Account (or use existing)
2. Go to **Access keys** in the Azure portal
3. Copy the **Connection string**

### 3. Environment Variables

Create a `.env` file for local development:

```env
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
```

For Netlify deployment, add this as an environment variable in:
**Site settings → Environment variables**

### 4. Local Development

```bash
make dev
# or
bun run dev
```

Open http://localhost:3000

### 5. Deploy to Netlify

```bash
make deploy
```

Or connect your GitHub repo to Netlify for automatic deployments.

## Makefile Commands

| Command | Description |
|---------|-------------|
| `make install` | Install dependencies |
| `make dev` | Start development server |
| `make build` | Build for production |
| `make preview` | Preview production build |
| `make test` | Run tests |
| `make deploy` | Deploy to Netlify |
| `make clean` | Clean build artifacts |

## Carbon Calculation

The carbon footprint is calculated using:

- **Distance**: Haversine formula (great-circle distance from Seattle)
- **Emission Factor**: 0.55 kg CO₂ per tonne-km (IPCC average for air freight)
- **Bottle Weight**: 25g (average 500ml plastic water bottle)

Formula:
```
CO₂ (kg) = Distance (km) × Bottle Weight (tonnes) × 0.55
```

## Admin Mode

To access admin features:

1. Click the **shield icon** in the bottom-right corner
2. Admin mode allows:
   - Adding multiple bottles (bypass one-per-user limit)
   - Deleting any bottle entry
   - Resetting your submission status

## Project Structure

```
├── src/
│   ├── routes/
│   │   ├── index.tsx          # Main page
│   │   ├── __root.tsx         # Root layout
│   │   └── api.bottles.ts     # API endpoint for bottles
│   ├── components/
│   │   └── Header.tsx         # Header component
│   └── data/
│       └── carbon-calculator.ts  # Carbon calculation logic
├── netlify.toml               # Netlify configuration
├── Makefile                   # Build commands
└── package.json
```

## License

MIT
