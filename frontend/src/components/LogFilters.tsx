"use client"

import { useCallback } from "react"
import { useDebounce } from "../hooks/useDebounce"
import type { FilterParams } from "../types/log"

interface LogFiltersProps {
  filters: FilterParams
  onFiltersChange: (filters: FilterParams) => void
}

export default function LogFilters({ filters = {}, onFiltersChange }: LogFiltersProps) {
  const debouncedOnFiltersChange = useDebounce(onFiltersChange, 300)

  const handleInputChange = useCallback(
    (field: keyof FilterParams, value: string) => {
      const newFilters = {
        ...filters,
        [field]: value,
      }
      debouncedOnFiltersChange(newFilters)
    },
    [filters, debouncedOnFiltersChange],
  )

  const formatDateTimeForInput = (isoString: string | undefined): string => {
    if (!isoString) return ""
    try {
      const date = new Date(isoString)
      return date.toISOString().slice(0, 16)
    } catch {
      return ""
    }
  }

  const handleDateTimeChange = (field: keyof FilterParams, value: string) => {
    if (value) {
      const isoString = new Date(value).toISOString()
      handleInputChange(field, isoString)
    } else {
      handleInputChange(field, "")
    }
  }

  const inputClasses =
    "w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
  const labelClasses = "block text-sm font-medium text-gray-200 mb-1"

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50">
      <h2 className="text-lg font-semibold text-white mb-4">Filters</h2>

      <div className="space-y-4">
        {/* Message Search */}
        <div>
          <label htmlFor="message" className={labelClasses}>
            Search Message
          </label>
          <input
            type="text"
            id="message"
            defaultValue={filters?.message || ""}
            onChange={(e) => handleInputChange("message", e.target.value)}
            placeholder="Search in log messages..."
            className={inputClasses}
          />
        </div>

        {/* Level Filter */}
        <div>
          <label htmlFor="level" className={labelClasses}>
            Log Level
          </label>
          <select
            id="level"
            defaultValue={filters?.level || ""}
            onChange={(e) => handleInputChange("level", e.target.value)}
            className={inputClasses}
          >
            <option value="">All Levels</option>
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
        </div>

        {/* Resource ID */}
        <div>
          <label htmlFor="resourceId" className={labelClasses}>
            Resource ID
          </label>
          <input
            type="text"
            id="resourceId"
            defaultValue={filters?.resourceId || ""}
            onChange={(e) => handleInputChange("resourceId", e.target.value)}
            placeholder="e.g., server-1234"
            className={inputClasses}
          />
        </div>

        {/* Timestamp Range */}
        <div>
          <label className={labelClasses}>Timestamp Range</label>
          <div className="space-y-2">
            <div>
              <label htmlFor="timestamp_start" className="block text-xs text-gray-400 mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                id="timestamp_start"
                defaultValue={formatDateTimeForInput(filters?.timestamp_start)}
                onChange={(e) => handleDateTimeChange("timestamp_start", e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="timestamp_end" className="block text-xs text-gray-400 mb-1">
                End Time
              </label>
              <input
                type="datetime-local"
                id="timestamp_end"
                defaultValue={formatDateTimeForInput(filters?.timestamp_end)}
                onChange={(e) => handleDateTimeChange("timestamp_end", e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* Trace ID */}
        <div>
          <label htmlFor="traceId" className={labelClasses}>
            Trace ID
          </label>
          <input
            type="text"
            id="traceId"
            defaultValue={filters?.traceId || ""}
            onChange={(e) => handleInputChange("traceId", e.target.value)}
            placeholder="e.g., abc-xyz-123"
            className={inputClasses}
          />
        </div>

        {/* Span ID */}
        <div>
          <label htmlFor="spanId" className={labelClasses}>
            Span ID
          </label>
          <input
            type="text"
            id="spanId"
            defaultValue={filters?.spanId || ""}
            onChange={(e) => handleInputChange("spanId", e.target.value)}
            placeholder="e.g., span-456"
            className={inputClasses}
          />
        </div>

        {/* Commit */}
        <div>
          <label htmlFor="commit" className={labelClasses}>
            Commit Hash
          </label>
          <input
            type="text"
            id="commit"
            defaultValue={filters?.commit || ""}
            onChange={(e) => handleInputChange("commit", e.target.value)}
            placeholder="e.g., 5e5342f"
            className={inputClasses}
          />
        </div>
      </div>
    </div>
  )
}
