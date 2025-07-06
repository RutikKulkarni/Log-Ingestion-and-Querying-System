"use client";

import { useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiClock,
  FiServer,
  FiGitCommit,
} from "react-icons/fi";

const LogEntry = ({ log }) => {
  const [expanded, setExpanded] = useState(false);

  const getLevelStyles = (level) => {
    switch (level) {
      case "error":
        return {
          border: "border-l-red-500",
          bg: "bg-red-50",
          text: "text-red-800",
          badge: "bg-red-100 text-red-800",
        };
      case "warn":
        return {
          border: "border-l-yellow-500",
          bg: "bg-yellow-50",
          text: "text-yellow-800",
          badge: "bg-yellow-100 text-yellow-800",
        };
      case "info":
        return {
          border: "border-l-blue-500",
          bg: "bg-blue-50",
          text: "text-blue-800",
          badge: "bg-blue-100 text-blue-800",
        };
      case "debug":
        return {
          border: "border-l-gray-500",
          bg: "bg-gray-50",
          text: "text-gray-800",
          badge: "bg-gray-100 text-gray-800",
        };
      default:
        return {
          border: "border-l-gray-300",
          bg: "bg-white",
          text: "text-gray-800",
          badge: "bg-gray-100 text-gray-800",
        };
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const styles = getLevelStyles(log.level);

  return (
    <div
      className={`border-l-4 ${styles.border} ${styles.bg} p-4 hover:shadow-sm transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles.badge}`}
            >
              {log.level.toUpperCase()}
            </span>
            <div className="flex items-center text-sm text-gray-500 gap-4">
              <div className="flex items-center gap-1">
                <FiClock size={14} />
                <span>{formatTimestamp(log.timestamp)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiServer size={14} />
                <span>{log.resourceId}</span>
              </div>
            </div>
          </div>

          <div className={`text-sm ${styles.text} mb-2`}>
            <p className="font-medium">{log.message}</p>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Trace: {log.traceId}</span>
            <span>Span: {log.spanId}</span>
            <div className="flex items-center gap-1">
              <FiGitCommit size={12} />
              <span>{log.commit}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-4 p-1 hover:bg-gray-200 rounded transition-colors"
        >
          {expanded ? (
            <FiChevronDown size={16} />
          ) : (
            <FiChevronRight size={16} />
          )}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Metadata</h4>
          <pre className="text-xs text-gray-600 bg-gray-100 p-3 rounded overflow-x-auto">
            {JSON.stringify(log.metadata, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default LogEntry;
