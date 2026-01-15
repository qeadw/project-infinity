// Base elements - cost 1 each
export const BASE_ELEMENTS = {
  water: { id: 'water', name: 'Water', emoji: '💧', cost: 1 },
  fire: { id: 'fire', name: 'Fire', emoji: '🔥', cost: 1 },
  earth: { id: 'earth', name: 'Earth', emoji: '🌍', cost: 1 },
  wind: { id: 'wind', name: 'Wind', emoji: '💨', cost: 1 },
};

// All combined elements with their recipes
// Format: id: { name, emoji, recipe: [ingredient1, ingredient2] }
export const COMBINED_ELEMENTS = {
  // Tier 2 - Base + Base (cost 2)
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

  // Tier 3 - Base + Tier2 (cost 3)
  geyser: { id: 'geyser', name: 'Geyser', emoji: '⛲', recipe: ['water', 'steam'] },
  cloud: { id: 'cloud', name: 'Cloud', emoji: '☁️', recipe: ['wind', 'steam'] },
  tea: { id: 'tea', name: 'Tea', emoji: '🍵', recipe: ['fire', 'steam'] },
  brick: { id: 'brick', name: 'Brick', emoji: '🧱', recipe: ['fire', 'mud'] },
  swamp: { id: 'swamp', name: 'Swamp', emoji: '🏚️', recipe: ['water', 'mud'] },
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
  flood: { id: 'flood', name: 'Flood', emoji: '🌊', recipe: ['water', 'storm'] },
  thunder: { id: 'thunder', name: 'Thunder', emoji: '🔊', recipe: ['earth', 'storm'] },

  // Tier 4 - Tier2 + Tier2 (cost 4)
  life: { id: 'life', name: 'Life', emoji: '🧬', recipe: ['rain', 'mud'] },
  obsidian: { id: 'obsidian', name: 'Obsidian', emoji: '🖤', recipe: ['lava', 'ocean'] },
  weather: { id: 'weather', name: 'Weather', emoji: '🌤️', recipe: ['storm', 'steam'] },
  smog: { id: 'smog', name: 'Smog', emoji: '😶‍🌫️', recipe: ['smoke', 'fog'] },
  eruption: { id: 'eruption', name: 'Eruption', emoji: '🌋', recipe: ['lava', 'mountain'] },
  beach: { id: 'beach', name: 'Beach', emoji: '🏖️', recipe: ['ocean', 'sand'] },
  desert: { id: 'desert', name: 'Desert', emoji: '🏜️', recipe: ['sand', 'dust'] },
  glacier: { id: 'glacier', name: 'Glacier', emoji: '🧊', recipe: ['mountain', 'snow'] },
  blizzard: { id: 'blizzard', name: 'Blizzard', emoji: '🌨️', recipe: ['storm', 'snow'] },

  // Tier 5+ - Higher combinations
  glass: { id: 'glass', name: 'Glass', emoji: '🪟', recipe: ['fire', 'sand'] },
  tree: { id: 'tree', name: 'Tree', emoji: '🌳', recipe: ['plant', 'rain'] },
  flower: { id: 'flower', name: 'Flower', emoji: '🌸', recipe: ['plant', 'water'] },
  forest: { id: 'forest', name: 'Forest', emoji: '🌲', recipe: ['tree', 'tree'] },
  wood: { id: 'wood', name: 'Wood', emoji: '🪵', recipe: ['tree', 'wind'] },
  paper: { id: 'paper', name: 'Paper', emoji: '📄', recipe: ['wood', 'water'] },
  bonfire: { id: 'bonfire', name: 'Bonfire', emoji: '🔥', recipe: ['tree', 'fire'] },
  charcoal: { id: 'charcoal', name: 'Charcoal', emoji: '⬛', recipe: ['wood', 'fire'] },
  human: { id: 'human', name: 'Human', emoji: '👤', recipe: ['life', 'clay'] },
  animal: { id: 'animal', name: 'Animal', emoji: '🐾', recipe: ['life', 'earth'] },
  bird: { id: 'bird', name: 'Bird', emoji: '🐦', recipe: ['animal', 'wind'] },
  dog: { id: 'dog', name: 'Dog', emoji: '🐕', recipe: ['animal', 'human'] },
  cat: { id: 'cat', name: 'Cat', emoji: '🐈', recipe: ['animal', 'fire'] },
  house: { id: 'house', name: 'House', emoji: '🏠', recipe: ['brick', 'human'] },
  city: { id: 'city', name: 'City', emoji: '🏙️', recipe: ['house', 'house'] },
  boat: { id: 'boat', name: 'Boat', emoji: '⛵', recipe: ['wood', 'ocean'] },
  metal: { id: 'metal', name: 'Metal', emoji: '🔩', recipe: ['stone', 'fire'] },
  sword: { id: 'sword', name: 'Sword', emoji: '⚔️', recipe: ['metal', 'fire'] },
  tool: { id: 'tool', name: 'Tool', emoji: '🔧', recipe: ['metal', 'human'] },
  wheel: { id: 'wheel', name: 'Wheel', emoji: '🛞', recipe: ['tool', 'stone'] },
  car: { id: 'car', name: 'Car', emoji: '🚗', recipe: ['wheel', 'metal'] },
  airplane: { id: 'airplane', name: 'Airplane', emoji: '✈️', recipe: ['bird', 'metal'] },
  computer: { id: 'computer', name: 'Computer', emoji: '💻', recipe: ['electricity', 'glass'] },
  internet: { id: 'internet', name: 'Internet', emoji: '🌐', recipe: ['computer', 'computer'] },
  robot: { id: 'robot', name: 'Robot', emoji: '🤖', recipe: ['computer', 'metal'] },
  love: { id: 'love', name: 'Love', emoji: '❤️', recipe: ['human', 'human'] },
  family: { id: 'family', name: 'Family', emoji: '👨‍👩‍👧', recipe: ['love', 'house'] },
  music: { id: 'music', name: 'Music', emoji: '🎵', recipe: ['human', 'wind'] },
  art: { id: 'art', name: 'Art', emoji: '🎨', recipe: ['human', 'rainbow'] },
  book: { id: 'book', name: 'Book', emoji: '📚', recipe: ['paper', 'human'] },
  idea: { id: 'idea', name: 'Idea', emoji: '💡', recipe: ['human', 'light'] },
  science: { id: 'science', name: 'Science', emoji: '🔬', recipe: ['idea', 'tool'] },
  rocket: { id: 'rocket', name: 'Rocket', emoji: '🚀', recipe: ['airplane', 'explosion'] },
  space: { id: 'space', name: 'Space', emoji: '🌌', recipe: ['rocket', 'wind'] },
  star: { id: 'star', name: 'Star', emoji: '⭐', recipe: ['space', 'fire'] },
  moon: { id: 'moon', name: 'Moon', emoji: '🌙', recipe: ['space', 'stone'] },
  sun: { id: 'sun', name: 'Sun', emoji: '☀️', recipe: ['star', 'star'] },
  planet: { id: 'planet', name: 'Planet', emoji: '🪐', recipe: ['earth', 'space'] },
  alien: { id: 'alien', name: 'Alien', emoji: '👽', recipe: ['life', 'space'] },
  ufo: { id: 'ufo', name: 'UFO', emoji: '🛸', recipe: ['alien', 'metal'] },
  time: { id: 'time', name: 'Time', emoji: '⏰', recipe: ['sun', 'moon'] },
  fossil: { id: 'fossil', name: 'Fossil', emoji: '🦴', recipe: ['stone', 'animal'] },
  oil: { id: 'oil', name: 'Oil', emoji: '🛢️', recipe: ['fossil', 'earth'] },
  plastic: { id: 'plastic', name: 'Plastic', emoji: '🧴', recipe: ['oil', 'fire'] },
  coal: { id: 'coal', name: 'Coal', emoji: '⚫', recipe: ['fossil', 'fire'] },
  diamond: { id: 'diamond', name: 'Diamond', emoji: '💎', recipe: ['coal', 'earthquake'] },
  gold: { id: 'gold', name: 'Gold', emoji: '🥇', recipe: ['metal', 'sun'] },
  money: { id: 'money', name: 'Money', emoji: '💰', recipe: ['gold', 'human'] },
  bank: { id: 'bank', name: 'Bank', emoji: '🏦', recipe: ['money', 'house'] },
  farmer: { id: 'farmer', name: 'Farmer', emoji: '👨‍🌾', recipe: ['human', 'plant'] },
  wheat: { id: 'wheat', name: 'Wheat', emoji: '🌾', recipe: ['plant', 'farmer'] },
  bread: { id: 'bread', name: 'Bread', emoji: '🍞', recipe: ['wheat', 'fire'] },
  cookie: { id: 'cookie', name: 'Cookie', emoji: '🍪', recipe: ['bread', 'love'] },
  cake: { id: 'cake', name: 'Cake', emoji: '🎂', recipe: ['bread', 'fire'] },
  pizza: { id: 'pizza', name: 'Pizza', emoji: '🍕', recipe: ['bread', 'tomato'] },
  tomato: { id: 'tomato', name: 'Tomato', emoji: '🍅', recipe: ['plant', 'sun'] },
  juice: { id: 'juice', name: 'Juice', emoji: '🧃', recipe: ['fruit', 'water'] },
  fruit: { id: 'fruit', name: 'Fruit', emoji: '🍎', recipe: ['tree', 'sun'] },
  wine: { id: 'wine', name: 'Wine', emoji: '🍷', recipe: ['fruit', 'time'] },
  beer: { id: 'beer', name: 'Beer', emoji: '🍺', recipe: ['wheat', 'water'] },
  ice: { id: 'ice', name: 'Ice', emoji: '🧊', recipe: ['water', 'snow'] },
  icecream: { id: 'icecream', name: 'Ice Cream', emoji: '🍦', recipe: ['ice', 'milk'] },
  milk: { id: 'milk', name: 'Milk', emoji: '🥛', recipe: ['animal', 'farmer'] },
  cheese: { id: 'cheese', name: 'Cheese', emoji: '🧀', recipe: ['milk', 'time'] },
  egg: { id: 'egg', name: 'Egg', emoji: '🥚', recipe: ['bird', 'bird'] },
  chicken: { id: 'chicken', name: 'Chicken', emoji: '🐔', recipe: ['egg', 'life'] },
  phoenix: { id: 'phoenix', name: 'Phoenix', emoji: '🔥', recipe: ['bird', 'fire'] },
  dragon: { id: 'dragon', name: 'Dragon', emoji: '🐉', recipe: ['fire', 'lizard'] },
  lizard: { id: 'lizard', name: 'Lizard', emoji: '🦎', recipe: ['animal', 'stone'] },
  dinosaur: { id: 'dinosaur', name: 'Dinosaur', emoji: '🦕', recipe: ['lizard', 'time'] },
  ghost: { id: 'ghost', name: 'Ghost', emoji: '👻', recipe: ['human', 'fog'] },
  zombie: { id: 'zombie', name: 'Zombie', emoji: '🧟', recipe: ['human', 'mud'] },
  vampire: { id: 'vampire', name: 'Vampire', emoji: '🧛', recipe: ['human', 'blood'] },
  blood: { id: 'blood', name: 'Blood', emoji: '🩸', recipe: ['human', 'sword'] },
  wizard: { id: 'wizard', name: 'Wizard', emoji: '🧙', recipe: ['human', 'energy'] },
  magic: { id: 'magic', name: 'Magic', emoji: '✨', recipe: ['wizard', 'idea'] },
  unicorn: { id: 'unicorn', name: 'Unicorn', emoji: '🦄', recipe: ['horse', 'magic'] },
  horse: { id: 'horse', name: 'Horse', emoji: '🐴', recipe: ['animal', 'wind'] },
  pegasus: { id: 'pegasus', name: 'Pegasus', emoji: '🦄', recipe: ['horse', 'bird'] },
  mermaid: { id: 'mermaid', name: 'Mermaid', emoji: '🧜', recipe: ['human', 'fish'] },
  pirate: { id: 'pirate', name: 'Pirate', emoji: '🏴‍☠️', recipe: ['human', 'boat'] },
  treasure: { id: 'treasure', name: 'Treasure', emoji: '💎', recipe: ['pirate', 'island'] },
  ninja: { id: 'ninja', name: 'Ninja', emoji: '🥷', recipe: ['human', 'smoke'] },
  samurai: { id: 'samurai', name: 'Samurai', emoji: '⚔️', recipe: ['human', 'sword'] },
  king: { id: 'king', name: 'King', emoji: '👑', recipe: ['human', 'gold'] },
  castle: { id: 'castle', name: 'Castle', emoji: '🏰', recipe: ['house', 'stone'] },
  knight: { id: 'knight', name: 'Knight', emoji: '🛡️', recipe: ['human', 'metal'] },
  war: { id: 'war', name: 'War', emoji: '⚔️', recipe: ['knight', 'knight'] },
  peace: { id: 'peace', name: 'Peace', emoji: '☮️', recipe: ['war', 'love'] },
  angel: { id: 'angel', name: 'Angel', emoji: '👼', recipe: ['human', 'cloud'] },
  demon: { id: 'demon', name: 'Demon', emoji: '😈', recipe: ['angel', 'fire'] },
  heaven: { id: 'heaven', name: 'Heaven', emoji: '⛅', recipe: ['angel', 'cloud'] },
  hell: { id: 'hell', name: 'Hell', emoji: '🔥', recipe: ['demon', 'lava'] },
  god: { id: 'god', name: 'God', emoji: '✨', recipe: ['heaven', 'human'] },
  universe: { id: 'universe', name: 'Universe', emoji: '🌌', recipe: ['space', 'time'] },
  infinity: { id: 'infinity', name: 'Infinity', emoji: '♾️', recipe: ['universe', 'time'] },
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
