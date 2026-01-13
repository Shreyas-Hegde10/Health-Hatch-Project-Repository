import React, { FC } from "react"
import { View, StyleSheet, TextStyle, ViewStyle } from "react-native"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"

/**
 * AI Screen
 * Shows personalized AI recommendations and insights
 */
export const AIScreen: FC = function AIScreen() {
  return (
    <Screen preset="scroll" contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Personalization</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  } as ViewStyle,

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  } as TextStyle,

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  } as TextStyle,
})
