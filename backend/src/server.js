const { server } = require("./app");
const config = require("./config");

const PORT = config.PORT;

const startServer = async () => {
  try {
    await config.database.initialize();

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Log server running on http://localhost:${PORT}`);
      console.log(`WebSocket server ready for real-time logs`);
      console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
      console.log(`Frontend should connect to: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
