import { buildSpecialRow, opts, CCI_CONFIG, CoolItemData } from './core.js';

function injectArtifactStyles() {
  if (document.getElementById('cci-artifact-dynamic-styles')) return;
  const style = document.createElement('style');
  style.id = 'cci-artifact-dynamic-styles';
  style.textContent = `
    .cci-effects-section { gap: 16px !important; }
    .cci-effects-list { gap: 16px !important; }
    .cci-effect-row { padding: 18px !important; gap: 16px !important; }
    .cci-effect-body { gap: 16px !important; }
    .cci-effect-header { gap: 16px !important; }
    .cci-effect-special .cci-special-dropzone { min-height: 64px !important; padding: 10px !important; }
    .cci-effect-depletion select {
      background: linear-gradient(180deg, rgba(40,25,60,0.9) 0%, rgba(25,15,40,0.95) 100%) !important;
      border: 2px solid rgba(192,132,252,0.6) !important;
      border-radius: 6px !important;
      color: #ffffff !important;
      font-size: 0.9em !important;
      font-weight: 500 !important;
      padding: 5px 28px 5px 10px !important;
      height: 34px !important;
      min-width: 110px !important;
      appearance: none !important;
      -webkit-appearance: none !important;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 12 12'%3E%3Cpath fill='%23c084fc' d='M6 8L1 3h10z'/%3E%3C/svg%3E") !important;
      background-repeat: no-repeat !important;
      background-position: right 8px center !important;
      cursor: pointer !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4) !important;
    }
    .cci-effect-depletion select:hover {
      border-color: #c084fc !important;
      box-shadow: 0 2px 12px rgba(192,132,252,0.2) !important;
    }
    .cci-effect-depleted input[type="checkbox"] {
      appearance: none !important;
      -webkit-appearance: none !important;
      width: 22px !important;
      height: 22px !important;
      border: 2px solid rgba(192,132,252,0.6) !important;
      border-radius: 5px !important;
      background: linear-gradient(180deg, rgba(40,25,60,0.9) 0%, rgba(25,15,40,0.95) 100%) !important;
      cursor: pointer !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4) !important;
    }
    .cci-effect-depleted input[type="checkbox"]:checked {
      background: linear-gradient(180deg, #a855f7 0%, #7c3aed 100%) !important;
      border-color: #c084fc !important;
      box-shadow: 0 0 10px rgba(192,132,252,0.3) !important;
    }
    .cci-effect-depleted input[type="checkbox"]:checked::after {
      content: '';
      position: absolute;
      inset: 3px;
      background: white;
      border-radius: 2px;
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    }
  `;
  document.head.appendChild(style);
}

export function buildArtifactPanel(item, isGM) {
  injectArtifactStyles();
  const data = CoolItemData.get(item);
  const sys = item.system || {};

  const rarity = data.rarity || 'common';
  const level = data.level ?? '';
  const form = data.form || '';
  const position = data.position || 'none';
  const price = data.price ?? '';
  const coin = data.coin || 'gp';
  const size = data.size || 'medium';
  const flavor = data.flavor || '';
  const description = sys.description || '';
  const effects = data.effects || [];

  const panel = document.createElement('div');
  panel.className = 'cci-cool-panel cci-artifact-panel';
  if (!isGM) panel.classList.add('cci-player-view');

  const bgImg = document.createElement('div');
  bgImg.className = 'cci-bg-image';
  bgImg.style.backgroundImage = `url("${item.img || 'icons/svg/mystery-man.svg'}")`;
  panel.appendChild(bgImg);

  const topRow = document.createElement('div');
  topRow.className = 'cci-row cci-top-row';
  topRow.innerHTML = `
    <div class="cci-image-wrap">
      <div class="cci-image-glow"></div>
      <img class="cci-item-img" src="${item.img || 'icons/svg/mystery-man.svg'}" alt="${item.name}">
      <div class="cci-image-ring"></div>
    </div>
    <div class="cci-info-block">
      ${isGM
        ? `<input type="text" name="name" value="${item.name}" class="cci-name-input" placeholder="Artifact Name">`
        : `<div class="cci-name-display">${item.name}</div>`
      }
      <div class="cci-info-fields">
        <div class="cci-field-pair">
          <label>Rarity</label>
          ${isGM
            ? `<select data-prop="rarity">${opts(CCI_CONFIG.rarity, rarity)}</select>`
            : `<div class="cci-readonly cci-rarity-badge" style="--rarity-color:${CCI_CONFIG.rarity[rarity]?.color}">${CCI_CONFIG.rarity[rarity]?.label}</div>`
          }
        </div>
        <div class="cci-field-pair">
          <label>Level</label>
          ${isGM
            ? `<input type="number" data-prop="level" value="${level}" min="0" max="10" placeholder="—" class="cci-level-input">`
            : `<div class="cci-readonly">${level !== '' ? level : '—'}</div>`
          }
        </div>
      </div>
    </div>
  `;
  panel.appendChild(topRow);

  const midRow = document.createElement('div');
  midRow.className = 'cci-row cci-mid-row';

  const formHtml = `
    <div class="cci-stat">
      <label>Form</label>
      ${isGM
        ? `<input type="text" data-prop="form" value="${form}" placeholder="e.g. Crystal Orb" class="cci-form-input">`
        : `<div class="cci-readonly">${form || '—'}</div>`
      }
    </div>
  `;

  const positionHtml = `
    <div class="cci-stat">
      <label>Position</label>
      ${isGM
        ? `<select data-prop="position">${opts(CCI_CONFIG.position, position)}</select>`
        : `<div class="cci-readonly">${CCI_CONFIG.position[position]}</div>`
      }
    </div>
  `;

  const priceHtml = `
    <div class="cci-stat">
      <label>Price</label>
      <div class="cci-price-row">
        ${isGM
          ? `<input type="number" data-prop="price" value="${price}" min="0" placeholder="0" class="cci-price-amount">`
          : `<div class="cci-readonly cci-price-amount">${price || '—'}</div>`
        }
        ${isGM
          ? `<select data-prop="coin" class="cci-coin-type">${opts(CCI_CONFIG.coin, coin)}</select>`
          : `<div class="cci-readonly cci-coin-type">${CCI_CONFIG.coin[coin]}</div>`
        }
      </div>
    </div>
  `;

  const sizeCfg = CCI_CONFIG.size[size];
  const sizeTooltip = `Dimensions: ${sizeCfg.dims} • Weight: ${sizeCfg.weight} • ${sizeCfg.desc} • e.g. ${sizeCfg.examples}`;
  const sizeHtml = `
    <div class="cci-stat">
      <label>Size</label>
      ${isGM
        ? `<select data-prop="size" title="${sizeTooltip}" class="cci-size-select">${opts(CCI_CONFIG.size, size)}</select>`
        : `<div class="cci-readonly cci-size-badge" title="${sizeTooltip}">${sizeCfg.label}</div>`
      }
    </div>
  `;

  midRow.innerHTML = `<div class="cci-stats-block">${formHtml}${positionHtml}${priceHtml}${sizeHtml}</div>`;
  panel.appendChild(midRow);

  const effectsSection = document.createElement('div');
  effectsSection.className = 'cci-row cci-effects-section';
  effectsSection.innerHTML = `
    <div class="cci-effects-header">
      <label>Effects <span class="cci-hint">(${effects.length})</span></label>
      ${isGM ? `<button type="button" class="cci-add-effect" title="Add Effect"><i class="fas fa-plus"></i></button>` : ''}
    </div>
    <div class="cci-effects-list">
      ${effects.length > 0
        ? effects.map((eff, idx) => renderEffectRow(eff, idx, isGM)).join('')
        : (isGM ? '<div class="cci-drop-hint">No effects yet. Click "Add Effect" to create one.</div>' : '')
      }
    </div>
  `;
  panel.appendChild(effectsSection);

  const descRow = document.createElement('div');
  descRow.className = 'cci-row cci-desc-row';
  if (isGM) {
    descRow.innerHTML = `
      <label>Description</label>
      <div class="cci-wysiwyg-toolbar">
        <button type="button" data-cmd="bold" title="Bold"><i class="fas fa-bold"></i></button>
        <button type="button" data-cmd="italic" title="Italic"><i class="fas fa-italic"></i></button>
        <button type="button" data-cmd="underline" title="Underline"><i class="fas fa-underline"></i></button>
        <button type="button" data-cmd="strikeThrough" title="Strikethrough"><i class="fas fa-strikethrough"></i></button>
        <span class="cci-wysiwyg-sep"></span>
        <button type="button" data-cmd="insertUnorderedList" title="Bullet List"><i class="fas fa-list-ul"></i></button>
        <button type="button" data-cmd="insertOrderedList" title="Numbered List"><i class="fas fa-list-ol"></i></button>
        <span class="cci-wysiwyg-sep"></span>
        <button type="button" data-cmd="justifyLeft" title="Align Left"><i class="fas fa-align-left"></i></button>
        <button type="button" data-cmd="justifyCenter" title="Align Center"><i class="fas fa-align-center"></i></button>
        <button type="button" data-cmd="justifyRight" title="Align Right"><i class="fas fa-align-right"></i></button>
      </div>
      <div class="cci-wysiwyg" contenteditable="true" data-prop="description">${description}</div>
    `;
  } else {
    descRow.innerHTML = `
      <label>Description</label>
      <div class="cci-description-render">${description}</div>
    `;
  }
  panel.appendChild(descRow);

  const flavorRow = document.createElement('div');
  flavorRow.className = 'cci-flavor-text';
  if (isGM) {
    flavorRow.innerHTML = `
      <span class="cci-flavor-label">Flavor</span>
      <input type="text" data-prop="flavor" value="${flavor}" placeholder="Flavor text...">
    `;
  } else if (flavor) {
    flavorRow.innerHTML = `
      <span class="cci-flavor-label">Flavor</span>
      <span class="cci-flavor-display">${flavor}</span>
    `;
  }
  if (isGM || flavor) panel.appendChild(flavorRow);

  return panel;
}

function renderEffectRow(effect, index, isGM) {
  const specialAbilities = effect.specialAbilities || [];
  const desc = effect.description || '';
  return `
    <div class="cci-effect-row" data-effect-index="${index}" data-effect-id="${effect.id || index}">
      <div class="cci-effect-header">
        ${isGM
          ? `<input type="text" data-effect-prop="name" value="${effect.name || ''}" placeholder="Effect name..." class="cci-effect-name">`
          : `<div class="cci-effect-name-readonly">${effect.name || 'Unnamed Effect'}</div>`
        }
        ${isGM ? `<button type="button" class="cci-remove-effect" data-index="${index}"><i class="fas fa-trash"></i></button>` : ''}
      </div>
      <div class="cci-effect-body">
        <div class="cci-effect-special">
          <label>Special <span class="cci-hint">(drop abilities here)</span></label>
          <div class="cci-special-dropzone" data-effect-drop="${index}">
            ${specialAbilities.length > 0
              ? specialAbilities.map(a => `
                <div class="cci-ability-icon" data-ability-id="${a.id}" title="${a.name}">
                  <img src="${a.img}" alt="${a.name}">
                  ${isGM ? `<button class="cci-remove-ability" data-id="${a.id}">×</button>` : ''}
                </div>
              `).join('')
              : (isGM ? '<div class="cci-drop-hint">Drag abilities here</div>' : '')
            }
          </div>
        </div>
        <div class="cci-effect-desc">
          ${isGM
            ? `<textarea data-effect-prop="description" placeholder="Effect description..." class="cci-effect-textarea">${desc}</textarea>`
            : `<div class="cci-effect-desc-render">${desc}</div>`
          }
        </div>
        <div class="cci-effect-meta">
          <div class="cci-effect-depletion">
            <label>Depletion</label>
            ${isGM
              ? `<select data-effect-prop="depletion">${opts(CCI_CONFIG.depletion, effect.depletion || 'd6')}</select>`
              : `<div class="cci-readonly">${CCI_CONFIG.depletion[effect.depletion || 'd6']}</div>`
            }
          </div>
          <div class="cci-effect-depleted">
            <label>Depleted</label>
            ${isGM
              ? `<input type="checkbox" data-effect-prop="depleted" ${effect.depleted ? 'checked' : ''}>`
              : `<div class="cci-readonly">${effect.depleted ? 'Yes' : 'No'}</div>`
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

export function rebuildArtifactEffects(panel, item, isGM) {
  const data = CoolItemData.get(item);
  const effects = data.effects || [];
  
  const effectsList = panel.querySelector('.cci-effects-list');
  const effectsHeader = panel.querySelector('.cci-effects-header label');
  
  if (effectsHeader) {
    effectsHeader.innerHTML = `Effects <span class="cci-hint">(${effects.length})</span>`;
  }
  
  if (effectsList) {
    effectsList.innerHTML = effects.length > 0
      ? effects.map((eff, idx) => renderEffectRow(eff, idx, isGM)).join('')
      : (isGM ? '<div class="cci-drop-hint">No effects yet. Click "Add Effect" to create one.</div>' : '');
  }
}

export function bindArtifactEvents(panel, item, isGM) {
  // Add effect button
  const addBtn = panel.querySelector('.cci-add-effect');
  if (addBtn && isGM) {
    addBtn.addEventListener('click', async () => {
      const data = CoolItemData.get(item);
      const effects = data.effects || [];
      effects.push({
        id: `effect_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: '',
        description: '',
        depletion: 'd6',
        depleted: false,
        specialAbilities: []
      });
      await CoolItemData.set(item, 'effects', effects);
      rebuildArtifactEffects(panel, item, isGM);
      bindArtifactEffectEvents(panel, item, isGM);
    });
  }

  bindArtifactEffectEvents(panel, item, isGM);
}

function bindArtifactEffectEvents(panel, item, isGM) {
  // Effect property changes
  panel.querySelectorAll('[data-effect-prop]').forEach(input => {
    input.addEventListener('change', async (e) => {
      const effectRow = input.closest('.cci-effect-row');
      const effectIdx = parseInt(effectRow.dataset.effectIndex);
      const prop = input.dataset.effectProp;
      
      const data = CoolItemData.get(item);
      const effects = data.effects || [];
      if (!effects[effectIdx]) return;
      
      let value = e.target.value;
      if (e.target.type === 'checkbox') value = e.target.checked;
      
      effects[effectIdx][prop] = value;
      await CoolItemData.set(item, 'effects', effects);
    });
  });

  // Remove effect buttons
  panel.querySelectorAll('.cci-remove-effect').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.index);
      const data = CoolItemData.get(item);
      const effects = data.effects || [];
      effects.splice(idx, 1);
      await CoolItemData.set(item, 'effects', effects);
      rebuildArtifactEffects(panel, item, isGM);
      bindArtifactEffectEvents(panel, item, isGM);
    });
  });

  // Drop zones for effect special abilities
  panel.querySelectorAll('[data-effect-drop]').forEach(dropzone => {
    if (!isGM) return;
    const effectIdx = parseInt(dropzone.dataset.effectDrop);
    
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('cci-dragover'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('cci-dragover'));
    dropzone.addEventListener('drop', async (e) => {
      e.preventDefault();
      dropzone.classList.remove('cci-dragover');

      let data;
      try { data = JSON.parse(e.dataTransfer.getData('text/plain')); } catch { return; }
      if (!data || data.type !== 'Item') return;

      const droppedItem = await fromUuid(data.uuid);
      if (!droppedItem || droppedItem.type !== 'ability') {
        ui.notifications.warn('Only Ability items can be dropped here.');
        return;
      }

      const itemData = CoolItemData.get(item);
      const effects = itemData.effects || [];
      if (!effects[effectIdx]) return;
      
      const abilities = effects[effectIdx].specialAbilities || [];
      if (abilities.find(a => a.id === droppedItem.id)) return;

      abilities.push({ id: droppedItem.id, name: droppedItem.name, img: droppedItem.img, uuid: data.uuid });
      effects[effectIdx].specialAbilities = abilities;
      await CoolItemData.set(item, 'effects', effects);
      
      rebuildArtifactEffects(panel, item, isGM);
      bindArtifactEffectEvents(panel, item, isGM);
    });

    // Remove ability buttons within effects
    dropzone.querySelectorAll('.cci-remove-ability').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const itemData = CoolItemData.get(item);
        const effects = itemData.effects || [];
        if (!effects[effectIdx]) return;
        effects[effectIdx].specialAbilities = (effects[effectIdx].specialAbilities || []).filter(a => a.id !== id);
        await CoolItemData.set(item, 'effects', effects);
        rebuildArtifactEffects(panel, item, isGM);
        bindArtifactEffectEvents(panel, item, isGM);
      });
    });
  });
}
