import { DATABASE_ID, tablesDB } from "@/src/lib/appwrite";
import type { Habit, HabitCompletion } from "@/src/types/habit";
import { ID, Query } from "react-native-appwrite";

export const getAllHabits = async (userId: string) => {
  try {
    const habits = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: "habits",
      queries: [Query.equal("user_id", userId), Query.orderDesc("$createdAt")],
    });

    const refinedHabits: Habit[] = habits.rows.map((habit) => {
      return {
        id: habit.$id as string,
        user_id: habit.user_id as string,
        title: habit.title as string,
        description: habit.description as string,
        frequency: habit.frequency as string,
        streak_count: habit.streak_count as number,
        last_completed: habit.last_completed as string,
      };
    });

    return refinedHabits;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getTodayCompletions = async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const completions = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: "habit_completions",
      queries: [
        Query.equal("user_id", userId),
        Query.orderDesc("$createdAt"),
        Query.greaterThanEqual("$createdAt", today.toISOString()),
      ],
    });

    const refinedCompletions: HabitCompletion[] = completions?.rows?.map(
      (com) => {
        return {
          id: com.$id,
          user_id: com.user_id,
          habit_id: com.habit_id,
          createdAt: com.$createdAt,
        };
      },
    );

    return refinedCompletions;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllCompletions = async (userId: string) => {
  try {
    const completions = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: "habit_completions",
      queries: [Query.equal("user_id", userId), Query.orderDesc("$createdAt")],
    });

    const refinedCompletions: HabitCompletion[] = completions?.rows?.map(
      (com) => {
        return {
          id: com.$id,
          user_id: com.user_id,
          habit_id: com.habit_id,
          createdAt: com.$createdAt,
        };
      },
    );

    return refinedCompletions;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const deleteHabit = async (habitId: string) => {
  try {
    await tablesDB.deleteRow({
      databaseId: DATABASE_ID,
      tableId: "habits",
      rowId: habitId,
    });
    return true;
  } catch (error) {
    console.log("Error deleting habit:", error);
    throw error;
  }
};

export const completeHabit = async (habitId: string, userId: string) => {
  try {
    await tablesDB.createRow({
      databaseId: DATABASE_ID,
      tableId: "habit_completions",
      rowId: ID.unique(),
      data: {
        habit_id: habitId,
        user_id: userId,
      },
    });
    return "success";
  } catch (error) {
    console.log("Error completing habit:", error);
    return "error";
  }
};

export const updateHabitData = async (
  habitId: string,
  data: Record<string, any>,
) => {
  try {
    await tablesDB.updateRow({
      databaseId: DATABASE_ID,
      tableId: "habits",
      rowId: habitId,
      data,
    });
  } catch (error) {
    console.log("Error updating habit after completion", error);
  }
};
