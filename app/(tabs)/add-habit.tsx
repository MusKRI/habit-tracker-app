import { AddHabitCustomHeader } from "@/src/components/add-habit-screen/custom-header";
import { DATABASE_ID, tablesDB } from "@/src/lib/appwrite";
import { useAuth } from "@/src/lib/auth-context";
import { useRouter } from "expo-router";
import {
  Button,
  Divider,
  RadioGroup,
  Spinner,
  Surface,
  TextField,
  useToast,
} from "heroui-native";
import { Fragment, useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { ID } from "react-native-appwrite";

function AddHabitScreen() {
  const [habitFormData, setHabitFormData] = useState({
    name: "",
    description: "",
    frequency: "daily",
  });

  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    setIsLoading(true);

    try {
      const habit = await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: "habits",
        rowId: ID.unique(),
        data: {
          user_id: user.$id,
          title: habitFormData.name,
          description: habitFormData.description,
          frequency: habitFormData.frequency,
          streak_count: 0,
          last_completed: new Date().toISOString(),
        },
      });

      console.log("Habit created successfully", habit);
      toast.show({
        variant: "success",
        label: "Habit added successfully",
        description: "You can now track your habit",
      });
      setHabitFormData({
        name: "",
        description: "",
        frequency: "daily",
      });
      router.replace("/");
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
          description: "An unknown error occurred",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      className="bg-background text-foreground"
    >
      <AddHabitCustomHeader />
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4 flex flex-col justify-center p-4">
          <TextField>
            <TextField.Label>Habit Name</TextField.Label>
            <TextField.Input
              placeholder="Enter your habit name"
              value={habitFormData.name}
              onChangeText={(text) =>
                setHabitFormData((prev) => ({ ...prev, name: text }))
              }
            />
          </TextField>

          <TextField>
            <TextField.Label>Description</TextField.Label>
            <TextField.Input
              placeholder="Type your description..."
              multiline
              numberOfLines={4}
              value={habitFormData.description}
              onChangeText={(text) =>
                setHabitFormData((prev) => ({ ...prev, description: text }))
              }
            />
            <TextField.Description>
              Maximum 500 characters
            </TextField.Description>
          </TextField>

          <Surface className="gap-6">
            <View>
              <Text className="text-foreground font-semibold text-base">
                Choose Your Frequency
              </Text>
              <Text className="text-muted text-sm">
                Select a frequency to continue
              </Text>
            </View>
            <RadioGroup
              value={habitFormData.frequency}
              onValueChange={(value) =>
                setHabitFormData((prev) => ({
                  ...prev,
                  frequency: value as Frequency,
                }))
              }
            >
              {FREQUENCIES.map((frequency, index) => {
                const isLast = index === FREQUENCIES.length - 1;

                return (
                  <Fragment key={frequency.value}>
                    <RadioGroup.Item
                      key={frequency.value}
                      value={frequency.value}
                    >
                      <View className="flex-1">
                        <RadioGroup.Label>{frequency.label}</RadioGroup.Label>
                      </View>
                      <RadioGroup.Indicator />
                    </RadioGroup.Item>

                    {!isLast && <Divider />}
                  </Fragment>
                );
              })}
            </RadioGroup>
          </Surface>

          <Button
            isDisabled={
              !habitFormData.name || !habitFormData.description || isLoading
            }
            onPress={handleSubmit}
          >
            {isLoading ? <Spinner /> : "Add Habit"}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const FREQUENCIES = [
  {
    value: "daily",
    label: "Daily",
  },
  {
    value: "weekly",
    label: "Weekly",
  },
  {
    value: "monthly",
    label: "Monthly",
  },
] as const;

type Frequency = (typeof FREQUENCIES)[number]["value"];

export default AddHabitScreen;
