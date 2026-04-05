// Achievement badges and glow points system for Happy Kilojoule Kitchen

export const BADGES = [
  {
    id: 'first_log',
    name: 'First Bite! 🍽️',
    description: 'Logged your very first meal',
    emoji: '🍽️',
    requirement: { type: 'meals_logged', count: 1 },
    glowPoints: 10,
  },
  {
    id: 'five_meals',
    name: 'Foodie Five 🖐️',
    description: 'Logged 5 meals',
    emoji: '🖐️',
    requirement: { type: 'meals_logged', count: 5 },
    glowPoints: 25,
  },
  {
    id: 'ten_meals',
    name: 'Meal Master 🏅',
    description: 'Logged 10 meals',
    emoji: '🏅',
    requirement: { type: 'meals_logged', count: 10 },
    glowPoints: 50,
  },
  {
    id: 'twenty_five_meals',
    name: 'Super Tracker 🌟',
    description: 'Logged 25 meals',
    emoji: '🌟',
    requirement: { type: 'meals_logged', count: 25 },
    glowPoints: 100,
  },
  {
    id: 'fifty_meals',
    name: 'Legendary Logger 👑',
    description: 'Logged 50 meals — incredible dedication!',
    emoji: '👑',
    requirement: { type: 'meals_logged', count: 50 },
    glowPoints: 200,
  },
  {
    id: 'streak_3',
    name: 'Three Day Glow 🔥',
    description: '3-day logging streak',
    emoji: '🔥',
    requirement: { type: 'streak', count: 3 },
    glowPoints: 30,
  },
  {
    id: 'streak_7',
    name: 'Weekly Wonder ⭐',
    description: '7-day logging streak',
    emoji: '⭐',
    requirement: { type: 'streak', count: 7 },
    glowPoints: 75,
  },
  {
    id: 'streak_14',
    name: 'Fortnight Fighter 💎',
    description: '14-day logging streak — unstoppable!',
    emoji: '💎',
    requirement: { type: 'streak', count: 14 },
    glowPoints: 150,
  },
  {
    id: 'streak_30',
    name: 'Monthly Marvel 🏆',
    description: '30-day streak — you are absolutely amazing!',
    emoji: '🏆',
    requirement: { type: 'streak', count: 30 },
    glowPoints: 300,
  },
  {
    id: 'under_goal_1',
    name: 'Goal Getter 🎯',
    description: 'Stayed under your kJ goal for a day',
    emoji: '🎯',
    requirement: { type: 'days_under_goal', count: 1 },
    glowPoints: 15,
  },
  {
    id: 'under_goal_7',
    name: 'Week of Wins 🌈',
    description: 'Under kJ goal for 7 days total',
    emoji: '🌈',
    requirement: { type: 'days_under_goal', count: 7 },
    glowPoints: 80,
  },
  {
    id: 'under_goal_30',
    name: 'Glow Queen 💖',
    description: 'Under kJ goal for 30 days total — absolute queen!',
    emoji: '💖',
    requirement: { type: 'days_under_goal', count: 30 },
    glowPoints: 250,
  },
  {
    id: 'first_weight',
    name: 'Weigh-In Wonder ⚖️',
    description: 'Logged your first weight entry',
    emoji: '⚖️',
    requirement: { type: 'weight_logged', count: 1 },
    glowPoints: 15,
  },
  {
    id: 'first_photo',
    name: 'Picture Perfect 📸',
    description: 'Took your first meal photo',
    emoji: '📸',
    requirement: { type: 'photos_taken', count: 1 },
    glowPoints: 20,
  },
  {
    id: 'five_photos',
    name: 'Food Photographer 🎨',
    description: 'Took 5 meal photos',
    emoji: '🎨',
    requirement: { type: 'photos_taken', count: 5 },
    glowPoints: 50,
  },
  {
    id: 'first_chat',
    name: 'Coach Connect 💬',
    description: 'Had your first chat with the Glow Coach',
    emoji: '💬',
    requirement: { type: 'chats', count: 1 },
    glowPoints: 10,
  },
  {
    id: 'plan_generated',
    name: 'Plan Pro 📋',
    description: 'Generated your first meal plan',
    emoji: '📋',
    requirement: { type: 'plans_generated', count: 1 },
    glowPoints: 15,
  },
];

export function checkBadges(stats) {
  const earned = [];
  for (const badge of BADGES) {
    const { type, count } = badge.requirement;
    const userCount = stats[type] || 0;
    if (userCount >= count) {
      earned.push(badge);
    }
  }
  return earned;
}

export function getGlowPoints(earnedBadges) {
  return earnedBadges.reduce((total, badge) => total + badge.glowPoints, 0);
}

export function getGlowLevel(points) {
  if (points >= 1000) return { level: 'Radiant Queen 👑', color: '#FFD700' };
  if (points >= 500) return { level: 'Glowing Goddess ✨', color: '#FF69B4' };
  if (points >= 250) return { level: 'Bright Star ⭐', color: '#FF8A65' };
  if (points >= 100) return { level: 'Blooming Beauty 🌸', color: '#CE93D8' };
  if (points >= 25) return { level: 'Fresh Start 🌱', color: '#81C784' };
  return { level: 'New Glow 🌟', color: '#B3E5FC' };
}
