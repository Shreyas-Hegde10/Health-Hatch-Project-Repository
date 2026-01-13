import React, { FC, useEffect, useState } from "react"
import { View, StyleSheet, TextStyle, ViewStyle, ScrollView } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { AlertCard } from "@/components/AlertCard"
import { fetchAlerts, type Alert } from "@/services/hydrationService"

/**
 * Alerts Screen
 * Shows current and past hydration alerts with actionable guidance
 */
export const AlertsScreen: FC = function AlertsScreen() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    try {
      const data = await fetchAlerts()
      setAlerts(data)
    } catch (error) {
      console.error("Error loading alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
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
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Guidance & Alerts</Text>
        </View>

        {/* Alerts List */}
        <View style={styles.alertsContainer}>
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              severity={alert.severity}
              title={alert.title}
              message={alert.message}
              additionalInfo="Your skin impedance has increased by 12%, suggesting reduced water content in tissue."
              nextSteps={alert.nextSteps}
              timestamp={alert.timestamp}
              onDetailsPress={() => console.log("Details pressed for alert:", alert.id)}
            />
          ))}
        </View>

        {/* Personalization Note */}
        <View style={styles.noteContainer}>
          <View style={styles.noteIcon}>
            <Text style={styles.noteIconText}>i</Text>
          </View>
          <Text style={styles.noteText}>
            Note: These alerts are based on your personalized baseline. Factors like activity
            level and humidity are considered automatically.
          </Text>
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

  scrollView: {
    flex: 1,
  } as ViewStyle,

  scrollContent: {
    paddingBottom: 24,
  } as ViewStyle,

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

  alertsContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  } as ViewStyle,

  noteContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#D1FAE5",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
  } as ViewStyle,

  noteIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  } as ViewStyle,

  noteIconText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  } as TextStyle,

  noteText: {
    flex: 1,
    fontSize: 14,
    color: "#065F46",
    lineHeight: 20,
  } as TextStyle,

  bottomSpacing: {
    height: 20,
  } as ViewStyle,
})
