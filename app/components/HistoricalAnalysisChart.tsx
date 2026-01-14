import React, { useState, useMemo } from "react"
import { StyleSheet, View, ViewStyle, TextStyle, Pressable, Dimensions } from "react-native"
import { Text } from "./Text"
 import Svg, { Path, Defs, LinearGradient, Stop, Line, Circle, G } from "react-native-svg"
const { width: SCREEN_WIDTH } = Dimensions.get("window")
const CHART_PADDING = 40
const CHART_WIDTH = SCREEN_WIDTH - CHART_PADDING * 2
const CHART_HEIGHT = 150

export type MetricType = "hydration" | "impedance" | "skinTemp" | "heartRate"

export interface MetricData {
  day: string
  value: number
}

export interface HistoricalAnalysisChartProps {
  hydrationData: MetricData[]
  impedanceData: MetricData[]
  skinTempData: MetricData[]
  heartRateData: MetricData[]
  averages: {
    hydration: { current: number; change: number }
    impedance: { current: number; change: number }
    skinTemp: { current: number; change: number }
    heartRate: { current: number; change: number }
  }
  style?: ViewStyle
}

const METRIC_CONFIGS: Record<
  MetricType,
  { label: string; icon: string; unit: string; color: string }
> = {
  hydration: { label: "HYDRATION", icon: "💧", unit: "%", color: "#6366F1" },
  impedance: { label: "IMPEDANCE", icon: "⚡", unit: "Ω", color: "#8B5CF6" },
  skinTemp: { label: "SKIN TEMP", icon: "🌡️", unit: "°C", color: "#F59E0B" },
  heartRate: { label: "", icon: "❤️", unit: "bpm", color: "#EC4899" },
}

/**
 * HistoricalAnalysisChart Component
 * Displays a smooth area chart with metric tabs for switching between different metrics
 */
export const HistoricalAnalysisChart: React.FC<HistoricalAnalysisChartProps> = ({
  hydrationData,
  impedanceData,
  skinTempData,
  heartRateData,
  averages,
  style,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("hydration")
  const [timeRange, setTimeRange] = useState("7 DAYS")

  const getData = (metric: MetricType): MetricData[] => {
    switch (metric) {
      case "hydration":
        return hydrationData
      case "impedance":
        return impedanceData
      case "skinTemp":
        return skinTempData
      case "heartRate":
        return heartRateData
      default:
        return hydrationData
    }
  }

  const currentData = getData(selectedMetric)
  const currentConfig = METRIC_CONFIGS[selectedMetric]
  const currentAverage = averages[selectedMetric]

  // Generate smooth curve path using bezier curves
  const { areaPath, linePath, points } = useMemo(() => {
    if (!currentData || currentData.length === 0) {
      return { areaPath: "", linePath: "", points: [] }
    }

    const values = currentData.map((d) => d.value)
    const minVal = Math.min(...values)
    const maxVal = Math.max(...values)
    const range = maxVal - minVal || 1 // Avoid division by zero

    const padding = 20
    const effectiveWidth = CHART_WIDTH - padding * 2
    const effectiveHeight = CHART_HEIGHT - padding

    const pts = currentData.map((d, i) => ({
      x: padding + (i / (currentData.length - 1)) * effectiveWidth,
      y: effectiveHeight - ((d.value - minVal) / range) * (effectiveHeight - 30) + 15,
      day: d.day,
      value: d.value,
    }))

    // Create smooth bezier curve
    let pathLine = `M ${pts[0].x} ${pts[0].y}`
    let pathArea = `M ${pts[0].x} ${CHART_HEIGHT} L ${pts[0].x} ${pts[0].y}`

    for (let i = 0; i < pts.length - 1; i++) {
      const current = pts[i]
      const next = pts[i + 1]
      const midX = (current.x + next.x) / 2

      pathLine += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`
      pathArea += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`
    }

    pathArea += ` L ${pts[pts.length - 1].x} ${CHART_HEIGHT} Z`

    return { areaPath: pathArea, linePath: pathLine, points: pts }
  }, [currentData])

  const renderMetricTab = (metric: MetricType) => {
    const config = METRIC_CONFIGS[metric]
    const isSelected = selectedMetric === metric

    return (
      <Pressable
        key={metric}
        style={[styles.metricTab, isSelected && styles.metricTabSelected]}
        onPress={() => setSelectedMetric(metric)}
      >
        <Text style={styles.metricIcon}>{config.icon}</Text>
        {config.label && (
          <Text style={[styles.metricLabel, isSelected && styles.metricLabelSelected]}>
            {config.label}
          </Text>
        )}
      </Pressable>
    )
  }

  const getAverageLabel = () => {
    switch (selectedMetric) {
      case "hydration":
        return "AVG HYDRATION"
      case "impedance":
        return "AVG IMPEDANCE"
      case "skinTemp":
        return "AVG SKIN TEMP"
      case "heartRate":
        return "AVG HEART RATE"
    }
  }

  const formatValue = (value: number) => {
    if (selectedMetric === "skinTemp") {
      return value.toFixed(1)
    }
    return Math.round(value).toString()
  }

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Historical Analysis</Text>
        <Pressable style={styles.dropdown}>
          <Text style={styles.timeRange}>{timeRange}</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </Pressable>
      </View>

      {/* Metric Tabs */}
      <View style={styles.tabsContainer}>
        {renderMetricTab("hydration")}
        {renderMetricTab("impedance")}
        {renderMetricTab("skinTemp")}
        {renderMetricTab("heartRate")}
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          <Defs>
            <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={currentConfig.color} stopOpacity={0.3} />
              <Stop offset="100%" stopColor={currentConfig.color} stopOpacity={0.05} />
            </LinearGradient>
          </Defs>

          {/* Horizontal grid lines */}
          {[0, 1, 2].map((i) => (
            <Line
              key={i}
              x1={20}
              y1={30 + i * 40}
              x2={CHART_WIDTH - 20}
              y2={30 + i * 40}
              stroke="#E5E7EB"
              strokeWidth={1}
              strokeDasharray="4,4"
            />
          ))}

          {/* Area fill */}
          <Path d={areaPath} fill="url(#areaGradient)" />

          {/* Line */}
          <Path
            d={linePath}
            stroke={currentConfig.color}
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <G key={index}>
              <Circle cx={point.x} cy={point.y} r={4} fill={currentConfig.color} />
              <Circle cx={point.x} cy={point.y} r={2} fill="#FFFFFF" />
            </G>
          ))}
        </Svg>

        {/* X-axis labels */}
        <View style={styles.xAxisLabels}>
          {currentData.map((item, index) => (
            <Text key={index} style={styles.xAxisLabel}>
              {item.day}
            </Text>
          ))}
        </View>
      </View>

      {/* Average Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>{getAverageLabel()}</Text>
          <View style={styles.statValueRow}>
            <Text style={styles.statValue}>
              {formatValue(currentAverage.current)}
            </Text>
            <Text style={styles.statUnit}>{currentConfig.unit}</Text>
          </View>
        </View>
        <View style={styles.changeContainer}>
          <Text
            style={[
              styles.changeText,
              currentAverage.change >= 0 ? styles.changePositive : styles.changeNegative,
            ]}
          >
            {currentAverage.change >= 0 ? "↗" : "↘"} {currentAverage.change >= 0 ? "+" : ""}
            {currentAverage.change}% vs last wk
          </Text>
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
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  } as ViewStyle,

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
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  } as ViewStyle,

  timeRange: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
    marginRight: 6,
  } as TextStyle,

  dropdownIcon: {
    fontSize: 8,
    color: "#9CA3AF",
  } as TextStyle,

  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  } as ViewStyle,

  metricTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  } as ViewStyle,

  metricTabSelected: {
    backgroundColor: "#EEF2FF",
    borderColor: "#6366F1",
  } as ViewStyle,

  metricIcon: {
    fontSize: 14,
  } as TextStyle,

  metricLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    marginLeft: 6,
    letterSpacing: 0.3,
  } as TextStyle,

  metricLabelSelected: {
    color: "#4F46E5",
  } as TextStyle,

  chartContainer: {
    alignItems: "center",
    marginBottom: 16,
  } as ViewStyle,

  xAxisLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: CHART_WIDTH - 40,
    paddingTop: 8,
  } as ViewStyle,

  xAxisLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#9CA3AF",
  } as TextStyle,

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  } as ViewStyle,

  statItem: {
    flex: 1,
  } as ViewStyle,

  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6366F1",
    letterSpacing: 0.5,
    marginBottom: 4,
  } as TextStyle,

  statValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  } as ViewStyle,

  statValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1F2937",
  } as TextStyle,

  statUnit: {
    fontSize: 18,
    fontWeight: "500",
    color: "#6B7280",
    marginLeft: 2,
  } as TextStyle,

  changeContainer: {
    alignItems: "flex-end",
  } as ViewStyle,

  changeText: {
    fontSize: 13,
    fontWeight: "600",
  } as TextStyle,

  changePositive: {
    color: "#10B981",
  } as TextStyle,

  changeNegative: {
    color: "#EF4444",
  } as TextStyle,
})
