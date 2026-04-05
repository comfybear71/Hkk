// Food Analysis Service for Happy Kilojoule Kitchen
// Provides kJ estimation from food descriptions or photos

// Common Australian foods kJ database (per typical serving)
const FOOD_DATABASE = {
  // Breads & Cereals
  'toast': { kj: 450, serve: '1 slice' },
  'wholemeal toast': { kj: 420, serve: '1 slice' },
  'sourdough': { kj: 480, serve: '1 slice' },
  'porridge': { kj: 700, serve: '1 cup cooked' },
  'oats': { kj: 700, serve: '1 cup cooked' },
  'cereal': { kj: 600, serve: '1 cup' },
  'muesli': { kj: 800, serve: '½ cup' },
  'rice': { kj: 900, serve: '1 cup cooked' },
  'brown rice': { kj: 850, serve: '1 cup cooked' },
  'pasta': { kj: 1000, serve: '1 cup cooked' },
  'noodles': { kj: 900, serve: '1 cup cooked' },

  // Proteins
  'chicken breast': { kj: 700, serve: '100g' },
  'chicken': { kj: 800, serve: '100g' },
  'fish': { kj: 500, serve: '100g' },
  'salmon': { kj: 900, serve: '100g' },
  'tuna': { kj: 500, serve: '95g tin' },
  'prawns': { kj: 400, serve: '100g' },
  'egg': { kj: 310, serve: '1 large' },
  'eggs': { kj: 620, serve: '2 large' },
  'beef': { kj: 900, serve: '100g lean' },
  'lamb': { kj: 1000, serve: '100g' },
  'tofu': { kj: 500, serve: '100g' },

  // Dairy
  'milk': { kj: 280, serve: '1 cup' },
  'yoghurt': { kj: 400, serve: '200g' },
  'greek yoghurt': { kj: 500, serve: '200g' },
  'cheese': { kj: 500, serve: '30g slice' },
  'cottage cheese': { kj: 350, serve: '100g' },
  'butter': { kj: 300, serve: '1 tbsp' },

  // Fruits
  'apple': { kj: 350, serve: '1 medium' },
  'banana': { kj: 380, serve: '1 medium' },
  'orange': { kj: 250, serve: '1 medium' },
  'strawberries': { kj: 150, serve: '1 cup' },
  'blueberries': { kj: 200, serve: '1 cup' },
  'grapes': { kj: 300, serve: '1 cup' },
  'watermelon': { kj: 200, serve: '1 cup' },
  'mango': { kj: 350, serve: '1 cup' },
  'avocado': { kj: 700, serve: '½ avocado' },

  // Vegetables
  'salad': { kj: 100, serve: '1 cup' },
  'broccoli': { kj: 100, serve: '1 cup' },
  'spinach': { kj: 50, serve: '1 cup' },
  'carrot': { kj: 150, serve: '1 medium' },
  'tomato': { kj: 80, serve: '1 medium' },
  'potato': { kj: 500, serve: '1 medium' },
  'sweet potato': { kj: 450, serve: '1 medium' },
  'pumpkin': { kj: 200, serve: '1 cup' },
  'corn': { kj: 350, serve: '1 cob' },
  'mushrooms': { kj: 100, serve: '1 cup' },
  'capsicum': { kj: 100, serve: '1 medium' },
  'zucchini': { kj: 100, serve: '1 medium' },
  'beans': { kj: 150, serve: '1 cup' },
  'peas': { kj: 250, serve: '1 cup' },
  'cucumber': { kj: 50, serve: '½ cucumber' },

  // Spreads & Extras
  'peanut butter': { kj: 350, serve: '1 tbsp' },
  'honey': { kj: 90, serve: '1 tsp' },
  'hummus': { kj: 300, serve: '2 tbsp' },
  'olive oil': { kj: 350, serve: '1 tbsp' },

  // Snacks
  'almonds': { kj: 400, serve: '10 nuts' },
  'nuts': { kj: 500, serve: 'small handful' },
  'rice cake': { kj: 150, serve: '1 cake' },
  'cracker': { kj: 200, serve: '2 crackers' },

  // Drinks
  'coffee': { kj: 20, serve: 'black, 1 cup' },
  'flat white': { kj: 450, serve: '1 regular' },
  'cappuccino': { kj: 400, serve: '1 regular' },
  'latte': { kj: 500, serve: '1 regular' },
  'tea': { kj: 10, serve: '1 cup, no milk' },
  'juice': { kj: 400, serve: '1 cup' },
  'smoothie': { kj: 800, serve: '1 cup' },
  'water': { kj: 0, serve: '1 glass' },

  // Common meals
  'sandwich': { kj: 1500, serve: '1 sandwich' },
  'soup': { kj: 800, serve: '1 bowl' },
  'stir fry': { kj: 1500, serve: '1 serve' },
  'omelette': { kj: 1100, serve: '2 egg' },
  'salad bowl': { kj: 1200, serve: '1 large bowl' },
  'wrap': { kj: 1400, serve: '1 wrap' },
  'sushi': { kj: 1200, serve: '6 pieces' },
};

export function searchFood(query) {
  const lower = query.toLowerCase().trim();
  const results = [];

  for (const [food, data] of Object.entries(FOOD_DATABASE)) {
    if (food.includes(lower) || lower.includes(food)) {
      results.push({ name: food, ...data });
    }
  }

  // If no exact match, try partial matching
  if (results.length === 0) {
    const words = lower.split(' ');
    for (const [food, data] of Object.entries(FOOD_DATABASE)) {
      if (words.some(w => food.includes(w) || w.includes(food))) {
        results.push({ name: food, ...data });
      }
    }
  }

  return results;
}

export function estimateKjFromDescription(description) {
  const lower = description.toLowerCase();
  let totalKj = 0;
  const items = [];

  for (const [food, data] of Object.entries(FOOD_DATABASE)) {
    if (lower.includes(food)) {
      totalKj += data.kj;
      items.push({ name: food, kj: data.kj, serve: data.serve });
    }
  }

  if (items.length === 0) {
    // Rough estimate based on meal type keywords
    if (lower.includes('light') || lower.includes('small') || lower.includes('snack')) {
      return { totalKj: 500, items: [{ name: 'Light snack (estimate)', kj: 500 }], isEstimate: true };
    }
    if (lower.includes('big') || lower.includes('large') || lower.includes('heavy')) {
      return { totalKj: 2500, items: [{ name: 'Large meal (estimate)', kj: 2500 }], isEstimate: true };
    }
    return { totalKj: 1500, items: [{ name: 'Average meal (estimate)', kj: 1500 }], isEstimate: true };
  }

  return { totalKj, items, isEstimate: false };
}

// Simulated photo analysis (in production, send to vision AI API)
export async function analyzePhotoForFood(imageUri) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In production, you would:
  // 1. Upload image to your server or directly to an AI vision API
  // 2. Get back food identification and kJ estimates
  // 3. Return structured data

  // Demo responses for simulation
  const demoAnalyses = [
    {
      foods: [
        { name: 'Grilled chicken breast', kj: 700, confidence: 0.9 },
        { name: 'Steamed vegetables', kj: 200, confidence: 0.85 },
        { name: 'Brown rice', kj: 850, confidence: 0.8 },
      ],
      totalKj: 1750,
      description: 'Looks like a lovely balanced meal with grilled chicken, veggies, and rice! 🍗🥦🍚',
    },
    {
      foods: [
        { name: 'Mixed salad', kj: 150, confidence: 0.9 },
        { name: 'Avocado', kj: 350, confidence: 0.85 },
        { name: 'Egg', kj: 310, confidence: 0.8 },
        { name: 'Toast', kj: 450, confidence: 0.75 },
      ],
      totalKj: 1260,
      description: 'A beautiful plate! Salad with avocado, egg, and toast — great choice! 🥗🥑',
    },
    {
      foods: [
        { name: 'Yoghurt', kj: 400, confidence: 0.9 },
        { name: 'Fresh berries', kj: 150, confidence: 0.85 },
        { name: 'Granola', kj: 350, confidence: 0.7 },
      ],
      totalKj: 900,
      description: 'Yummy yoghurt bowl with berries and granola — light and lovely! 🫐',
    },
  ];

  return demoAnalyses[Math.floor(Math.random() * demoAnalyses.length)];
}
