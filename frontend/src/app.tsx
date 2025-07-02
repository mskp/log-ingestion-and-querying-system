"use client"

import { useCallback, useState } from "react"
import { useLogs } from "./hooks/useLogs"
import Analytics from "./components/Analytics"
import ErrorBanner from "./components/ErrorBanner"
import LoadingSpinner from "./components/LoadingSpinner"
import LogFilters from "./components/LogFilters"
import LogList from "./components/LogList"
import type { FilterParams } from "./types/log"

export default function App() {
  const { logs, loading, error, initialLoading, fetchLogs, refreshLogs, clearError } = useLogs()
  const [filters, setFilters] = useState<FilterParams>({})
  const [showAnalytics, setShowAnalytics] = useState(false)

  const handleFiltersChange = useCallback(
    (newFilters: FilterParams) => {
      setFilters(newFilters)
      fetchLogs(newFilters)
    },
    [fetchLogs],
  )

  const clearFilters = useCallback(() => {
    const emptyFilters = {}
    setFilters(emptyFilters)
    fetchLogs(emptyFilters)
  }, [fetchLogs])

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading application..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Log Ingestion & Querying System</h1>
              <p className="text-gray-400">Monitor and analyze your application logs in real-time</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && <ErrorBanner error={error} onDismiss={clearError} />}

        {/* Action Buttons */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            {showAnalytics ? "Hide Analytics" : "Show Analytics"}
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Clear Filters
          </button>
          <button
            onClick={refreshLogs}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Refresh Logs
          </button>
        </div>

        {/* Analytics */}
        {showAnalytics && (
          <div className="mb-8">
            <Analytics filters={filters} />
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <LogFilters filters={filters} onFiltersChange={handleFiltersChange} />
          </div>

          {/* Logs Display */}
          <div className="lg:col-span-3">
            <LogList logs={logs} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}
