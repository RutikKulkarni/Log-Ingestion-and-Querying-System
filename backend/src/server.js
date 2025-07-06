const app = require("./app");
const config = require("./config");

const PORT = config.PORT;

const startServer = async () => {
  try {
    await config.database.initialize();
    app.listen(PORT, () => {
      console.log(`Log server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
