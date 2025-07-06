const sampleLogs = require("../utils/sampleData");

class LogGeneratorService {
  constructor() {
    this.isGenerating = false;
    this.intervalId = null;
    this.logService = null;
    this.io = null;
  }

  setLogService(logService) {
    this.logService = logService;
  }

  setSocketIO(io) {
    this.io = io;
  }

  generateRandomLog() {
    const logLevels = ["error", "warn", "info", "debug"];
    const resources = [
      "server-001",
      "server-002",
      "auth-service",
      "payment-service",
      "api-gateway",
      "cache-service",
    ];

    const messages = {
      error: [
        "Database connection failed",
        "Payment processing error",
        "Authentication failed",
        "External API timeout",
        "Memory allocation failed",
        "File system error",
      ],
      warn: [
        "High memory usage detected",
        "Rate limit approaching",
        "Disk space running low",
        "Slow query detected",
        "Cache miss rate high",
        "Connection pool exhausted",
      ],
      info: [
        "User login successful",
        "Payment processed successfully",
        "Backup completed",
        "API request processed",
        "Cache refreshed",
        "Session created",
      ],
      debug: [
        "Cache hit for user data",
        "Database query executed",
        "Session validated",
        "API response cached",
        "Memory usage normal",
        "Request processed",
      ],
    };

    const level = logLevels[Math.floor(Math.random() * logLevels.length)];
    const resourceId = resources[Math.floor(Math.random() * resources.length)];
    const message =
      messages[level][Math.floor(Math.random() * messages[level].length)];

    return {
      level,
      message,
      resourceId,
      timestamp: new Date().toISOString(),
      traceId: `trace-${Math.random().toString(36).substr(2, 9)}`,
      spanId: `span-${Math.random().toString(36).substr(2, 6)}`,
      commit: Math.random().toString(36).substr(2, 16),
      metadata: {
        parentResourceId: resourceId,
        source: `${resourceId}.js`,
        tags: [level, "generated", "realtime"],
        timestamp: Date.now(),
        randomValue: Math.floor(Math.random() * 1000),
        userId:
          level === "info"
            ? `user-${Math.floor(Math.random() * 10000)}`
            : undefined,
        errorCode:
          level === "error"
            ? `ERR_${Math.floor(Math.random() * 999)}`
            : undefined,
      },
    };
  }

  async startGenerating() {
    if (this.isGenerating) {
      console.log("Log generator already running");
      return;
    }

    console.log("Starting automatic log generation...");
    this.isGenerating = true;

    const generateAndSend = async () => {
      if (!this.isGenerating) return;

      try {
        const logData = this.generateRandomLog();

        if (this.logService) {
          await this.logService.createLog(logData);
          console.log(
            `Generated ${logData.level.toUpperCase()} log: ${logData.message}`
          );
        }

        if (this.isGenerating) {
          const nextInterval = Math.random() * 4000 + 2000;
          this.intervalId = setTimeout(generateAndSend, nextInterval);
        }
      } catch (error) {
        console.error("Error generating log:", error);
        if (this.isGenerating) {
          this.intervalId = setTimeout(generateAndSend, 3000);
        }
      }
    };
    generateAndSend();
  }

  stopGenerating() {
    if (!this.isGenerating) {
      console.log("Log generator not running");
      return;
    }

    console.log("Stopping automatic log generation...");
    this.isGenerating = false;

    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  getStatus() {
    return {
      isGenerating: this.isGenerating,
      message: this.isGenerating
        ? "Generating logs automatically"
        : "Log generation stopped",
    };
  }
}

module.exports = new LogGeneratorService();
