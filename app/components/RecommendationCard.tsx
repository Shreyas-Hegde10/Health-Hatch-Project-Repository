import React from "react"
import { StyleSheet, View, ViewStyle, TextStyle } from "react-native"
import { Text } from "./Text"

export interface RecommendationCardProps {
  title: string
  message: string
  style?: ViewStyle
}

/**
 * RecommendationCard Component
 * Displays AI-powered recommendations in a prominent card
 */
export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  message,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
  } as ViewStyle,

  title: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: "uppercase",
  } as TextStyle,

  message: {
    fontSize: 15,
    lineHeight: 22,
    color: "#FFFFFF",
    fontWeight: "500",
  } as TextStyle,
})
