import React, { useState, useMemo } from "react"
import { StyleSheet, View, ViewStyle, TextStyle, Pressable, Dimensions } from "react-native"
import { Text } from "./Text"
 import Svg, { Path, Defs, LinearGradient, Stop, Line, Circle, G, Rect } from "react-native-svg"
const { width: SCREEN_WIDTH } = Dimensions.get("window")
const CHART_PADDING = 12
const Y_AXIS_WIDTH = 28
const CHART_WIDTH = SCREEN_WIDTH - CHART_PADDING * 2 - Y_AXIS_WIDTH
const CHART_HEIGHT = 160

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
  heartRate: { label: "HEART RATE", icon: "❤️", unit: "bpm", color: "#EC4899" },
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
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null)

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

  // Generate bar data with proper y-axis scaling
  const { bars, yAxisValues } = useMemo(() => {
    if (!currentData || currentData.length === 0) {
      return { bars: [], yAxisValues: [] }
    }

    const values = currentData.map((d) => d.value)
    const maxVal = Math.max(...values)
    const minVal = 0 // Always start from 0

    // Calculate nice y-axis scale
    const roundedMax = Math.ceil(maxVal / 100) * 100
    const yAxisStep = roundedMax > 0 ? roundedMax / 4 : 25
    const effectiveMax = roundedMax > 0 ? roundedMax : 100
    const yAxisValues = [0, yAxisStep, yAxisStep * 2, yAxisStep * 3, effectiveMax]

    const topPadding = 10
    const bottomPadding = 10
    const effectiveHeight = CHART_HEIGHT - topPadding - bottomPadding

    // Calculate bar dimensions - moderate width bars (50% of segment width)
    const segmentWidth = CHART_WIDTH / currentData.length
    const barWidth = segmentWidth * 0.5
    const leftMargin = 4 // Small margin to push bars slightly from left edge

    const bars = currentData.map((d, i) => {
      const barHeight = Math.max((d.value / effectiveMax) * effectiveHeight, 2)
      // Center each bar in its segment with slight left margin
      const barX = leftMargin + segmentWidth * i + (segmentWidth - barWidth) / 2 - leftMargin
      return {
        x: barX,
        y: CHART_HEIGHT - bottomPadding - barHeight,
        width: barWidth,
        height: barHeight,
        day: d.day,
        value: d.value,
        centerX: segmentWidth * i + segmentWidth / 2,
      }
    })

    return { bars, yAxisValues }
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

      {/* Metric Tabs - 2x2 Grid */}
      <View style={styles.tabsGrid}>
        <View style={styles.tabsRow}>
          {renderMetricTab("hydration")}
          {renderMetricTab("impedance")}
        </View>
        <View style={styles.tabsRow}>
          {renderMetricTab("skinTemp")}
          {renderMetricTab("heartRate")}
        </View>
      </View>

      {/* Chart with Y-axis */}
      <View style={styles.chartContainer}>
        <View style={styles.chartWithYAxis}>
          {/* Y-axis labels */}
          <View style={styles.yAxisLabels}>
            {yAxisValues.map((value, index) => {
              const topPadding = 10
              const bottomPadding = 10
              const effectiveHeight = CHART_HEIGHT - topPadding - bottomPadding
              const yPosition = CHART_HEIGHT - bottomPadding - (index / (yAxisValues.length - 1)) * effectiveHeight
              return (
                <Text
                  key={index}
                  style={[
                    styles.yAxisLabel,
                    {
                      position: "absolute",
                      top: yPosition - 12, 
                    },
                  ]}
                >
                  {Math.round(value)}
                </Text>
              )
            })}
          </View>

          {/* SVG Chart */}
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={currentConfig.color} stopOpacity={0.8} />
                <Stop offset="100%" stopColor={currentConfig.color} stopOpacity={0.4} />
              </LinearGradient>
            </Defs>

            {/* Horizontal grid lines */}
            {yAxisValues.map((_, i) => {
              // Use same padding values as bar calculations for alignment
              const topPadding = 10
              const bottomPadding = 10
              const effectiveHeight = CHART_HEIGHT - topPadding - bottomPadding
              const yPosition = CHART_HEIGHT - bottomPadding - (i / (yAxisValues.length - 1)) * effectiveHeight
              return (
                <Line
                  key={i}
                  x1={0}
                  y1={yPosition}
                  x2={CHART_WIDTH}
                  y2={yPosition}
                  stroke="#E5E7EB"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
              )
            })}

            {/* Bars */}
            {bars.map((bar, index) => (
              <G key={index}>
                <Rect
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  fill={selectedPointIndex === index ? currentConfig.color : "url(#barGradient)"}
                  rx={4}
                  ry={4}
                  opacity={selectedPointIndex === index ? 1 : 0.8}
                />
                {/* Invisible tap zone */}
                <Rect
                  x={bar.x}
                  y={0}
                  width={bar.width}
                  height={CHART_HEIGHT}
                  fill="transparent"
                  onPress={() =>
                    setSelectedPointIndex(selectedPointIndex === index ? null : index)
                  }
                />
              </G>
            ))}
          </Svg>
        </View>

        {/* Tooltip */}
        {selectedPointIndex !== null && bars[selectedPointIndex] && (
          <View
            style={[
              styles.tooltip,
              {
                left: Math.max(
                  Y_AXIS_WIDTH + 10,
                  Math.min(
                    bars[selectedPointIndex].centerX + Y_AXIS_WIDTH - 55,
                    SCREEN_WIDTH - CHART_PADDING - 110,
                  ),
                ),
              },
            ]}
          >
            <Text style={styles.tooltipDay}>{bars[selectedPointIndex].day}</Text>
            <Text style={styles.tooltipValue}>
              {`${formatValue(bars[selectedPointIndex].value)}${currentConfig.unit}`}
            </Text>
          </View>
        )}

        {/* X-axis labels */}
        <View style={styles.xAxisLabels}>
          {currentData.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => setSelectedPointIndex(selectedPointIndex === index ? null : index)}
              style={styles.xAxisLabelContainer}
            >
              <Text
                style={[
                  styles.xAxisLabel,
                  selectedPointIndex === index && styles.xAxisLabelSelected,
                ]}
              >
                {item.day}
              </Text>
            </Pressable>
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
    padding: 10,
    marginHorizontal: 8,
    marginBottom: 12,
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
    marginBottom: 12,
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

  tabsGrid: {
    marginBottom: 12,
  } as ViewStyle,

  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
    marginBottom: 6,
  } as ViewStyle,

  metricTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 10,
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
    fontSize: 9,
    fontWeight: "600",
    color: "#6B7280",
    marginLeft: 4,
    letterSpacing: 0.2,
  } as TextStyle,

  metricLabelSelected: {
    color: "#4F46E5",
  } as TextStyle,

  chartContainer: {
    marginBottom: 12,
  } as ViewStyle,

  chartWithYAxis: {
    flexDirection: "row",
    alignItems: "stretch",
    width: "100%",
  } as ViewStyle,

  yAxisLabels: {
    width: Y_AXIS_WIDTH,
    height: CHART_HEIGHT,
    justifyContent: "space-between",
    paddingVertical: 5,
  } as ViewStyle,

  yAxisLabel: {
    fontSize: 9,
    color: "#9CA3AF",
    fontWeight: "500",
    textAlign: "right",
    paddingRight: 8,
  } as TextStyle,

  tooltip: {
    position: "absolute",
    top: 20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  } as ViewStyle,

  tooltipDay: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 4,
  } as TextStyle,

  tooltipValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  } as TextStyle,

  xAxisLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: CHART_WIDTH,
    marginLeft: Y_AXIS_WIDTH,
    paddingTop: 8,
  } as ViewStyle,

  xAxisLabelContainer: {
    flex: 1,
    alignItems: "center",
  } as ViewStyle,

  xAxisLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
  } as TextStyle,

  xAxisLabelSelected: {
    color: "#4F46E5",
    fontWeight: "700",
  } as TextStyle,

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
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
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
  } as TextStyle,

  statUnit: {
    fontSize: 14,
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
