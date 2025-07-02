import type { Log } from "../types/log"
import LoadingSpinner from "./LoadingSpinner"

interface LogListProps {
  logs: Log[]
  loading: boolean
}

const levelColors = {
  error: "border-l-red-500 bg-red-900/10",
  warn: "border-l-yellow-500 bg-yellow-900/10",
  info: "border-l-blue-500 bg-blue-900/10",
  debug: "border-l-gray-500 bg-gray-900/10",
}

const levelTextColors = {
  error: "text-red-400 bg-red-900/20",
  warn: "text-yellow-400 bg-yellow-900/20",
  info: "text-blue-400 bg-blue-900/20",
  debug: "text-gray-400 bg-gray-900/20",
}

export default function LogList({ logs = [], loading = false }: LogListProps) {
  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-8">
        <LoadingSpinner text="Loading logs..." />
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-8">
        <div className="text-center text-gray-400">
          <p className="text-lg">No logs found</p>
          <p className="text-sm">Try adjusting your filters or ingest some logs</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Logs ({logs.length})</h2>
      </div>

      <div className="divide-y divide-gray-700 max-h-[800px] overflow-y-auto">
        {logs.map((log, index) => (
          <div
            key={`${log.traceId}-${log.spanId}-${index}`}
            className={`p-4 border-l-4 ${levelColors[log.level as keyof typeof levelColors]}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${levelTextColors[log.level as keyof typeof levelTextColors]}`}
                >
                  {log.level.toUpperCase()}
                </span>
                <span className="text-sm text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
              <span className="text-xs text-gray-500 font-mono">{log.resourceId}</span>
            </div>

            <div className="mb-3">
              <p className="text-gray-100 font-medium">{log.message}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs text-gray-400">
              <div>
                <span className="font-medium">Trace ID:</span>
                <span className="ml-1 font-mono text-gray-300">{log.traceId}</span>
              </div>
              <div>
                <span className="font-medium">Span ID:</span>
                <span className="ml-1 font-mono text-gray-300">{log.spanId}</span>
              </div>
              <div>
                <span className="font-medium">Commit:</span>
                <span className="ml-1 font-mono text-gray-300">{log.commit}</span>
              </div>
            </div>

            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <div className="mt-3 p-2 bg-gray-900/50 rounded text-xs">
                <span className="font-medium text-gray-300">Metadata:</span>
                <pre className="mt-1 text-gray-400 overflow-x-auto">{JSON.stringify(log.metadata, null, 2)}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
