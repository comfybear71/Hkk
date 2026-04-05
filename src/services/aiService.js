// AI Chat Service for Happy Kilojoule Kitchen "Glow Coach"
// Replace API_KEY and endpoint with your actual AI provider

const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with actual key
const API_URL = 'https://api.anthropic.com/v1/messages'; // Claude API

const SYSTEM_PROMPT = `You are the "Glow Coach" — a warm, encouraging, and knowledgeable nutrition assistant inside the Happy Kilojoule Kitchen app. You're helping an Australian mum eat healthier and stay under 6000 kJ per day.

Your personality:
- Warm, supportive, like a best friend who also knows nutrition
- Use encouraging language, emojis, and positive reinforcement
- Keep answers simple and practical — no medical jargon
- Focus on Australian-friendly foods and measurements (kJ, not calories)
- Always suggest whole foods, balanced meals, portion control
- Never shame or judge — always uplift and motivate
- If asked about medical conditions, gently suggest consulting a doctor
- Keep responses concise (2-4 short paragraphs max)

Key facts:
- 1 calorie = 4.184 kJ
- Daily goal is typically under 6000 kJ for weight management
- Focus on: lean proteins, veggies, whole grains, healthy fats, fruit
- Minimise: processed foods, sugary drinks, excessive portions`;

// Simulated responses for offline/demo mode
const SIMULATED_RESPONSES = {
  default: "That's a great question, love! 💚 Let me think about that for you...\n\nFor staying under 6000 kJ, I'd suggest focusing on lean proteins (chicken, fish, eggs), plenty of colourful veggies, and small portions of whole grains. Remember, you're doing an amazing job just by asking! 🌟\n\nWould you like me to suggest some specific meal ideas?",

  pasta: "Oh, I totally understand the pasta craving! 🍝 Here are some lovely swaps:\n\n• **Zucchini noodles** — spiralise them, they're delicious with tomato sauce (only ~200 kJ per serve!)\n• **Small serve of wholemeal pasta** (60g dry) with lots of veggies — that's about 1200 kJ total\n• **Cauliflower rice** stir-fried with your favourite sauce\n\nYou don't have to give up pasta completely — just make it a smaller part of a veggie-packed dish! 💪",

  sweet: "I hear you — sweet cravings are totally normal! 🍫 Here are some gorgeous options under 500 kJ:\n\n• **Greek yoghurt with berries** (~400 kJ) — creamy and satisfying!\n• **Frozen banana 'ice cream'** — just blend a frozen banana (~380 kJ)\n• **Apple slices with 1 tsp peanut butter** (~350 kJ)\n• **2 squares of dark chocolate** (70%+) (~400 kJ)\n• **Warm stewed fruit with cinnamon** (~300 kJ)\n\nThe trick is having these ready to go so you reach for them instead of the biscuit tin! 😊",

  motivation: "Oh gorgeous, we ALL have those days! 💖 Here's what I want you to remember:\n\n**You are already winning** just by caring about your health. Not every day has to be perfect — progress is what matters!\n\n🌟 Try this: Instead of thinking about what you CAN'T eat, focus on all the delicious things you CAN enjoy. A colourful salad, a warm soup, fresh fruit...\n\n💪 And remember — one 'off' meal doesn't undo all your hard work. Just pick it back up at the next meal. You've got this, beautiful! 🌈",

  snack: "Snack time! 🎉 Here are my favourite low-kJ snacks:\n\n• **Veggie sticks with hummus** (~350 kJ)\n• **Small handful of almonds (10)** (~400 kJ)\n• **Rice cake with cottage cheese** (~300 kJ)\n• **Boiled egg** (~310 kJ)\n• **Cherry tomatoes with a cheese cube** (~350 kJ)\n• **Small banana** (~380 kJ)\n\nKeep them prepped and ready in the fridge — that's the secret! 🥕✨",

  breakfast: "Good morning! 🌞 Here are some beautiful breakfast ideas under 1200 kJ:\n\n• **Veggie omelette** (2 eggs + spinach + mushrooms) — ~1100 kJ\n• **Greek yoghurt bowl** with berries and a drizzle of honey — ~950 kJ\n• **Avocado on wholegrain toast** — ~1200 kJ\n• **Banana porridge** with cinnamon — ~1150 kJ\n\nBreakfast is your foundation for the day! Make it colourful and protein-rich 💚",
};

function getSimulatedResponse(message) {
  const lower = message.toLowerCase();

  if (lower.includes('pasta') || lower.includes('carb') || lower.includes('noodle')) {
    return SIMULATED_RESPONSES.pasta;
  }
  if (lower.includes('sweet') || lower.includes('sugar') || lower.includes('chocolate') || lower.includes('dessert') || lower.includes('treat')) {
    return SIMULATED_RESPONSES.sweet;
  }
  if (lower.includes('motivat') || lower.includes('struggle') || lower.includes('hard') || lower.includes('give up') || lower.includes('can\'t do')) {
    return SIMULATED_RESPONSES.motivation;
  }
  if (lower.includes('snack') || lower.includes('hungry') || lower.includes('between meal')) {
    return SIMULATED_RESPONSES.snack;
  }
  if (lower.includes('breakfast') || lower.includes('morning') || lower.includes('wake up')) {
    return SIMULATED_RESPONSES.breakfast;
  }

  return SIMULATED_RESPONSES.default;
}

export async function sendChatMessage(message, conversationHistory = []) {
  // Try real API first, fall back to simulated responses
  try {
    if (API_KEY === 'YOUR_API_KEY_HERE') {
      // Demo mode — use simulated responses
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      return {
        success: true,
        message: getSimulatedResponse(message),
        isSimulated: true,
      };
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: [
          ...conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: 'user', content: message },
        ],
      }),
    });

    const data = await response.json();
    return {
      success: true,
      message: data.content[0].text,
      isSimulated: false,
    };
  } catch (error) {
    // Fallback to simulated response
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      message: getSimulatedResponse(message),
      isSimulated: true,
    };
  }
}

export { SYSTEM_PROMPT };
