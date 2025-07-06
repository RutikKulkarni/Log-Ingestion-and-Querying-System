class HealthController {
  healthCheck(req, res) {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = new HealthController();
