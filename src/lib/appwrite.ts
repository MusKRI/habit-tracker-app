import { Account, Client, Databases, TablesDB } from "react-native-appwrite";

const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const PLATFORM = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM;

export const client = new Client()
  .setEndpoint(ENDPOINT!)
  .setProject(PROJECT_ID!)
  .setPlatform(PLATFORM!);

export const account = new Account(client);
export const databases = new Databases(client);

export const tablesDB = new TablesDB(client);

export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;

export const HABIT_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_HABIT_COLLECTION_ID!;

export const HABIT_COMPLETION_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_HABIT_COMPLETION_COLLECTION_ID!;
