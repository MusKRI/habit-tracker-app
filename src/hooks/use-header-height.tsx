import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useHeaderHeight() {
  const insets = useSafeAreaInsets();

  const safeAreaHeight = insets.top + 8;

  const contentHeight = 48;

  const headerHeight = safeAreaHeight + contentHeight;

  return {
    headerHeight,
    safeAreaHeight,
    contentHeight,
  };
}
