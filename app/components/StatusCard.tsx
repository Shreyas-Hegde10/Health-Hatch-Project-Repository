import React from "react"
import { StyleSheet, View, ViewStyle, TextStyle } from "react-native"
import { Text } from "./Text"
import { Icon } from "./Icon"
import { useAppTheme } from "@/theme/context"

export interface StatusCardProps {
  status: "optimal" | "dehydrated" | "retention"
  statusText: string
  fluidLevel: number
  message: string
  style?: ViewStyle
}

/**
 * StatusCard Component
 * Displays the main hydration status with visual indicators
 */
export const StatusCard: React.FC<StatusCardProps> = ({
  status,
  statusText,
  fluidLevel,
  message,
  style,
}) => {
  const { theme } = useAppTheme()

  const getStatusColor = () => {
    switch (status) {
      case "optimal":
        return "#D4F4DD" // Light mint green
      case "dehydrated":
        return "#FFE5E5" // Light red
      case "retention":
        return "#FFF4E5" // Light orange
      default:
        return "#D4F4DD"
    }
  }

  const getStatusIconColor = () => {
    switch (status) {
      case "optimal":
        return "#10B981" // Green
      case "dehydrated":
        return "#EF4444" // Red
      case "retention":
        return "#F59E0B" // Orange
      default:
        return "#10B981"
    }
  }

  const getProgressColor = () => {
    switch (status) {
      case "optimal":
        return "#6366F1" // Indigo/Blue
      case "dehydrated":
        return "#EF4444" // Red
      case "retention":
        return "#F59E0B" // Orange
      default:
        return "#6366F1"
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: getStatusColor() }, style]}>
      <View style={styles.header}>
        <View style={styles.statusSection}>
          <Text style={styles.statusLabel}>STATUS</Text>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
        <View style={[styles.iconContainer, { backgroundColor: getStatusIconColor() }]}>
          <Icon icon="check" color="#FFFFFF" size={24} />
        </View>
      </View>

      <View style={styles.fluidSection}>
        <View style={styles.fluidHeader}>
          <Text style={styles.fluidLabel}>Estimated Fluid Level</Text>
          <Text style={styles.fluidPercentage}>{fluidLevel}%</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${fluidLevel}%`,
                backgroundColor: getProgressColor(),
              },
            ]}
          />
        </View>
      </View>

      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 12,
  } as ViewStyle,

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  } as ViewStyle,

  statusSection: {
    flex: 1,
  } as ViewStyle,

  statusLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 1,
    marginBottom: 4,
  } as TextStyle,

  statusText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#047857",
  } as TextStyle,

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  fluidSection: {
    marginBottom: 16,
  } as ViewStyle,

  fluidHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  } as ViewStyle,

  fluidLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  } as TextStyle,

  fluidPercentage: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1F2937",
  } as TextStyle,

  progressBarContainer: {
    height: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    overflow: "hidden",
  } as ViewStyle,

  progressBar: {
    height: "100%",
    borderRadius: 4,
  } as ViewStyle,

  message: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  } as TextStyle,
})
