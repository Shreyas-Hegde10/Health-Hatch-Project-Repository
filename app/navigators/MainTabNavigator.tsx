/**
 * Main Tab Navigator
 * Bottom tab navigation for the main app screens
 */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Icon } from "@/components/Icon"
import { useAppTheme } from "@/theme/context"

import { DashboardScreen } from "@/screens/DashboardScreen"
import { AlertsScreen } from "@/screens/AlertsScreen"
import { TrendsScreen } from "@/screens/TrendsScreen"
import { AIScreen } from "@/screens/AIScreen"
import { AccessibilityScreen } from "@/screens/AccessibilityScreen"
import { SettingsScreen } from "@/screens/SettingsScreen"

export type MainTabParamList = {
  Home: undefined
  Alerts: undefined
  Trends: undefined
  AI: undefined
  Settings: undefined
}

const Tab = createBottomTabNavigator<MainTabParamList>()

export const MainTabNavigator = () => {
  const { theme } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6366F1", // Indigo/Purple
        tabBarInactiveTintColor: "#9CA3AF", // Gray
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingBottom: 10,
          paddingTop: 10,
          height: 75,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "600",
          marginTop: 2,
          letterSpacing: 0.3,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarLabel: "HOME",
          tabBarIcon: ({ color }) => (
            <Icon icon="menu" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarLabel: "ALERTS",
          tabBarIcon: ({ color }) => (
            <Icon icon="bell" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Trends"
        component={TrendsScreen}
        options={{
          tabBarLabel: "TRENDS",
          tabBarIcon: ({ color }) => (
            <Icon icon="ladybug" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="AI"
        component={AIScreen}
        options={{
          tabBarLabel: "AI",
          tabBarIcon: ({ color }) => (
            <Icon icon="components" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "SETTINGS",
          tabBarIcon: ({ color }) => (
            <Icon icon="settings" color={color} size={22} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
