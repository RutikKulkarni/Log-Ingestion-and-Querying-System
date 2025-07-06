# Log Ingestion and Querying System

A full-stack application for ingesting, storing, and querying log data. Built with Node.js/Express backend and React frontend.

## Features

- **Log Ingestion**: REST API endpoint to accept and store log entries
- **Advanced Filtering**: Search and filter logs by multiple criteria
- **Real-time Updates**: Dynamic filtering without page reloads
- **Visual Log Levels**: Color-coded log entries for easy identification
- **Responsive Design**: Clean, professional interface built with Tailwind CSS

## Architecture

### Backend (Node.js/Express)
- RESTful API with two main endpoints: POST /logs and GET /logs
- JSON file-based persistence using node-json-db
- Comprehensive filtering support with combinable criteria
- Input validation using Joi schema validation
- CORS enabled for frontend integration

### Frontend (React)
- Modern React with functional components and hooks
- Tailwind CSS for styling (no external UI libraries)
- React Icons for consistent iconography
- Debounced search inputs for optimal performance
- Responsive design for desktop usage

## Installation and Setup

### Recommended: Docker Setup

**Prerequisites:**
- Docker
- Docker Compose

**Quick Start with Docker:**

1. **Clone the repository**
   ```bash
   git clone https://github.com/RutikKulkarni/Log-Ingestion-and-Querying-System.git
   cd Log-Ingestion-and-Querying-System
   ```

2. **Create environment files**
   
   Create `frontend/.env`:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   REACT_APP_WS_URL=http://localhost:3001
   ```
   
   Create `backend/.env`:
   ```
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

**Docker Commands:**
```bash
# Start the application
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# Stop the application
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose down && docker-compose up --build
```

### Manual Setup

**Prerequisites:**
- Node.js
- npm

**Steps:**

1. **Clone the repository**
   ```bash
   git clone https://github.com/RutikKulkarni/Log-Ingestion-and-Querying-System.git
   cd Log-Ingestion-and-Querying-System
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start Backend** (in backend directory)
   ```bash
   npm run dev
   ```

5. **Start Frontend** (in frontend directory, new terminal)
   ```bash
   npm start
   ```

**Manual Setup URLs:**
- Backend server: http://localhost:3001
- Frontend application: http://localhost:3000


## Technology Stack

- **Backend**: Node.js, Express.js, node-json-db, Joi, Socket.IO
- **Frontend**: React, Tailwind CSS, React Icons, Socket.IO Client
- **Development**: Docker, Docker Compose, Nodemon
- **Storage**: JSON file-based persistence

