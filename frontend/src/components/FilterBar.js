"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiX, FiFilter } from "react-icons/fi";

const FilterBar = ({ filters, onFilterChange, onClearFilters, loading }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);

    if (field === "message" || field === "resourceId") {
      const timeoutId = setTimeout(() => {
        onFilterChange(newFilters);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      onFilterChange(newFilters);
    }
  };

  const hasActiveFilters = Object.values(localFilters).some(
    (value) => value !== ""
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FiFilter className="text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-auto flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            <FiX size={14} />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Message
          </label>
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              value={localFilters.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Search in log messages..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Log Level
          </label>
          <select
            value={localFilters.level}
            onChange={(e) => handleInputChange("level", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          >
            <option value="">All Levels</option>
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resource ID
          </label>
          <input
            type="text"
            value={localFilters.resourceId}
            onChange={(e) => handleInputChange("resourceId", e.target.value)}
            placeholder="Filter by resource ID..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="datetime-local"
            value={localFilters.timestamp_start}
            onChange={(e) =>
              handleInputChange("timestamp_start", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="datetime-local"
            value={localFilters.timestamp_end}
            onChange={(e) => handleInputChange("timestamp_end", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
        </div>
      </div>

      {loading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          Loading logs...
        </div>
      )}
    </div>
  );
};

export default FilterBar;
