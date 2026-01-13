import React, { FC, useEffect, useState } from "react"
import {
  View,
  ViewStyle,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TextStyle,
} from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { StatusCard } from "@/components/StatusCard"
import { MetricTile } from "@/components/MetricTile"
import { RecommendationCard } from "@/components/RecommendationCard"
import { Icon, PressableIcon } from "@/components/Icon"
import { useAppTheme } from "@/theme/context"
import {
  fetchDashboardData,
  type DashboardData,
} from "@/services/hydrationService"

/**
 * Dashboard Screen
 * Main screen showing current hydration status, metrics, and AI recommendations
 */
export const DashboardScreen: FC = function DashboardScreen() {
  const { theme } = useAppTheme()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const dashboardData = await fetchDashboardData()
      setData(dashboardData)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    loadData()
  }

  if (loading || !data) {
    return (
      <Screen preset="fixed" contentContainerStyle={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </Screen>
    )
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.tint}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>HydroSense</Text>
            <Text style={styles.lastSynced}>LAST SYNCED: {data.currentStatus.lastSynced}</Text>
          </View>
          <View style={styles.syncIconContainer}>
            <PressableIcon icon="reload" size={24} color="#6B7280" onPress={loadData} />
          </View>
        </View>

        {/* Status Card */}
        <StatusCard
          status={data.currentStatus.status}
          statusText={data.currentStatus.statusText}
          fluidLevel={data.currentStatus.fluidLevel}
          message={data.currentStatus.message}
        />

        {/* Metrics Grid */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricsRow}>
            <MetricTile
              label={data.metrics.impedance.label}
              value={data.metrics.impedance.value}
              unit={data.metrics.impedance.unit}
              backgroundColor="#EEF2FF"
              iconColor="#6366F1"
              style={styles.metricTile}
            />
            <MetricTile
              label={data.metrics.skinTemp.label}
              value={data.metrics.skinTemp.value}
              unit={data.metrics.skinTemp.unit}
              backgroundColor="#FEF3F2"
              iconColor="#F97316"
              style={styles.metricTile}
            />
          </View>
          <View style={styles.metricsRow}>
            <MetricTile
              label={data.metrics.heartRate.label}
              value={data.metrics.heartRate.value}
              unit={data.metrics.heartRate.unit}
              backgroundColor="#FFF1F2"
              iconColor="#EC4899"
              style={styles.metricTile}
            />
            <MetricTile
              label={data.metrics.weather.label}
              value={data.metrics.weather.value}
              unit={data.metrics.weather.unit}
              backgroundColor="#F0F9FF"
              iconColor="#0EA5E9"
              style={styles.metricTile}
            />
          </View>
        </View>

        {/* AI Recommendation */}
        <RecommendationCard
          title={data.aiRecommendation.title}
          message={data.aiRecommendation.message}
        />

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

  scrollView: {
    flex: 1,
  } as ViewStyle,

  scrollContent: {
    paddingBottom: 24,
  } as ViewStyle,

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  } as ViewStyle,

  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  } as TextStyle,

  lastSynced: {
    fontSize: 11,
    fontWeight: "500",
    color: "#9CA3AF",
    letterSpacing: 0.5,
  } as TextStyle,

  syncIconContainer: {
    padding: 8,
  } as ViewStyle,

  metricsContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  } as ViewStyle,

  metricsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  } as ViewStyle,

  metricTile: {
    flex: 1,
  } as ViewStyle,

  bottomSpacing: {
    height: 20,
  } as ViewStyle,
})
