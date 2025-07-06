"use client";

import { FiDatabase, FiActivity, FiInfo } from "react-icons/fi";

const LogTypeToggle = ({ logType, onToggle, sampleCount, realCount }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiInfo className="text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Log Source</h3>
        </div>

        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onToggle("sample")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              logType === "sample"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FiDatabase size={16} />
            Sample Logs
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                logType === "sample"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {sampleCount}
            </span>
          </button>

          <button
            onClick={() => onToggle("real")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              logType === "real"
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FiActivity size={16} />
            Real-time Logs
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                logType === "real"
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {realCount}
            </span>
          </button>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        {logType === "sample" ? (
          <p>Viewing pre-loaded sample logs for demonstration purposes</p>
        ) : (
          <p>Viewing real-time logs from actual API ingestion</p>
        )}
      </div>
    </div>
  );
};

export default LogTypeToggle;
