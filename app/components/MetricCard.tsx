import React from "react"
import { StyleSheet, View, ViewStyle, TextStyle, Dimensions } from "react-native"
import { Text } from "./Text"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const CARD_WIDTH = SCREEN_WIDTH * 0.85

export interface MetricCardProps {
  metricName: string
  currentValue: number
  unit: string
  weeklyData: Array<{
    day: string
    value: number
  }>
  color?: string
  style?: ViewStyle
}

/**
 * MetricCard Component
 * Card for displaying individual metric trends in carousel
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  metricName,
  currentValue,
  unit,
  weeklyData,
  color = "#6366F1",
  style,
}) => {
  const maxValue = Math.max(...weeklyData.map((d) => d.value))
  const minValue = Math.min(...weeklyData.map((d) => d.value))
  const range = maxValue - minValue

  const getBarHeight = (value: number) => {
    if (range === 0) return 50
    const normalizedHeight = ((value - minValue) / range) * 80 + 40
    return Math.max(40, Math.min(normalizedHeight, 120))
  }

  const calculateChange = () => {
    if (weeklyData.length < 2) return 0
    const lastValue = weeklyData[weeklyData.length - 1].value
    const firstValue = weeklyData[0].value
    const change = ((lastValue - firstValue) / firstValue) * 100
    return change.toFixed(1)
  }

  const change = calculateChange()
  const isPositive = parseFloat(change) >= 0

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.metricName}>{metricName}</Text>
        <View style={[styles.badge, { backgroundColor: `${color}20` }]}>
          <Text style={[styles.badgeText, { color }]}>7 Days</Text>
        </View>
      </View>

      {/* Current Value */}
      <View style={styles.valueContainer}>
        <Text style={styles.currentValue}>
          {currentValue}
          <Text style={styles.unit}> {unit}</Text>
        </Text>
        <View style={styles.changeContainer}>
          <Text style={[styles.changeText, { color: isPositive ? "#10B981" : "#EF4444" }]}>
            {isPositive ? "↗" : "↘"} {Math.abs(parseFloat(change))}%
          </Text>
        </View>
      </View>

      {/* Mini Chart */}
      <View style={styles.chartContainer}>
        {weeklyData.map((item, index) => (
          <View key={index} style={styles.barWrapper}>
            <View
              style={[
                styles.bar,
                {
                  height: getBarHeight(item.value),
                  backgroundColor: color,
                  opacity: 0.7 + (index / weeklyData.length) * 0.3,
                },
              ]}
            />
            <Text style={styles.barLabel}>{item.day}</Text>
          </View>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>AVG</Text>
          <Text style={styles.statValue}>
            {(weeklyData.reduce((sum, d) => sum + d.value, 0) / weeklyData.length).toFixed(1)}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>MIN</Text>
          <Text style={styles.statValue}>{minValue}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>MAX</Text>
          <Text style={styles.statValue}>{maxValue}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  } as ViewStyle,

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  } as ViewStyle,

  metricName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  } as TextStyle,

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  } as ViewStyle,

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  } as TextStyle,

  valueContainer: {
    marginBottom: 24,
  } as ViewStyle,

  currentValue: {
    fontSize: 48,
    fontWeight: "700",
    color: "#1F2937",
  } as TextStyle,

  unit: {
    fontSize: 24,
    fontWeight: "600",
    color: "#9CA3AF",
  } as TextStyle,

  changeContainer: {
    marginTop: 8,
  } as ViewStyle,

  changeText: {
    fontSize: 16,
    fontWeight: "600",
  } as TextStyle,

  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
    marginBottom: 20,
  } as ViewStyle,

  barWrapper: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 1,
  } as ViewStyle,

  bar: {
    width: "100%",
    borderRadius: 4,
    marginBottom: 6,
  } as ViewStyle,

  barLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#9CA3AF",
  } as TextStyle,

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  } as ViewStyle,

  statItem: {
    alignItems: "center",
    flex: 1,
  } as ViewStyle,

  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9CA3AF",
    letterSpacing: 0.5,
    marginBottom: 4,
  } as TextStyle,

  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  } as TextStyle,

  divider: {
    width: 1,
    height: 30,
    backgroundColor: "#E5E7EB",
  } as ViewStyle,
})
