const { JsonDB, Config } = require("node-json-db");
const sampleLogs = require("../utils/sampleData");

class DatabaseManager {
  constructor() {
    this.db = new JsonDB(new Config("logs", true, false, "/"));
  }

  async initialize() {
    try {
      const logs = await this.db.getData("/logs");
      if (logs.length === 0) {
        console.log("Loading sample log data...");
        await this.db.push("/logs", sampleLogs);
        console.log(`Loaded ${sampleLogs.length} sample logs`);
      }
    } catch (error) {
      console.log("Initializing database with sample log data...");
      await this.db.push("/logs", sampleLogs);
      console.log(`Loaded ${sampleLogs.length} sample logs`);
    }
  }

  async getData(path) {
    return await this.db.getData(path);
  }

  async push(path, data) {
    return await this.db.push(path, data);
  }

  async resetToSampleData() {
    await this.db.push("/logs", sampleLogs);
    console.log(`Reset database with ${sampleLogs.length} sample logs`);
  }
}

module.exports = new DatabaseManager();
