import { useBottomTabBarHeight } from "@/src/hooks/use-bottom-tab-bar-height";
import { useAnimatedScrollList } from "@/src/providers/animated-scroll-list-provider";
import { useRouter } from "expo-router";
import { PlusIcon } from "lucide-react-native";
import { Text, TouchableOpacity } from "react-native";
import {
  createAnimatedComponent,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";

const AnimatedPressable = createAnimatedComponent(TouchableOpacity);

export function AddHabitBtn() {
  const { netHeight, grossHeight } = useBottomTabBarHeight();
  const foregroundColor = useCSSVariable("--snow") as string;

  const router = useRouter();

  const { listOffsetY, scrollDirection } = useAnimatedScrollList();

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const THRESOLD = 300;

    const shouldHide =
      listOffsetY.get() > THRESOLD && scrollDirection.get() === "down";

    if (shouldHide) {
      return {
        translateY: withTiming(netHeight, { duration: 300 }),
      };
    }

    return {
      translateY: withTiming(0, { duration: 300 }),
    };
  });

  return (
    <AnimatedPressable
      className="absolute right-6 flex-row gap-2 bg-accent text-accent-foreground rounded-full border border-border overflow-hidden items-center shadow-md z-10 px-4 py-3"
      style={[buttonAnimatedStyle, { bottom: grossHeight + 16 }]}
      onPress={() => router.push("/add-habit")}
      activeOpacity={1}
    >
      <PlusIcon size={20} color={foregroundColor} />
      <Text className="text-white font-medium" maxFontSizeMultiplier={1}>
        Add Habit
      </Text>
    </AnimatedPressable>
  );
}
