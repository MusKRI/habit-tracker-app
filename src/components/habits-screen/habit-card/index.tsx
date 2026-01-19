import { deleteHabit } from "@/src/services/queries";
import { Habit } from "@/src/types/habit";
import { Chip, Surface, useToast } from "heroui-native";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { CompleteHabitAction } from "./complete-habit-action";
import { DeleteHabitButton } from "./delete-habit-action";

interface HabitCardProps {
  habit: Habit;
  todayCompleted: boolean;
}

export function HabitCard({ habit, todayCompleted }: HabitCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteHabit = useCallback(async (habitId: string) => {
    await deleteHabit(habitId);
  }, []);

  const { toast } = useToast();

  const handleDelete = useCallback(async () => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      await handleDeleteHabit(habit.id);
      toast.show({
        variant: "success",
        label: "Habit deleted",
        description: `${habit.title} has been removed`,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.show({
          variant: "danger",
          label: "Error",
          description: error.message,
        });
      } else {
        toast.show({
          variant: "danger",
          label: "Error",
          description: "Failed to delete habit. Please try again.",
        });
      }
    } finally {
      setIsDeleting(false);
    }
  }, [habit.id, habit.title, isDeleting, handleDeleteHabit]);

  const frequencyLabel =
    habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1);

  return (
    <Surface
      className="p-0"
      style={
        {
          // opacity: todayCompleted ? 0.5 : 1,
        }
      }
    >
      <View className="flex-row">
        <View className="flex-1 p-4">
          {todayCompleted && (
            <Chip size="sm" variant="soft" color="success">
              Completed Today
            </Chip>
          )}
          <View className="flex-row justify-between items-start">
            <View className="flex-1 gap-1">
              <View className="flex flex-row items-center">
                <Text
                  className="text-foreground text-lg font-semibold max-w-[70%]"
                  numberOfLines={1}
                >
                  {habit.title}
                </Text>
                <Text className="text-foreground"> • </Text>
                <View className="shrink-0" style={{ borderRadius: 100 }}>
                  <Text className="text-accent text-xs font-medium">
                    {frequencyLabel}
                  </Text>
                </View>
              </View>
              <Text className="text-muted text-sm" numberOfLines={2}>
                {habit.description}
              </Text>
            </View>
          </View>
          <View className="flex-row gap-3 items-center mt-1.5">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-accent text-xs font-semibold">
                🔥 {habit.streak_count}
              </Text>
              <Text className="text-accent text-xs font-semibold">
                {habit.streak_count === 1 ? "day" : "days"} streak
              </Text>
            </View>
          </View>
        </View>
        <View className="h-full w-12">
          <View className="flex-1 items-center justify-center">
            <CompleteHabitAction
              habit={habit}
              todayCompleted={todayCompleted}
            />
          </View>
          <View className="flex-1 items-center justify-center">
            <DeleteHabitButton
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          </View>
        </View>
      </View>
    </Surface>
  );
}
