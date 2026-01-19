import { useAuth } from "@/src/lib/auth-context";
import { completeHabit, updateHabitData } from "@/src/services/queries";
import { Habit } from "@/src/types/habit";
import { Spinner, useToast } from "heroui-native";
import { Check } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useCSSVariable } from "uniwind";

interface CompleteHabitProps {
  habit: Habit;
  todayCompleted: boolean;
}

export function CompleteHabitAction({
  habit,
  todayCompleted,
}: CompleteHabitProps) {
  const successColor = useCSSVariable("--success") as string;

  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const handleCompleteHabit = async () => {
    if (!user || todayCompleted) return;

    setIsLoading(true);

    try {
      const result = await completeHabit(habit.id, user.$id);
      if (result === "success") {
        console.log("I'm updating habit streak count now");
        await updateHabitData(habit.id, {
          streak_count: habit.streak_count + 1,
          last_completed: new Date().toISOString(),
        });

        toast.show({
          variant: "success",
          label: "Habit Completed",
          description: `You have completed the habit: ${habit.title}`,
        });
      } else if (result === "error") {
        toast.show({
          variant: "danger",
          label: "Error",
          description: `Failed to complete the habit: ${habit.title}. Please try again.`,
        });
      }
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
          description: "Failed to complete habit. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-success/20 h-full w-full justify-center items-center disabled:opacity-50 disabled:bg-success-500/50"
        onPress={handleCompleteHabit}
        disabled={todayCompleted}
      >
        {isLoading ? (
          <Spinner color="success" />
        ) : (
          <Check size={20} color={successColor} />
        )}
      </TouchableOpacity>
      {/* <Dialog isOpen={isOpen} onOpenChange={setIsOpen} className="w-full">
        <Dialog.Trigger asChild>
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-accent/20 h-full w-full justify-center items-center disabled:opacity-50 disabled:bg-red-500/50"
          >
            <View>
              <Ionicons name="pencil" size={20} color={accentColor} />
            </View>
          </TouchableOpacity>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <KeyboardAvoidingView behavior="padding">
            <Dialog.Content isSwipeable={false}>
              <View className="mb-5 gap-1.5">
                <Dialog.Title numberOfLines={1}>Edit Habit</Dialog.Title>
              </View>
              <View className="gap-4 flex flex-col">
                <TextField>
                  <TextField.Label className="text-xs">
                    Habit Name
                  </TextField.Label>
                  <TextField.Input
                    placeholder="Enter your habit name"
                    value={habitFormData.name}
                    onChangeText={(text) =>
                      setHabitFormData((prev) => ({ ...prev, name: text }))
                    }
                  />
                </TextField>

                <TextField>
                  <TextField.Label className="text-xs">
                    Description
                  </TextField.Label>
                  <TextField.Input
                    placeholder="Type your description..."
                    multiline
                    numberOfLines={4}
                    value={habitFormData.description}
                    onChangeText={(text) =>
                      setHabitFormData((prev) => ({
                        ...prev,
                        description: text,
                      }))
                    }
                  />
                </TextField>

                <Button
                  isDisabled={
                    !habitFormData.name ||
                    !habitFormData.description ||
                    isLoading
                  }
                  onPress={handleSubmit}
                >
                  {isLoading ? <Spinner /> : "Update Habit"}
                </Button>
              </View>
            </Dialog.Content>
          </KeyboardAvoidingView>
        </Dialog.Portal>
      </Dialog> */}
    </>
  );
}
