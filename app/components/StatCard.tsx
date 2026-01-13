import React from "react"
import { StyleSheet, View, ViewStyle, TextStyle } from "react-native"
import { Text } from "./Text"

export interface StatCardProps {
  icon: string
  label: string
  value: string | number
  color?: string
  backgroundColor?: string
  style?: ViewStyle
}

/**
 * StatCard Component
 * Displays a stat with icon, label, and value
 */
export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  color = "#6366F1",
  backgroundColor = "#EEF2FF",
  style,
}) => {
  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={[styles.label, { color }]}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    flex: 1,
    minHeight: 140,
    justifyContent: "center",
    alignItems: "flex-start",
  } as ViewStyle,

  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  } as ViewStyle,

  icon: {
    fontSize: 28,
  } as TextStyle,

  label: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: "uppercase",
  } as TextStyle,

  value: {
    fontSize: 40,
    fontWeight: "700",
    color: "#1F2937",
  } as TextStyle,
})
