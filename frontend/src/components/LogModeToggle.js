"use client";

import {
  FiDatabase,
  FiRadio,
  FiWifi,
  FiWifiOff,
  FiPlay,
  FiPause,
} from "react-icons/fi";

const LogModeToggle = ({
  mode,
  onModeChange,
  connected,
  connectionError,
  generatorStatus,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Log Source
          </h2>
          <p className="text-sm text-gray-600">
            Choose between sample data or real-time log streaming
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onModeChange("sample")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "sample"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FiDatabase size={16} />
            Sample Logs
          </button>

          <button
            onClick={() => onModeChange("realtime")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "realtime"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FiRadio size={16} />
            Real-time Logs
          </button>
        </div>
      </div>

      {mode === "realtime" && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            {connected ? (
              <>
                <FiWifi className="text-green-500" size={16} />
                <span className="text-sm text-green-600 font-medium">
                  Connected to real-time stream
                </span>
                <div className="ml-2 flex space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </>
            ) : (
              <>
                <FiWifiOff className="text-red-500" size={16} />
                <span className="text-sm text-red-600 font-medium">
                  {connectionError || "Connecting to real-time stream..."}
                </span>
              </>
            )}
          </div>

          {connected && generatorStatus && (
            <div className="flex items-center gap-2 mb-3">
              {generatorStatus.isGenerating ? (
                <>
                  <FiPlay className="text-blue-500" size={14} />
                  <span className="text-sm text-blue-600 font-medium">
                    Generating logs...
                  </span>
                </>
              ) : (
                <>
                  <FiPause className="text-gray-500" size={14} />
                  <span className="text-sm text-gray-600">
                    Log generation paused
                  </span>
                </>
              )}
            </div>
          )}

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="text-sm text-blue-800">
                <strong>Note:</strong> Real-time logs are automatically
                generated using sample log patterns. New logs will appear every
                2-6 seconds when connected.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogModeToggle;
