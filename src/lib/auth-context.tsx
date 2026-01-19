import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null,
  );

  const signUp = async (email: string, password: string) => {
    try {
      await account.create({
        userId: ID.unique(),
        email,
        password,
      });
      await signIn(email, password);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      } else {
        return "An unknown error occurred during sign up";
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession({
        email,
        password,
      });
      await getUser();
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      } else {
        return "An unknown error occurred during sign in";
      }
    }
  };

  const signOut = async () => {
    try {
      await account.deleteSession({
        sessionId: "current",
      });
      setUser(null);
      router.replace("/auth");
    } catch (error) {}
  };

  const getUser = async () => {
    try {
      const session = await account.get();
      setUser(session);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // const checkAuthStatus = async () => {};

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
