import React from "react"
import { StyleSheet, View, ViewStyle, TextStyle } from "react-native"
import { Text } from "./Text"

export interface WeeklyChartProps {
  data: Array<{
    day: string
    avgLevel: number
    status?: string
  }>
  title?: string
  timeRange?: string
  style?: ViewStyle
}

/**
 * WeeklyChart Component
 * Displays a bar chart showing weekly hydration performance
 */
export const WeeklyChart: React.FC<WeeklyChartProps> = ({
  data,
  title = "Weekly Performance",
  timeRange = "Last 7 Days",
  style,
}) => {
  const maxValue = Math.max(...data.map((d) => d.avgLevel))
  const minValue = Math.min(...data.map((d) => d.avgLevel))
  const range = maxValue - minValue

  const getBarHeight = (value: number) => {
    if (range === 0) return 70 // Default height if all values are the same
    const normalizedHeight = ((value - minValue) / range) * 100 + 70
    return Math.max(70, Math.min(normalizedHeight, 170))
  }

  const getBarColor = (status?: string) => {
    if (status === "sub-optimal") return "#FBBF24" // Yellow
    return "#6366F1" // Blue
  }

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.calendarIcon}>
            <Text style={styles.calendarIconText}>📅</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.dropdown}>
          <Text style={styles.timeRange}>{timeRange}</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </View>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.barWrapper}>
            <View
              style={[
                styles.bar,
                {
                  height: getBarHeight(item.avgLevel),
                  backgroundColor: getBarColor(item.status),
                },
              ]}
            />
            <Text style={styles.barLabel}>{item.day}</Text>
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#6366F1" }]} />
          <Text style={styles.legendText}>OPTIMAL</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#FBBF24" }]} />
          <Text style={styles.legendText}>SUB-OPTIMAL</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  } as ViewStyle,

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  } as ViewStyle,

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,

  calendarIcon: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  } as ViewStyle,

  calendarIconText: {
    fontSize: 20,
  } as TextStyle,

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  } as TextStyle,

  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  } as ViewStyle,

  timeRange: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6366F1",
    marginRight: 6,
  } as TextStyle,

  dropdownIcon: {
    fontSize: 10,
    color: "#6366F1",
  } as TextStyle,

  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 200,
    marginBottom: 16,
    paddingHorizontal: 8,
  } as ViewStyle,

  barWrapper: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 2,
  } as ViewStyle,

  bar: {
    width: "100%",
    borderRadius: 6,
    marginBottom: 8,
  } as ViewStyle,

  barLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#9CA3AF",
  } as TextStyle,

  legend: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  } as ViewStyle,

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  } as ViewStyle,

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  } as ViewStyle,

  legendText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9CA3AF",
    letterSpacing: 0.5,
  } as TextStyle,
})
