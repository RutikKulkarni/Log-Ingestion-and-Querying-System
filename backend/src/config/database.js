const { JsonDB, Config } = require("node-json-db");

class DatabaseManager {
  constructor() {
    this.db = new JsonDB(new Config("logs", true, false, "/"));
  }

  async initialize() {
    try {
      await this.db.getData("/logs");
    } catch (error) {
      await this.db.push("/logs", []);
    }
  }

  async getData(path) {
    return await this.db.getData(path);
  }

  async push(path, data) {
    return await this.db.push(path, data);
  }
}

module.exports = new DatabaseManager();
