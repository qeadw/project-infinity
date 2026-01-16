import { game } from './game.js';

let workspace = null;
let sidebar = null;
let currencyDisplay = null;
let discardZone = null;
let discoveryCount = null;
let menuOverlay = null;
let draggedItem = null;
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
  `;

  workspace = document.getElementById('workspace');
  sidebar = document.getElementById('sidebar');
  currencyDisplay = document.getElementById('currency');
  discardZone = document.getElementById('discard');
  discoveryCount = document.getElementById('discovery-count');
  menuOverlay = document.getElementById('menu-overlay');

  // Workspace events
  workspace.addEventListener('dragover', onWorkspaceDragOver);
  workspace.addEventListener('drop', onWorkspaceDrop);

  // Discard zone events
  discardZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    discardZone.classList.add('drag-over');
  });
  discardZone.addEventListener('dragleave', () => {
    discardZone.classList.remove('drag-over');
  });
  discardZone.addEventListener('drop', onDiscardDrop);

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
         data-element="${el.id}"
         draggable="${game.canAfford(el.id)}">
      <span class="emoji">${el.emoji}</span>
      <span class="name">${el.name}</span>
      <span class="cost">${el.cost}</span>
    </div>
  `).join('');

  // Add drag events to sidebar elements
  sidebar.querySelectorAll('.element-btn').forEach(btn => {
    btn.addEventListener('dragstart', onSidebarDragStart);
    btn.addEventListener('click', onSidebarClick);
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
    div.draggable = true;
    div.style.left = `${item.x}px`;
    div.style.top = `${item.y}px`;
    div.innerHTML = `
      <span class="emoji">${element.emoji}</span>
      <span class="name">${element.name}</span>
    `;

    div.addEventListener('dragstart', onItemDragStart);
    div.addEventListener('dragend', onItemDragEnd);

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
           data-element="${el.id}"
           draggable="${canAfford}">
        <div class="discovery-header">
          <span class="emoji">${el.emoji}</span>
          <span class="name">${el.name}</span>
          <span class="cost-badge">${el.cost}</span>
        </div>
        ${recipeHtml}
      </div>
    `;
  }).join('');

  // Add drag events to discovery entries
  content.querySelectorAll('.discovery-entry.can-afford').forEach(entry => {
    entry.addEventListener('dragstart', onDiscoveryDragStart);
  });
}

// Discovery menu drag start
function onDiscoveryDragStart(e) {
  const elementId = e.target.closest('.discovery-entry').dataset.element;
  if (!game.canAfford(elementId)) {
    e.preventDefault();
    return;
  }
  e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'spawn', elementId }));
  e.dataTransfer.effectAllowed = 'copy';
  // Close menu after drag starts
  setTimeout(() => closeMenu(), 100);
}

// Sidebar drag start - spawning new element
function onSidebarDragStart(e) {
  const btn = e.target.closest('.element-btn');
  const elementId = btn?.dataset.element;
  if (!elementId || !game.canAfford(elementId)) {
    e.preventDefault();
    return;
  }
  e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'spawn', elementId }));
  e.dataTransfer.effectAllowed = 'copy';
}

// Sidebar click - spawn at random position
function onSidebarClick(e) {
  const btn = e.target.closest('.element-btn');
  if (!btn || btn.classList.contains('disabled')) return;

  const elementId = btn.dataset.element;
  const btnRect = btn.getBoundingClientRect();
  const workspaceRect = workspace.getBoundingClientRect();

  // Spawn just to the right of the button
  const x = 20; // Just past the sidebar edge
  const y = btnRect.top - workspaceRect.top;

  game.spawnElement(elementId, x, y);
}

// Workspace item drag start
function onItemDragStart(e) {
  const itemId = parseInt(e.target.dataset.itemId);
  const rect = e.target.getBoundingClientRect();

  dragOffset.x = e.clientX - rect.left;
  dragOffset.y = e.clientY - rect.top;
  draggedItem = itemId;

  e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'move', itemId }));
  e.dataTransfer.effectAllowed = 'move';
  e.target.classList.add('dragging');
}

function onItemDragEnd(e) {
  e.target.classList.remove('dragging');
  draggedItem = null;
}

// Workspace drag over
function onWorkspaceDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

// Workspace drop
function onWorkspaceDrop(e) {
  e.preventDefault();
  discardZone.classList.remove('drag-over');

  const rect = workspace.getBoundingClientRect();
  const x = e.clientX - rect.left - dragOffset.x;
  const y = e.clientY - rect.top - dragOffset.y;

  try {
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));

    if (data.type === 'spawn') {
      // Spawning from sidebar
      game.spawnElement(data.elementId, x, y);
    } else if (data.type === 'move') {
      // Moving existing item - check for combination
      const dropTarget = findItemAtPosition(e.clientX, e.clientY, data.itemId);

      if (dropTarget) {
        // Try to combine
        const result = game.combineItems(data.itemId, dropTarget);
        if (!result) {
          // No recipe - just move
          game.moveItem(data.itemId, x, y);
          renderWorkspace();
        }
      } else {
        // Just moving
        game.moveItem(data.itemId, x, y);
        renderWorkspace();
      }
    }
  } catch (err) {
    console.error('Drop error:', err);
  }
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

// Discard drop
function onDiscardDrop(e) {
  e.preventDefault();
  discardZone.classList.remove('drag-over');

  try {
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (data.type === 'move' && data.itemId) {
      game.discardItem(data.itemId);
    }
  } catch (err) {
    console.error('Discard error:', err);
  }
}
