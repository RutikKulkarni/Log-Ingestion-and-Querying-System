import LogEntry from "./LogEntry";
import { FiInbox } from "react-icons/fi";

const LogList = ({ logs, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading logs...</span>
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
            No logs match your current filter criteria. Try adjusting your
            filters or check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Log Entries ({logs.length})
        </h2>
      </div>
      <div className="divide-y divide-gray-200">
        {logs.map((log, index) => (
          <LogEntry key={`${log.traceId}-${log.spanId}-${index}`} log={log} />
        ))}
      </div>
    </div>
  );
};

export default LogList;
