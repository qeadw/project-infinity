// Layer 1 - Base elements (cost 1)
export const BASE_ELEMENTS = {
  water: { id: 'water', name: 'Water', emoji: '💧', cost: 1 },
  fire: { id: 'fire', name: 'Fire', emoji: '🔥', cost: 1 },
  earth: { id: 'earth', name: 'Earth', emoji: '🌍', cost: 1 },
  wind: { id: 'wind', name: 'Wind', emoji: '💨', cost: 1 },
};

// Layer 2 & 3 - Combined elements
export const COMBINED_ELEMENTS = {
  // Layer 2 - Base + Base (cost 2)
  steam: { id: 'steam', name: 'Steam', emoji: '♨️', recipe: ['water', 'fire'] },
  mud: { id: 'mud', name: 'Mud', emoji: '🟤', recipe: ['water', 'earth'] },
  rain: { id: 'rain', name: 'Rain', emoji: '🌧️', recipe: ['water', 'wind'] },
  lava: { id: 'lava', name: 'Lava', emoji: '🌋', recipe: ['fire', 'earth'] },
  smoke: { id: 'smoke', name: 'Smoke', emoji: '🌫️', recipe: ['fire', 'wind'] },
  dust: { id: 'dust', name: 'Dust', emoji: '🌪️', recipe: ['earth', 'wind'] },
  ocean: { id: 'ocean', name: 'Ocean', emoji: '🌊', recipe: ['water', 'water'] },
  energy: { id: 'energy', name: 'Energy', emoji: '⚡', recipe: ['fire', 'fire'] },
  mountain: { id: 'mountain', name: 'Mountain', emoji: '⛰️', recipe: ['earth', 'earth'] },
  storm: { id: 'storm', name: 'Storm', emoji: '⛈️', recipe: ['wind', 'wind'] },

  // Layer 3 - Base + Layer2 (cost 3) - FINAL, no further combinations
  geyser: { id: 'geyser', name: 'Geyser', emoji: '⛲', recipe: ['water', 'steam'] },
  cloud: { id: 'cloud', name: 'Cloud', emoji: '☁️', recipe: ['wind', 'steam'] },
  boil: { id: 'boil', name: 'Boil', emoji: '🫧', recipe: ['fire', 'steam'] },
  brick: { id: 'brick', name: 'Brick', emoji: '🧱', recipe: ['fire', 'mud'] },
  swamp: { id: 'swamp', name: 'Swamp', emoji: '🐸', recipe: ['water', 'mud'] },
  clay: { id: 'clay', name: 'Clay', emoji: '🏺', recipe: ['earth', 'mud'] },
  plant: { id: 'plant', name: 'Plant', emoji: '🌱', recipe: ['earth', 'rain'] },
  rainbow: { id: 'rainbow', name: 'Rainbow', emoji: '🌈', recipe: ['fire', 'rain'] },
  pond: { id: 'pond', name: 'Pond', emoji: '🪷', recipe: ['water', 'rain'] },
  volcano: { id: 'volcano', name: 'Volcano', emoji: '🌋', recipe: ['earth', 'lava'] },
  stone: { id: 'stone', name: 'Stone', emoji: '🪨', recipe: ['water', 'lava'] },
  ash: { id: 'ash', name: 'Ash', emoji: '⬛', recipe: ['wind', 'lava'] },
  fog: { id: 'fog', name: 'Fog', emoji: '🌁', recipe: ['water', 'smoke'] },
  pollution: { id: 'pollution', name: 'Pollution', emoji: '🏭', recipe: ['earth', 'smoke'] },
  sand: { id: 'sand', name: 'Sand', emoji: '🏖️', recipe: ['earth', 'dust'] },
  sandstorm: { id: 'sandstorm', name: 'Sandstorm', emoji: '🏜️', recipe: ['wind', 'dust'] },
  island: { id: 'island', name: 'Island', emoji: '🏝️', recipe: ['earth', 'ocean'] },
  wave: { id: 'wave', name: 'Wave', emoji: '🌊', recipe: ['wind', 'ocean'] },
  salt: { id: 'salt', name: 'Salt', emoji: '🧂', recipe: ['fire', 'ocean'] },
  fish: { id: 'fish', name: 'Fish', emoji: '🐟', recipe: ['water', 'ocean'] },
  light: { id: 'light', name: 'Light', emoji: '💡', recipe: ['wind', 'energy'] },
  electricity: { id: 'electricity', name: 'Electricity', emoji: '⚡', recipe: ['water', 'energy'] },
  explosion: { id: 'explosion', name: 'Explosion', emoji: '💥', recipe: ['fire', 'energy'] },
  earthquake: { id: 'earthquake', name: 'Earthquake', emoji: '🌍', recipe: ['earth', 'energy'] },
  river: { id: 'river', name: 'River', emoji: '🏞️', recipe: ['water', 'mountain'] },
  cave: { id: 'cave', name: 'Cave', emoji: '🕳️', recipe: ['wind', 'mountain'] },
  snow: { id: 'snow', name: 'Snow', emoji: '❄️', recipe: ['water', 'storm'] },
  lightning: { id: 'lightning', name: 'Lightning', emoji: '⚡', recipe: ['fire', 'storm'] },
  tornado: { id: 'tornado', name: 'Tornado', emoji: '🌪️', recipe: ['wind', 'storm'] },
  hail: { id: 'hail', name: 'Hail', emoji: '🧊', recipe: ['earth', 'storm'] },

  // Layer 3 - Layer2 + Layer2 (cost 4) - FINAL, no further combinations
  life: { id: 'life', name: 'Life', emoji: '🧬', recipe: ['rain', 'mud'] },
  obsidian: { id: 'obsidian', name: 'Obsidian', emoji: '🖤', recipe: ['lava', 'ocean'] },
  weather: { id: 'weather', name: 'Weather', emoji: '🌤️', recipe: ['storm', 'steam'] },
  smog: { id: 'smog', name: 'Smog', emoji: '😶‍🌫️', recipe: ['smoke', 'dust'] },
  eruption: { id: 'eruption', name: 'Eruption', emoji: '🌋', recipe: ['lava', 'mountain'] },
  tsunami: { id: 'tsunami', name: 'Tsunami', emoji: '🌊', recipe: ['ocean', 'storm'] },
  glacier: { id: 'glacier', name: 'Glacier', emoji: '🧊', recipe: ['mountain', 'ocean'] },
  plasma: { id: 'plasma', name: 'Plasma', emoji: '✨', recipe: ['energy', 'energy'] },
  magma: { id: 'magma', name: 'Magma', emoji: '🔶', recipe: ['lava', 'lava'] },
};

// Calculate costs dynamically based on ingredients
function calculateCost(elementId, visited = new Set()) {
  if (BASE_ELEMENTS[elementId]) {
    return BASE_ELEMENTS[elementId].cost;
  }
  const element = COMBINED_ELEMENTS[elementId];
  if (!element || visited.has(elementId)) return 0;
  visited.add(elementId);
  const [ing1, ing2] = element.recipe;
  return calculateCost(ing1, visited) + calculateCost(ing2, visited);
}

// Add costs to combined elements
Object.keys(COMBINED_ELEMENTS).forEach(id => {
  COMBINED_ELEMENTS[id].cost = calculateCost(id);
});

// All elements lookup
export const ALL_ELEMENTS = { ...BASE_ELEMENTS, ...COMBINED_ELEMENTS };

// Build recipe map from combined elements
export const RECIPES = {};
Object.entries(COMBINED_ELEMENTS).forEach(([id, element]) => {
  const key = element.recipe.slice().sort().join('+');
  RECIPES[key] = id;
});

// Get recipe result from two element IDs
export function getRecipeResult(id1, id2) {
  const key = [id1, id2].sort().join('+');
  return RECIPES[key] || null;
}

// Get ingredients for an element (one layer)
export function getIngredients(elementId) {
  const element = COMBINED_ELEMENTS[elementId];
  if (!element) return null;
  return element.recipe;
}
