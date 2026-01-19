import { CustomTabBar, Tab } from "@/src/components/custom-tab-bar";
import { AnimatedScrollListProvider } from "@/src/providers/animated-scroll-list-provider";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";

export default function TabsRootLayout() {
  return (
    <AnimatedScrollListProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
        tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen name={Tab.Habits} />
        <Tabs.Screen name={Tab.Streaks} />
        <Tabs.Screen name={Tab.AddHabit} />
      </Tabs>
    </AnimatedScrollListProvider>
  );
}
