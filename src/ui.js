import { game } from './game.js';

let workspace = null;
let sidebar = null;
let currencyDisplay = null;
let discardZone = null;
let discoveryCount = null;
let menuOverlay = null;

// Mouse drag state
let isDragging = false;
let dragData = null; // { type: 'spawn'|'move', elementId?, itemId? }
let dragGhost = null;
let dragOffset = { x: 0, y: 0 };

export function initUI() {
  createLayout();
  renderSidebar();
  updateCurrencyDisplay();
  updateDiscoveryCount();

  // Set up game callbacks
  game.onCurrencyChange = updateCurrencyDisplay;
  game.onWorkspaceChange = renderWorkspace;
  game.onDiscovery = onNewDiscovery;

  // Render any saved workspace items
  renderWorkspace();

  // Global mouse events for dragging
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function createLayout() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="game-container">
      <header class="header">
        <h1>Project Infinity</h1>
        <div class="header-right">
          <button class="menu-btn" id="menu-btn">
            📖 <span id="discovery-count">4</span>/${game.getTotalElements()}
          </button>
          <div class="matter">⚛️ <span id="currency">4</span></div>
        </div>
      </header>
      <div class="main">
        <aside class="sidebar" id="sidebar"></aside>
        <div class="workspace-container">
          <div class="workspace" id="workspace"></div>
          <div class="discard-zone" id="discard">
            ⚛️ Reclaim Matter
          </div>
        </div>
      </div>
    </div>
    <div class="menu-overlay hidden" id="menu-overlay">
      <div class="menu-panel">
        <div class="menu-header">
          <h2>Discoveries</h2>
          <button class="close-btn" id="close-menu">&times;</button>
        </div>
        <div class="menu-content" id="menu-content"></div>
        <div class="menu-footer">
          <button class="reset-btn" id="reset-btn">Reset Progress</button>
        </div>
      </div>
    </div>
    <div class="discovery-popup hidden" id="discovery-popup">
      <div class="discovery-content">
        <div class="discovery-label">New Discovery!</div>
        <div class="discovery-element" id="discovery-element"></div>
      </div>
    </div>
    <div class="drag-ghost hidden" id="drag-ghost"></div>
  `;

  workspace = document.getElementById('workspace');
  sidebar = document.getElementById('sidebar');
  currencyDisplay = document.getElementById('currency');
  discardZone = document.getElementById('discard');
  discoveryCount = document.getElementById('discovery-count');
  menuOverlay = document.getElementById('menu-overlay');
  dragGhost = document.getElementById('drag-ghost');

  // Menu events
  document.getElementById('menu-btn').addEventListener('click', openMenu);
  document.getElementById('close-menu').addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) closeMenu();
  });
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      game.reset();
      updateDiscoveryCount();
      closeMenu();
    }
  });
}

function renderSidebar() {
  const elements = game.getBaseElements();
  sidebar.innerHTML = '<h2>Elements</h2>' + elements.map(el => `
    <div class="element-btn ${game.canAfford(el.id) ? '' : 'disabled'}"
         data-element="${el.id}">
      <span class="emoji">${el.emoji}</span>
      <span class="name">${el.name}</span>
      <span class="cost">${el.cost}</span>
    </div>
  `).join('');

  // Add mouse events to sidebar elements
  sidebar.querySelectorAll('.element-btn').forEach(btn => {
    btn.addEventListener('mousedown', onSidebarMouseDown);
  });
}

function renderWorkspace() {
  // Clear existing items
  workspace.querySelectorAll('.workspace-item').forEach(el => el.remove());

  // Render all items
  game.getWorkspaceItems().forEach(item => {
    const element = game.getElement(item.elementId);
    const div = document.createElement('div');
    div.className = 'workspace-item';
    div.dataset.itemId = item.id;
    div.style.left = `${item.x}px`;
    div.style.top = `${item.y}px`;
    div.innerHTML = `
      <span class="emoji">${element.emoji}</span>
      <span class="name">${element.name}</span>
    `;

    div.addEventListener('mousedown', onItemMouseDown);

    workspace.appendChild(div);
  });

  // Update sidebar affordability
  renderSidebar();
}

function updateCurrencyDisplay() {
  currencyDisplay.textContent = game.getCurrency();
  renderSidebar();
}

function updateDiscoveryCount() {
  discoveryCount.textContent = game.getDiscoveryCount();
}

function onNewDiscovery(elementId) {
  updateDiscoveryCount();
  showDiscoveryPopup(elementId);
}

function showDiscoveryPopup(elementId) {
  const element = game.getElement(elementId);
  const popup = document.getElementById('discovery-popup');
  const content = document.getElementById('discovery-element');

  content.innerHTML = `
    <span class="emoji">${element.emoji}</span>
    <span class="name">${element.name}</span>
  `;

  popup.classList.remove('hidden');
  setTimeout(() => popup.classList.add('hidden'), 2000);
}

function openMenu() {
  renderMenuContent();
  menuOverlay.classList.remove('hidden');
}

function closeMenu() {
  menuOverlay.classList.add('hidden');
}

function renderMenuContent() {
  const content = document.getElementById('menu-content');
  const discoveries = game.getDiscoveries();

  // Sort by cost (tier), then alphabetically
  discoveries.sort((a, b) => {
    if (a.cost !== b.cost) return a.cost - b.cost;
    return a.name.localeCompare(b.name);
  });

  content.innerHTML = discoveries.map(el => {
    const ingredients = game.getIngredients(el.id);
    const canAfford = game.canAfford(el.id);
    let recipeHtml = '';

    if (ingredients) {
      const ing1 = game.getElement(ingredients[0]);
      const ing2 = game.getElement(ingredients[1]);
      recipeHtml = `
        <div class="recipe">
          <span class="recipe-item">${ing1.emoji} ${ing1.name}</span>
          <span class="recipe-plus">+</span>
          <span class="recipe-item">${ing2.emoji} ${ing2.name}</span>
        </div>
      `;
    } else {
      recipeHtml = '<div class="recipe base">Base Element</div>';
    }

    return `
      <div class="discovery-entry ${canAfford ? 'can-afford' : 'cannot-afford'}"
           data-element="${el.id}">
        <div class="discovery-header">
          <span class="emoji">${el.emoji}</span>
          <span class="name">${el.name}</span>
          <span class="cost-badge">${el.cost}</span>
        </div>
        ${recipeHtml}
      </div>
    `;
  }).join('');

  // Add mouse events to discovery entries
  content.querySelectorAll('.discovery-entry.can-afford').forEach(entry => {
    entry.addEventListener('mousedown', onDiscoveryMouseDown);
  });
}

// Create ghost element for dragging
function createGhost(element) {
  dragGhost.innerHTML = `
    <span class="emoji">${element.emoji}</span>
    <span class="name">${element.name}</span>
  `;
  dragGhost.classList.remove('hidden');
}

function hideGhost() {
  dragGhost.classList.add('hidden');
}

function updateGhostPosition(clientX, clientY) {
  dragGhost.style.left = `${clientX - dragOffset.x}px`;
  dragGhost.style.top = `${clientY - dragOffset.y}px`;
}

// Sidebar mouse down - start spawning
function onSidebarMouseDown(e) {
  const btn = e.target.closest('.element-btn');
  if (!btn || btn.classList.contains('disabled')) return;

  e.preventDefault();
  const elementId = btn.dataset.element;
  if (!game.canAfford(elementId)) return;

  const element = game.getElement(elementId);
  const rect = btn.getBoundingClientRect();

  isDragging = true;
  dragData = { type: 'spawn', elementId };
  dragOffset = { x: 40, y: 20 }; // Center of ghost

  createGhost(element);
  updateGhostPosition(e.clientX, e.clientY);
}

// Discovery menu mouse down
function onDiscoveryMouseDown(e) {
  const entry = e.target.closest('.discovery-entry');
  if (!entry || entry.classList.contains('cannot-afford')) return;

  e.preventDefault();
  const elementId = entry.dataset.element;
  if (!game.canAfford(elementId)) return;

  const element = game.getElement(elementId);

  isDragging = true;
  dragData = { type: 'spawn', elementId };
  dragOffset = { x: 40, y: 20 };

  createGhost(element);
  updateGhostPosition(e.clientX, e.clientY);

  // Close menu
  closeMenu();
}

// Workspace item mouse down - start moving
function onItemMouseDown(e) {
  const item = e.target.closest('.workspace-item');
  if (!item) return;

  e.preventDefault();
  const itemId = parseInt(item.dataset.itemId);
  const rect = item.getBoundingClientRect();
  const workspaceItem = game.getWorkspaceItems().find(i => i.id === itemId);
  if (!workspaceItem) return;

  const element = game.getElement(workspaceItem.elementId);

  isDragging = true;
  dragData = { type: 'move', itemId };
  dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };

  item.classList.add('dragging');
  createGhost(element);
  updateGhostPosition(e.clientX, e.clientY);
}

// Global mouse move
function onMouseMove(e) {
  if (!isDragging) return;

  updateGhostPosition(e.clientX, e.clientY);

  // Check if over discard zone
  const discardRect = discardZone.getBoundingClientRect();
  if (e.clientX >= discardRect.left && e.clientX <= discardRect.right &&
      e.clientY >= discardRect.top && e.clientY <= discardRect.bottom) {
    discardZone.classList.add('drag-over');
  } else {
    discardZone.classList.remove('drag-over');
  }
}

// Global mouse up - handle drop
function onMouseUp(e) {
  if (!isDragging) return;

  isDragging = false;
  hideGhost();
  discardZone.classList.remove('drag-over');

  // Remove dragging class from any items
  document.querySelectorAll('.workspace-item.dragging').forEach(el => {
    el.classList.remove('dragging');
  });

  const workspaceRect = workspace.getBoundingClientRect();
  const discardRect = discardZone.getBoundingClientRect();

  // Check if dropped on discard zone
  if (e.clientX >= discardRect.left && e.clientX <= discardRect.right &&
      e.clientY >= discardRect.top && e.clientY <= discardRect.bottom) {
    if (dragData.type === 'move' && dragData.itemId) {
      game.discardItem(dragData.itemId);
    }
    dragData = null;
    return;
  }

  // Check if dropped on workspace
  if (e.clientX >= workspaceRect.left && e.clientX <= workspaceRect.right &&
      e.clientY >= workspaceRect.top && e.clientY <= workspaceRect.bottom) {

    const x = e.clientX - workspaceRect.left - dragOffset.x;
    const y = e.clientY - workspaceRect.top - dragOffset.y;

    if (dragData.type === 'spawn') {
      game.spawnElement(dragData.elementId, x, y);
    } else if (dragData.type === 'move') {
      // Check for combination
      const dropTarget = findItemAtPosition(e.clientX, e.clientY, dragData.itemId);

      if (dropTarget) {
        const result = game.combineItems(dragData.itemId, dropTarget);
        if (!result) {
          // No recipe - just move
          game.moveItem(dragData.itemId, x, y);
          renderWorkspace();
        }
      } else {
        // Just moving
        game.moveItem(dragData.itemId, x, y);
        renderWorkspace();
      }
    }
  }

  dragData = null;
}

// Find item at position (excluding one item)
function findItemAtPosition(clientX, clientY, excludeId) {
  const items = workspace.querySelectorAll('.workspace-item');
  for (const item of items) {
    const id = parseInt(item.dataset.itemId);
    if (id === excludeId) continue;

    const rect = item.getBoundingClientRect();
    if (clientX >= rect.left && clientX <= rect.right &&
        clientY >= rect.top && clientY <= rect.bottom) {
      return id;
    }
  }
  return null;
}
