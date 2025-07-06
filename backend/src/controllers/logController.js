const logService = require("../services/logService");

class LogController {
  async createLog(req, res, next) {
    try {
      const logData = req.body;

      if (!logService.io) {
        logService.setSocketIO(req.app.get("io"));
      }

      const createdLog = await logService.createLog(logData);
      res.status(201).json(createdLog);
    } catch (error) {
      next(error);
    }
  }

  async getLogs(req, res, next) {
    try {
      const filters = req.query;
      const logs = await logService.getLogs(filters);
      res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  }

  async getSampleLogs(req, res, next) {
    try {
      const filters = req.query;
      const logs = await logService.getSampleLogs(filters);
      res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LogController();
