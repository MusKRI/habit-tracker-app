import { useBottomTabBarHeight } from "@/src/hooks/use-bottom-tab-bar-height";
import { useHeaderHeight } from "@/src/hooks/use-header-height";
import { Habit, HabitCompletion } from "@/src/types/habit";
import { Surface } from "heroui-native";
import { ScrollView, Text, View } from "react-native";

interface StreaksContentProps {
  habits: Habit[];
  completedHabits: HabitCompletion[];
}

interface StreakData {
  streak: number;
  bestStreak: number;
  total: number;
}

export function StreaksContent({
  habits,
  completedHabits,
}: StreaksContentProps) {
  const { grossHeight } = useBottomTabBarHeight();
  const { headerHeight, contentHeight } = useHeaderHeight();

  const getStreakData = (habitId: string): StreakData => {
    const habitCompletions = completedHabits
      ?.filter((c) => c.habit_id === habitId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    if (habitCompletions?.length === 0) {
      return { streak: 0, bestStreak: 0, total: 0 };
    }

    // build streak data
    let streak = 0;
    let bestStreak = 0;
    let total = habitCompletions.length;

    let lastDate: Date | null = null;
    let currentStreak = 0;

    habitCompletions?.forEach((c) => {
      const date = new Date(c.createdAt);
      if (lastDate) {
        const diff =
          (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

        if (diff <= 1.5) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      if (currentStreak > bestStreak) bestStreak = currentStreak;
      streak = currentStreak;
      lastDate = date;
    });

    return { streak, bestStreak, total };
  };

  const habitStreaks = habits.map((habit) => {
    const { streak, bestStreak, total } = getStreakData(habit.id);
    return { habit, bestStreak, streak, total };
  });

  const rankedHabits = habitStreaks.sort((a, b) => b.bestStreak - a.bestStreak);

  const badgeColors = [
    { bg: "bg-yellow-500", text: "text-white" }, // Gold
    { bg: "bg-gray-400", text: "text-white" }, // Silver
    { bg: "bg-amber-700", text: "text-white" }, // Bronze
  ];

  if (habits.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-foreground text-lg text-center">
          No habits yet. Add your first habit to start tracking streaks! 🎯
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: headerHeight + 28,
          paddingBottom: grossHeight + 16,
        }}
      >
        {/* Top 3 Rankings Section */}
        {rankedHabits.length > 0 && rankedHabits[0].bestStreak > 0 && (
          <Surface className="mb-6 p-4 rounded-2xl">
            <Text className="text-foreground text-xl font-bold mb-4 text-center">
              🏅 Top Streaks
            </Text>
            {rankedHabits.slice(0, 3).map((item, index) => {
              if (item.bestStreak === 0) return null;
              const badgeStyle = badgeColors[index];
              return (
                <View
                  key={item.habit.id}
                  className="flex-row items-center mb-3 pb-3 border-b border-divider last:border-b-0 last:mb-0 last:pb-0"
                >
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${badgeStyle.bg}`}
                  >
                    <Text className={`${badgeStyle.text} font-bold text-base`}>
                      {index + 1}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground text-base font-semibold">
                      {item.habit.title}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-primary text-base font-bold">
                      {item.bestStreak}
                    </Text>
                    <Text className="text-muted text-sm ml-1">days</Text>
                  </View>
                </View>
              );
            })}
          </Surface>
        )}

        {/* All Habits List */}
        <View className="gap-4">
          {rankedHabits.map(({ habit, streak, bestStreak, total }, index) => (
            <Surface
              key={habit.id}
              className={`p-4 rounded-2xl ${
                index === 0 && bestStreak > 0 ? "border-2 border-primary" : ""
              }`}
            >
              <View className="mb-3">
                <Text className="text-foreground text-lg font-bold mb-1">
                  {habit.title}
                </Text>
                {habit.description && (
                  <Text className="text-muted text-sm" numberOfLines={2}>
                    {habit.description}
                  </Text>
                )}
              </View>

              {/* Stats Row */}
              <View className="flex-row justify-between gap-3 mt-2">
                {/* Current Streak */}
                <View className="flex-1 bg-orange-50 dark:bg-orange-950/20 rounded-xl p-3 items-center">
                  <Text className="text-foreground text-lg font-bold">
                    🔥 {streak}
                  </Text>
                  <Text className="text-muted text-xs font-medium mt-1">
                    Current
                  </Text>
                </View>

                {/* Best Streak */}
                <View className="flex-1 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl p-3 items-center">
                  <Text className="text-foreground text-lg font-bold">
                    🏆 {bestStreak}
                  </Text>
                  <Text className="text-muted text-xs font-medium mt-1">
                    Best
                  </Text>
                </View>

                {/* Total Completions */}
                <View className="flex-1 bg-green-50 dark:bg-green-950/20 rounded-xl p-3 items-center">
                  <Text className="text-foreground text-lg font-bold">
                    ✅ {total}
                  </Text>
                  <Text className="text-muted text-xs font-medium mt-1">
                    Total
                  </Text>
                </View>
              </View>
            </Surface>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
