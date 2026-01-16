// Import element definitions from separate files
import { BASE_ELEMENTS } from './elements/base.js';
import { LAYER2_ELEMENTS } from './elements/layer2.js';
import { LAYER3_ELEMENTS } from './elements/layer3.js';
import { INDUSTRIAL_ELEMENTS } from './elements/industrial.js';

// Re-export base elements
export { BASE_ELEMENTS };

// Combined elements - merge all layers
export const COMBINED_ELEMENTS = {
  ...LAYER2_ELEMENTS,
  ...LAYER3_ELEMENTS,
  ...INDUSTRIAL_ELEMENTS,
};

// Calculate costs dynamically based on ingredients
function calculateCost(elementId) {
  if (BASE_ELEMENTS[elementId]) {
    return BASE_ELEMENTS[elementId].cost;
  }
  const element = COMBINED_ELEMENTS[elementId];
  if (!element) return 0;
  const [ing1, ing2] = element.recipe;
  // Calculate each ingredient's cost independently (no shared visited set)
  return calculateCost(ing1) + calculateCost(ing2);
}

// Add costs to combined elements (unless manually set)
Object.keys(COMBINED_ELEMENTS).forEach(id => {
  if (COMBINED_ELEMENTS[id].cost === undefined) {
    COMBINED_ELEMENTS[id].cost = calculateCost(id);
  }
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

// Calculate layer (depth) of an element
// Layer = max(ingredient layers) + 1
// Base elements are layer 1
export function calculateLayer(elementId) {
  if (BASE_ELEMENTS[elementId]) {
    return 1;
  }
  const element = COMBINED_ELEMENTS[elementId];
  if (!element) return 0;
  const [ing1, ing2] = element.recipe;
  return Math.max(calculateLayer(ing1), calculateLayer(ing2)) + 1;
}

// Pre-calculate layers for all elements
export const ELEMENT_LAYERS = {};
Object.keys(BASE_ELEMENTS).forEach(id => {
  ELEMENT_LAYERS[id] = 1;
});
Object.keys(COMBINED_ELEMENTS).forEach(id => {
  ELEMENT_LAYERS[id] = calculateLayer(id);
});
