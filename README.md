# Dozlab Frontend

The web frontend for the Dozlab platform, built with Nuxt.js, Vue 3, and TypeScript.

## Features

- **Modern UI**: Built with Nuxt UI and Tailwind CSS
- **Authentication**: User login and session management
- **Lab Interface**: Interactive lab environment with terminal and code editor
- **Real-time Updates**: WebSocket connections for live feedback
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Progressive Web App**: PWA support for offline functionality

## Tech Stack

- **Framework**: Nuxt.js 4.1.0
- **Frontend**: Vue 3.5.20 + TypeScript 5.9.2
- **Styling**: Tailwind CSS + Nuxt UI
- **State Management**: Pinia
- **Build Tool**: Vite
- **Linting**: ESLint

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dozlab-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file
cp .env.example .env

# Configure your environment
NUXT_API_BASE_URL=http://localhost:8080
NUXT_WS_URL=ws://localhost:8081
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── assets/           # Static assets (images, styles)
├── components/       # Reusable Vue components
├── pages/           # File-based routing pages
├── layouts/         # Application layouts
├── middleware/      # Route middleware
├── plugins/         # Nuxt plugins
├── stores/          # Pinia stores
├── composables/     # Vue composables
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
└── public/          # Public static files
```

## Key Components

### Authentication
- Login/register forms
- JWT token management
- Route protection middleware

### Lab Interface
- Terminal component with WebSocket connection
- Code editor integration
- File explorer
- Progress tracking

### Real-time Features
- WebSocket connection management
- Live updates for lab progress
- Real-time collaboration features

## API Integration

The frontend communicates with the Dozlab API service:

- **Authentication**: `/auth/*` endpoints
- **Labs**: `/labs/*` endpoints
- **Sessions**: `/sessions/*` endpoints
- **WebSocket**: Real-time terminal and updates

## Development

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting (auto-configured via Nuxt)

### State Management
Uses Pinia for state management with stores for:
- User authentication
- Lab sessions
- UI state
- Real-time updates

### Styling
- Tailwind CSS for utility-first styling
- Nuxt UI for pre-built components
- Responsive design patterns
- Dark/light theme support

## Environment Variables

```bash
# API Configuration
NUXT_API_BASE_URL=http://localhost:8080
NUXT_WS_URL=ws://localhost:8081

# Authentication
NUXT_JWT_SECRET=your-jwt-secret

# Feature Flags
NUXT_ENABLE_PWA=true
NUXT_ENABLE_ANALYTICS=false

# Development
NUXT_DEV_TOOLS=true
```

## Docker

### Development
```bash
docker build -f Dockerfile.dev -t dozlab-frontend:dev .
docker run -p 3000:3000 dozlab-frontend:dev
```

### Production
```bash
docker build -t dozlab-frontend:latest .
docker run -p 3000:3000 dozlab-frontend:latest
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run typecheck
```

## Performance

- **SSR/SSG**: Server-side rendering for better SEO and performance
- **Code Splitting**: Automatic code splitting with Nuxt
- **Image Optimization**: Optimized images with Nuxt Image
- **Caching**: HTTP caching and service worker caching

## Deployment

### Static Deployment
```bash
npm run generate
# Deploy the .output/public directory to your static host
```

### Server Deployment
```bash
npm run build
# Deploy the .output directory to your Node.js server
```

### Docker Deployment
```bash
docker build -t dozlab-frontend .
docker run -p 3000:3000 dozlab-frontend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and type checking
6. Submit a pull request

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

[Add your license here]