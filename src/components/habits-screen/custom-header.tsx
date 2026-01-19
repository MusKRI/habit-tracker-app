import { useHeaderHeight } from "@/src/hooks/use-header-height";
import { useAnimatedScrollList } from "@/src/providers/animated-scroll-list-provider";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface CustomHabitsHeaderProps {
  totalHabits: number;
}

export function CustomHabitsHeader({ totalHabits }: CustomHabitsHeaderProps) {
  const { safeAreaHeight, contentHeight } = useHeaderHeight();

  const { listOffsetY } = useAnimatedScrollList();

  const animatedStyle = useAnimatedStyle(() => {
    const thresold = 450;

    const shouldBeVisible = listOffsetY.get() > thresold;

    return {
      opacity: withTiming(shouldBeVisible ? 1 : 0, { duration: 100 }),
      transform: [
        { translateY: withTiming(shouldBeVisible ? 0 : 15, { duration: 100 }) },
      ],
    };
  });

  return (
    <View className="absolute top-0 left-0 right-0 z-10 bg-background border-b border-surface/30">
      <View style={{ height: safeAreaHeight }} />
      <View
        className="px-5 flex-row items-center justify-center overflow-hidden"
        style={{ height: contentHeight }}
      >
        <Text className="text-xl font-bold text-foreground">Habits</Text>
        <Animated.View className="absolute left-[66%]" style={[animatedStyle]}>
          <Text className="text-sm text-accent font-semibold">
            ({totalHabits})
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}
