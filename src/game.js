import { BASE_ELEMENTS, ALL_ELEMENTS, getRecipeResult } from './recipes.js';

class Game {
  constructor() {
    this.currency = 4;
    this.workspaceItems = []; // { id, elementId, x, y }
    this.nextItemId = 1;
    this.onCurrencyChange = null;
    this.onWorkspaceChange = null;
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

    this.onWorkspaceChange?.(this.workspaceItems);

    return resultItem;
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
}

export const game = new Game();
