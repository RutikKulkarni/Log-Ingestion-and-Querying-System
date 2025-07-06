import LogEntry from "./LogEntry";
import { FiInbox, FiWifi, FiLoader } from "react-icons/fi";

const LogList = ({ logs, loading, mode, connected, generatorStatus }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">
            {mode === "realtime"
              ? "Connecting to real-time stream..."
              : "Loading logs..."}
          </span>
        </div>
      </div>
    );
  }

  if (mode === "realtime" && connected && logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <FiWifi className="h-12 w-12 text-blue-500" />
            <div className="ml-2 flex space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div
                className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Waiting for Real-time Logs
          </h3>
          <p className="text-gray-600 mb-2">
            Connected and ready to receive logs. New logs will appear here
            automatically.
          </p>
          {generatorStatus?.isGenerating && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              <FiLoader className="animate-spin" size={14} />
              Generating logs...
            </div>
          )}
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <FiInbox className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No logs found
          </h3>
          <p className="text-gray-600">
            {mode === "realtime"
              ? "No real-time logs match your current filter criteria."
              : "No logs match your current filter criteria. Try adjusting your filters or check back later."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Log Entries ({logs.length})
          </h2>
          {mode === "realtime" && connected && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Live</span>
            </div>
          )}
        </div>
      </div>
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {logs.map((log, index) => (
          <LogEntry
            key={`${log.traceId}-${log.spanId}-${index}-${log.timestamp}`}
            log={log}
          />
        ))}
      </div>
    </div>
  );
};

export default LogList;
