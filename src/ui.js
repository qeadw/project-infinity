import { game } from './game.js';

let workspace = null;
let sidebar = null;
let currencyDisplay = null;
let discardZone = null;
let draggedItem = null;
let dragOffset = { x: 0, y: 0 };

export function initUI() {
  createLayout();
  renderSidebar();
  updateCurrencyDisplay();

  // Set up game callbacks
  game.onCurrencyChange = updateCurrencyDisplay;
  game.onWorkspaceChange = renderWorkspace;
}

function createLayout() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="game-container">
      <header class="header">
        <h1>Project Infinity</h1>
        <div class="currency">💰 <span id="currency">4</span></div>
      </header>
      <div class="main">
        <aside class="sidebar" id="sidebar"></aside>
        <div class="workspace-container">
          <div class="workspace" id="workspace"></div>
          <div class="discard-zone" id="discard">
            🗑️ Discard (refund)
          </div>
        </div>
      </div>
    </div>
  `;

  workspace = document.getElementById('workspace');
  sidebar = document.getElementById('sidebar');
  currencyDisplay = document.getElementById('currency');
  discardZone = document.getElementById('discard');

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

// Sidebar drag start - spawning new element
function onSidebarDragStart(e) {
  const elementId = e.target.dataset.element;
  if (!game.canAfford(elementId)) {
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
  const rect = workspace.getBoundingClientRect();
  const x = Math.random() * (rect.width - 100) + 20;
  const y = Math.random() * (rect.height - 100) + 20;

  game.spawnElement(elementId, x, y);
}

// Workspace item drag start
function onItemDragStart(e) {
  const itemId = parseInt(e.target.dataset.itemId);
  const rect = e.target.getBoundingClientRect();
  const workspaceRect = workspace.getBoundingClientRect();

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
