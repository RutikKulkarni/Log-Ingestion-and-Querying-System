const database = require("../config/database");
const logGeneratorService = require("./logGeneratorService");

class LogService {
  constructor() {
    this.io = null;
    logGeneratorService.setLogService(this);
  }

  setSocketIO(io) {
    this.io = io;
    logGeneratorService.setSocketIO(io);
  }

  async createLog(logData) {
    try {
      const logs = await database.getData("/logs");
      logs.push(logData);
      await database.push("/logs", logs);

      if (this.io) {
        console.log(
          `Emitting new log to clients: ${logData.level} - ${logData.message}`
        );
        this.io.to("logs-room").emit("new-log", logData);

        this.io.emit("new-log", logData);
      } else {
        console.log("No Socket.IO instance available");
      }

      return logData;
    } catch (error) {
      console.error("Error creating log:", error);
      throw error;
    }
  }

  async getLogs(filters) {
    let logs = await database.getData("/logs");
    logs = this.applyFilters(logs, filters);
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return logs;
  }

  async getSampleLogs(filters) {
    const sampleLogs = require("../utils/sampleData");
    const logs = this.applyFilters(sampleLogs, filters);
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return logs;
  }

  applyFilters(logs, filters) {
    const {
      level,
      message,
      resourceId,
      timestamp_start,
      timestamp_end,
      traceId,
      spanId,
      commit,
    } = filters;

    if (level) {
      logs = logs.filter((log) => log.level === level);
    }

    if (message) {
      const searchTerm = message.toLowerCase();
      logs = logs.filter((log) =>
        log.message.toLowerCase().includes(searchTerm)
      );
    }

    if (resourceId) {
      logs = logs.filter((log) => log.resourceId === resourceId);
    }

    if (timestamp_start) {
      const startDate = new Date(timestamp_start);
      logs = logs.filter((log) => new Date(log.timestamp) >= startDate);
    }

    if (timestamp_end) {
      const endDate = new Date(timestamp_end);
      logs = logs.filter((log) => new Date(log.timestamp) <= endDate);
    }

    if (traceId) {
      logs = logs.filter((log) => log.traceId === traceId);
    }

    if (spanId) {
      logs = logs.filter((log) => log.spanId === spanId);
    }

    if (commit) {
      logs = logs.filter((log) => log.commit === commit);
    }

    return logs;
  }
}

module.exports = new LogService();
