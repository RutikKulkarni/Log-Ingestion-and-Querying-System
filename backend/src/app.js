const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const logGeneratorService = require("./services/logGeneratorService");

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type"],
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

app.set("io", io);
logGeneratorService.setSocketIO(io);

app.use("/api", routes);
app.use(errorHandler);

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.emit("connected", {
    message: "Connected to log server",
    id: socket.id,
  });

  socket.on("join-logs", () => {
    socket.join("logs-room");
    console.log(`Client ${socket.id} joined logs room`);

    const roomSize = io.sockets.adapter.rooms.get("logs-room")?.size || 0;
    console.log(`Total clients in logs room: ${roomSize}`);

    const status = logGeneratorService.getStatus();
    socket.emit("generator-status", status);
    console.log(`Sent generator status to ${socket.id}:`, status);
  });

  socket.on("start-realtime", () => {
    console.log(`Client ${socket.id} requested real-time logs`);

    if (!logGeneratorService.getStatus().isGenerating) {
      logGeneratorService.startGenerating();
      console.log("Started log generation");
    } else {
      console.log("Log generator already running, not starting again");
    }

    const status = logGeneratorService.getStatus();
    io.to("logs-room").emit("generator-status", status);
    console.log(`Broadcasted generator status to all clients:`, status);
  });

  socket.on("stop-realtime", () => {
    console.log(`Client ${socket.id} stopped real-time logs`);

    const clientsInRoom = io.sockets.adapter.rooms.get("logs-room");
    if (!clientsInRoom || clientsInRoom.size <= 1) {
      logGeneratorService.stopGenerating();
      console.log("Stopped log generation - no more clients");
    }

    const status = logGeneratorService.getStatus();
    io.to("logs-room").emit("generator-status", status);
  });

  socket.on("leave-logs", () => {
    socket.leave("logs-room");
    console.log(`Client ${socket.id} left logs room`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);

    setTimeout(() => {
      const clientsInRoom = io.sockets.adapter.rooms.get("logs-room");
      const roomSize = clientsInRoom?.size || 0;
      console.log(`Clients remaining in logs room: ${roomSize}`);

      if (roomSize === 0) {
        console.log("No clients connected, stopping log generation");
        logGeneratorService.stopGenerating();
      }
    }, 2000);
  });

  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });

  socket.on("ping", (data) => {
    console.log(`Ping from ${socket.id}:`, data);
    socket.emit("pong", {
      message: "Server received ping",
      timestamp: new Date().toISOString(),
    });
  });
});

app.get("/api/test", (req, res) => {
  const roomSize = io.sockets.adapter.rooms.get("logs-room")?.size || 0;
  res.json({
    message: "Backend is running",
    timestamp: new Date().toISOString(),
    generatorStatus: logGeneratorService.getStatus(),
    connectedClients: roomSize,
  });
});

process.on("SIGINT", () => {
  console.log("\n Shutting down server...");
  logGeneratorService.stopGenerating();
  server.close(() => {
    console.log("Server shut down gracefully");
    process.exit(0);
  });
});

module.exports = { app, server, io };
