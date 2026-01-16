import { BASE_ELEMENTS, ALL_ELEMENTS, COMBINED_ELEMENTS, getRecipeResult, getIngredients } from './recipes.js';

const STORAGE_KEY = 'project-infinity-save';
const COOKIE_NAME = 'project_infinity';

// Cookie helpers
function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

class Game {
  constructor() {
    this.currency = 10;
    this.workspaceItems = []; // { id, elementId, x, y }
    this.nextItemId = 1;
    this.discoveries = new Set(['water', 'fire', 'earth', 'wind']); // discovered element IDs
    this.onCurrencyChange = null;
    this.onWorkspaceChange = null;
    this.onDiscovery = null;
    this.load();
  }

  // Save to localStorage and cookie
  save() {
    const data = {
      currency: this.currency,
      discoveries: Array.from(this.discoveries),
      workspaceItems: this.workspaceItems,
      nextItemId: this.nextItemId,
    };
    const json = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, json);
    setCookie(COOKIE_NAME, json);
  }

  // Load from localStorage or cookie
  load() {
    try {
      // Try localStorage first, fall back to cookie
      let json = localStorage.getItem(STORAGE_KEY);
      if (!json) {
        json = getCookie(COOKIE_NAME);
      }
      if (json) {
        const data = JSON.parse(json);
        this.currency = data.currency ?? 10;
        this.discoveries = new Set(data.discoveries ?? ['water', 'fire', 'earth', 'wind']);
        this.workspaceItems = data.workspaceItems ?? [];
        this.nextItemId = data.nextItemId ?? 1;
      }
    } catch (e) {
      console.error('Failed to load save:', e);
    }
  }

  // Reset progress
  reset() {
    this.currency = 10;
    this.workspaceItems = [];
    this.nextItemId = 1;
    this.discoveries = new Set(['water', 'fire', 'earth', 'wind']);
    localStorage.removeItem(STORAGE_KEY);
    deleteCookie(COOKIE_NAME);
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

    // Refund the cost (10% bonus for items costing 10+)
    let refund = element.cost;
    if (element.cost >= 10) {
      refund = Math.floor(element.cost * 1.1);
    }
    this.currency += refund;

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

    // Place result at the target item's position (where user dropped)
    const x = item2.x;
    const y = item2.y;

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
