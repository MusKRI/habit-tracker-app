export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description: string;
  frequency: string;
  streak_count: number;
  last_completed: string;
}

export interface HabitCompletion {
  id: string;
  user_id: string;
  habit_id: string;
  createdAt: string;
}
