import {
  StreaksContent,
  StreaksCustomHeader,
} from "@/src/components/streaks-screen";
import { client, DATABASE_ID } from "@/src/lib/appwrite";
import { useAuth } from "@/src/lib/auth-context";
import { getAllCompletions, getAllHabits } from "@/src/services/queries";
import { Habit, HabitCompletion } from "@/src/types/habit";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";

export default function MeetScreen() {
  const { user } = useAuth();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<HabitCompletion[]>([]);

  const loadHabits = useCallback(async () => {
    if (user) {
      const habits = await getAllHabits(user.$id);
      setHabits(habits ?? []);
    }
  }, [user]);

  const loadCompletedHabits = useCallback(async () => {
    if (user) {
      const completedHabits = await getAllCompletions(user.$id);
      setCompletedHabits(completedHabits ?? []);
    }
  }, [user]);

  useEffect(() => {
    loadHabits();
    loadCompletedHabits();
  }, []);

  useEffect(() => {
    if (user) {
      const habitsChannel = `databases.${DATABASE_ID}.tables.habits.rows`;
      const completionsChannel = `databases.${DATABASE_ID}.tables.habit_completions.rows`;

      const habitsSubscription = client.subscribe(habitsChannel, (event) => {
        if (
          event.events.includes("databases.*.tables.*.rows.*.create") ||
          event.events.includes("databases.*.tables.*.rows.*.update") ||
          event.events.includes("databases.*.tables.*.rows.*.delete")
        ) {
          loadHabits();
        }
      });

      const completionSubscription = client.subscribe(
        completionsChannel,
        (event) => {
          if (event.events.includes("databases.*.tables.*.rows.*.create")) {
            loadCompletedHabits();
          }
        },
      );

      return () => {
        habitsSubscription();
        completionSubscription();
      };
    }
  }, [user]);

  return (
    <View className="flex-1 bg-background text-foreground">
      <StreaksCustomHeader />
      <StreaksContent habits={habits} completedHabits={completedHabits} />
    </View>
  );
}
