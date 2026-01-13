import React, { FC, useEffect, useState } from "react"
import { View, StyleSheet, TextStyle, ViewStyle, Dimensions } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { WeeklyChart } from "@/components/WeeklyChart"
import { StatCard } from "@/components/StatCard"
import { MetricCard } from "@/components/MetricCard"
import { fetchTrends, type Trends } from "@/services/hydrationService"
import { useSharedValue } from "react-native-reanimated"
import Carousel from "react-native-reanimated-carousel"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

/**
 * Trends Screen
 * Shows daily and weekly hydration trends and insights
 */
export const TrendsScreen: FC = function TrendsScreen() {
  const [trends, setTrends] = useState<Trends | null>(null)
  const [loading, setLoading] = useState(true)
  const progress = useSharedValue<number>(0)

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

  const carouselData = [
    {
      metricName: "Hydration Level",
      currentValue: 68,
      unit: "%",
      weeklyData: trends.hydration.weekly.map((d) => ({
        day: d.day!,
        value: d.avgLevel!,
      })),
      color: "#6366F1",
    },
    {
      metricName: "Skin Impedance",
      currentValue: 450,
      unit: "Ω",
      weeklyData: trends.impedance.weekly.map((d) => ({
        day: d.day!,
        value: d.value!,
      })),
      color: "#8B5CF6",
    },
    {
      metricName: "Skin Temperature",
      currentValue: 36.6,
      unit: "°C",
      weeklyData: trends.skinTemp.weekly.map((d) => ({
        day: d.day!,
        value: d.value!,
      })),
      color: "#F59E0B",
    },
    {
      metricName: "Heart Rate",
      currentValue: 72,
      unit: "bpm",
      weeklyData: trends.heartRate.weekly.map((d) => ({
        day: d.day!,
        value: d.value!,
      })),
      color: "#EC4899",
    },
  ]

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Insights & Trends</Text>
      </View>

      <View style={styles.scrollContainer}>
        {/* Weekly Performance Chart */}
        <View style={styles.section}>
          <WeeklyChart data={trends.hydration.weekly} />
        </View>

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

        {/* Carousel Section */}
        <View style={styles.carouselSection}>
          <Text style={styles.sectionTitle}>Detailed Metrics</Text>
          <Carousel
            loop={false}
            width={SCREEN_WIDTH}
            height={420}
            data={carouselData}
            scrollAnimationDuration={300}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
            onProgressChange={(offsetProgress, absoluteProgress) => {
              progress.value = absoluteProgress
            }}
            renderItem={({ item }) => (
              <MetricCard
                metricName={item.metricName}
                currentValue={item.currentValue}
                unit={item.unit}
                weeklyData={item.weeklyData}
                color={item.color}
              />
            )}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </View>
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

  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  } as ViewStyle,

  statsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  } as ViewStyle,

  statCard: {
    flex: 1,
  } as ViewStyle,

  carouselSection: {
    marginBottom: 20,
  } as ViewStyle,

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    paddingHorizontal: 20,
    marginBottom: 16,
  } as TextStyle,

  bottomSpacing: {
    height: 40,
  } as ViewStyle,
})
