const sampleLogs = [
  {
    level: "error",
    message: "Database connection failed",
    resourceId: "server-001",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    traceId: "abc-123-def-456",
    spanId: "span-001",
    commit: "e3b0c44298fc1c14",
    metadata: {
      parentResourceId: "server-001",
      source: "database.js",
      tags: ["database", "connection", "critical"],
      errorCode: "DB_CONN_FAILED",
      retryCount: 3,
    },
  },
  {
    level: "warn",
    message: "High memory usage detected",
    resourceId: "server-002",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    traceId: "xyz-789-ghi-012",
    spanId: "span-002",
    commit: "a1b2c3d4e5f6g7h8",
    metadata: {
      parentResourceId: "server-002",
      source: "monitor.js",
      tags: ["memory", "performance", "warning"],
      memoryUsage: "85%",
      threshold: "80%",
    },
  },
  {
    level: "info",
    message: "User authentication successful",
    resourceId: "auth-service",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    traceId: "mno-345-pqr-678",
    spanId: "span-003",
    commit: "f1e2d3c4b5a69788",
    metadata: {
      parentResourceId: "auth-service",
      source: "auth.js",
      tags: ["authentication", "user", "success"],
      userId: "user-12345",
      sessionId: "sess-abcdef",
      ipAddress: "192.168.1.100",
    },
  },
  {
    level: "debug",
    message: "Cache hit for user profile data",
    resourceId: "cache-service",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    traceId: "stu-901-vwx-234",
    spanId: "span-004",
    commit: "9876543210abcdef",
    metadata: {
      parentResourceId: "cache-service",
      source: "cache.js",
      tags: ["cache", "performance", "hit"],
      cacheKey: "user:profile:12345",
      hitRate: "92%",
      responseTime: "2ms",
    },
  },
  {
    level: "error",
    message: "Payment processing failed",
    resourceId: "payment-service",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    traceId: "yza-567-bcd-890",
    spanId: "span-005",
    commit: "fedcba0987654321",
    metadata: {
      parentResourceId: "payment-service",
      source: "payment.js",
      tags: ["payment", "transaction", "error"],
      transactionId: "txn-98765",
      amount: "$99.99",
      errorCode: "INSUFFICIENT_FUNDS",
      userId: "user-67890",
    },
  },
  {
    level: "info",
    message: "API request processed successfully",
    resourceId: "api-gateway",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    traceId: "efg-123-hij-456",
    spanId: "span-006",
    commit: "1a2b3c4d5e6f7g8h",
    metadata: {
      parentResourceId: "api-gateway",
      source: "gateway.js",
      tags: ["api", "request", "success"],
      endpoint: "/api/users/profile",
      method: "GET",
      statusCode: 200,
      responseTime: "150ms",
      userAgent: "Mozilla/5.0 Chrome/91.0",
    },
  },
  {
    level: "warn",
    message: "Rate limit approaching for API key",
    resourceId: "rate-limiter",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    traceId: "klm-789-nop-012",
    spanId: "span-007",
    commit: "8h7g6f5e4d3c2b1a",
    metadata: {
      parentResourceId: "rate-limiter",
      source: "rateLimit.js",
      tags: ["rate-limit", "api", "warning"],
      apiKey: "key-abc123",
      currentUsage: 850,
      limit: 1000,
      resetTime: "2024-01-07T15:00:00Z",
    },
  },
  {
    level: "info",
    message: "Scheduled backup completed successfully",
    resourceId: "backup-service",
    timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    traceId: "qrs-345-tuv-678",
    spanId: "span-008",
    commit: "backup123456789a",
    metadata: {
      parentResourceId: "backup-service",
      source: "backup.js",
      tags: ["backup", "scheduled", "success"],
      backupSize: "2.5GB",
      duration: "45 minutes",
      destination: "s3://backups/daily/",
      filesCount: 15420,
    },
  },
  {
    level: "debug",
    message: "Database query executed",
    resourceId: "db-pool-01",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    traceId: "wxy-901-zab-234",
    spanId: "span-009",
    commit: "query987654321def",
    metadata: {
      parentResourceId: "db-pool-01",
      source: "database.js",
      tags: ["database", "query", "performance"],
      query: "SELECT * FROM users WHERE active = true",
      executionTime: "25ms",
      rowsReturned: 1247,
      connectionPool: "pool-1",
    },
  },
  {
    level: "error",
    message: "External API timeout",
    resourceId: "external-api-client",
    timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    traceId: "cde-567-fgh-890",
    spanId: "span-010",
    commit: "timeout12345abcde",
    metadata: {
      parentResourceId: "external-api-client",
      source: "apiClient.js",
      tags: ["external-api", "timeout", "error"],
      endpoint: "https://api.external-service.com/data",
      timeout: "30s",
      retryAttempt: 2,
      maxRetries: 3,
    },
  },
  {
    level: "info",
    message: "User session started",
    resourceId: "session-manager",
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    traceId: "ijk-123-lmn-456",
    spanId: "span-011",
    commit: "session789012345f",
    metadata: {
      parentResourceId: "session-manager",
      source: "session.js",
      tags: ["session", "user", "start"],
      userId: "user-11111",
      sessionId: "sess-xyz789",
      ipAddress: "10.0.0.15",
      userAgent: "Mozilla/5.0 Safari/537.36",
    },
  },
  {
    level: "warn",
    message: "Disk space running low",
    resourceId: "server-003",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    traceId: "opq-789-rst-012",
    spanId: "span-012",
    commit: "disk456789012345",
    metadata: {
      parentResourceId: "server-003",
      source: "monitor.js",
      tags: ["disk", "storage", "warning"],
      availableSpace: "2.1GB",
      totalSpace: "50GB",
      usagePercentage: "95.8%",
      mountPoint: "/var/log",
    },
  },
]

module.exports = sampleLogs

