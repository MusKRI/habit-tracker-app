# Habit Tracker App 🎯

A beautiful, feature-rich habit tracking mobile application built with React Native and Expo. Track your daily habits, maintain streaks, and build consistency with smooth animations and an intuitive user interface.

## ✨ Features

- **Habit Management**: Create, edit, and delete habits with custom descriptions and frequencies
- **Streak Tracking**: Visualize your current streak, best streak, and total completions
- **Real-time Updates**: Live synchronization with Appwrite backend
- **Smooth Animations**: Scroll-based UI animations using React Native Reanimated
  - Tab bar and buttons intelligently hide/show based on scroll direction
  - Fade-in animations for headers
  - Haptic feedback on interactions
- **Beautiful UI**: Built with Hero UI Native components and Tailwind CSS
- **Authentication**: Secure user authentication with email/password
- **Dark Mode Support**: Automatic theme switching based on system preferences
- **Cross-platform**: Runs on iOS, Android, and Web

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev) ~54.0.31
- **Runtime**: React Native 0.81.5
- **Language**: TypeScript 5.9.2
- **Routing**: Expo Router 6.0.21 (file-based routing)
- **UI Components**: [Hero UI Native](https://v3.heroui.com/docs/native/getting-started) 1.0.0-beta.12
- **Styling**: Tailwind CSS 4.1.18 + UniWind
- **Animations**: React Native Reanimated 4.1.1
- **Backend**: [Appwrite](https://appwrite.io) (Database & Authentication)
- **Icons**: Lucide React Native
- **State Management**: React Context API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (optional, but recommended)
- **Appwrite Account** (free tier available at [appwrite.io](https://appwrite.io))
- **iOS Simulator** (for macOS users) or **Android Studio** (for Android development)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd habit-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Appwrite Backend

#### Create an Appwrite Project

1. Sign up for a free account at [appwrite.io](https://appwrite.io)
2. Create a new project
3. Note down your **Project ID** and **Endpoint URL**

#### Create Database and Tables

1. In your Appwrite console, create a new **Database**
2. Create two **Tables**:
   - `habits` - for storing user habits
   - `habit_completions` - for tracking habit completions

#### Configure Tables

**`habits` table structure:**

- `user_id` (string, required)
- `title` (string, required)
- `description` (string, optional)
- `frequency` (string, required) - e.g., "daily", "weekly"
- `streak_count` (integer, default: 0)
- `last_completed` (string, optional)

**`habit_completions` table structure:**

- `user_id` (string, required)
- `habit_id` (string, required)

#### Set Up Authentication

1. In Appwrite Console, go to **Auth** section
2. Enable **Email/Password** authentication
3. Configure your authentication settings

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Appwrite Configuration
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
EXPO_PUBLIC_APPWRITE_PLATFORM=com.yourcompany.yourapp
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
EXPO_PUBLIC_APPWRITE_HABIT_COLLECTION_ID=habits
EXPO_PUBLIC_APPWRITE_HABIT_COMPLETION_COLLECTION_ID=habit_completions
```

**Important**:

- Replace all placeholder values with your actual Appwrite credentials
- The `.env` file is already in `.gitignore` to keep your credentials secure
- For Appwrite Cloud, use `https://cloud.appwrite.io/v1` as the endpoint
- For self-hosted Appwrite, use your server's endpoint

### 5. Start the Development Server

```bash
npm start
```

Or use specific platform commands:

```bash
# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

### 6. Run the App

- **Expo Go**: Scan the QR code with Expo Go app (iOS/Android)
- **Development Build**: Press `i` for iOS simulator or `a` for Android emulator
- **Web**: Press `w` to open in browser

## 📁 Project Structure

```
gmail-interactions/
├── app/                          # Expo Router pages (file-based routing)
│   ├── _layout.tsx              # Root layout with providers
│   ├── auth.tsx                 # Authentication screen
│   └── (tabs)/                  # Tab navigation group
│       ├── _layout.tsx          # Tab layout configuration
│       ├── index.tsx            # Habits list screen
│       ├── add-habit.tsx        # Add habit screen
│       └── streaks.tsx          # Streaks tracking screen
│
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── custom-tab-bar.tsx  # Custom animated tab bar
│   │   ├── habits-screen/      # Habits-related components
│   │   │   ├── all-habits.tsx  # Main habits list
│   │   │   ├── habit-card/     # Habit card components
│   │   │   └── add-habit-btn.tsx # Floating action button
│   │   └── streaks-screen/     # Streaks-related components
│   │       └── streaks-content.tsx # Streaks display
│   │
│   ├── lib/                     # Core utilities and configurations
│   │   ├── appwrite.ts         # Appwrite client setup
│   │   ├── auth-context.tsx    # Authentication context provider
│   │   └── classes.ts          # Utility functions
│   │
│   ├── services/               # API and data services
│   │   └── queries.ts          # Appwrite database queries
│   │
│   ├── types/                   # TypeScript type definitions
│   │   └── habit.ts            # Habit and completion types
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-bottom-tab-bar-height.tsx
│   │   ├── use-header-height.tsx
│   │   └── use-scroll-direction.ts
│   │
│   └── providers/               # React context providers
│       └── animated-scroll-list-provider.tsx
│
├── assets/                      # Images, fonts, and static assets
├── global.css                   # Global styles and Tailwind imports
├── app.json                     # Expo configuration
├── package.json                 # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## 🎨 Key Features Explained

### Animation System

The app uses **React Native Reanimated** for smooth, performant animations:

- **Scroll-based UI Hiding**: Tab bar and floating action button automatically hide when scrolling down and reappear when scrolling up
- **Header Animations**: Dynamic header that fades in when scrolling past a threshold

### Authentication Flow

- Users can sign up and sign in with email/password
- Authentication state is managed via React Context
- Protected routes automatically redirect unauthenticated users
- Session management handled by Appwrite

## Getting Help

- Check [Expo Documentation](https://docs.expo.dev/)
- Check [Appwrite Documentation](https://appwrite.io/docs)
- Review [React Native Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)

## 📝 Development Notes

- The app uses **Expo Router** for navigation (file-based routing)
- **Hero UI Native** components are used for consistent UI design
- **TypeScript** is used throughout for type safety
- The project follows a component-based architecture
- Custom hooks are used for reusable logic

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- [Expo](https://expo.dev) for the amazing development platform
- [Appwrite](https://appwrite.io) for backend services
- [Hero UI Native](https://v3.heroui.com/docs/native/getting-started) for beautiful UI components
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) for smooth animations

---

**Built with ❤️ using React Native and Expo**
