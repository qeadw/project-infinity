import { BASE_ELEMENTS, ALL_ELEMENTS, COMBINED_ELEMENTS, getRecipeResult, getIngredients } from './recipes.js';

const STORAGE_KEY = 'project-infinity-save';

class Game {
  constructor() {
    this.currency = 4;
    this.workspaceItems = []; // { id, elementId, x, y }
    this.nextItemId = 1;
    this.discoveries = new Set(['water', 'fire', 'earth', 'wind']); // discovered element IDs
    this.onCurrencyChange = null;
    this.onWorkspaceChange = null;
    this.onDiscovery = null;
    this.load();
  }

  // Save to localStorage
  save() {
    const data = {
      currency: this.currency,
      discoveries: Array.from(this.discoveries),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // Load from localStorage
  load() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (data) {
        this.currency = data.currency ?? 4;
        this.discoveries = new Set(data.discoveries ?? ['water', 'fire', 'earth', 'wind']);
      }
    } catch (e) {
      console.error('Failed to load save:', e);
    }
  }

  // Reset progress
  reset() {
    this.currency = 4;
    this.workspaceItems = [];
    this.nextItemId = 1;
    this.discoveries = new Set(['water', 'fire', 'earth', 'wind']);
    localStorage.removeItem(STORAGE_KEY);
    this.onCurrencyChange?.(this.currency);
    this.onWorkspaceChange?.(this.workspaceItems);
  }

  // Get current currency
  getCurrency() {
    return this.currency;
  }

  // Check if player can afford an element
  canAfford(elementId) {
    const element = ALL_ELEMENTS[elementId];
    return element && this.currency >= element.cost;
  }

  // Check if element is discovered
  isDiscovered(elementId) {
    return this.discoveries.has(elementId);
  }

  // Get all discoveries
  getDiscoveries() {
    return Array.from(this.discoveries).map(id => ALL_ELEMENTS[id]).filter(Boolean);
  }

  // Get discovery count
  getDiscoveryCount() {
    return this.discoveries.size;
  }

  // Get total possible discoveries
  getTotalElements() {
    return Object.keys(ALL_ELEMENTS).length;
  }

  // Spawn an element in workspace (costs currency)
  spawnElement(elementId, x, y) {
    const element = ALL_ELEMENTS[elementId];
    if (!element || !this.canAfford(elementId)) {
      return null;
    }

    this.currency -= element.cost;
    const item = {
      id: this.nextItemId++,
      elementId,
      x,
      y,
    };
    this.workspaceItems.push(item);

    this.save();
    this.onCurrencyChange?.(this.currency);
    this.onWorkspaceChange?.(this.workspaceItems);

    return item;
  }

  // Move an item in workspace
  moveItem(itemId, x, y) {
    const item = this.workspaceItems.find(i => i.id === itemId);
    if (item) {
      item.x = x;
      item.y = y;
    }
  }

  // Discard an item (refund its cost)
  discardItem(itemId) {
    const index = this.workspaceItems.findIndex(i => i.id === itemId);
    if (index === -1) return;

    const item = this.workspaceItems[index];
    const element = ALL_ELEMENTS[item.elementId];

    // Refund the cost
    this.currency += element.cost;

    // Remove from workspace
    this.workspaceItems.splice(index, 1);

    this.save();
    this.onCurrencyChange?.(this.currency);
    this.onWorkspaceChange?.(this.workspaceItems);
  }

  // Try to combine two items
  combineItems(itemId1, itemId2) {
    const item1 = this.workspaceItems.find(i => i.id === itemId1);
    const item2 = this.workspaceItems.find(i => i.id === itemId2);

    if (!item1 || !item2 || item1 === item2) return null;

    const resultId = getRecipeResult(item1.elementId, item2.elementId);
    if (!resultId) return null;

    // Get position (midpoint of the two items)
    const x = (item1.x + item2.x) / 2;
    const y = (item1.y + item2.y) / 2;

    // Remove both items (no refund - they're consumed)
    this.workspaceItems = this.workspaceItems.filter(
      i => i.id !== itemId1 && i.id !== itemId2
    );

    // Create the result item (no cost - already paid for ingredients)
    const resultItem = {
      id: this.nextItemId++,
      elementId: resultId,
      x,
      y,
    };
    this.workspaceItems.push(resultItem);

    // Track discovery
    const isNew = !this.discoveries.has(resultId);
    this.discoveries.add(resultId);

    this.save();
    this.onWorkspaceChange?.(this.workspaceItems);

    if (isNew) {
      this.onDiscovery?.(resultId);
    }

    return { item: resultItem, isNew };
  }

  // Get base elements for sidebar
  getBaseElements() {
    return Object.values(BASE_ELEMENTS);
  }

  // Get all workspace items
  getWorkspaceItems() {
    return this.workspaceItems;
  }

  // Get element data by ID
  getElement(elementId) {
    return ALL_ELEMENTS[elementId];
  }

  // Get ingredients for element (one layer)
  getIngredients(elementId) {
    return getIngredients(elementId);
  }
}

export const game = new Game();
