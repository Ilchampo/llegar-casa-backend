# LlegarCasa Backend

A production-ready Node.js REST API backend for the LlegarCasa application, designed to aggregate and serve data from external services including vehicle information and complaint records from Ecuador's public databases. This service provides a secure, rate-limited API interface with intelligent caching and standardized error handling.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Technical Stack](#technical-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [Performance Optimizations](#performance-optimizations)
- [Production Considerations](#production-considerations)
- [Development](#development)
- [Project Structure](#project-structure)

## Architecture Overview

This backend follows enterprise-grade patterns and best practices for API development:

### Core Components

- **Express.js Application**: High-performance HTTP server with middleware pipeline
- **Response Handler**: Centralized response formatting and error handling
- **API Caller**: Standardized HTTP client for external service communication
- **Simple Cache**: In-memory caching system with TTL support
- **Rate Limiting**: Multi-tier request throttling system
- **Security Middleware**: CORS, Helmet, and security headers configuration

### Service Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend App  │────│   Backend API   │────│  Python Scraper │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
            ┌───────▼───┐ ┌───▼───┐ ┌───▼──────┐
            │ Rate      │ │Cache  │ │ Security │
            │ Limiting  │ │Layer  │ │ Headers  │
            └───────────┘ └───────┘ └──────────┘
```

## Features

### Core Functionality

- Vehicle information retrieval from Ecuador's vehicle registry
- Complaint records search and data aggregation
- Real-time data fetching with external API integration
- HTML parsing and data transformation capabilities

### Production Features

- **Rate Limiting**: Multi-tier request throttling (general API, data fetching, basic endpoints)
- **Intelligent Caching**: In-memory cache with automatic TTL expiration
- **Error Handling**: Centralized error management with standardized responses
- **Security Headers**: Comprehensive security configuration with Helmet.js
- **CORS Management**: Environment-based CORS configuration
- **Health Monitoring**: Health check endpoints with cache statistics
- **Input Validation**: Request parameter validation and sanitization
- **Response Standardization**: Consistent API response format across all endpoints

## Technical Stack

- **Runtime**: Node.js 22+
- **Web Framework**: Express.js 5.1+
- **Language**: TypeScript 5.8+
- **HTTP Client**: Axios 1.9+
- **HTML Parser**: Cheerio 1.0+
- **Security**: Helmet 8.1+, CORS 2.8+
- **Rate Limiting**: express-rate-limit 7.5+
- **Development Tools**: ESLint, Prettier, Husky

## Installation

### Prerequisites

- Node.js 22 or higher
- npm or yarn package manager
- 512MB+ RAM for optimal performance

### Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/Ilchampo/llegar-casa.git
    cd llegar-casa/llegar-casa-backend
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Environment configuration**:

    ```bash
    cp .env.example .env
    # Edit .env with your configuration
    ```

4. **Build the application**:
    ```bash
    npm run build
    ```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Application Settings
PORT=3000
NODE_ENV=development

# CORS Configuration
# Single origin: CORS_ORIGIN_WHITELIST=http://localhost:5173
# Multiple origins: CORS_ORIGIN_WHITELIST=http://localhost:5173,http://localhost:3000
CORS_ORIGIN_WHITELIST=http://localhost:5173

# External Services
COMPLAINTS_BASE_URL=http://localhost:8000
COMPLAINTS_TIMEOUT=20000

VEHICLES_BASE_URL=http://localhost:6000
VEHICLES_TIMEOUT=20000
```

### Configuration Options

| Variable                | Default                 | Description                          |
| ----------------------- | ----------------------- | ------------------------------------ |
| `PORT`                  | `3000`                  | Server port number                   |
| `NODE_ENV`              | `development`           | Environment (development/production) |
| `CORS_ORIGIN_WHITELIST` | `http://localhost:5173` | Allowed CORS origins                 |
| `COMPLAINTS_BASE_URL`   | `http://localhost:8000` | Complaints service endpoint          |
| `VEHICLES_BASE_URL`     | `http://localhost:6000` | Vehicles service endpoint            |

## Running the Application

### Development Mode

```bash
# Start development server with auto-reload
npm run dev

# Type checking
npm run type-check

# Code formatting
npm run format

# Linting
npm run lint
```

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm start
```

## API Documentation

### Base URL

```
Development: http://localhost:3000
Production: http://localhost:3000
```

### Endpoints

#### Health Check

```http
GET /health
```

**Response:**

```json
{
	"message": "Service is healthy",
	"status": 200,
	"data": {
		"environment": "development",
		"timestamp": "2024-01-01T00:00:00.000Z",
		"uptime": 3600.5,
		"cache": {
			"size": 10
		}
	}
}
```

#### Vehicle Information

```http
GET /api/vehicles?licensePlate=ABC-1234
```

**Parameters:**

- `licensePlate` (string, required): Vehicle license plate

**Response:**

```json
{
	"message": "Vehicle retrieved successfully",
	"status": 200,
	"data": {
		"licensePlate": "ABC-1234",
		"brand": "Toyota",
		"model": "Corolla",
		"year": 2020,
		"color": "White",
		"stolen": false
	}
}
```

#### Complaint Records

```http
GET /api/complaints?licensePlate=ABC-1234
```

**Parameters:**

- `licensePlate` (string, required): License plate to search for

**Response:**

```json
{
	"message": "Complaints retrieved successfully",
	"status": 200,
	"data": {
		"location": "Quito",
		"date": "2024-01-01",
		"offense": "Traffic violation"
	}
}
```

### Error Responses

All endpoints return standardized error responses:

```json
{
	"message": "Error description",
	"status": 400,
	"error": "Detailed error message"
}
```

## Security Features

### CORS Configuration

- Environment-based origin whitelisting
- Configurable credentials and methods
- Production-ready security settings

### Security Headers (Helmet.js)

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security` (production only)

### Rate Limiting

- **General API**: 100 requests per 15 minutes (production)
- **Data Fetching**: 30 requests per 15 minutes (production)
- **Basic Endpoints**: 60 requests per minute
- Development mode has more permissive limits

## Performance Optimizations

### Caching Strategy

- **In-Memory Cache**: Simple Map-based caching system
- **TTL Management**: Automatic expiration with cleanup
- **Cache Statistics**: Monitoring and health reporting
- **Cache Levels**:
    - Vehicle data: 1 hour TTL
    - Complaint data: 15 minutes TTL
    - Health data: 5 minutes TTL

### Response Optimization

- Standardized response format
- Efficient error handling
- Automatic cache hit/miss management

## Production Considerations

### Performance

- Lightweight in-memory caching
- Efficient external API handling
- Optimized middleware pipeline

### Monitoring

- Health check endpoints
- Cache performance metrics
- Request rate monitoring

### Security

- Environment-based configuration
- Rate limiting protection
- Security headers enforcement
- CORS origin validation

### Scalability

- Stateless design
- External service abstraction
- Configurable timeouts and retries

## Development

### Code Quality

```bash
# Run all checks
npm run lint && npm run type-check && npm run format:check

# Fix issues automatically
npm run lint:fix && npm run format
```

### Git Hooks

- Pre-commit: Linting and formatting checks
- Husky integration for automated quality checks

### Project Standards

- TypeScript strict mode
- ESLint with recommended rules
- Prettier for code formatting
- Conventional commit messages

## Project Structure

```
src/
├── config/                     # Configuration files
│   ├── cors.ts                 # CORS configuration
│   ├── helmet.ts               # Security headers config
│   └── rateLimit.ts            # Rate limiting configuration
├── controllers/                # Request handlers
│   ├── complaints.controller.ts
│   └── vehicle.controller.ts
├── lib/
│   ├── interfaces/             # TypeScript interfaces
│   │   ├── response.interface.ts
│   │   ├── vehicle.interface.ts
│   │   ├── complaints.interface.ts
│   │   └── config.interface.ts
│   └── utils/                  # Utility functions
│       ├── apiCaller.ts        # HTTP client wrapper
│       ├── responseHandler.ts  # Response standardization
│       ├── htmlParser.ts       # HTML parsing utilities
│       └── simpleCache.ts      # Caching implementation
├── routes/                     # API route definitions
│   ├── complaints.routes.ts
│   └── vehicles.routes.ts
├── services/                   # Business logic
│   ├── complaints.service.ts
│   └── vehicle.service.ts
├── app.ts                      # Express application setup
├── config.ts                   # Environment configuration
└── index.ts                    # Application entry point
```

### Key Directories

- **`config/`**: Middleware and application configuration
- **`controllers/`**: HTTP request/response handling
- **`lib/interfaces/`**: TypeScript type definitions
- **`lib/utils/`**: Reusable utility functions
- **`routes/`**: Express route definitions
- **`services/`**: External API integration and business logic

This architecture promotes separation of concerns, maintainability, and scalability while ensuring production-ready reliability and performance.
