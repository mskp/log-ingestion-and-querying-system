"use client"

import { useState, useEffect } from "react"
import type { FilterParams, AnalyticsData } from "../types/log"
import { API_URL } from "../lib/constants"

interface UseAnalyticsReturn {
  analytics: AnalyticsData | null
  loading: boolean
  error: string | null
}

export function useAnalytics(filters: FilterParams): UseAnalyticsReturn {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      setError(null)

      try {
        const queryParams = new URLSearchParams()
        Object.entries(filters || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            queryParams.append(key, value.toString())
          }
        })

        const response = await fetch(`${API_URL}/analytics?${queryParams}`)

        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        } else {
          setError("Failed to fetch analytics")
        }
      } catch (error) {
        console.error("Error fetching analytics:", error)
        setError("Network error: Unable to fetch analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [filters])

  return { analytics, loading, error }
}
