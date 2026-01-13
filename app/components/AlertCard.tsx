import React from "react"
import { StyleSheet, View, ViewStyle, TextStyle } from "react-native"
import { Text } from "./Text"
import { Icon } from "./Icon"

export interface AlertCardProps {
  severity: "info" | "warning" | "critical"
  title: string
  message: string
  additionalInfo?: string
  nextSteps: string[]
  timestamp: string
  onDetailsPress?: () => void
  style?: ViewStyle
}

/**
 * AlertCard Component
 * Displays hydration alerts with severity levels and actionable next steps
 */
export const AlertCard: React.FC<AlertCardProps> = ({
  severity,
  title,
  message,
  additionalInfo,
  nextSteps,
  timestamp,
  onDetailsPress,
  style,
}) => {
  const getSeverityColor = () => {
    switch (severity) {
      case "critical":
        return "#DC2626" // Red
      case "warning":
        return "#D97706" // Orange/Amber
      case "info":
        return "#3B82F6" // Blue
      default:
        return "#D97706"
    }
  }

  const getSeverityBgColor = () => {
    switch (severity) {
      case "critical":
        return "#FEF2F2" // Light red
      case "warning":
        return "#FFFBEB" // Light yellow/cream
      case "info":
        return "#EFF6FF" // Light blue
      default:
        return "#FFFBEB"
    }
  }

  const getSeverityLabel = () => {
    switch (severity) {
      case "critical":
        return "CRITICAL ALERT"
      case "warning":
        return "DEHYDRATION WARNING"
      case "info":
        return "INFORMATION"
      default:
        return "ALERT"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  return (
    <View style={[styles.container, style]}>
      {/* Alert Header */}
      <View style={[styles.header, { backgroundColor: getSeverityBgColor() }]}>
        <View style={styles.headerContent}>
          <View style={[styles.iconCircle, { backgroundColor: getSeverityColor() }]}>
            <Text style={styles.iconText}>!</Text>
          </View>
          <Text style={[styles.severityLabel, { color: getSeverityColor() }]}>
            {getSeverityLabel()}
          </Text>
        </View>
      </View>

      {/* Alert Body */}
      <View style={styles.body}>
        {/* Main Message */}
        <Text style={styles.message}>{message}</Text>

        {/* Additional Info */}
        {additionalInfo && (
          <View style={styles.infoContainer}>
            <View style={styles.infoIcon}>
              <Icon icon="components" size={16} color="#9CA3AF" />
            </View>
            <Text style={styles.infoText}>{additionalInfo}</Text>
          </View>
        )}

        {/* Next Steps */}
        <Text style={styles.nextStepsLabel}>NEXT STEPS</Text>
        {nextSteps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.timestampContainer}>
            <Icon icon="components" size={14} color="#9CA3AF" />
            <Text style={styles.timestamp}>TRIGGERED {formatTimestamp(timestamp)}</Text>
          </View>
          {onDetailsPress && (
            <Text style={styles.detailsLink} onPress={onDetailsPress}>
              Details ›
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  } as ViewStyle,

  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  } as ViewStyle,

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,

  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  } as ViewStyle,

  iconText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  } as TextStyle,

  severityLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  } as TextStyle,

  body: {
    padding: 20,
  } as ViewStyle,

  message: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
    lineHeight: 26,
  } as TextStyle,

  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  } as ViewStyle,

  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  } as ViewStyle,

  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#6B7280",
    fontStyle: "italic",
    lineHeight: 20,
  } as TextStyle,

  nextStepsLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 1,
    marginBottom: 16,
  } as TextStyle,

  stepContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  } as ViewStyle,

  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  } as ViewStyle,

  stepNumberText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4F46E5",
  } as TextStyle,

  stepText: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  } as TextStyle,

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  } as ViewStyle,

  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,

  timestamp: {
    fontSize: 11,
    fontWeight: "500",
    color: "#9CA3AF",
    marginLeft: 6,
    letterSpacing: 0.3,
  } as TextStyle,

  detailsLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366F1",
  } as TextStyle,
})
