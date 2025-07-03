# Log Ingestion and Querying System

A full-stack application for ingesting, storing, and querying log data. Built with Express.js backend and Next.js frontend.

## 🎥 Demo Video

Watch the system in action: [Log Ingestion & Querying System Demo](https://youtu.be/up6AdkWrcw4)

## 🚀 Features

### Core Features

- **Log Ingestion**: REST API endpoint to accept and store log entries

- **Advanced Filtering**: Search and filter logs by level, message, resource ID, timestamp range, trace ID, span ID, and commit hash

- **Responsive UI**: Clean, intuitive interface with visual log level indicators

- **Reverse Chronological Ordering**: Most recent logs displayed first

### Bonus Features ✨

- **Analytics Dashboard**: Visual charts showing log distribution and activity patterns

- **Containerization**: Complete Docker setup with docker-compose

- **Sample Data Generator**: Script to generate realistic test data

## 📋 Prerequisites

- Node.js 18+

- Bun.js (Package Manager)

- Docker & Docker Compose (for containerized setup)

## 🛠️ Installation & Setup

### Option 1: Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/mskp/log-ingestion-and-querying-system
   cd log-ingestion-and-querying-system
   ```

2. **Setup Backend**

   ```bash
   cd backend
   bun install
   bun run dev
   ```

   The backend server will start on `http://localhost:3001`

3. **Setup Frontend** (in a new terminal)

   ```bash
   cd frontend
   bun install
   bun run dev
   ```

   The frontend will be available at `http://localhost:3000`

### Option 2: Docker Setup

1. **Run with Docker Compose**

   ```bash
   docker-compose up --build
   ```

   This will start both services:

   - Frontend: `http://localhost:3000`

   - Backend: `http://localhost:3001`

## 📊 Usage

### Ingesting Logs

Send a POST request to `/logs` with a JSON payload:

```bash
curl -X POST http://localhost:3001/logs \
  -H "Content-Type: application/json" \
  -d '{
    "level": "error",
    "message": "Database connection failed",
    "resourceId": "server-1234",
    "timestamp": "2023-09-15T08:00:00Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {"parentResourceId": "server-5678"}
  }'
```

### Querying Logs

Retrieve logs with optional filters:

```bash
# Get all logs
curl http://localhost:3001/logs

# Filter by level
curl http://localhost:3001/logs?level=error

# Search in messages
curl http://localhost:3001/logs?message=database

# Combine filters
curl "http://localhost:3001/logs?level=error&resourceId=server-1234"
```

### Generate Sample Data

Use the included script to generate test data:

```bash
# From the root directory
bun run seed
```

## 🎨 UI Features

### Filter Bar

- **Text Search**: Case-insensitive search across log messages

- **Level Filter**: Dropdown to filter by log severity

- **Resource ID**: Filter logs by specific resource

- **Timestamp Range**: Date/time pickers for time-based filtering

- **Trace/Span IDs**: Filter by distributed tracing identifiers

- **Commit Hash**: Filter by code version

### Log Display

- **Visual Level Indicators**: Color-coded borders and backgrounds

- **Responsive Layout**: Adapts to different screen sizes

- **Metadata Expansion**: Collapsible JSON metadata display

### Analytics Dashboard

- **Level Distribution**: Pie chart showing log count by severity

- **Activity Timeline**: Hourly log activity for last 24 hours

- **Filter Integration**: Analytics update based on current filters

## 🔧 Technical Decisions & Trade-offs

### Data Persistence

**Decision**: Single JSON file storage

**Rationale**: Per requirements, no external databases allowed

**Trade-offs**:

- ✅ Simple setup, no dependencies

- ❌ Not suitable for high-volume production use

- ❌ No concurrent write protection

### Frontend Framework

**Decision**: Vite with TypeScript

**Rationale**: Modern React framework with excellent developer experience

**Benefits**:

- Built-in TypeScript support

- Optimized performance

- Easy deployment options

### State Management

**Decision**: React hooks (useState, useEffect) without external libraries

**Rationale**: Application complexity doesn't justify Redux/MobX

**Benefits**:

- Simpler codebase

- Fewer dependencies

- Adequate for current scope

### Filtering Implementation

**Decision**: Server-side filtering with debounced client requests

**Rationale**: Better performance and user experience

**Benefits**:

- Reduced API calls

- Smooth typing experience

- Server-side validation

## 🚀 Deployment

### Local Production Build

```bash
# Backend
cd backend
bun run start

# Frontend
cd frontend
bun run build
bun run preview
```

### Docker Production

```bash
docker-compose up --build
```

### Production Deployment Scripts

**Backend (Express.js)**
```bash
# Install dependencies
bun install

# Build if TypeScript
bun run build

# Start production server
NODE_ENV=production bun run start
```

**Frontend (Vite.js)**
```bash
# Install dependencies
bun install

# Build for production
bun run build

# Preview production build locally
bun run preview

# Serve with static server (optional)
bunx serve dist
```

## 🔍 API Documentation

### POST /logs

Ingest a single log entry

**Request Body:**

```json
{
  "level": "error|warn|info|debug",
  "message": "string",
  "resourceId": "string",
  "timestamp": "ISO 8601 string",
  "traceId": "string",
  "spanId": "string",
  "commit": "string",
  "metadata": "object"
}
```

**Response:** `201 Created` with the log object

### GET /logs

Retrieve filtered logs

**Query Parameters:**

- `level`: Filter by log level

- `message`: Search in log messages

- `resourceId`: Filter by resource ID

- `timestamp_start`: Start of time range (ISO 8601)

- `timestamp_end`: End of time range (ISO 8601)

- `traceId`: Filter by trace ID

- `spanId`: Filter by span ID

- `commit`: Filter by commit hash

**Response:** `200 OK` with array of log objects

### GET /analytics

Get analytics data for current filters

**Response:** `200 OK` with analytics object containing level counts and hourly data

## 📦 Package Management with Bun

This project uses Bun.js as the primary package manager for improved performance:

```bash
# Install dependencies
bun install

# Add new packages
bun add <package-name>

# Add dev dependencies
bun add -d <package-name>

# Run scripts
bun run <script-name>

# Run files directly
bun <file.js>
```

### Bun-specific optimizations:

- **Faster installs**: Bun's package installation is significantly faster than npm/yarn
- **Built-in bundler**: No need for separate build tools in many cases
- **TypeScript support**: Native TypeScript execution without compilation step
- **Hot reloading**: Built-in watch mode for development
