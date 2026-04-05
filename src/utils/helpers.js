// Utility helpers for Happy Kilojoule Kitchen

export function formatDate(date) {
  const d = new Date(date);
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  return d.toLocaleDateString('en-AU', options);
}

export function formatDateShort(date) {
  const d = new Date(date);
  const options = { weekday: 'short', day: 'numeric', month: 'short' };
  return d.toLocaleDateString('en-AU', options);
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getTimeEmoji() {
  const hour = new Date().getHours();
  if (hour < 6) return '🌙';
  if (hour < 12) return '🌞';
  if (hour < 17) return '☀️';
  if (hour < 20) return '🌅';
  return '🌙';
}

export function getMealTimeEmoji(mealType) {
  switch (mealType) {
    case 'breakfast': return '🌅';
    case 'lunch': return '☀️';
    case 'dinner': return '🌙';
    case 'snack': return '🍪';
    default: return '🍽️';
  }
}

export function kjToCalories(kj) {
  return Math.round(kj / 4.184);
}

export function caloriesToKj(cal) {
  return Math.round(cal * 4.184);
}

export function getKjStatus(current, goal) {
  const ratio = current / goal;
  if (ratio <= 0.7) return { status: 'great', color: '#66BB6A', message: 'Looking great! 💚' };
  if (ratio <= 0.9) return { status: 'good', color: '#FFB74D', message: 'Getting close — you\'re doing well! 🧡' };
  if (ratio <= 1.0) return { status: 'near', color: '#FF8A65', message: 'Almost at your goal! 🎯' };
  return { status: 'over', color: '#EF5350', message: 'A little over today — that\'s okay! Tomorrow is fresh 💪' };
}

export function getStreakMessage(days) {
  if (days >= 30) return '30+ day streak!! You are absolutely incredible! 🏆👑';
  if (days >= 14) return `${days} day streak! Unstoppable! 💎🔥`;
  if (days >= 7) return `${days} day streak! A whole week — amazing! ⭐`;
  if (days >= 3) return `${days} day streak! You\'re on fire! 🔥`;
  if (days >= 1) return `${days} day streak! Keep it going! 💚`;
  return 'Start your streak today! Log a meal to begin 🌱';
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export function isToday(dateStr) {
  return dateStr === getTodayString();
}
