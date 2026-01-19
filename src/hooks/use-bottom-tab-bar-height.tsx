import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useBottomTabBarHeight() {
  const insets = useSafeAreaInsets();

  const baseHeight = 60; // Base height of the tab bar without insets

  return {
    netHeight: baseHeight,
    grossHeight: baseHeight + insets.bottom,
  };
}
