const database = require("../config/database");

class LogService {
  async createLog(logData) {
    const logs = await database.getData("/logs");
    logs.push(logData);
    await database.push("/logs", logs);
    return logData;
  }

  async getLogs(filters) {
    let logs = await database.getData("/logs");
    logs = this.applyFilters(logs, filters);
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
