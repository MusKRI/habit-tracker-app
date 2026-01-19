import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";

import { useBottomTabBarHeight } from "@/src/hooks/use-bottom-tab-bar-height";
import { useAnimatedScrollList } from "@/src/providers/animated-scroll-list-provider";

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { grossHeight } = useBottomTabBarHeight();
  const accentColor = useCSSVariable("--accent") as string;
  const foregroundColor = useCSSVariable("--muted") as string;

  const { listOffsetY, scrollDirection } = useAnimatedScrollList();

  const animatedStyle = useAnimatedStyle(() => {
    const THRESOLD = 300;

    const shouldHide =
      listOffsetY.get() > THRESOLD && scrollDirection.get() === "down";

    if (shouldHide) {
      return {
        bottom: withTiming(-grossHeight, { duration: 300 }),
      };
    }

    return {
      bottom: withTiming(0, { duration: 300 }),
    };
  });

  return (
    <Animated.View
      className="absolute bottom-0 left-0 right-0 bg-background flex-row border-t border-surface/30"
      style={[{ height: grossHeight }, animatedStyle]}
    >
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;

        return (
          <Pressable
            key={tab.name}
            className="flex-1 items-center pt-4"
            android_ripple={{ color: "transparent" }}
            onPress={() => navigation.navigate(tab.name)}
          >
            <View className="flex flex-col gap-0.5 items-center">
              {tab.icon({
                focused: isFocused,
                activeTintColor: accentColor,
                inactiveTintColor: foregroundColor,
              })}
              <Text
                className="text-xs"
                style={{
                  color: isFocused ? accentColor : foregroundColor,
                }}
              >
                {tab.tabLabel}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </Animated.View>
  );
}

export enum Tab {
  Habits = "index",
  Streaks = "streaks",
  AddHabit = "add-habit",
}

type TabInfo = {
  name: Tab;
  icon: (props: {
    focused: boolean;
    activeTintColor: string;
    inactiveTintColor: string;
    size?: number;
  }) => React.ReactNode;
  tabLabel: string;
};

const tabs: TabInfo[] = [
  {
    name: Tab.Habits,
    icon: ({ focused, activeTintColor, inactiveTintColor, size }) => (
      <Ionicons
        name="calendar-outline"
        size={size ?? 20}
        color={focused ? activeTintColor : inactiveTintColor}
      />
    ),
    tabLabel: "Today's Habits",
  },
  {
    name: Tab.Streaks,
    icon: ({ focused, activeTintColor, inactiveTintColor, size }) => (
      <MaterialCommunityIcons
        name="chart-bell-curve-cumulative"
        size={size ?? 20}
        color={focused ? activeTintColor : inactiveTintColor}
      />
    ),
    tabLabel: "Streaks",
  },
  {
    name: Tab.AddHabit,
    icon: ({ focused, activeTintColor, inactiveTintColor, size }) => (
      <MaterialCommunityIcons
        name="plus-circle-outline"
        size={size ?? 20}
        color={focused ? activeTintColor : inactiveTintColor}
      />
    ),
    tabLabel: "Add Habit",
  },
] as const;
