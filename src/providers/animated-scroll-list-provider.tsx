import {
  ScrollDirectionValue,
  useScrollDirection,
} from "@/src/hooks/use-scroll-direction";
import { LegendListRef } from "@legendapp/list";
import { createContext, useContext, useRef } from "react";
import {
  ScrollHandlerProcessed,
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

type AnimatedScrollListContextType = {
  listRef: React.RefObject<LegendListRef | null> | null; // Reference to the LegendList
  listOffsetY: SharedValue<number>; // Realtime scroll position of the list
  isDragging: SharedValue<boolean>; // Indicates if the user is currently dragging the list to prevent auto-scrolling
  scrollDirection: ScrollDirectionValue; // current scroll direction of the list
  offsetYAnchorOnBeginDrag: SharedValue<number>; // anchor position at the moment the user puts their finger down and starts dragging.
  offsetYAnchorOnChangeDirection: SharedValue<number>; // anchor position where scrolling direction changed.
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>; // Reanimated scroll handler for the list
};

const AnimatedScrollListContext = createContext<AnimatedScrollListContextType>(
  {} as AnimatedScrollListContextType,
);

export const AnimatedScrollListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const listRef = useRef<LegendListRef | null>(null);

  const listOffsetY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const {
    scrollDirection,
    offsetYAnchorOnBeginDrag,
    offsetYAnchorOnChangeDirection,
    onBeginDrag: scrollDirectionOnBeginDrag,
    onScroll: scrollDirectionOnScroll,
  } = useScrollDirection();

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: (event) => {
      isDragging.set(true);
      scrollDirectionOnBeginDrag(event);
    },
    onScroll: (event) => {
      listOffsetY.set(event.contentOffset.y);
      scrollDirectionOnScroll(event);
    },
    onEndDrag: () => {
      isDragging.set(false);
    },
  });

  return (
    <AnimatedScrollListContext.Provider
      value={{
        listRef,
        listOffsetY,
        isDragging,
        scrollDirection,
        offsetYAnchorOnBeginDrag,
        offsetYAnchorOnChangeDirection,
        scrollHandler,
      }}
    >
      {children}
    </AnimatedScrollListContext.Provider>
  );
};

export const useAnimatedScrollList = () => {
  const context = useContext(AnimatedScrollListContext);

  if (!context) {
    throw new Error(
      "useAnimatedScrollList must be used within an AnimatedScrollListProvider",
    );
  }

  return context;
};
