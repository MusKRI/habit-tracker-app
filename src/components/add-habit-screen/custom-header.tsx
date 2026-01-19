import { useHeaderHeight } from "@/src/hooks/use-header-height";
import { Text, View } from "react-native";

export function AddHabitCustomHeader() {
  const { safeAreaHeight, contentHeight } = useHeaderHeight();

  return (
    <View className="absolute top-0 left-0 right-0 z-10 bg-background border-b border-surface/30">
      <View style={{ height: safeAreaHeight }} />
      <View
        className="px-5 flex-row items-center justify-center overflow-hidden"
        style={{ height: contentHeight }}
      >
        <Text className="text-xl font-bold text-foreground">
          Add a new habit
        </Text>
      </View>
    </View>
  );
}
