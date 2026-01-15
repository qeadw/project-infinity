// Base elements - cost 1 each
export const BASE_ELEMENTS = {
  water: { id: 'water', name: 'Water', emoji: '💧', cost: 1 },
  fire: { id: 'fire', name: 'Fire', emoji: '🔥', cost: 1 },
  earth: { id: 'earth', name: 'Earth', emoji: '🌍', cost: 1 },
  wind: { id: 'wind', name: 'Wind', emoji: '💨', cost: 1 },
};

// Combined elements - cost = sum of parts
export const COMBINED_ELEMENTS = {
  steam: { id: 'steam', name: 'Steam', emoji: '♨️', cost: 2 },
  mud: { id: 'mud', name: 'Mud', emoji: '🟤', cost: 2 },
  rain: { id: 'rain', name: 'Rain', emoji: '🌧️', cost: 2 },
  lava: { id: 'lava', name: 'Lava', emoji: '🌋', cost: 2 },
  smoke: { id: 'smoke', name: 'Smoke', emoji: '🌫️', cost: 2 },
  dust: { id: 'dust', name: 'Dust', emoji: '🌪️', cost: 2 },
  ocean: { id: 'ocean', name: 'Ocean', emoji: '🌊', cost: 2 },
  inferno: { id: 'inferno', name: 'Inferno', emoji: '🔥', cost: 2 },
  mountain: { id: 'mountain', name: 'Mountain', emoji: '⛰️', cost: 2 },
  storm: { id: 'storm', name: 'Storm', emoji: '⛈️', cost: 2 },
};

// All elements lookup
export const ALL_ELEMENTS = { ...BASE_ELEMENTS, ...COMBINED_ELEMENTS };

// Recipe map - key is sorted element IDs joined by +
// Sorted alphabetically so water+fire and fire+water both work
export const RECIPES = {
  'fire+water': 'steam',
  'earth+water': 'mud',
  'water+wind': 'rain',
  'earth+fire': 'lava',
  'fire+wind': 'smoke',
  'earth+wind': 'dust',
  'water+water': 'ocean',
  'fire+fire': 'inferno',
  'earth+earth': 'mountain',
  'wind+wind': 'storm',
};

// Get recipe result from two element IDs
export function getRecipeResult(id1, id2) {
  const key = [id1, id2].sort().join('+');
  return RECIPES[key] || null;
}
