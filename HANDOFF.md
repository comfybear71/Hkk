# Handoff Document — Happy Kilojoule Kitchen

## What Was Built
A complete React Native/Expo health & wellness app with 5 screens, 26 files, ~4,800 lines of code. The app helps Mum track daily kilojoule intake, follow meal plans, log food, track weight, and chat with an AI nutrition coach.

## Current State
- **Code**: Complete and pushed to `claude/mums-glow-daily-app-ftpy7`
- **Deployment**: Vercel project is set up, working through build configuration
- **Functionality**: All features are implemented with demo/simulated data

## What's Working
1. **Home Screen** — Greeting, kJ progress ring, today's meals at a glance, quick action buttons, daily motivational quote and tip
2. **Meal Plan Screen** — 7-day scrollable plan, day selector tabs with kJ totals, full recipe modal (ingredients + steps), meal swap functionality with alternatives list
3. **Food Log Screen** — 4 logging methods (photo analysis, food search, text description, log planned meal), daily log list, planned vs actual kJ comparison
4. **Track Screen** — Weight logging with line chart, Glow Points & level system, 16 achievement badges, streak tracking, wellbeing check-in (energy, mood, waist)
5. **Chat Screen** — AI "Glow Coach" with 6 quick prompt buttons, simulated context-aware responses, typing indicator, message history

## What's Simulated (Needs Real API)
- **Photo food analysis** (`src/services/foodAnalysis.js:analyzePhotoForFood`) — returns random demo results. In production, send the image to a vision AI API (Claude, GPT-4V) and parse the response.
- **AI Chat** (`src/services/aiService.js`) — has keyword-matched simulated responses. Replace `YOUR_API_KEY_HERE` with a real Claude API key to enable live AI chat. The system prompt and message formatting are already built.
- **Data persistence** — state is in-memory via Zustand. To persist across sessions, add the Zustand `persist` middleware with AsyncStorage (commented guidance is in `src/store/useStore.js`).

## Data Assets Created
- **30+ meal recipes** — 10 breakfasts, 10 lunches, 10 dinners, 10 snacks. All Australian-friendly with ingredients, step-by-step instructions, kJ values, prep times, and tags.
- **150+ food database entries** — Common Australian foods with kJ per typical serving, used for the search/log feature.
- **30 motivational quotes** + **14 daily health tips** — rotate daily.
- **16 achievement badges** — tied to meals logged, streaks, weight entries, photos, chat usage, and plan generation.

## Architecture Decisions
| Decision | Rationale |
|----------|-----------|
| Zustand over Redux | Simpler API, less boilerplate, perfect for this app size |
| React Navigation over Expo Router | Avoids expo-router dependency; more flexible for non-file-based routing |
| Metro bundler for web | Expo SDK 50 default; webpack is deprecated in newer Expo |
| SPA mode (`"output": "single"`) | Static mode requires expo-router; SPA works with React Navigation |
| `--legacy-peer-deps` | Several Expo packages have peer dep mismatches; this is standard for Expo projects |
| Simulated AI responses | App works fully offline without API keys; real API is a drop-in replacement |

## Known Issues / Next Steps
- [ ] **Vercel deployment** — may need further build config tweaks depending on build output
- [ ] **Data persistence** — add AsyncStorage persistence to Zustand store so data survives app restarts
- [ ] **Real AI integration** — swap in Claude API key for live Glow Coach responses
- [ ] **Real photo analysis** — integrate a vision API for actual meal photo kJ estimation
- [ ] **Push notifications** — expo-notifications is installed but not configured with notification scheduling
- [ ] **Confetti animation** — currently a simple overlay; could use `react-native-confetti-cannon` for particle effects
- [ ] **Settings screen** — add a settings/profile screen to customise name, kJ goal, notification preferences
- [ ] **Meal favourites** — let Mum save and re-use favourite meals
- [ ] **Shopping list** — auto-generate a weekly shopping list from the meal plan
- [ ] **Dark mode** — app currently light-only; could add a toggle

## Files Changed (All New)
| File | Purpose |
|------|---------|
| `App.js` | Entry point, confetti overlay |
| `app.json` | Expo config (name, platforms, web) |
| `package.json` | Dependencies and scripts |
| `babel.config.js` | Babel + Reanimated plugin |
| `vercel.json` | Vercel build config |
| `.npmrc` | Legacy peer deps flag |
| `.gitignore` | Standard ignores |
| `README.md` | Project overview |
| `src/navigation/AppNavigator.js` | 5-tab bottom navigator |
| `src/screens/HomeScreen.js` | Dashboard |
| `src/screens/MealPlanScreen.js` | Weekly meal plans |
| `src/screens/FoodLogScreen.js` | Food logging |
| `src/screens/TrackScreen.js` | Progress tracking |
| `src/screens/ChatScreen.js` | AI coach chat |
| `src/components/KJProgressRing.js` | SVG progress ring |
| `src/components/MealCard.js` | Meal display + recipe modal |
| `src/components/DailyQuote.js` | Quote + tip cards |
| `src/components/WeightChart.js` | Weight line chart |
| `src/components/Badge.js` | Badge grid |
| `src/store/useStore.js` | Global state (Zustand) |
| `src/data/mealPlans.js` | 30+ recipes + generator |
| `src/data/quotes.js` | Quotes + tips |
| `src/data/badges.js` | 16 badges + points system |
| `src/services/aiService.js` | Chat AI service |
| `src/services/foodAnalysis.js` | Food database + photo analysis |
| `src/utils/helpers.js` | Utility functions |
| `src/theme/colors.js` | Design tokens |
