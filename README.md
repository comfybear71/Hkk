# 🌟 Happy Kilojoule Kitchen

A beautiful, encouraging health & wellness app to help Mum follow a healthy eating lifestyle with balanced, nutritious meals — all under 6000 kJ per day!

## Features

- **📋 7-Day Meal Plan** — Fresh weekly plans with Australian-friendly recipes, kJ tracking, and easy meal swapping
- **📝 Food Logging** — Photo analysis, food search, or text description to track daily intake
- **📈 Progress Tracking** — Weight charts, streaks, badges, Glow Points, and wellbeing check-ins
- **💬 Glow Coach** — AI chat assistant for nutrition advice, meal ideas, and motivation
- **🎉 Encouragement** — Daily quotes, confetti celebrations, and badges for milestones

## Tech Stack

- React Native + Expo (web-compatible)
- Zustand state management
- React Navigation (bottom tabs)
- react-native-chart-kit & react-native-svg
- Deployable to Vercel as a web app

## Getting Started

```bash
npm install
npx expo start        # Development
npx expo start --web  # Web browser
```

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. It will auto-detect the config from `vercel.json`

## Customisation

- **Daily kJ Goal**: Default 6000 kJ, adjustable in app
- **AI Chat**: Replace `YOUR_API_KEY_HERE` in `src/services/aiService.js` with your Claude API key
- **Meal Database**: Add meals in `src/data/mealPlans.js`
