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

### Quick Start

1. **Clone the repository**
   ```
   git clone https://github.com/RutikKulkarni/Log-Ingestion-and-Querying-System.git
   cd Log-Ingestion-and-Querying-System
   ```

2. **Install backend dependencies**
   ```
   cd backend
   npm install
   ```

3. *Start backend**
   ```
   npm run dev
   ```

4. **Install frontend dependencies**
   ```
   cd frontend
   npm install
   ```

5. *Start frontend**
   ```
   npm start
   ```

This will start:
- Backend server on http://localhost:3001
- Frontend application on http://localhost:3000
