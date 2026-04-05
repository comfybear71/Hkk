import { create } from 'zustand';
import { generateMealPlan } from '../data/mealPlans';
import { checkBadges, getGlowPoints, getGlowLevel } from '../data/badges';
import { generateId, getTodayString } from '../utils/helpers';

// Note: In production, use AsyncStorage middleware for persistence
// import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create((set, get) => ({
  // ====== USER SETTINGS ======
  userName: 'Mum',
  dailyKjGoal: 6000,
  setUserName: (name) => set({ userName: name }),
  setDailyKjGoal: (goal) => set({ dailyKjGoal: goal }),

  // ====== MEAL PLAN ======
  mealPlan: generateMealPlan(),
  regeneratePlan: () => {
    const stats = get().stats;
    set({
      mealPlan: generateMealPlan(),
      stats: { ...stats, plans_generated: (stats.plans_generated || 0) + 1 },
    });
  },
  swapMeal: (dayIndex, mealType, newMeal) => {
    const plan = [...get().mealPlan];
    plan[dayIndex] = {
      ...plan[dayIndex],
      [mealType]: newMeal,
      totalKj:
        (mealType === 'breakfast' ? newMeal.kj : plan[dayIndex].breakfast.kj) +
        (mealType === 'lunch' ? newMeal.kj : plan[dayIndex].lunch.kj) +
        (mealType === 'dinner' ? newMeal.kj : plan[dayIndex].dinner.kj),
    };
    set({ mealPlan: plan });
  },

  // ====== FOOD LOG ======
  foodLog: {},
  addFoodLogEntry: (entry) => {
    const today = getTodayString();
    const log = { ...get().foodLog };
    if (!log[today]) log[today] = [];
    log[today].push({
      id: generateId(),
      timestamp: new Date().toISOString(),
      ...entry,
    });

    const stats = { ...get().stats };
    stats.meals_logged = (stats.meals_logged || 0) + 1;
    if (entry.photoUri) {
      stats.photos_taken = (stats.photos_taken || 0) + 1;
    }

    // Check if under goal today
    const todayKj = log[today].reduce((sum, e) => sum + (e.kj || 0), 0);
    if (todayKj <= get().dailyKjGoal) {
      stats.days_under_goal = (stats.days_under_goal || 0) + 1;
    }

    // Update streak
    const streak = get().calculateStreak({ ...log });

    set({ foodLog: log, stats, currentStreak: streak });
  },
  getTodayLog: () => {
    const today = getTodayString();
    return get().foodLog[today] || [];
  },
  getTodayKj: () => {
    const today = getTodayString();
    const todayLog = get().foodLog[today] || [];
    return todayLog.reduce((sum, entry) => sum + (entry.kj || 0), 0);
  },

  // ====== WEIGHT TRACKING ======
  weightLog: [],
  addWeightEntry: (weight, date = null) => {
    const entries = [...get().weightLog];
    const entry = {
      id: generateId(),
      weight: parseFloat(weight),
      date: date || getTodayString(),
      timestamp: new Date().toISOString(),
    };
    entries.push(entry);
    entries.sort((a, b) => new Date(a.date) - new Date(b.date));

    const stats = { ...get().stats };
    stats.weight_logged = (stats.weight_logged || 0) + 1;

    set({ weightLog: entries, stats });
  },

  // ====== BIOMETRICS ======
  biometrics: [],
  addBiometric: (data) => {
    const entries = [...get().biometrics];
    entries.push({
      id: generateId(),
      date: getTodayString(),
      timestamp: new Date().toISOString(),
      ...data,
    });
    set({ biometrics: entries });
  },

  // ====== CHAT ======
  chatHistory: [],
  addChatMessage: (message) => {
    const history = [...get().chatHistory, message];
    const stats = { ...get().stats };
    if (message.role === 'user') {
      stats.chats = (stats.chats || 0) + 1;
    }
    set({ chatHistory: history, stats });
  },
  clearChat: () => set({ chatHistory: [] }),

  // ====== STREAKS & BADGES ======
  currentStreak: 0,
  stats: {
    meals_logged: 0,
    streak: 0,
    days_under_goal: 0,
    weight_logged: 0,
    photos_taken: 0,
    chats: 0,
    plans_generated: 1,
  },

  calculateStreak: (log) => {
    const dates = Object.keys(log || get().foodLog).sort().reverse();
    if (dates.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      if (dates.includes(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  },

  getEarnedBadges: () => {
    const stats = {
      ...get().stats,
      streak: get().currentStreak,
    };
    return checkBadges(stats);
  },

  getGlowPoints: () => {
    const earned = get().getEarnedBadges();
    return getGlowPoints(earned);
  },

  getGlowLevel: () => {
    const points = get().getGlowPoints();
    return getGlowLevel(points);
  },

  // ====== NOTIFICATIONS ======
  notificationsEnabled: true,
  toggleNotifications: () => set(s => ({ notificationsEnabled: !s.notificationsEnabled })),

  // ====== SHOW CONFETTI (for achievements) ======
  showConfetti: false,
  triggerConfetti: () => {
    set({ showConfetti: true });
    setTimeout(() => set({ showConfetti: false }), 3000);
  },

  // ====== PERSISTENCE (simplified for demo) ======
  // In production, add AsyncStorage middleware:
  // persist((...) => ({...}), { name: 'hkk-storage', getStorage: () => AsyncStorage })
}));

export default useStore;
