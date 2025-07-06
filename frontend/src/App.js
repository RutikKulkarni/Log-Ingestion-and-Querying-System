"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import FilterBar from "./components/FilterBar";
import LogList from "./components/LogList";
import LogModeToggle from "./components/LogModeToggle";
import { fetchLogs, fetchSampleLogs } from "./services/api";
import { useWebSocket } from "./hooks/useWebsocket";

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("sample");
  const [filters, setFilters] = useState({
    message: "",
    level: "",
    resourceId: "",
    timestamp_start: "",
    timestamp_end: "",
  });

  const filtersRef = useRef(filters);
  const modeRef = useRef(mode);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const logMatchesFilters = useCallback((log, currentFilters) => {
    if (currentFilters.level && log.level !== currentFilters.level) {
      return false;
    }

    if (currentFilters.message && currentFilters.message.trim() !== "") {
      const searchTerm = currentFilters.message.toLowerCase();
      if (!log.message.toLowerCase().includes(searchTerm)) {
        return false;
      }
    }

    if (currentFilters.resourceId && currentFilters.resourceId.trim() !== "") {
      if (!log.resourceId.includes(currentFilters.resourceId)) {
        return false;
      }
    }

    if (
      currentFilters.timestamp_start &&
      currentFilters.timestamp_start.trim() !== ""
    ) {
      const startDate = new Date(currentFilters.timestamp_start);
      if (new Date(log.timestamp) < startDate) {
        return false;
      }
    }

    if (
      currentFilters.timestamp_end &&
      currentFilters.timestamp_end.trim() !== ""
    ) {
      const endDate = new Date(currentFilters.timestamp_end);
      if (new Date(log.timestamp) > endDate) {
        return false;
      }
    }

    return true;
  }, []);

  const handleNewLog = useCallback(
    (newLog) => {
      console.log("App processing new log:", newLog);

      if (modeRef.current === "realtime") {
        const matchesFilters = logMatchesFilters(newLog, filtersRef.current);
        console.log(
          "🔍 Log matches filters:",
          matchesFilters,
          "Filters:",
          filtersRef.current
        );

        if (matchesFilters) {
          setLogs((prevLogs) => {
            const updatedLogs = [newLog, ...prevLogs].slice(0, 100);
            console.log(
              "Updated logs count:",
              updatedLogs.length,
              "New log:",
              newLog.message
            );
            return updatedLogs;
          });
        } else {
          console.log("Log filtered out:", newLog.level, newLog.message);
        }
      } else {
        console.log("Not in realtime mode, ignoring log");
      }
    },
    [logMatchesFilters]
  );

  const { connected, connectionError, generatorStatus } = useWebSocket({
    enabled: mode === "realtime",
    onNewLog: handleNewLog,
  });

  const loadLogs = useCallback(async () => {
    if (mode === "realtime" && connected) {
      console.log("Skipping log load - in realtime mode");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data;
      if (mode === "sample") {
        data = await fetchSampleLogs(filters);
      } else {
        data = await fetchLogs(filters);
      }
      console.log("Loaded logs:", data.length);
      setLogs(data);
    } catch (err) {
      setError("Failed to load logs. Please try again.");
      console.error("Error loading logs:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, mode, connected]);

  useEffect(() => {
    if (mode === "sample") {
      loadLogs();
    } else if (mode === "realtime" && !connected) {
      setLogs([]);
    }
  }, [filters, mode, loadLogs, connected]);

  const handleModeChange = useCallback(
    (newMode) => {
      console.log("Mode changing from", mode, "to", newMode);
      setMode(newMode);
      setLogs([]);
      setError(null);

      if (newMode === "realtime") {
        setLoading(true);
      }
    },
    [mode]
  );

  useEffect(() => {
    if (mode === "realtime" && connected) {
      setLoading(false);
    }
  }, [mode, connected]);

  const handleFilterChange = useCallback(
    (newFilters) => {
      console.log("Filters changing:", newFilters);
      setFilters(newFilters);

      if (mode === "realtime" && connected) {
        setLogs((prevLogs) => {
          const filteredLogs = prevLogs.filter((log) =>
            logMatchesFilters(log, newFilters)
          );
          console.log(
            "Re-filtered logs:",
            filteredLogs.length,
            "from",
            prevLogs.length
          );
          return filteredLogs;
        });
      }
    },
    [mode, connected, logMatchesFilters]
  );

  const handleClearFilters = useCallback(() => {
    const clearedFilters = {
      message: "",
      level: "",
      resourceId: "",
      timestamp_start: "",
      timestamp_end: "",
    };
    console.log("Clearing filters");
    setFilters(clearedFilters);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Log Ingestion & Querying System
          </h1>
          <p className="text-gray-600">
            Search, filter, and analyze your application logs in real-time
          </p>
        </header>

        <LogModeToggle
          mode={mode}
          onModeChange={handleModeChange}
          connected={connected}
          connectionError={connectionError}
          generatorStatus={generatorStatus}
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

        <LogList
          logs={logs}
          loading={loading}
          mode={mode}
          connected={connected}
          generatorStatus={generatorStatus}
        />
      </div>
    </div>
  );
}

export default App;
