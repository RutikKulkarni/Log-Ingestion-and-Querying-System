"use client";

import { useState } from "react";
import { FiPlus, FiSend, FiX } from "react-icons/fi";
import { ingestLog } from "../services/api";

const LogIngestionForm = ({ onLogAdded, show, onClose }) => {
  const [formData, setFormData] = useState({
    level: "info",
    message: "",
    resourceId: "",
    traceId: "",
    spanId: "",
    commit: "",
    metadata: "{}",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let metadata;
      try {
        metadata = JSON.parse(formData.metadata);
      } catch (err) {
        throw new Error("Invalid JSON in metadata field");
      }

      const logData = {
        ...formData,
        metadata,
        timestamp: new Date().toISOString(),
      };

      await ingestLog(logData);
      onLogAdded();

      setFormData({
        level: "info",
        message: "",
        resourceId: "",
        traceId: "",
        spanId: "",
        commit: "",
        metadata: "{}",
      });

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleData = () => {
    const sampleMessages = [
      "User login successful",
      "Database query executed",
      "API request processed",
      "Cache miss occurred",
      "File upload completed",
      "Payment processed successfully",
      "Email notification sent",
      "Background job started",
    ];

    const sampleResources = [
      "auth-service",
      "api-gateway",
      "database-pool",
      "cache-service",
      "file-service",
      "payment-service",
      "notification-service",
      "worker-service",
    ];

    const randomMessage =
      sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    const randomResource =
      sampleResources[Math.floor(Math.random() * sampleResources.length)];
    const randomTrace = `trace-${Math.random().toString(36).substr(2, 9)}`;
    const randomSpan = `span-${Math.random().toString(36).substr(2, 6)}`;
    const randomCommit = Math.random().toString(36).substr(2, 16);

    setFormData({
      ...formData,
      message: randomMessage,
      resourceId: randomResource,
      traceId: randomTrace,
      spanId: randomSpan,
      commit: randomCommit,
      metadata: JSON.stringify(
        {
          source: "manual-entry",
          timestamp: new Date().toISOString(),
          userId: `user-${Math.floor(Math.random() * 1000)}`,
          requestId: `req-${Math.random().toString(36).substr(2, 8)}`,
        },
        null,
        2
      ),
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Add New Log Entry
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Log Level *
              </label>
              <select
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="debug">Debug</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resource ID *
              </label>
              <input
                type="text"
                value={formData.resourceId}
                onChange={(e) =>
                  setFormData({ ...formData, resourceId: e.target.value })
                }
                placeholder="e.g., server-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Describe what happened..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trace ID *
              </label>
              <input
                type="text"
                value={formData.traceId}
                onChange={(e) =>
                  setFormData({ ...formData, traceId: e.target.value })
                }
                placeholder="trace-abc123"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Span ID *
              </label>
              <input
                type="text"
                value={formData.spanId}
                onChange={(e) =>
                  setFormData({ ...formData, spanId: e.target.value })
                }
                placeholder="span-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commit *
              </label>
              <input
                type="text"
                value={formData.commit}
                onChange={(e) =>
                  setFormData({ ...formData, commit: e.target.value })
                }
                placeholder="abc123def456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Metadata (JSON) *
            </label>
            <textarea
              value={formData.metadata}
              onChange={(e) =>
                setFormData({ ...formData, metadata: e.target.value })
              }
              placeholder='{"key": "value"}'
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={generateSampleData}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
            >
              <FiPlus size={16} />
              Generate Sample Data
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FiSend size={16} />
                )}
                {loading ? "Adding..." : "Add Log"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogIngestionForm;
