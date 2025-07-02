import { useAnalytics } from "../hooks/useAnalytics"
import LoadingSpinner from "./LoadingSpinner"
import type { FilterParams } from "../types/log"

interface AnalyticsProps {
  filters: FilterParams
}

export default function Analytics({ filters = {} }: AnalyticsProps) {
  const { analytics, loading, error } = useAnalytics(filters)

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6">
        <LoadingSpinner text="Loading analytics..." />
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6">
        <p className="text-red-400 text-center">{error || "Failed to load analytics"}</p>
      </div>
    )
  }

  const levelColors = {
    error: "bg-red-500",
    warn: "bg-yellow-500",
    info: "bg-blue-500",
    debug: "bg-gray-500",
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Log Level Distribution */}
        <div>
          <h3 className="text-md font-medium text-gray-200 mb-3">Log Level Distribution</h3>
          <div className="space-y-2">
            {Object.entries(analytics.levelCounts).map(([level, count]) => (
              <div key={level} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded ${levelColors[level as keyof typeof levelColors]}`} />
                  <span className="text-sm capitalize text-gray-300">{level}</span>
                </div>
                <span className="text-sm font-medium text-white">{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-300">Total Logs</span>
              <span className="text-white">{analytics.totalLogs}</span>
            </div>
          </div>
        </div>

        {/* Hourly Activity */}
        <div>
          <h3 className="text-md font-medium text-gray-200 mb-3">Activity (Last 24 Hours)</h3>
          <div className="space-y-1">
            {analytics.hourlyData.slice(0, 12).map((item, index) => {
              const maxCount = Math.max(...analytics.hourlyData.map((d) => d.count))
              const width = maxCount > 0 ? (item.count / maxCount) * 100 : 0

              return (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400 w-12">
                    {new Date(item.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-300 w-8">{item.count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
