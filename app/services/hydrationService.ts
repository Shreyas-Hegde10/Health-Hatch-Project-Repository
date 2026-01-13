/**
 * Hydration Service
 * Simulates async API calls by loading data from local JSON file
 */

import mockData from "./mockData.json"

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export interface HydrationStatus {
  status: "optimal" | "dehydrated" | "retention"
  statusText: string
  lastSynced: string
  fluidLevel: number
  message: string
}

export interface Metric {
  value: number
  unit: string
  label: string
}

export interface Metrics {
  impedance: Metric
  skinTemp: Metric
  heartRate: Metric
  weather: Metric
}

export interface AIRecommendation {
  title: string
  message: string
}

export interface Alert {
  id: string
  severity: "info" | "warning" | "critical"
  title: string
  message: string
  timestamp: string
  nextSteps: string[]
}

export interface TrendData {
  time?: string
  day?: string
  level?: number
  avgLevel?: number
}

export interface Trends {
  daily: TrendData[]
  weekly: TrendData[]
}

export interface Personalization {
  baselineFluidLevel: number
  activityLevel: string
  environmentalFactors: {
    temperature: number
    humidity: number
  }
  learningProgress: number
}

export interface DashboardData {
  currentStatus: HydrationStatus
  metrics: Metrics
  aiRecommendation: AIRecommendation
  alerts: Alert[]
  trends: Trends
  personalization: Personalization
}

/**
 * Fetch current dashboard data
 */
export async function fetchDashboardData(): Promise<DashboardData> {
  await delay(500) // Simulate network request
  return mockData as DashboardData
}

/**
 * Fetch alerts
 */
export async function fetchAlerts(): Promise<Alert[]> {
  await delay(300)
  return mockData.alerts as Alert[]
}

/**
 * Fetch trends
 */
export async function fetchTrends(): Promise<Trends> {
  await delay(400)
  return mockData.trends as Trends
}

/**
 * Fetch personalization data
 */
export async function fetchPersonalization(): Promise<Personalization> {
  await delay(300)
  return mockData.personalization as Personalization
}
