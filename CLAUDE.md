# Happy Kilojoule Kitchen (HKK)

## Project Overview
A health & wellness mobile/web app built for Mum to follow a healthy eating lifestyle, targeting under 6000 kJ per day with balanced, nutritious Australian-friendly meals.

## Tech Stack
- **Framework**: React Native + Expo (SDK 50) with web support
- **State Management**: Zustand (`src/store/useStore.js`)
- **Navigation**: React Navigation bottom tabs (5 tabs)
- **Charts**: react-native-chart-kit + react-native-svg
- **Web**: Metro bundler, SPA mode, deployed via Vercel
- **AI**: Placeholder for Claude API in `src/services/aiService.js`

## Project Structure
```
App.js                          # Entry point + confetti overlay
src/
├── navigation/AppNavigator.js  # Bottom tab navigator (5 tabs)
├── screens/
│   ├── HomeScreen.js           # Dashboard: greeting, kJ ring, today's plan, quick actions
│   ├── MealPlanScreen.js       # 7-day meal plan with day selector & meal swapping
│   ├── FoodLogScreen.js        # Log food via photo/search/text/planned meals
│   ├── TrackScreen.js          # Weight chart, badges, streaks, wellbeing check-in
│   └── ChatScreen.js           # AI "Glow Coach" chat interface
├── components/
│   ├── KJProgressRing.js       # Circular kJ progress indicator (SVG)
│   ├── MealCard.js             # Meal display + recipe modal
│   ├── DailyQuote.js           # Motivational quote + daily tip
│   ├── WeightChart.js          # Line chart for weight progress
│   └── Badge.js                # Badge grid + individual badge component
├── store/useStore.js           # Zustand store (all app state)
├── data/
│   ├── mealPlans.js            # 30+ meal recipes + plan generator
│   ├── quotes.js               # 30 quotes + 14 tips
│   └── badges.js               # 16 badges + glow points system
├── services/
│   ├── aiService.js            # Chat AI (simulated + Claude API placeholder)
│   └── foodAnalysis.js         # Food kJ database (150+ items) + photo analysis
├── utils/helpers.js            # Date formatting, kJ conversion, streak logic
└── theme/colors.js             # Colors, gradients, shadows, font presets
```

## Key Conventions
- **kJ not calories** — all energy values are in kilojoules (Australian standard)
- **Emojis are intentional** — the app uses emojis throughout for a warm, friendly feel
- **Large text & high contrast** — designed for an older user
- **Offline-first** — everything works without network (AI chat has simulated fallback responses)
- **No external API required** — demo mode works out of the box

## Running Locally
```bash
npm install
npx expo start --web    # Web browser
npx expo start          # Native with Expo Go
```

## Deploying
- Vercel auto-deploys from the `claude/mums-glow-daily-app-ftpy7` branch
- Config in `vercel.json` and `.npmrc`
- Build: `npx expo export --platform web` → outputs to `dist/`

## AI Integration
To enable real AI chat responses, replace `YOUR_API_KEY_HERE` in `src/services/aiService.js` with a Claude API key. The system prompt and conversation handling are already wired up.

## Default Daily Goal
6000 kJ per day across 3 meals. Configurable via `dailyKjGoal` in the Zustand store.
