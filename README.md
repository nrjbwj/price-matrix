# PriceMatrix - Real-Time Order Book

A real-time cryptocurrency order book application built with Next.js, displaying live market depth data from Binance. The application provides an intuitive interface to visualize bid and ask orders with smooth animations and real-time updates.

## Features

- **Real-Time Updates**: Live order book data via WebSocket connection (updates every 100ms)
- **Multiple Trading Pairs**: Support for BTCUSDT, ETHUSDT, BNBUSDT, and SOLUSDT
- **Visual Depth Indicators**: Animated depth bars showing order book liquidity
- **Best Bid/Ask Display**: Highlighted best bid and ask prices with spread calculation
- **Interactive UI**: 
  - Click on order rows to select/highlight them
  - Smooth depth bar animations
  - Responsive design for mobile and desktop
- **Dark/Light Mode**: Toggle between dark and light themes
- **Cumulative Size Calculation**: Shows total order size at each price level

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: Material UI (MUI)
- **State Management**: Redux Toolkit
- **Data Fetching**: Tanstack Query (React Query)
- **Styling**: Tailwind CSS v4, Material UI `sx` prop
- **Real-Time**: WebSocket API (Binance)
- **Package Manager**: pnpm

## Prerequisites

- Node.js 20 or higher
- pnpm (recommended) or npm/yarn
- Docker (optional, for containerized deployment)

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd price-matrix
```

2. Install dependencies:
```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Production Build

Build the application for production:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

### Linting

Run ESLint to check for code issues:

```bash
pnpm lint
```

## Docker Deployment

The application is fully containerized and ready for production deployment.

### Using Docker Compose (Recommended)

Build and start the containers:

```bash
make docker-up-build
```

Or manually:
```bash
docker compose up -d --build
```

Start containers on a custom port:
```bash
PORT=3001 make docker-up-build
```

View logs:
```bash
make docker-logs
```

Stop containers:
```bash
make docker-down
```

### Using Docker Directly

Build the image:
```bash
docker build -t price-matrix .
```

Run the container:
```bash
docker run -p 3000:3000 price-matrix
```

### Available Make Commands

The project includes a `Makefile` with convenient commands:

- `make install` - Install dependencies
- `make dev` - Start development server
- `make build` - Build for production
- `make docker-build` - Build Docker image
- `make docker-up` - Start Docker containers
- `make docker-down` - Stop Docker containers
- `make docker-logs` - View container logs
- `make help` - Show all available commands

See `Makefile` for the complete list of commands.

For detailed Docker documentation, see [README.Docker.md](./README.Docker.md).

## Project Structure

```
price-matrix/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout with providers
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── OrderBook/       # Order book components
│   │   ├── providers/       # Context providers (Redux, Query, Theme)
│   │   └── ui/              # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   │   ├── useOrderBook.ts
│   │   ├── useOrderBookData.ts
│   │   └── useWebSocket.ts
│   ├── services/
│   │   └── api/             # API services
│   │       ├── binance.ts   # REST API client
│   │       └── websocket.ts # WebSocket client
│   ├── store/               # Redux store
│   │   ├── slices/          # Redux slices
│   │   └── hooks.ts         # Typed Redux hooks
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
│       ├── calculations.ts  # Order book calculations
│       ├── formatting.ts    # Number formatting
│       ├── orderBook.ts     # Order book utilities
│       └── theme.ts         # Theme utilities
├── Dockerfile               # Docker build configuration
├── docker-compose.yml       # Docker Compose configuration
├── Makefile                 # Convenience commands
└── package.json
```

## Key Features Implementation

### Real-Time Data Flow

1. **Initial Load**: REST API fetches initial order book snapshot
2. **WebSocket Connection**: Establishes WebSocket connection for real-time updates
3. **State Management**: Redux stores order book state
4. **UI Updates**: React components reactively update when state changes

### Order Book Display

- **Bids**: Displayed in descending order (highest price first)
- **Asks**: Displayed in ascending order (lowest price first)
- **Depth Visualization**: Animated bars showing cumulative order size
- **Cumulative Sizes**: Calculated and displayed for each price level

### Performance Optimizations

- Memoized calculations using `useMemo`
- Efficient WebSocket reconnection logic
- Optimized Redux state updates
- Smooth CSS transitions for depth bars

## Environment Variables

The application uses default configuration. No environment variables are required for basic functionality.

For Docker deployment, you can set:
- `PORT` - Port number for the application (default: 3000)

## API Integration

The application integrates with Binance public APIs:

- **REST API**: `https://api.binance.com/api/v3/depth` - Initial order book snapshot
- **WebSocket**: `wss://stream.binance.com:9443/ws/{symbol}@depth20@100ms` - Real-time updates

No API keys are required as we use public endpoints only.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues or questions, please open an issue in the repository.
