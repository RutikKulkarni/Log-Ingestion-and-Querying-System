"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const wsURL = process.env.REACT_APP_WS_URL || "http://localhost:3001";

export function useWebSocket({ enabled, onNewLog }) {
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [generatorStatus, setGeneratorStatus] = useState({
    isGenerating: false,
    message: "",
  });
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isConnectingRef = useRef(false);

  const handleNewLog = useCallback(
    (log) => {
      console.log("WebSocket received new log:", log.level, log.message);
      onNewLog(log);
    },
    [onNewLog]
  );

  useEffect(() => {
    const cleanup = () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (socketRef.current) {
        console.log("Cleaning up WebSocket connection...");
        socketRef.current.emit("stop-realtime");
        socketRef.current.emit("leave-logs");
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      isConnectingRef.current = false;
      setConnected(false);
      setConnectionError(null);
      setGeneratorStatus({ isGenerating: false, message: "" });
    };

    if (!enabled) {
      cleanup();
      return;
    }

    if (
      isConnectingRef.current ||
      (socketRef.current && socketRef.current.connected)
    ) {
      console.log("⏭WebSocket already connecting or connected, skipping...");
      return;
    }

    console.log("Attempting to connect to WebSocket...");
    isConnectingRef.current = true;

    const testBackend = async () => {
      try {
        // const response = await fetch(`${wsURL}/api/text`, {
        const response = await fetch("http://localhost:3001/api/test", {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const data = await response.json();
        console.log("Backend test successful:", data);
        return true;
      } catch (error) {
        console.error("Backend test failed:", error);
        setConnectionError("Backend server not running ");
        isConnectingRef.current = false;
        return false;
      }
    };

    const connectSocket = async () => {
      const backendOk = await testBackend();
      if (!backendOk || !enabled) {
        isConnectingRef.current = false;
        return;
      }

      const socket = io(wsURL, {
        transports: ["websocket", "polling"],
        timeout: 10000,
        forceNew: true,
        reconnection: false,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("WebSocket connected successfully");
        isConnectingRef.current = false;
        setConnected(true);
        setConnectionError(null);

        socket.emit("join-logs");
        console.log("Joined logs room");

        socket.emit("ping", {
          message: "Frontend connected",
          timestamp: new Date().toISOString(),
        });

        setTimeout(() => {
          if (socket.connected) {
            console.log("Requesting real-time logs...");
            socket.emit("start-realtime");
          }
        }, 1000);
      });

      socket.on("connected", (data) => {
        console.log("Server welcome message:", data);
      });

      socket.on("pong", (data) => {
        console.log("Pong from server:", data);
      });

      socket.on("disconnect", (reason) => {
        console.log("WebSocket disconnected:", reason);
        isConnectingRef.current = false;
        setConnected(false);
        setGeneratorStatus({ isGenerating: false, message: "Disconnected" });

        if (
          enabled &&
          reason !== "io client disconnect" &&
          reason !== "client namespace disconnect"
        ) {
          console.log("Will attempt to reconnect in 3 seconds...");
          reconnectTimeoutRef.current = setTimeout(() => {
            if (enabled && !socketRef.current?.connected) {
              console.log("Attempting to reconnect...");
              connectSocket();
            }
          }, 3000);
        }
      });

      socket.on("connect_error", (error) => {
        console.error("WebSocket connection error:", error);
        isConnectingRef.current = false;
        setConnectionError(
          `Connection failed: ${error.message || "Unknown error"}`
        );
        setConnected(false);

        if (enabled) {
          reconnectTimeoutRef.current = setTimeout(() => {
            if (enabled && !socketRef.current?.connected) {
              console.log("Retrying connection...");
              connectSocket();
            }
          }, 5000);
        }
      });

      socket.on("new-log", (log) => {
        console.log("Received new-log event:", log);
        handleNewLog(log);
      });

      socket.on("generator-status", (status) => {
        console.log("Generator status received:", status);
        setGeneratorStatus(status);
      });

      socket.onAny((eventName, ...args) => {
        console.log(`Socket event received: ${eventName}`, args);
      });
    };

    connectSocket();

    return cleanup;
  }, [enabled, handleNewLog]);

  return { connected, connectionError, generatorStatus };
}
