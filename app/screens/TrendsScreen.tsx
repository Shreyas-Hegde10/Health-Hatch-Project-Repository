import React, { FC, useEffect, useState } from "react"
import { View, StyleSheet, TextStyle, ViewStyle, ScrollView } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { HistoricalAnalysisChart } from "@/components/HistoricalAnalysisChart"
import { StatCard } from "@/components/StatCard"
import { fetchTrends, type Trends } from "@/services/hydrationService"

/**
 * Trends Screen
 * Shows daily and weekly hydration trends and insights
 */
export const TrendsScreen: FC = function TrendsScreen() {
  const [trends, setTrends] = useState<Trends | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTrends()
  }, [])

  const loadTrends = async () => {
    try {
      const data = await fetchTrends()
      setTrends(data)
    } catch (error) {
      console.error("Error loading trends:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !trends) {
    return (
      <Screen preset="fixed" contentContainerStyle={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </Screen>
    )
  }

  // Prepare data for the HistoricalAnalysisChart
  const hydrationData = trends.hydration.weekly.map((d) => ({
    day: d.day!,
    value: d.avgLevel!,
  }))

  const impedanceData = trends.impedance.weekly.map((d) => ({
    day: d.day!,
    value: d.value!,
  }))

  const skinTempData = trends.skinTemp.weekly.map((d) => ({
    day: d.day!,
    value: d.value!,
  }))

  const heartRateData = trends.heartRate.weekly.map((d) => ({
    day: d.day!,
    value: d.value!,
  }))

  // Calculate averages
  const calculateAverage = (data: { value: number }[]) => {
    const sum = data.reduce((acc, d) => acc + d.value, 0)
    return sum / data.length
  }

  const averages = {
    hydration: {
      current: calculateAverage(hydrationData),
      change: 4, // Mock change percentage
    },
    impedance: {
      current: calculateAverage(impedanceData),
      change: -2,
    },
    skinTemp: {
      current: calculateAverage(skinTempData),
      change: 0.1,
    },
    heartRate: {
      current: calculateAverage(heartRateData),
      change: 1,
    },
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Insights & Trends</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Historical Analysis Chart with Metric Tabs */}
        <HistoricalAnalysisChart
          hydrationData={hydrationData}
          impedanceData={impedanceData}
          skinTempData={skinTempData}
          heartRateData={heartRateData}
          averages={averages}
        />

        {/* Stat Cards Row */}
        <View style={styles.statsRow}>
          <StatCard
            icon="📈"
            label="CONSISTENCY"
            value={`${trends.hydration.consistency}%`}
            color="#8B5CF6"
            backgroundColor="#F5F3FF"
            style={styles.statCard}
          />
          <StatCard
            icon="🏆"
            label="HYDRATION SCORE"
            value={trends.hydration.score}
            color="#10B981"
            backgroundColor="#D1FAE5"
            style={styles.statCard}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  } as ViewStyle,

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  } as TextStyle,

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  } as ViewStyle,

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
  } as TextStyle,

  scrollContainer: {
    flex: 1,
  } as ViewStyle,

  statsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  } as ViewStyle,

  statCard: {
    flex: 1,
  } as ViewStyle,

  bottomSpacing: {
    height: 40,
  } as ViewStyle,
})
