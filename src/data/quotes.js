// Daily motivational quotes and tips for Happy Kilojoule Kitchen
export const MOTIVATIONAL_QUOTES = [
  { text: "You're doing amazing, Mum! Every healthy choice counts 💚", author: "Your Glow Coach" },
  { text: "Small steps every day lead to big results. Keep going! 🌟", author: "Your Glow Coach" },
  { text: "Nourishing your body is an act of self-love 💖", author: "Your Glow Coach" },
  { text: "You don't have to be perfect — just consistent! 🌈", author: "Your Glow Coach" },
  { text: "Every veggie on your plate is a gift to your health 🥦", author: "Your Glow Coach" },
  { text: "Drink that water, gorgeous! Your body will thank you 💧", author: "Your Glow Coach" },
  { text: "Progress, not perfection. You're glowing! ✨", author: "Your Glow Coach" },
  { text: "Cooking at home is one of the best things you can do for yourself 🏠", author: "Your Glow Coach" },
  { text: "Your health journey is beautiful — and so are you! 🌸", author: "Your Glow Coach" },
  { text: "One meal at a time, one day at a time. You've got this! 💪", author: "Your Glow Coach" },
  { text: "Eating well isn't about restriction — it's about choosing joy 🎉", author: "Your Glow Coach" },
  { text: "That salad you made? Chef's kiss! 😘👌", author: "Your Glow Coach" },
  { text: "Fuel your body with goodness and watch yourself bloom 🌷", author: "Your Glow Coach" },
  { text: "You're investing in the most important person — YOU! 👑", author: "Your Glow Coach" },
  { text: "Healthy eating is a marathon, not a sprint. Pace yourself lovingly 🏃‍♀️", author: "Your Glow Coach" },
  { text: "Colour on your plate = colour in your life! 🌈🍽️", author: "Your Glow Coach" },
  { text: "Rest days are just as important as active days. Be gentle with yourself 💜", author: "Your Glow Coach" },
  { text: "You woke up today and chose health. That's powerful! ⚡", author: "Your Glow Coach" },
  { text: "Your body is your home. Treat it with love and care 🏡", author: "Your Glow Coach" },
  { text: "Remember: you deserve to feel amazing every single day 🌞", author: "Your Glow Coach" },
  { text: "A healthy outside starts from the inside 🧡", author: "Your Glow Coach" },
  { text: "Swap, don't stop! There's always a healthier version 🔄", author: "Your Glow Coach" },
  { text: "Look at you, tracking your meals like a pro! 📊💚", author: "Your Glow Coach" },
  { text: "The best project you'll ever work on is YOU 🌺", author: "Your Glow Coach" },
  { text: "Celebrate every win — even the tiny ones count! 🎊", author: "Your Glow Coach" },
  { text: "Your future self will thank you for today's healthy choices 🙏", author: "Your Glow Coach" },
  { text: "Eating healthy is a form of self-respect 🌿", author: "Your Glow Coach" },
  { text: "You're not on a diet — you're living a beautiful lifestyle! 💃", author: "Your Glow Coach" },
  { text: "Fill your plate with rainbows and your heart with joy 🌈❤️", author: "Your Glow Coach" },
  { text: "Today is another chance to nourish your amazing body! 🌅", author: "Your Glow Coach" },
];

export const DAILY_TIPS = [
  "💡 Tip: Drink a big glass of water before each meal — it helps with portion control!",
  "💡 Tip: Use a smaller plate to make portions look bigger and more satisfying.",
  "💡 Tip: Add an extra handful of veggies to any meal for bonus nutrients!",
  "💡 Tip: Chew slowly and enjoy every bite — it takes 20 minutes to feel full.",
  "💡 Tip: Prep some veggies at the start of the week for easy grab-and-go snacks.",
  "💡 Tip: Swap soft drinks for sparkling water with a squeeze of lemon! 🍋",
  "💡 Tip: Try to eat at regular times each day — your body loves routine!",
  "💡 Tip: Add herbs and spices instead of salt for amazing flavour.",
  "💡 Tip: Keep fruit visible on the bench — you'll eat more of it!",
  "💡 Tip: A handful of nuts (about 10) makes a perfect satisfying snack.",
  "💡 Tip: Try to fill half your plate with vegetables at dinner time.",
  "💡 Tip: Frozen veggies are just as nutritious as fresh — and so convenient!",
  "💡 Tip: Reading food labels? Check the 'per 100g' column for easy comparison.",
  "💡 Tip: Walking after a meal helps with digestion and blood sugar levels! 🚶‍♀️",
];

export function getDailyQuote() {
  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
}

export function getDailyTip() {
  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
}
