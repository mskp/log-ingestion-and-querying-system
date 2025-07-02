"use client"

import { useState, useCallback, useEffect } from "react"
import type { Log, FilterParams } from "../types/log"
import { API_URL } from "../lib/constants"

interface UseLogsReturn {
  logs: Log[]
  loading: boolean
  error: string | null
  initialLoading: boolean
  fetchLogs: (filters: FilterParams) => Promise<void>
  refreshLogs: () => void
  clearError: () => void
}

export function useLogs(): UseLogsReturn {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [currentFilters, setCurrentFilters] = useState<FilterParams>({})

  const fetchLogs = useCallback(async (filters: FilterParams) => {
    setLoading(true)
    setError(null)
    setCurrentFilters(filters)

    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.append(key, value.toString())
        }
      })

      const response = await fetch(`${API_URL}/logs?${queryParams}`)

      if (response.ok) {
        const data = await response.json()
        setLogs(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to fetch logs")
        console.error("❌ Failed to fetch logs:", errorData)
      }
    } catch (error) {
      console.error("❌ Error fetching logs:", error)
      setError("Network error: Unable to connect to the server")
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshLogs = useCallback(() => {
    fetchLogs(currentFilters)
  }, [fetchLogs, currentFilters])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Initial data load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await fetchLogs({})
      } catch (error) {
        console.error("Failed to initialize app:", error)
        setError("Failed to load initial data")
      } finally {
        setInitialLoading(false)
      }
    }

    initializeApp()
  }, [fetchLogs])

  return {
    logs,
    loading,
    error,
    initialLoading,
    fetchLogs,
    refreshLogs,
    clearError,
  }
}
