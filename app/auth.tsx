import { useAuth } from "@/src/lib/auth-context";
import { useRouter } from "expo-router";
import { Button, ErrorView, Spinner, TextField } from "heroui-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

function AuthScreen() {
  const { signUp, signIn } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [isSignUp, setIsSignUp] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleAuth = async () => {
    setError(null);

    if (!formData.email) {
      setError("Email is required");
      return;
    }
    if (!formData.password) {
      setError("Password is required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const error = await signUp(formData.email, formData.password);
        if (error) {
          setError(error);
          return;
        }
      } else {
        const error = await signIn(formData.email, formData.password);
        if (error) {
          setError(error);
          return;
        }

        router.replace("/");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: "",
      password: "",
    });
    setError(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      className="bg-background text-foreground"
    >
      <View className="flex-1 justify-center gap-4 p-4">
        <Text className="text-2xl font-bold text-center text-foreground">
          {isSignUp ? "Create an account" : "Welcome back"}
        </Text>

        <TextField>
          <TextField.Label>Email</TextField.Label>
          <TextField.Input
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, email: text }))
            }
          />
        </TextField>

        <TextField>
          <TextField.Label>Password</TextField.Label>
          <TextField.Input
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, password: text }))
            }
          />
        </TextField>

        {error && <ErrorView isInvalid>{error}</ErrorView>}
        <Button onPress={handleAuth} isDisabled={isLoading}>
          {isLoading ? <Spinner /> : isSignUp ? "Create account" : "Login"}
        </Button>
        <Button
          onPress={handleModeChange}
          variant="ghost"
          className="text-accent! underline"
        >
          {isSignUp
            ? "Already have an account? Login"
            : "Don't have an account? Create an account"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

export default AuthScreen;
