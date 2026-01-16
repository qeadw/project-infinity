import { game, MACHINE_TYPES } from './game.js';

let workspace = null;
let sidebar = null;
let currencyDisplay = null;
let discardZone = null;
let discoveryCount = null;
let menuOverlay = null;
let machineMenuOverlay = null;

// Mouse drag state
let isDragging = false;
let dragData = null; // { type: 'spawn'|'move', elementId?, itemId? }
let dragGhost = null;
let dragOffset = { x: 0, y: 0 };

// Pinned recipe
let pinnedRecipe = null;
let collapsedNodes = new Set(); // Track collapsed tree nodes

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

  // Prevent context menu on workspace
  workspace.addEventListener('contextmenu', (e) => e.preventDefault());
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
          <h2>Research Book</h2>
          <button class="close-btn" id="close-menu">&times;</button>
        </div>
        <div class="menu-content" id="menu-content"></div>
        <div class="menu-footer">
          <button class="reset-btn" id="reset-btn">Reset Progress</button>
        </div>
      </div>
    </div>
    <div class="menu-overlay hidden" id="machine-menu-overlay">
      <div class="menu-panel machine-panel">
        <div class="menu-header">
          <h2 id="machine-menu-title">Machine</h2>
          <button class="close-btn" id="close-machine-menu">&times;</button>
        </div>
        <div class="menu-content" id="machine-menu-content"></div>
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
  machineMenuOverlay = document.getElementById('machine-menu-overlay');
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

  // Machine menu events
  document.getElementById('close-machine-menu').addEventListener('click', closeMachineMenu);
  machineMenuOverlay.addEventListener('click', (e) => {
    if (e.target === machineMenuOverlay) closeMachineMenu();
  });
}

function renderSidebar() {
  const elements = game.getBaseElements();
  let html = '<h2>Elements</h2>' + elements.map(el => `
    <div class="element-btn ${game.canAfford(el.id) ? '' : 'disabled'}"
         data-element="${el.id}">
      <span class="emoji">${el.emoji}</span>
      <span class="name">${el.name}</span>
      <span class="cost">${el.cost}</span>
    </div>
  `).join('');

  // Add pinned recipe tree if any
  if (pinnedRecipe) {
    html += renderPinnedRecipe();
  }

  sidebar.innerHTML = html;

  // Add mouse events to sidebar elements
  sidebar.querySelectorAll('.element-btn').forEach(btn => {
    btn.addEventListener('mousedown', onSidebarMouseDown);
  });

  // Add unpin button event
  const unpinBtn = sidebar.querySelector('.unpin-btn');
  if (unpinBtn) {
    unpinBtn.addEventListener('click', () => {
      pinnedRecipe = null;
      collapsedNodes.clear();
      renderSidebar();
    });
  }

  // Add collapse button events
  sidebar.querySelectorAll('.collapse-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const path = btn.dataset.path;
      if (collapsedNodes.has(path)) {
        collapsedNodes.delete(path);
      } else {
        collapsedNodes.add(path);
      }
      renderSidebar();
    });
  });
}

function renderPinnedRecipe() {
  const element = game.getElement(pinnedRecipe);
  if (!element) return '';

  const tree = buildRecipeTree(pinnedRecipe, 20); // Deep enough for any recipe

  return `
    <div class="pinned-section">
      <div class="pinned-header">
        <h2>Recipe</h2>
        <button class="unpin-btn">Unpin</button>
      </div>
      <div class="pinned-target">
        <span class="emoji">${element.emoji}</span>
        <span class="name">${element.name}</span>
        <span class="cost-badge">${element.cost}</span>
      </div>
      <div class="recipe-tree">${tree}</div>
    </div>
  `;
}

function buildRecipeTree(elementId, depth, level = 0, path = '') {
  if (depth <= 0) return '';

  const ingredients = game.getIngredients(elementId);
  if (!ingredients) return '';

  const [ing1Id, ing2Id] = ingredients;
  const ing1 = game.getElement(ing1Id);
  const ing2 = game.getElement(ing2Id);
  const ing1Discovered = game.isDiscovered(ing1Id);
  const ing2Discovered = game.isDiscovered(ing2Id);
  const hasIng1Recipe = game.getIngredients(ing1Id);
  const hasIng2Recipe = game.getIngredients(ing2Id);

  // Show ??? for undiscovered elements
  const ing1Display = ing1Discovered ? `${ing1.emoji} ${ing1.name}` : '???';
  const ing2Display = ing2Discovered ? `${ing2.emoji} ${ing2.name}` : '???';

  let html = `
    <div class="tree-node" style="margin-left: ${level * 8}px">
      <span class="tree-item ${ing1Discovered ? '' : 'undiscovered'} ${hasIng1Recipe && ing1Discovered ? 'has-recipe' : ''}">
        ${ing1Display}
      </span>
      <span class="tree-plus">+</span>
      <span class="tree-item ${ing2Discovered ? '' : 'undiscovered'} ${hasIng2Recipe && ing2Discovered ? 'has-recipe' : ''}">
        ${ing2Display}
      </span>
    </div>
  `;

  // Recursively add sub-trees with labels and collapse buttons (only if discovered)
  if (hasIng1Recipe && ing1Discovered) {
    const nodePath1 = path + '/' + ing1Id;
    const isCollapsed1 = collapsedNodes.has(nodePath1);
    html += `<div class="tree-sub" style="margin-left: ${(level + 1) * 8}px">
      <button class="collapse-btn" data-path="${nodePath1}">${isCollapsed1 ? '+' : '-'}</button>
      <span class="tree-label">${ing1.emoji} ${ing1.name} =</span>
    </div>`;
    if (!isCollapsed1) {
      html += `<div class="tree-children" data-path="${nodePath1}">`;
      html += buildRecipeTree(ing1Id, depth - 1, level + 1, nodePath1);
      html += `</div>`;
    }
  }
  if (hasIng2Recipe && ing2Discovered) {
    const nodePath2 = path + '/' + ing2Id;
    const isCollapsed2 = collapsedNodes.has(nodePath2);
    html += `<div class="tree-sub" style="margin-left: ${(level + 1) * 8}px">
      <button class="collapse-btn" data-path="${nodePath2}">${isCollapsed2 ? '+' : '-'}</button>
      <span class="tree-label">${ing2.emoji} ${ing2.name} =</span>
    </div>`;
    if (!isCollapsed2) {
      html += `<div class="tree-children" data-path="${nodePath2}">`;
      html += buildRecipeTree(ing2Id, depth - 1, level + 1, nodePath2);
      html += `</div>`;
    }
  }

  return html;
}

function renderWorkspace() {
  // Clear existing items
  workspace.querySelectorAll('.workspace-item').forEach(el => el.remove());

  // Render all items
  game.getWorkspaceItems().forEach(item => {
    const element = game.getElement(item.elementId);
    const isMachine = game.isMachine(item.elementId);
    const config = isMachine ? game.getMachineConfig(item.id) : null;

    const div = document.createElement('div');
    div.className = 'workspace-item' + (isMachine ? ' machine' : '') + (config?.enabled ? ' active' : '');
    div.dataset.itemId = item.id;
    div.style.left = `${item.x}px`;
    div.style.top = `${item.y}px`;
    div.innerHTML = `
      <span class="emoji">${element.emoji}</span>
      <span class="name">${element.name}</span>
      ${isMachine ? '<span class="machine-indicator">⚙️</span>' : ''}
    `;

    div.addEventListener('mousedown', onItemMouseDown);
    if (isMachine) {
      div.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        openMachineMenu(item.id);
      });
    }

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
    let recipeHtml = '';

    if (ingredients) {
      const ing1 = game.getElement(ingredients[0]);
      const ing2 = game.getElement(ingredients[1]);
      const ing1Discovered = game.isDiscovered(ingredients[0]);
      const ing2Discovered = game.isDiscovered(ingredients[1]);
      const ing1Display = ing1Discovered ? `${ing1.emoji} ${ing1.name}` : '???';
      const ing2Display = ing2Discovered ? `${ing2.emoji} ${ing2.name}` : '???';
      recipeHtml = `
        <div class="recipe">
          <span class="recipe-item ${ing1Discovered ? '' : 'undiscovered'}">${ing1Display}</span>
          <span class="recipe-plus">+</span>
          <span class="recipe-item ${ing2Discovered ? '' : 'undiscovered'}">${ing2Display}</span>
        </div>
      `;
    } else {
      recipeHtml = '<div class="recipe base">Base Element</div>';
    }

    return `
      <div class="discovery-entry" data-element="${el.id}">
        <div class="discovery-header">
          <span class="emoji">${el.emoji}</span>
          <span class="name">${el.name}</span>
          <span class="cost-badge">${el.cost}</span>
          ${ingredients ? `<button class="pin-btn" data-element="${el.id}">📌</button>` : ''}
        </div>
        ${recipeHtml}
      </div>
    `;
  }).join('');

  // Add pin button events
  content.querySelectorAll('.pin-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      pinnedRecipe = btn.dataset.element;
      renderSidebar();
      closeMenu();
    });
  });
}

// Machine menu
let currentMachineItemId = null;

function openMachineMenu(itemId) {
  currentMachineItemId = itemId;
  const item = game.getWorkspaceItems().find(i => i.id === itemId);
  if (!item) return;

  const element = game.getElement(item.elementId);
  const machineType = MACHINE_TYPES[item.elementId];
  const config = game.getMachineConfig(itemId);

  document.getElementById('machine-menu-title').textContent = element.name;

  const content = document.getElementById('machine-menu-content');

  if (item.elementId === 'accumulator') {
    // Accumulator: select element to produce
    const discoveries = game.getDiscoveries();
    discoveries.sort((a, b) => a.cost - b.cost);

    content.innerHTML = `
      <div class="machine-config">
        <label>
          <input type="checkbox" id="machine-enabled" ${config.enabled ? 'checked' : ''}>
          Enabled
        </label>
        <p class="machine-desc">${machineType.description}</p>
        <p class="machine-interval">Produces every ${machineType.interval / 1000}s</p>
        <h3>Select Element to Produce:</h3>
        <div class="element-select">
          ${discoveries.map(el => `
            <div class="select-option ${config.targetElement === el.id ? 'selected' : ''}"
                 data-element="${el.id}">
              <span class="emoji">${el.emoji}</span>
              <span class="name">${el.name}</span>
              <span class="cost-badge">${el.cost}/ea</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Enable toggle
    content.querySelector('#machine-enabled').addEventListener('change', (e) => {
      game.setMachineConfig(itemId, { enabled: e.target.checked });
      renderWorkspace();
    });

    // Element selection
    content.querySelectorAll('.select-option').forEach(opt => {
      opt.addEventListener('click', () => {
        content.querySelectorAll('.select-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        game.setMachineConfig(itemId, { targetElement: opt.dataset.element });
      });
    });
  } else if (item.elementId === 'mechanical_arm') {
    // Mechanical arm: just enable/disable
    content.innerHTML = `
      <div class="machine-config">
        <label>
          <input type="checkbox" id="machine-enabled" ${config.enabled ? 'checked' : ''}>
          Enabled
        </label>
        <p class="machine-desc">${machineType.description}</p>
        <p class="machine-interval">Moves items every ${machineType.interval / 1000}s</p>
        <p class="machine-info">Place items to the left of the arm. It will move them to the right.</p>
      </div>
    `;

    content.querySelector('#machine-enabled').addEventListener('change', (e) => {
      game.setMachineConfig(itemId, { enabled: e.target.checked });
      renderWorkspace();
    });
  } else if (item.elementId === 'research_bench') {
    // Research bench: spend matter to unlock random element
    const totalMatter = game.getTotalMatter();
    const canAfford = game.getCurrency() >= machineType.cost && totalMatter - machineType.cost >= machineType.minMatter;

    content.innerHTML = `
      <div class="machine-config">
        <p class="machine-desc">${machineType.description}</p>
        <p class="machine-info">Cost: ${machineType.cost} matter (minimum ${machineType.minMatter} total must remain)</p>
        <p class="machine-info">Current: ${game.getCurrency()} | Total (with board): ${totalMatter}</p>
        <button class="research-btn ${canAfford ? '' : 'disabled'}" id="do-research">
          Research (${machineType.cost} matter)
        </button>
        <div id="research-result"></div>
      </div>
    `;

    const researchBtn = content.querySelector('#do-research');
    researchBtn.addEventListener('click', () => {
      if (researchBtn.classList.contains('disabled')) return;

      const result = game.doResearch();
      const resultDiv = content.querySelector('#research-result');

      if (result.success) {
        resultDiv.innerHTML = `
          <div class="research-success">
            <span class="discovery-label">Discovered!</span>
            <span class="emoji">${result.element.emoji}</span>
            <span class="name">${result.element.name}</span>
          </div>
        `;
        // Update button state
        const newTotal = game.getTotalMatter();
        const newCanAfford = game.getCurrency() >= machineType.cost && newTotal - machineType.cost >= machineType.minMatter;
        if (!newCanAfford) {
          researchBtn.classList.add('disabled');
        }
        // Update matter display in menu
        content.querySelector('.machine-info:nth-child(3)').textContent =
          `Current: ${game.getCurrency()} | Total (with board): ${newTotal}`;
      } else if (result.reason === 'not_enough_matter') {
        resultDiv.innerHTML = `<div class="research-fail">Not enough matter! Need ${machineType.minMatter + machineType.cost} total.</div>`;
      } else if (result.reason === 'all_discovered') {
        resultDiv.innerHTML = `<div class="research-fail">All tier 10+ elements already discovered!</div>`;
      }
    });
  } else if (item.elementId === 'advanced_research_bench') {
    // Advanced research bench: select an ingredient to research with
    const totalMatter = game.getTotalMatter();
    const canAfford = game.getCurrency() >= machineType.cost && totalMatter - machineType.cost >= machineType.minMatter;
    const discoveries = game.getDiscoveries();
    discoveries.sort((a, b) => a.cost - b.cost);

    content.innerHTML = `
      <div class="machine-config">
        <p class="machine-desc">${machineType.description}</p>
        <p class="machine-info">Cost: ${machineType.cost} matter (minimum ${machineType.minMatter} total must remain)</p>
        <p class="machine-info current-matter">Current: ${game.getCurrency()} | Total (with board): ${totalMatter}</p>
        <h3>Select ingredient to research:</h3>
        <div class="element-select">
          ${discoveries.map(el => `
            <div class="select-option" data-element="${el.id}">
              <span class="emoji">${el.emoji}</span>
              <span class="name">${el.name}</span>
            </div>
          `).join('')}
        </div>
        <button class="research-btn ${canAfford ? '' : 'disabled'}" id="do-advanced-research" disabled>
          Select an ingredient first
        </button>
        <div id="research-result"></div>
      </div>
    `;

    let selectedIngredient = null;
    const researchBtn = content.querySelector('#do-advanced-research');

    // Element selection
    content.querySelectorAll('.select-option').forEach(opt => {
      opt.addEventListener('click', () => {
        content.querySelectorAll('.select-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedIngredient = opt.dataset.element;
        const el = game.getElement(selectedIngredient);
        researchBtn.textContent = `Research ${el.name} recipes (${machineType.cost} matter)`;
        researchBtn.disabled = false;
      });
    });

    researchBtn.addEventListener('click', () => {
      if (researchBtn.classList.contains('disabled') || !selectedIngredient) return;

      const result = game.doAdvancedResearch(selectedIngredient);
      const resultDiv = content.querySelector('#research-result');

      if (result.success) {
        resultDiv.innerHTML = `
          <div class="research-success">
            <span class="discovery-label">Discovered!</span>
            <span class="emoji">${result.element.emoji}</span>
            <span class="name">${result.element.name}</span>
          </div>
        `;
        // Update button state
        const newTotal = game.getTotalMatter();
        const newCanAfford = game.getCurrency() >= machineType.cost && newTotal - machineType.cost >= machineType.minMatter;
        if (!newCanAfford) {
          researchBtn.classList.add('disabled');
        }
        // Update matter display
        content.querySelector('.current-matter').textContent =
          `Current: ${game.getCurrency()} | Total (with board): ${newTotal}`;
      } else if (result.reason === 'not_enough_matter') {
        resultDiv.innerHTML = `<div class="research-fail">Not enough matter! Need ${machineType.minMatter + machineType.cost} total.</div>`;
      } else if (result.reason === 'none_available') {
        const ing = game.getElement(result.ingredient);
        resultDiv.innerHTML = `<div class="research-fail">No undiscovered recipes use ${ing.emoji} ${ing.name}!</div>`;
      }
    });
  }

  machineMenuOverlay.classList.remove('hidden');
}

function closeMachineMenu() {
  machineMenuOverlay.classList.add('hidden');
  currentMachineItemId = null;
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

  isDragging = true;
  dragData = { type: 'spawn', elementId };
  dragOffset = { x: 40, y: 20 }; // Center of ghost

  createGhost(element);
  updateGhostPosition(e.clientX, e.clientY);
}

// Workspace item mouse down - start moving
function onItemMouseDown(e) {
  // Ignore right clicks
  if (e.button === 2) return;

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
      // Check if dropping on an existing item to combine
      const dropTarget = findItemAtPosition(e.clientX, e.clientY, null);
      if (dropTarget) {
        // Spawn the element first, then try to combine
        const spawnedItem = game.spawnElement(dragData.elementId, x, y);
        if (spawnedItem) {
          const result = game.combineItems(spawnedItem.id, dropTarget);
          if (!result) {
            // No recipe - element already spawned, leave it there
          }
        }
      } else {
        game.spawnElement(dragData.elementId, x, y);
      }
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
