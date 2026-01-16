import { BASE_ELEMENTS, ALL_ELEMENTS, COMBINED_ELEMENTS, getRecipeResult, getIngredients, ELEMENT_LAYERS } from './recipes.js';

const STORAGE_KEY = 'project-infinity-save';
const COOKIE_NAME = 'project_infinity';

// Machine types
export const MACHINE_TYPES = {
  accumulator: {
    id: 'accumulator',
    name: 'Accumulator',
    description: 'Produces elements automatically',
    interval: 5000, // 5 seconds
  },
  mechanical_arm: {
    id: 'mechanical_arm',
    name: 'Mechanical Arm',
    description: 'Moves items from left to right',
    interval: 2000, // 2 seconds
  },
  research_bench: {
    id: 'research_bench',
    name: 'Research Bench',
    description: 'Spend 3 matter to unlock a random element (cost 3+)',
    cost: 3,
    minTier: 3, // Minimum element cost to research
    minMatter: 10, // Can't go below this total matter
  },
  advanced_research_bench: {
    id: 'advanced_research_bench',
    name: 'Advanced Research Bench',
    description: 'Research elements that combine with a specific material',
    cost: 5,
    minMatter: 10,
  },
};

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
    this.machineConfigs = {}; // { itemId: { targetElement, enabled } }
    this.machineTimers = {}; // { itemId: intervalId }
    this.onCurrencyChange = null;
    this.onWorkspaceChange = null;
    this.onDiscovery = null;
    this.load();
    this.startMachines();
  }

  // Check if an element is a machine
  isMachine(elementId) {
    const element = COMBINED_ELEMENTS[elementId];
    return element?.machine === true;
  }

  // Get machine config for an item
  getMachineConfig(itemId) {
    return this.machineConfigs[itemId] || { targetElement: null, enabled: false };
  }

  // Set machine config
  setMachineConfig(itemId, config) {
    this.machineConfigs[itemId] = { ...this.getMachineConfig(itemId), ...config };
    this.save();
    this.restartMachine(itemId);
  }

  // Start all machines
  startMachines() {
    this.workspaceItems.forEach(item => {
      if (this.isMachine(item.elementId)) {
        this.startMachine(item.id);
      }
    });
  }

  // Start a single machine
  startMachine(itemId) {
    const item = this.workspaceItems.find(i => i.id === itemId);
    if (!item || !this.isMachine(item.elementId)) return;

    // Clear existing timer
    if (this.machineTimers[itemId]) {
      clearInterval(this.machineTimers[itemId]);
    }

    const config = this.getMachineConfig(itemId);
    if (!config.enabled) return;

    const machineType = MACHINE_TYPES[item.elementId];
    if (!machineType) return;

    this.machineTimers[itemId] = setInterval(() => {
      this.tickMachine(itemId);
    }, machineType.interval);
  }

  // Restart a machine (after config change)
  restartMachine(itemId) {
    if (this.machineTimers[itemId]) {
      clearInterval(this.machineTimers[itemId]);
      delete this.machineTimers[itemId];
    }
    this.startMachine(itemId);
  }

  // Stop a machine
  stopMachine(itemId) {
    if (this.machineTimers[itemId]) {
      clearInterval(this.machineTimers[itemId]);
      delete this.machineTimers[itemId];
    }
  }

  // Machine tick - perform action
  tickMachine(itemId) {
    const item = this.workspaceItems.find(i => i.id === itemId);
    if (!item) {
      this.stopMachine(itemId);
      return;
    }

    const config = this.getMachineConfig(itemId);
    if (!config.enabled) return;

    if (item.elementId === 'accumulator') {
      this.tickAccumulator(item, config);
    } else if (item.elementId === 'mechanical_arm') {
      this.tickMechanicalArm(item, config);
    }
  }

  // Accumulator: produce element to the right
  tickAccumulator(item, config) {
    if (!config.targetElement) return;

    const element = ALL_ELEMENTS[config.targetElement];
    if (!element) return;

    // Check if we can afford it
    if (this.currency < element.cost) return;

    // Deduct cost and spawn element
    this.currency -= element.cost;
    const newItem = {
      id: this.nextItemId++,
      elementId: config.targetElement,
      x: item.x + 100,
      y: item.y,
    };
    this.workspaceItems.push(newItem);

    this.save();
    this.onCurrencyChange?.(this.currency);
    this.onWorkspaceChange?.(this.workspaceItems);
  }

  // Mechanical Arm: move items from left to right
  tickMechanicalArm(item, config) {
    // Find items to the left of the arm
    const armX = item.x;
    const armY = item.y;
    const range = 80; // pixels

    const itemsToMove = this.workspaceItems.filter(i => {
      if (i.id === item.id) return false;
      if (this.isMachine(i.elementId)) return false;
      const dx = armX - i.x;
      const dy = Math.abs(armY - i.y);
      return dx > 0 && dx < range && dy < range;
    });

    if (itemsToMove.length > 0) {
      // Move the closest item
      const closest = itemsToMove.reduce((a, b) =>
        Math.abs(a.x - armX) < Math.abs(b.x - armX) ? a : b
      );
      closest.x = armX + 100; // Move to right of arm
      this.save();
      this.onWorkspaceChange?.(this.workspaceItems);
    }
  }

  // Calculate total matter (currency + value of workspace items)
  getTotalMatter() {
    const workspaceValue = this.workspaceItems.reduce((sum, item) => {
      const element = ALL_ELEMENTS[item.elementId];
      return sum + (element?.cost || 0);
    }, 0);
    return this.currency + workspaceValue;
  }

  // Research Bench: spend matter to unlock random element
  doResearch() {
    const config = MACHINE_TYPES.research_bench;
    const cost = config.cost;
    const minMatter = config.minMatter;
    const minTier = config.minTier;

    // Check if we have enough matter (total including workspace can't go below minimum)
    if (this.getTotalMatter() - cost < minMatter) {
      return { success: false, reason: 'not_enough_matter' };
    }

    // Also need enough currency to actually pay
    if (this.currency < cost) {
      return { success: false, reason: 'not_enough_matter' };
    }

    // Find undiscovered elements with cost >= minTier
    const undiscovered = Object.values(ALL_ELEMENTS).filter(el =>
      el.cost >= minTier && !this.discoveries.has(el.id)
    );

    if (undiscovered.length === 0) {
      return { success: false, reason: 'all_discovered' };
    }

    // Deduct cost
    this.currency -= cost;

    // Pick a random element
    const randomElement = undiscovered[Math.floor(Math.random() * undiscovered.length)];
    this.discoveries.add(randomElement.id);

    this.save();
    this.onCurrencyChange?.(this.currency);
    this.onDiscovery?.(randomElement.id);

    return { success: true, element: randomElement };
  }

  // Advanced Research Bench: research elements containing a specific ingredient
  doAdvancedResearch(ingredientId) {
    const cost = MACHINE_TYPES.advanced_research_bench.cost;
    const minMatter = MACHINE_TYPES.advanced_research_bench.minMatter;

    // Check if we have enough matter (total including workspace can't go below minimum)
    if (this.getTotalMatter() - cost < minMatter) {
      return { success: false, reason: 'not_enough_matter' };
    }

    // Also need enough currency to actually pay
    if (this.currency < cost) {
      return { success: false, reason: 'not_enough_matter' };
    }

    // Find undiscovered elements that use this ingredient
    const undiscovered = Object.values(COMBINED_ELEMENTS).filter(el => {
      if (this.discoveries.has(el.id)) return false;
      return el.recipe && el.recipe.includes(ingredientId);
    });

    if (undiscovered.length === 0) {
      return { success: false, reason: 'none_available', ingredient: ingredientId };
    }

    // Deduct cost
    this.currency -= cost;

    // Pick a random element
    const randomElement = undiscovered[Math.floor(Math.random() * undiscovered.length)];
    this.discoveries.add(randomElement.id);

    this.save();
    this.onCurrencyChange?.(this.currency);
    this.onDiscovery?.(randomElement.id);

    return { success: true, element: randomElement };
  }

  // Save to localStorage and cookie
  save() {
    const data = {
      currency: this.currency,
      discoveries: Array.from(this.discoveries),
      workspaceItems: this.workspaceItems,
      nextItemId: this.nextItemId,
      machineConfigs: this.machineConfigs,
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
        this.machineConfigs = data.machineConfigs ?? {};
      }
    } catch (e) {
      console.error('Failed to load save:', e);
    }
  }

  // Reset progress
  reset() {
    // Stop all machines
    Object.keys(this.machineTimers).forEach(id => this.stopMachine(parseInt(id)));

    this.currency = 10;
    this.workspaceItems = [];
    this.nextItemId = 1;
    this.discoveries = new Set(['water', 'fire', 'earth', 'wind']);
    this.machineConfigs = {};
    this.machineTimers = {};
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

    // Stop machine if it's running
    this.stopMachine(itemId);
    delete this.machineConfigs[itemId];

    // Refund the cost (add 1 for every 10 cost)
    const refund = element.cost + Math.floor(element.cost / 10);
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

  // Get layer (depth) of an element
  getLayer(elementId) {
    return ELEMENT_LAYERS[elementId] || 0;
  }
}

export const game = new Game();
