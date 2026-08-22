import { buildSpecialRow, opts, CCI_CONFIG, CoolItemData } from './core.js';

const RANGE_OPTIONS = {
  immediate: 'Immediate',
  short: 'Short',
  long: 'Long',
  veryLong: 'Very Long'
};

function escapeHtml(str) {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function buildAbilityPanel(item, isGM) {
  const data = CoolItemData.get(item);
  const sys = item.system || {};

  const abilityType = data.abilityType || 'mundane';
  const activation = data.activation || 'action';
  const durationValue = data.durationValue ?? '';
  const durationUnit = data.durationUnit || 'instant';
  const poolCostPool = data.poolCostPool || 'none';
  const poolCost = data.poolCost ?? '';
  const flavor = data.flavor || '';
  const description = sys.description || '';

  // Ability mode flags
  const attack = data.attack || false;
  const defense = data.defense || false;
  const utility = data.utility || false;

  // Attack data
  const attackBonus = data.attackBonus ?? '';
  const damage = data.damage || '';
  const attackRange = data.attackRange || 'immediate';
  const attackAmmo = data.attackAmmo || false;
  const attackAmmoItem = data.attackAmmoItem || null;
  const attackDuration = data.attackDuration || '';

  // Defense data
  const defenseArmor = data.defenseArmor ?? '';
  const defensePenalty = data.defensePenalty ?? '';

  const panel = document.createElement('div');
  panel.className = 'cci-cool-panel cci-ability-panel';
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
      <img class="cci-item-img" src="${item.img || 'icons/svg/mystery-man.svg'}" alt="${escapeHtml(item.name)}">
      <div class="cci-image-ring"></div>
    </div>
    <div class="cci-info-block">
      ${isGM
        ? `<input type="text" name="name" value="${escapeHtml(item.name)}" class="cci-name-input" placeholder="Ability Name">`
        : `<div class="cci-name-display">${escapeHtml(item.name)}</div>`
      }
      <div class="cci-info-fields">
        <div class="cci-field-pair">
          <label>Type</label>
          ${isGM
            ? `<select data-prop="abilityType">${opts(CCI_CONFIG.abilityType, abilityType)}</select>`
            : `<div class="cci-readonly">${CCI_CONFIG.abilityType[abilityType]}</div>`
          }
        </div>
        <div class="cci-field-pair">
          <label>Activation</label>
          ${isGM
            ? `<select data-prop="activation">${opts(CCI_CONFIG.activation, activation)}</select>`
            : `<div class="cci-readonly">${CCI_CONFIG.activation[activation]}</div>`
          }
        </div>
      </div>
    </div>
  `;
  panel.appendChild(topRow);

  const midRow = document.createElement('div');
  midRow.className = 'cci-row cci-mid-row';

  const poolCostHtml = `
    <div class="cci-stat">
      <label>Pool Cost</label>
      <div class="cci-poolcost-row">
        ${isGM
          ? `<select data-prop="poolCostPool">${opts(CCI_CONFIG.pool, poolCostPool)}</select>`
          : `<div class="cci-readonly">${CCI_CONFIG.pool[poolCostPool]}</div>`
        }
        ${isGM
          ? `<input type="number" data-prop="poolCost" value="${poolCost}" min="0" placeholder="Cost" class="cci-poolcost-value">`
          : `<div class="cci-readonly cci-poolcost-value">${poolCost !== '' ? poolCost : '—'}</div>`
        }
      </div>
    </div>
  `;

  const durationHtml = `
    <div class="cci-stat">
      <label>Duration</label>
      <div class="cci-duration-row">
        ${isGM
          ? `<input type="number" data-prop="durationValue" value="${durationValue}" min="0" placeholder="—" class="cci-duration-value">`
          : `<div class="cci-readonly cci-duration-value">${durationValue !== '' ? durationValue : '—'}</div>`
        }
        ${isGM
          ? `<select data-prop="durationUnit">${opts(CCI_CONFIG.durationUnit, durationUnit)}</select>`
          : `<div class="cci-readonly">${CCI_CONFIG.durationUnit[durationUnit]}</div>`
        }
      </div>
    </div>
  `;

  midRow.innerHTML = `<div class="cci-stats-block">${poolCostHtml}${durationHtml}</div>`;
  panel.appendChild(midRow);

  // === ABILITY MODE CHECKBOXES ===
  const modeRow = document.createElement('div');
  modeRow.className = 'cci-row cci-mode-row';
  modeRow.innerHTML = `
    <div class="cci-mode-label">Mode</div>
    <div class="cci-mode-checkboxes">
      <label class="cci-mode-checkbox ${attack ? 'cci-mode-active' : ''}" data-mode="attack">
        <input type="checkbox" data-mode-toggle="attack" ${attack ? 'checked' : ''} ${!isGM ? 'disabled' : ''}>
        <span class="cci-mode-icon cci-mode-attack"><i class="fas fa-sword"></i></span>
        <span class="cci-mode-text">Attack</span>
      </label>
      <label class="cci-mode-checkbox ${defense ? 'cci-mode-active' : ''}" data-mode="defense">
        <input type="checkbox" data-mode-toggle="defense" ${defense ? 'checked' : ''} ${!isGM ? 'disabled' : ''}>
        <span class="cci-mode-icon cci-mode-defense"><i class="fas fa-shield-alt"></i></span>
        <span class="cci-mode-text">Defense</span>
      </label>
      <label class="cci-mode-checkbox ${utility ? 'cci-mode-active' : ''}" data-mode="utility">
        <input type="checkbox" data-mode-toggle="utility" ${utility ? 'checked' : ''} ${!isGM ? 'disabled' : ''}>
        <span class="cci-mode-icon cci-mode-utility"><i class="fas fa-star"></i></span>
        <span class="cci-mode-text">Utility</span>
      </label>
    </div>
  `;
  panel.appendChild(modeRow);

  // === ATTACK SECTION (always rendered, toggled via CSS) ===
  const attackSection = document.createElement('div');
  attackSection.className = 'cci-row cci-attack-section';
  attackSection.style.display = attack ? '' : 'none';
  attackSection.dataset.section = 'attack';
  attackSection.innerHTML = `
    <div class="cci-section-header cci-attack-header">
      <i class="fas fa-sword"></i> Attack
    </div>
    <div class="cci-attack-grid">
      <div class="cci-attack-field">
        <label>Bonus / Penalty</label>
        ${isGM
          ? `<input type="number" data-prop="attackBonus" value="${attackBonus}" placeholder="0" class="cci-attack-bonus">`
          : `<div class="cci-readonly">${attackBonus !== '' ? (attackBonus > 0 ? '+' + attackBonus : attackBonus) : '—'}</div>`
        }
      </div>
      <div class="cci-attack-field">
        <label>Damage</label>
        ${isGM
          ? `<input type="text" data-prop="damage" value="${escapeHtml(damage)}" placeholder="e.g. 2d6+3" class="cci-attack-damage">`
          : `<div class="cci-readonly">${escapeHtml(damage) || '—'}</div>`
        }
      </div>
      <div class="cci-attack-field">
        <label>Range</label>
        ${isGM
          ? `<select data-prop="attackRange">${opts(RANGE_OPTIONS, attackRange)}</select>`
          : `<div class="cci-readonly">${RANGE_OPTIONS[attackRange]}</div>`
        }
      </div>
      <div class="cci-attack-field">
        <label>Duration</label>
        ${isGM
          ? `<input type="text" data-prop="attackDuration" value="${escapeHtml(attackDuration)}" placeholder="e.g. 1 round" class="cci-attack-duration">`
          : `<div class="cci-readonly">${escapeHtml(attackDuration) || '—'}</div>`
        }
      </div>
    </div>
    <div class="cci-attack-ammo-row">
      <label class="cci-ammo-toggle">
        <input type="checkbox" data-ammo-toggle ${attackAmmo ? 'checked' : ''} ${!isGM ? 'disabled' : ''}>
        <span class="cci-ammo-toggle-track">
          <span class="cci-ammo-toggle-thumb"></span>
        </span>
        <span class="cci-ammo-toggle-label">Uses Ammo</span>
      </label>
      <div class="cci-ammo-dropzone ${attackAmmo ? '' : 'cci-hidden'}" data-drop="ammo">
        ${attackAmmoItem
          ? `<div class="cci-ammo-item" data-ammo-id="${attackAmmoItem.id}" title="${escapeHtml(attackAmmoItem.name)}">
              <img src="${attackAmmoItem.img}" alt="${escapeHtml(attackAmmoItem.name)}">
              ${isGM ? `<button class="cci-remove-ammo" data-id="${attackAmmoItem.id}"><i class="fas fa-times"></i></button>` : ''}
            </div>`
          : (isGM ? '<div class="cci-drop-hint">Drag ammo item here</div>' : '<div class="cci-readonly">—</div>')
        }
      </div>
    </div>
  `;
  panel.appendChild(attackSection);

  // === DEFENSE SECTION (always rendered, toggled via CSS) ===
  const defenseSection = document.createElement('div');
  defenseSection.className = 'cci-row cci-defense-section';
  defenseSection.style.display = defense ? '' : 'none';
  defenseSection.dataset.section = 'defense';
  defenseSection.innerHTML = `
    <div class="cci-section-header cci-defense-header">
      <i class="fas fa-shield-alt"></i> Defense
    </div>
    <div class="cci-defense-grid">
      <div class="cci-defense-field">
        <label>Armor Value</label>
        ${isGM
          ? `<input type="number" data-prop="defenseArmor" value="${defenseArmor}" min="0" placeholder="0" class="cci-defense-armor">`
          : `<div class="cci-readonly">${defenseArmor !== '' ? defenseArmor : '—'}</div>`
        }
      </div>
      <div class="cci-defense-field">
        <label>Penalty</label>
        ${isGM
          ? `<input type="number" data-prop="defensePenalty" value="${defensePenalty}" placeholder="0" class="cci-defense-penalty">`
          : `<div class="cci-readonly">${defensePenalty !== '' ? defensePenalty : '—'}</div>`
        }
      </div>
    </div>
  `;
  panel.appendChild(defenseSection);

  // === UTILITY SECTION (always rendered, toggled via CSS) ===
  const utilitySection = document.createElement('div');
  utilitySection.className = 'cci-row cci-utility-section';
  utilitySection.style.display = utility && !attack && !defense ? '' : 'none';
  utilitySection.dataset.section = 'utility';
  utilitySection.innerHTML = `
    <div class="cci-section-header cci-utility-header">
      <i class="fas fa-star"></i> Utility
    </div>
    <div class="cci-utility-hint">This ability is marked as Utility.</div>
  `;
  panel.appendChild(utilitySection);

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
      <input type="text" data-prop="flavor" value="${escapeHtml(flavor)}" placeholder="Flavor text...">
    `;
  } else if (flavor) {
    flavorRow.innerHTML = `
      <span class="cci-flavor-label">Flavor</span>
      <span class="cci-flavor-display">${escapeHtml(flavor)}</span>
    `;
  }
  if (isGM || flavor) panel.appendChild(flavorRow);

  return panel;
}

export function bindAbilityEvents(panel, item, isGM) {
  if (!isGM) return;

  // Mode checkbox change handlers — toggle visibility WITHOUT re-rendering
  panel.querySelectorAll('[data-mode-toggle]').forEach(cb => {
    cb.addEventListener('change', async (e) => {
      const mode = cb.dataset.modeToggle;
      const isChecked = cb.checked;

      // Save data silently (no re-render)
      await CoolItemData.set(item, mode, isChecked);

      // Toggle checkbox visual state
      const label = cb.closest('.cci-mode-checkbox');
      if (label) {
        if (isChecked) label.classList.add('cci-mode-active');
        else label.classList.remove('cci-mode-active');
      }

      // Toggle section visibility
      const section = panel.querySelector(`[data-section="${mode}"]`);
      if (section) {
        section.style.display = isChecked ? '' : 'none';
      }

      // Special case: utility only shows if attack and defense are both OFF
      if (mode === 'attack' || mode === 'defense') {
        const attackCb = panel.querySelector('[data-mode-toggle="attack"]');
        const defenseCb = panel.querySelector('[data-mode-toggle="defense"]');
        const utilityCb = panel.querySelector('[data-mode-toggle="utility"]');
        const utilitySection = panel.querySelector('[data-section="utility"]');

        const attackOn = attackCb?.checked || false;
        const defenseOn = defenseCb?.checked || false;
        const utilityOn = utilityCb?.checked || false;

        if (utilitySection) {
          utilitySection.style.display = (utilityOn && !attackOn && !defenseOn) ? '' : 'none';
        }
      }
    });
  });

  // Ammo toggle — show/hide ammo dropzone without re-render
  const ammoCb = panel.querySelector('[data-ammo-toggle]');
  if (ammoCb) {
    ammoCb.addEventListener('change', async (e) => {
      const isChecked = e.target.checked;
      await CoolItemData.set(item, 'attackAmmo', isChecked);

      const dropzone = panel.querySelector('[data-drop="ammo"]');
      if (dropzone) {
        dropzone.classList.toggle('cci-hidden', !isChecked);
      }
    });
  }

  // Ammo dropzone
  const ammoDropzone = panel.querySelector('[data-drop="ammo"]');
  if (ammoDropzone) {
    ammoDropzone.addEventListener('dragover', (e) => { e.preventDefault(); ammoDropzone.classList.add('cci-dragover'); });
    ammoDropzone.addEventListener('dragleave', () => ammoDropzone.classList.remove('cci-dragover'));
    ammoDropzone.addEventListener('drop', async (e) => {
      e.preventDefault();
      ammoDropzone.classList.remove('cci-dragover');

      let data;
      try { data = JSON.parse(e.dataTransfer.getData('text/plain')); } catch { return; }
      if (!data || data.type !== 'Item') return;

      const droppedItem = await fromUuid(data.uuid);
      if (!droppedItem || droppedItem.type !== 'ammo') {
        ui.notifications.warn('Only Ammo items can be dropped here.');
        return;
      }

      await CoolItemData.set(item, 'attackAmmoItem', {
        id: droppedItem.id,
        name: droppedItem.name,
        img: droppedItem.img,
        uuid: data.uuid
      });

      // Update dropzone content without re-rendering
      ammoDropzone.innerHTML = `
        <div class="cci-ammo-item" data-ammo-id="${droppedItem.id}" title="${escapeHtml(droppedItem.name)}">
          <img src="${droppedItem.img}" alt="${escapeHtml(droppedItem.name)}">
          <button class="cci-remove-ammo" data-id="${droppedItem.id}"><i class="fas fa-times"></i></button>
        </div>
      `;
      bindAmmoRemoveButton(ammoDropzone, item);
    });

    bindAmmoRemoveButton(ammoDropzone, item);
  }
}

function bindAmmoRemoveButton(dropzone, item) {
  const removeBtn = dropzone.querySelector('.cci-remove-ammo');
  if (!removeBtn) return;
  removeBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    await CoolItemData.set(item, 'attackAmmoItem', null);
    dropzone.innerHTML = '<div class="cci-drop-hint">Drag ammo item here</div>';
  });
}
