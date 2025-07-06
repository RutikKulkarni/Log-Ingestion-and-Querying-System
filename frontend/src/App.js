"use client";

import { useState, useEffect, useCallback } from "react";
import FilterBar from "./components/FilterBar";
import LogList from "./components/LogList";
import LogTypeToggle from "./components/LogTypeToggle";
import LogIngestionForm from "./components/LogIngestionForm";
import { fetchLogs } from "./services/api";
import { FiPlus } from "react-icons/fi";

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logType, setLogType] = useState("sample"); // 'sample' or 'real'
  const [showIngestionForm, setShowIngestionForm] = useState(false);
  const [logCounts, setLogCounts] = useState({ sample: 0, real: 0 });
  const [filters, setFilters] = useState({
    message: "",
    level: "",
    resourceId: "",
    timestamp_start: "",
    timestamp_end: "",
  });

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchLogs({ ...filters, logType });
      setLogs(data);
    } catch (err) {
      setError("Failed to load logs. Please try again.");
      console.error("Error loading logs:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, logType]);

  const loadLogCounts = useCallback(async () => {
    try {
      const [sampleLogs, realLogs] = await Promise.all([
        fetchLogs({ logType: "sample" }),
        fetchLogs({ logType: "real" }),
      ]);
      setLogCounts({
        sample: sampleLogs.length,
        real: realLogs.length,
      });
    } catch (err) {
      console.error("Error loading log counts:", err);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    loadLogCounts();
  }, [loadLogCounts]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      message: "",
      level: "",
      resourceId: "",
      timestamp_start: "",
      timestamp_end: "",
    });
  };

  const handleLogTypeToggle = (newLogType) => {
    setLogType(newLogType);
  };

  const handleLogAdded = () => {
    loadLogs();
    loadLogCounts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Log Ingestion & Querying System
              </h1>
              <p className="text-gray-600">
                Search, filter, and analyze your application logs
              </p>
            </div>

            {logType === "real" && (
              <button
                onClick={() => setShowIngestionForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiPlus size={16} />
                Add Log Entry
              </button>
            )}
          </div>
        </header>

        <LogTypeToggle
          logType={logType}
          onToggle={handleLogTypeToggle}
          sampleCount={logCounts.sample}
          realCount={logCounts.real}
        />

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          loading={loading}
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <LogList logs={logs} loading={loading} />

        <LogIngestionForm
          show={showIngestionForm}
          onClose={() => setShowIngestionForm(false)}
          onLogAdded={handleLogAdded}
        />
      </div>
    </div>
  );
}

export default App;
