import { SharedValue, useSharedValue } from "react-native-reanimated";
import { ReanimatedScrollEvent } from "react-native-reanimated/lib/typescript/hook/commonTypes";

export type ScrollDirection = "up" | "down" | "idle";
export type ScrollDirectionValue = SharedValue<ScrollDirection>;

export function useScrollDirection() {
  const scrollDirection = useSharedValue<ScrollDirection>("idle");
  const lastOffsetY = useSharedValue(0); // previous scroll position for direction comparison
  const offsetYAnchorOnBeginDrag = useSharedValue(0); // anchor position at the moment the user puts their finger down and starts dragging.
  const offsetYAnchorOnChangeDirection = useSharedValue(0); // anchor position where scrolling direction changed.

  const onBeginDrag = (event: ReanimatedScrollEvent | number) => {
    "worklet";
    const offsetY = typeof event === "number" ? event : event.contentOffset.y;
    offsetYAnchorOnBeginDrag.set(offsetY);
  };

  const onScroll = (event: ReanimatedScrollEvent | number) => {
    "worklet";

    const offsetY = typeof event === "number" ? event : event.contentOffset.y;

    const positiveOffsetY = Math.max(0, offsetY);
    const positiveLastOffsetY = Math.max(0, lastOffsetY.get());

    if (
      positiveOffsetY > positiveLastOffsetY &&
      (scrollDirection.get() === "idle" || scrollDirection.get() === "up")
    ) {
      // Scrolling down
      scrollDirection.set("down");
      offsetYAnchorOnChangeDirection.set(offsetY);
    } else if (
      positiveOffsetY < positiveLastOffsetY &&
      (scrollDirection.get() === "idle" || scrollDirection.get() === "down")
    ) {
      // Scrolling up
      scrollDirection.set("up");
      offsetYAnchorOnChangeDirection.set(offsetY);
    }

    lastOffsetY.set(offsetY);
  };

  return {
    scrollDirection,
    onScroll,
    onBeginDrag,
    offsetYAnchorOnBeginDrag,
    offsetYAnchorOnChangeDirection,
  };
}
