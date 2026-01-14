import React from "react"
import { StyleSheet, View, ViewStyle, TextStyle } from "react-native"
import { Text } from "./Text"
import { Icon, IconTypes } from "./Icon"

export interface MetricTileProps {
  label: string
  value: number | string
  unit: string
  icon?: IconTypes
  backgroundColor?: string
  iconColor?: string
  style?: ViewStyle
}

/**
 * MetricTile Component
 * Displays individual health metrics in a compact card format
 */
export const MetricTile: React.FC<MetricTileProps> = ({
  label,
  value,
  unit,
  icon,
  backgroundColor = "#F3F4F6",
  iconColor = "#6366F1",
  style,
}) => {
  const getIconForLabel = (label: string): IconTypes => {
    switch (label.toUpperCase()) {
      case "IMPEDANCE":
        return "resistance"
      case "SKIN TEMP":
        return "temperature"
      case "HEART RATE":
        return "heart"
      case "WEATHER":
        return "clouds"
      default:
        return "check"
    }
  }

  const displayIcon = icon || getIconForLabel(label)

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Icon icon={displayIcon} color={iconColor} size={28} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as ViewStyle,

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  } as ViewStyle,

  content: {
    flex: 1,
    minWidth: 0,
    flexWrap: "nowrap"
  } as ViewStyle,

  label: {
    fontSize: 10,
    fontWeight: "600",
    color: "#9CA3AF",
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: "uppercase",
  } as TextStyle,

  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  } as ViewStyle,

  value: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginRight: 2,
  } as TextStyle,

  unit: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
  } as TextStyle,
})
