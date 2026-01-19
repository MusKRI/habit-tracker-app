import Ionicons from "@expo/vector-icons/Ionicons";
import { Spinner } from "heroui-native";
import { TouchableOpacity, View } from "react-native";
import { useCSSVariable } from "uniwind";

interface DeleteHabitProps {
  onDelete: () => void;
  isDeleting: boolean;
}

export function DeleteHabitButton({ onDelete, isDeleting }: DeleteHabitProps) {
  const dangerColor = useCSSVariable("--danger") as string;

  return (
    <TouchableOpacity
      onPress={onDelete}
      disabled={isDeleting}
      activeOpacity={0.8}
      className="bg-danger/20 h-full w-full justify-center items-center disabled:opacity-50 disabled:bg-red-500/50"
      style={{
        opacity: isDeleting ? 0.5 : 1,
      }}
    >
      <View>
        {isDeleting ? (
          <Spinner color="danger" />
        ) : (
          <Ionicons name="trash-outline" size={20} color={dangerColor} />
        )}
      </View>
    </TouchableOpacity>
  );
}
