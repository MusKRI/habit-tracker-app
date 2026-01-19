import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import { View } from "react-native";
import { createAnimatedComponent } from "react-native-reanimated";

import { HabitCard } from "@/src/components/habits-screen/habit-card";
import { useBottomTabBarHeight } from "@/src/hooks/use-bottom-tab-bar-height";
import { useHeaderHeight } from "@/src/hooks/use-header-height";
import { useAnimatedScrollList } from "@/src/providers/animated-scroll-list-provider";
import { Habit } from "@/src/types/habit";

const AnimatedLegendList = createAnimatedComponent(LegendList<Habit>);

interface AllHabitsProps {
  habits: Habit[];
  completedHabits: string[];
}

export function AllHabits({ habits, completedHabits }: AllHabitsProps) {
  const { grossHeight } = useBottomTabBarHeight();
  const { headerHeight, contentHeight } = useHeaderHeight();

  const { listRef, scrollHandler } = useAnimatedScrollList();

  const renderItem = ({ item }: LegendListRenderItemProps<Habit>) => {
    const isTodayCompleted = completedHabits.includes(item.id);

    return <HabitCard habit={item} todayCompleted={isTodayCompleted} />;
  };

  return (
    <AnimatedLegendList
      ref={listRef}
      onScroll={scrollHandler}
      data={habits}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      recycleItems={true}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      contentContainerClassName="p-4"
      contentContainerStyle={{
        paddingTop: headerHeight + 28,
        paddingBottom: grossHeight + 16,
      }}
      scrollEventThrottle={1000 / 60}
      scrollIndicatorInsets={{ top: contentHeight }}
    />
  );
}
