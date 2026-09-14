/**
 * Cypher Cool Items — Attack Panel
 * Red-themed panel for attack items
 */

import { CoolItemData, CCI_CONFIG, MODULE_ID } from './core.js';
import { buildSpecialRow, opts } from './core.js';

export function buildAttackPanel(item, isGM) {
  const data = CoolItemData.get(item);
  const sys = item.system || {};
  const rarity = data.rarity || 'common';
  const price = data.price ?? '';
  const coin = data.coin || 'gp';
  const size = data.size || 'medium';
  const flavor = data.flavor || '';
  const description = data.description || sys.description || '';

  const attackType = data.attackType || 'melee';
  const level = data.level ?? '';
  const position = data.position || 'hands';
  const attackBonus = data.attackBonus ?? '';
  const damage = data.damage || '';
  const range = data.range || 'immediate';
  const duration = data.duration || '';
  const pool = data.pool || 'none';
  const poolValue = data.poolValue ?? '';
  const ammoEnabled = data.ammoEnabled || false;
  const ammoItem = data.ammoItem || null;
  const abilityItem = data.abilityItem || null;

  const panel = document.createElement('div');
  panel.className = 'cci-cool-panel cci-attack-panel';
  if (!isGM) panel.classList.add('cci-player-view');

  const bgImg = document.createElement('div');
  bgImg.className = 'cci-bg-image';
  bgImg.style.backgroundImage = `url("${item.img || 'icons/svg/mystery-man.svg'}")`;
  panel.appendChild(bgImg);

  /* === TOP ROW === */
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
        ? `<input type="text" name="name" value="${item.name}" class="cci-name-input" placeholder="Attack Name">`
        : `<div class="cci-name-display">${item.name}</div>`
      }
      <div class="cci-info-fields">
        <div class="cci-field-pair">
          <label>Type</label>
          ${isGM
            ? `<select data-prop="attackType">${opts(CCI_CONFIG.attackType, attackType)}</select>`
            : `<div class="cci-readonly">${CCI_CONFIG.attackType[attackType]}</div>`
          }
        </div>
        <div class="cci-field-pair">
          <label>Rarity</label>
          ${isGM
            ? `<select data-prop="rarity">${opts(CCI_CONFIG.rarity, rarity)}</select>`
            : `<div class="cci-readonly cci-rarity-badge" style="--rarity-color:${CCI_CONFIG.rarity[rarity]?.color}">${CCI_CONFIG.rarity[rarity]?.label}</div>`
          }
        </div>
      </div>
    </div>
  `;
  panel.appendChild(topRow);

  /* === MID ROW === */
  const midRow = document.createElement('div');
  midRow.className = 'cci-row cci-mid-row';

  const levelHtml = `
    <div class="cci-stat">
      <label>Level</label>
      ${isGM
        ? `<input type="number" data-prop="level" value="${level}" min="0" max="30" placeholder="0">`
        : `<div class="cci-readonly">${level || '—'}</div>`
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

  midRow.innerHTML = `<div class="cci-stats-block">${levelHtml}${positionHtml}${priceHtml}${sizeHtml}</div>`;
  panel.appendChild(midRow);

  /* === ATTACK DYNAMIC SECTION === */
  const attackSection = document.createElement('div');
  attackSection.className = 'cci-row cci-attack-dynamic';

  // ABILITY section
  const abilitySection = document.createElement('div');
  abilitySection.className = `cci-attack-ability-section ${attackType === 'ability' ? '' : 'cci-hidden'}`;
  abilitySection.innerHTML = `
    <div class="cci-section-header cci-ability-drop-header"><i class="fas fa-bolt"></i> Ability</div>
    ${isGM
      ? `<div class="cci-ability-dropzone" data-drop="ability">
          ${abilityItem
            ? `<div class="cci-ability-dropped" data-ability-id="${abilityItem.id}" title="${abilityItem.name}">
                <img src="${abilityItem.img}" alt="${abilityItem.name}">
                <span>${abilityItem.name}</span>
                <button class="cci-remove-ability" data-id="${abilityItem.id}">×</button>
               </div>`
            : '<div class="cci-drop-hint">Drag an Ability item here</div>'
          }
         </div>`
      : (abilityItem
          ? `<div class="cci-ability-dropped-readonly">
               <img src="${abilityItem.img}" alt="${abilityItem.name}">
               <span>${abilityItem.name}</span>
             </div>`
          : '<div class="cci-drop-hint">No ability linked</div>')
    }
    <div class="cci-ability-values">
      ${renderAbilityValues(abilityItem, isGM)}
    </div>
  `;
  attackSection.appendChild(abilitySection);

  // MELEE section
  const meleeSection = document.createElement('div');
  meleeSection.className = `cci-attack-melee-section ${attackType === 'melee' ? '' : 'cci-hidden'}`;
  meleeSection.innerHTML = `
    <div class="cci-section-header cci-melee-header"><i class="fas fa-sword"></i> Melee</div>
    <div class="cci-attack-grid">
      <div class="cci-attack-field">
        <label>Bonus / Penalty</label>
        ${isGM
          ? `<input type="number" data-prop="attackBonus" value="${attackBonus}" placeholder="0">`
          : `<div class="cci-readonly">${attackBonus || '—'}</div>`
        }
      </div>
      <div class="cci-attack-field">
        <label>Damage</label>
        ${isGM
          ? `<input type="text" data-prop="damage" value="${damage}" placeholder="2d6">`
          : `<div class="cci-readonly">${damage || '—'}</div>`
        }
      </div>
    </div>
  `;
  attackSection.appendChild(meleeSection);

  // RANGED section
  const rangedSection = document.createElement('div');
  rangedSection.className = `cci-attack-ranged-section ${attackType === 'ranged' ? '' : 'cci-hidden'}`;
  rangedSection.innerHTML = `
    <div class="cci-section-header cci-ranged-header"><i class="fas fa-crosshairs"></i> Ranged</div>
    <div class="cci-attack-grid">
      <div class="cci-attack-field">
        <label>Bonus / Penalty</label>
        ${isGM
          ? `<input type="number" data-prop="attackBonus" value="${attackBonus}" placeholder="0">`
          : `<div class="cci-readonly">${attackBonus || '—'}</div>`
        }
      </div>
      <div class="cci-attack-field">
        <label>Damage</label>
        ${isGM
          ? `<input type="text" data-prop="damage" value="${damage}" placeholder="2d6">`
          : `<div class="cci-readonly">${damage || '—'}</div>`
        }
      </div>
      <div class="cci-attack-field">
        <label>Range</label>
        ${isGM
          ? `<select data-prop="range">${opts(CCI_CONFIG.range, range)}</select>`
          : `<div class="cci-readonly">${CCI_CONFIG.range[range]}</div>`
        }
      </div>
    </div>
    <div class="cci-ranged-ammo-row">
      <label class="cci-ranged-ammo-label"><i class="fas fa-box"></i> Ammo</label>
      <div class="cci-ranged-ammo-dropzone" data-drop="ammo">
        ${ammoItem
          ? `<div class="cci-ammo-item" data-ammo-id="${ammoItem.id}" title="${ammoItem.name}">
               <img src="${ammoItem.img}" alt="${ammoItem.name}">
               <span>${ammoItem.name}</span>
               ${isGM ? `<button class="cci-remove-ammo" data-id="${ammoItem.id}">×</button>` : ''}
             </div>`
          : (isGM ? '<div class="cci-drop-hint">Drag ammo item here</div>' : '<div class="cci-drop-hint">No ammo</div>')
        }
      </div>
    </div>
  `;
  attackSection.appendChild(rangedSection);

  panel.appendChild(attackSection);

  /* === DEFENSE ROLL (GM only) === */
  const defenseRoll = data.defenseRoll || [];
  if (isGM) {
    const defenseRollRow = document.createElement('div');
    defenseRollRow.className = 'cci-row cci-defense-roll-row';
    const poolOpts = [
      { key: 'might', label: 'Might', icon: 'fa-fist-raised' },
      { key: 'speed', label: 'Speed', icon: 'fa-running' },
      { key: 'intellect', label: 'Intellect', icon: 'fa-brain' },
      { key: 'effort', label: 'Effort', icon: 'fa-bolt' },
      { key: 'xp', label: 'XP', icon: 'fa-star' }
    ];
    defenseRollRow.innerHTML = `
      <label><i class="fas fa-shield-alt"></i> Defense Roll</label>
      <div class="cci-defense-roll-checkboxes">
        ${poolOpts.map(o => `
          <label class="cci-defense-roll-check ${defenseRoll.includes(o.key) ? 'cci-checked' : ''}" data-key="${o.key}">
            <input type="checkbox" data-defense-roll="${o.key}" ${defenseRoll.includes(o.key) ? 'checked' : ''}>
            <span class="cci-defense-roll-icon"><i class="fas ${o.icon}"></i></span>
            <span class="cci-defense-roll-label">${o.label}</span>
          </label>
        `).join('')}
      </div>
    `;
    panel.appendChild(defenseRollRow);
  }

  /* === SPECIAL ABILITIES === */
  const specialAbilities = data.specialAbilities || [];
  if (isGM || specialAbilities.length > 0) {
    const specialRow = document.createElement('div');
    specialRow.className = 'cci-row cci-special-row';
    specialRow.innerHTML = `
      <label>Special <span class="cci-hint">(drop abilities here)</span></label>
      <div class="cci-special-dropzone" data-drop="special">
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
    `;
    panel.appendChild(specialRow);
  }

  /* === EFFECTS === */
  const effects = data.effects || [];
  if (isGM || effects.length > 0) {
    const effectsRow = document.createElement('div');
    effectsRow.className = 'cci-row cci-effects-row';
    effectsRow.innerHTML = `
      <label>Effects <span class="cci-hint">(drop active effects here)</span></label>
      <div class="cci-effects-dropzone" data-drop="effects">
        ${effects.length > 0
          ? effects.map((eff, idx) => `
            <div class="cci-effect-item" data-effect-idx="${idx}" data-effect-id="${eff.id}">
              <div class="cci-effect-header">
                <span class="cci-effect-label">${eff.name}</span>
                ${isGM ? `<button class="cci-remove-effect" data-idx="${idx}">×</button>` : ''}
              </div>
              <div class="cci-effect-fields">
                <img src="${eff.img || 'icons/svg/aura.svg'}" alt="${eff.name}" class="cci-effect-icon">
                ${isGM ? `
                  <select class="cci-effect-target" data-idx="${idx}" title="Target">
                    ${opts(CCI_CONFIG.effectTarget, eff.target || 'pc')}
                  </select>
                  <select class="cci-effect-trigger" data-idx="${idx}" title="Trigger">
                    ${opts(CCI_CONFIG.effectTrigger, eff.trigger || 'automatic')}
                  </select>
                ` : `
                  <span class="cci-effect-tag">${CCI_CONFIG.effectTarget[eff.target || 'pc']}</span>
                  <span class="cci-effect-tag">${CCI_CONFIG.effectTrigger[eff.trigger || 'automatic']}</span>
                `}
              </div>
              ${isGM ? `
              <div class="cci-effect-resistance-row">
                <span class="cci-effect-res-label">RESISTANCE</span>
                <select class="cci-effect-resistance" data-idx="${idx}" title="Resistance Attribute">
                  ${opts({might:'Might',speed:'Speed',intellect:'Intellect'}, eff.resistance?.attribute || 'might')}
                </select>
                <span class="cci-effect-res-label">DIFFICULTY</span>
                <select class="cci-effect-res-difficulty" data-idx="${idx}" title="Resistance Difficulty">
                  ${Array.from({length:15},(_,i)=>`<option value="${i+1}" ${(eff.resistance?.difficulty ?? 1) === i+1 ? 'selected' : ''}>${i+1}</option>`).join('')}
                </select>
              </div>
              ` : ''}
            </div>
          `).join('')
          : (isGM ? '<div class="cci-drop-hint">Drag active effects here</div>' : '')
        }
      </div>
    `;
    panel.appendChild(effectsRow);
  }

  /* === DESCRIPTION === */
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

  /* === FLAVOR === */
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

function renderAbilityValues(abilityItem, isGM) {
  if (!abilityItem) return '';
  const vals = [
    { label: 'Bonus', value: abilityItem.attackBonus },
    { label: 'Damage', value: abilityItem.damage },
    { label: 'Range', value: abilityItem.range ? CCI_CONFIG.range[abilityItem.range] : '' },
    { label: 'Duration', value: abilityItem.duration },
    { label: 'Pool', value: abilityItem.pool ? `${abilityItem.pool} ${abilityItem.poolValue || ''}` : '' }
  ];
  return vals.map(v => `
    <div class="cci-ability-value">
      <span class="cci-ability-value-label">${v.label}</span>
      <span class="cci-ability-value-text">${v.value || '—'}</span>
    </div>
  `).join('');
}

/* ================================
   EVENT BINDING
   ================================ */

export function bindAttackEvents(panel, item, isGM) {
  // === DEFENSE ROLL CHECKBOXES ===
  panel.querySelectorAll('[data-defense-roll]').forEach(cb => {
    cb.addEventListener('change', async (e) => {
      const key = e.target.dataset.defenseRoll;
      const current = CoolItemData.get(item).defenseRoll || [];
      const set = new Set(current);
      if (e.target.checked) set.add(key);
      else set.delete(key);
      await CoolItemData.set(item, 'defenseRoll', Array.from(set));
      // Toggle visual active state
      const label = cb.closest('.cci-defense-roll-check');
      if (label) label.classList.toggle('cci-checked', e.target.checked);
    });
  });

  // === ATTACK TYPE CHANGE ===
  const typeSelect = panel.querySelector('[data-prop="attackType"]');
  if (typeSelect) {
    typeSelect.addEventListener('change', async (e) => {
      const newType = e.target.value;
      await CoolItemData.set(item, 'attackType', newType);
      // Toggle sections via CSS only — NO re-render!
      panel.querySelector('.cci-attack-ability-section').classList.toggle('cci-hidden', newType !== 'ability');
      panel.querySelector('.cci-attack-melee-section').classList.toggle('cci-hidden', newType !== 'melee');
      panel.querySelector('.cci-attack-ranged-section').classList.toggle('cci-hidden', newType !== 'ranged');
    });
  }

  // === ABILITY DROPZONE ===
  const abilityDropzone = panel.querySelector('.cci-ability-dropzone[data-drop="ability"]');
  if (abilityDropzone && isGM) {
    abilityDropzone.addEventListener('dragover', (e) => { e.preventDefault(); abilityDropzone.classList.add('cci-dragover'); });
    abilityDropzone.addEventListener('dragleave', () => abilityDropzone.classList.remove('cci-dragover'));
    abilityDropzone.addEventListener('drop', async (e) => {
      e.preventDefault();
      abilityDropzone.classList.remove('cci-dragover');
      let data;
      try { data = JSON.parse(e.dataTransfer.getData('text/plain')); } catch { return; }
      if (!data || data.type !== 'Item') return;
      const droppedItem = await fromUuid(data.uuid);
      if (!droppedItem || droppedItem.type !== 'ability') {
        ui.notifications.warn('Only Ability items can be dropped here.');
        return;
      }
      // Read ability data
      const abilityData = CoolItemData.get(droppedItem);
      const abilityItemData = {
        id: droppedItem.id,
        name: droppedItem.name,
        img: droppedItem.img,
        uuid: data.uuid,
        attackBonus: abilityData.attackBonus ?? '',
        damage: abilityData.damage || '',
        range: abilityData.range || '',
        duration: abilityData.duration || '',
        pool: abilityData.pool || 'none',
        poolValue: abilityData.poolValue ?? ''
      };
      await CoolItemData.set(item, 'abilityItem', abilityItemData);
      // Update UI without re-render
      const valuesContainer = panel.querySelector('.cci-ability-values');
      if (valuesContainer) valuesContainer.innerHTML = renderAbilityValues(abilityItemData, isGM);
      // Update dropzone content
      const dropContent = abilityDropzone.querySelector('.cci-ability-dropped, .cci-drop-hint');
      if (dropContent) {
        dropContent.outerHTML = `<div class="cci-ability-dropped" data-ability-id="${abilityItemData.id}" title="${abilityItemData.name}">
          <img src="${abilityItemData.img}" alt="${abilityItemData.name}">
          <span>${abilityItemData.name}</span>
          <button class="cci-remove-ability" data-id="${abilityItemData.id}">×</button>
        </div>`;
      }
      // Re-bind remove button
      const removeBtn = abilityDropzone.querySelector('.cci-remove-ability');
      if (removeBtn) {
        removeBtn.addEventListener('click', async (ev) => {
          ev.stopPropagation();
          await CoolItemData.set(item, 'abilityItem', null);
          const dc = abilityDropzone.querySelector('.cci-ability-dropped');
          if (dc) dc.outerHTML = '<div class="cci-drop-hint">Drag an Ability item here</div>';
          if (valuesContainer) valuesContainer.innerHTML = '';
        });
      }
    });
    // Remove ability button
    const removeAbilityBtn = abilityDropzone.querySelector('.cci-remove-ability');
    if (removeAbilityBtn) {
      removeAbilityBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await CoolItemData.set(item, 'abilityItem', null);
        const dc = abilityDropzone.querySelector('.cci-ability-dropped');
        if (dc) dc.outerHTML = '<div class="cci-drop-hint">Drag an Ability item here</div>';
        const valuesContainer = panel.querySelector('.cci-ability-values');
        if (valuesContainer) valuesContainer.innerHTML = '';
      });
    }
  }

  // === AMMO DROPZONE (ranged) ===
  const ammoDropzone = panel.querySelector('.cci-ranged-ammo-dropzone[data-drop="ammo"]');
  if (ammoDropzone && isGM) {
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
      const ammoData = { id: droppedItem.id, name: droppedItem.name, img: droppedItem.img, uuid: data.uuid };
      await CoolItemData.set(item, 'ammoItem', ammoData);
      const dropContent = ammoDropzone.querySelector('.cci-ammo-item, .cci-drop-hint');
      if (dropContent) {
        dropContent.outerHTML = `<div class="cci-ammo-item" data-ammo-id="${ammoData.id}" title="${ammoData.name}">
          <img src="${ammoData.img}" alt="${ammoData.name}">
          <span>${ammoData.name}</span>
          <button class="cci-remove-ammo" data-id="${ammoData.id}">×</button>
        </div>`;
      }
      const removeBtn = ammoDropzone.querySelector('.cci-remove-ammo');
      if (removeBtn) {
        removeBtn.addEventListener('click', async (ev) => {
          ev.stopPropagation();
          await CoolItemData.set(item, 'ammoItem', null);
          const dc = ammoDropzone.querySelector('.cci-ammo-item');
          if (dc) dc.outerHTML = '<div class="cci-drop-hint">Drag ammo item here</div>';
        });
      }
    });
    const removeAmmoBtn = ammoDropzone.querySelector('.cci-remove-ammo');
    if (removeAmmoBtn) {
      removeAmmoBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await CoolItemData.set(item, 'ammoItem', null);
        const dc = ammoDropzone.querySelector('.cci-ammo-item');
        if (dc) dc.outerHTML = '<div class="cci-drop-hint">Drag ammo item here</div>';
      });
    }
  }

  // === SPECIAL DROPZONE ===
  const specialDropzone = panel.querySelector('.cci-special-dropzone[data-drop="special"]');
  if (specialDropzone && isGM) {
    specialDropzone.addEventListener('dragover', (e) => { e.preventDefault(); specialDropzone.classList.add('cci-dragover'); });
    specialDropzone.addEventListener('dragleave', () => specialDropzone.classList.remove('cci-dragover'));
    specialDropzone.addEventListener('drop', async (e) => {
      e.preventDefault();
      specialDropzone.classList.remove('cci-dragover');
      let data;
      try { data = JSON.parse(e.dataTransfer.getData('text/plain')); } catch { return; }
      if (!data || data.type !== 'Item') return;
      const droppedItem = await fromUuid(data.uuid);
      if (!droppedItem || droppedItem.type !== 'ability') {
        ui.notifications.warn('Only Ability items can be dropped here.');
        return;
      }
      const existing = CoolItemData.get(item).specialAbilities || [];
      if (existing.find(a => a.id === droppedItem.id)) return;
      existing.push({ id: droppedItem.id, name: droppedItem.name, img: droppedItem.img, uuid: data.uuid });
      await CoolItemData.set(item, 'specialAbilities', existing);
      const row = panel.querySelector('.cci-special-row');
      if (row) row.replaceWith(buildSpecialRow(item, isGM));
      bindAttackEvents(panel, item, isGM);
    });
    specialDropzone.querySelectorAll('.cci-remove-ability').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const existing = CoolItemData.get(item).specialAbilities || [];
        await CoolItemData.set(item, 'specialAbilities', existing.filter(a => a.id !== id));
        const row = panel.querySelector('.cci-special-row');
        if (row) row.replaceWith(buildSpecialRow(item, isGM));
        bindAttackEvents(panel, item, isGM);
      });
    });
  }

  // === EFFECTS DROPZONE ===
  const effectsDropzone = panel.querySelector('.cci-effects-dropzone[data-drop="effects"]');
  if (effectsDropzone && isGM) {
    effectsDropzone.addEventListener('dragover', (e) => { e.preventDefault(); effectsDropzone.classList.add('cci-dragover'); });
    effectsDropzone.addEventListener('dragleave', () => effectsDropzone.classList.remove('cci-dragover'));
    effectsDropzone.addEventListener('drop', async (e) => {
      e.preventDefault();
      effectsDropzone.classList.remove('cci-dragover');
      let data;
      try { data = JSON.parse(e.dataTransfer.getData('text/plain')); } catch { return; }
      if (!data) return;

      let effectDoc = null;
      if (data.type === 'ActiveEffect') {
        effectDoc = await fromUuid(data.uuid);
      } else if (data.type === 'Item') {
        // Also accept items that have effects (like from cypher-active-effects)
        const droppedItem = await fromUuid(data.uuid);
        if (droppedItem?.effects?.size > 0) {
          effectDoc = droppedItem.effects.contents[0];
        }
      }

      if (!effectDoc) {
        ui.notifications.warn('Only Active Effects can be dropped here.');
        return;
      }

      const existing = CoolItemData.get(item).effects || [];
      if (existing.find(fx => fx.id === effectDoc.id)) return;

      const desc = effectDoc.description || effectDoc.system?.description || '';
      existing.push({
        id: effectDoc.id,
        name: effectDoc.name,
        img: effectDoc.img || effectDoc.icon || 'icons/svg/aura.svg',
        uuid: data.uuid,
        description: desc,
        target: 'pc',
        trigger: 'automatic',
        resistance: { attribute: 'might', difficulty: 1 }
      });
      await CoolItemData.set(item, 'effects', existing);
      // Re-render effects row
      const row = panel.querySelector('.cci-effects-row');
      if (row) {
        const newRow = buildEffectsRow(item, isGM);
        row.replaceWith(newRow);
      }
      bindAttackEvents(panel, item, isGM);
    });

    // Remove effect
    effectsDropzone.querySelectorAll('.cci-remove-effect').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        const existing = CoolItemData.get(item).effects || [];
        existing.splice(idx, 1);
        await CoolItemData.set(item, 'effects', existing);
        const row = panel.querySelector('.cci-effects-row');
        if (row) {
          const newRow = buildEffectsRow(item, isGM);
          row.replaceWith(newRow);
        }
        bindAttackEvents(panel, item, isGM);
      });
    });

    // Effect target/trigger/resistance/difficulty change
    effectsDropzone.querySelectorAll('.cci-effect-target, .cci-effect-trigger, .cci-effect-resistance, .cci-effect-res-difficulty').forEach(sel => {
      sel.addEventListener('change', async (e) => {
        const idx = parseInt(e.target.dataset.idx);
        const existing = CoolItemData.get(item).effects || [];
        if (!existing[idx]) return;
        if (e.target.classList.contains('cci-effect-target')) {
          existing[idx].target = e.target.value;
        } else if (e.target.classList.contains('cci-effect-trigger')) {
          existing[idx].trigger = e.target.value;
        } else if (e.target.classList.contains('cci-effect-resistance')) {
          existing[idx].resistance = existing[idx].resistance || {};
          existing[idx].resistance.attribute = e.target.value;
        } else if (e.target.classList.contains('cci-effect-res-difficulty')) {
          existing[idx].resistance = existing[idx].resistance || {};
          existing[idx].resistance.difficulty = parseInt(e.target.value, 10) || 1;
        }
        await CoolItemData.set(item, 'effects', existing);
      });
    });

    // Effect icon tooltips
    effectsDropzone.querySelectorAll('.cci-effect-icon').forEach(icon => {
      const itemEl = icon.closest('.cci-effect-item');
      const idx = parseInt(itemEl?.dataset.effectIdx);
      const effects = CoolItemData.get(item).effects || [];
      const fx = effects[idx];
      if (!fx?.description) return;

      const tt = document.createElement('div');
      tt.className = 'cci-effect-tooltip';
      tt.innerHTML = `
        <div class="cci-effect-tt-header">${fx.name}</div>
        <div class="cci-effect-tt-desc">${fx.description}</div>
      `;
      document.body.appendChild(tt);

      const show = () => {
        const rect = icon.getBoundingClientRect();
        tt.style.left = rect.left + 'px';
        tt.style.top = (rect.bottom + 6) + 'px';
        tt.classList.add('cci-visible');
      };
      const hide = () => tt.classList.remove('cci-visible');

      icon.addEventListener('mouseenter', show);
      icon.addEventListener('mouseleave', hide);
    });
  }
}

export function buildEffectsRow(item, isGM) {
  const data = CoolItemData.get(item);
  const effects = data.effects || [];
  const row = document.createElement('div');
  row.className = 'cci-row cci-effects-row';
  row.innerHTML = `
    <label>Effects <span class="cci-hint">(drop active effects here)</span></label>
    <div class="cci-effects-dropzone" data-drop="effects">
      ${effects.length > 0
        ? effects.map((eff, idx) => `
          <div class="cci-effect-item" data-effect-idx="${idx}" data-effect-id="${eff.id}">
            <div class="cci-effect-header">
              <span class="cci-effect-label">${eff.name}</span>
              ${isGM ? `<button class="cci-remove-effect" data-idx="${idx}">×</button>` : ''}
            </div>
            <div class="cci-effect-fields">
              <img src="${eff.img || 'icons/svg/aura.svg'}" alt="${eff.name}" class="cci-effect-icon">
              ${isGM ? `
                <select class="cci-effect-target" data-idx="${idx}" title="Target">
                  ${opts(CCI_CONFIG.effectTarget, eff.target || 'pc')}
                </select>
                <select class="cci-effect-trigger" data-idx="${idx}" title="Trigger">
                  ${opts(CCI_CONFIG.effectTrigger, eff.trigger || 'automatic')}
                </select>
              ` : `
                <span class="cci-effect-tag">${CCI_CONFIG.effectTarget[eff.target || 'pc']}</span>
                <span class="cci-effect-tag">${CCI_CONFIG.effectTrigger[eff.trigger || 'automatic']}</span>
              `}
            </div>
            ${isGM ? `
            <div class="cci-effect-resistance-row">
              <span class="cci-effect-res-label">RESISTANCE</span>
              <select class="cci-effect-resistance" data-idx="${idx}" title="Resistance Attribute">
                ${opts({might:'Might',speed:'Speed',intellect:'Intellect'}, eff.resistance?.attribute || 'might')}
              </select>
              <span class="cci-effect-res-label">DIFFICULTY</span>
              <select class="cci-effect-res-difficulty" data-idx="${idx}" title="Resistance Difficulty">
                ${Array.from({length:15},(_,i)=>`<option value="${i+1}" ${(eff.resistance?.difficulty ?? 1) === i+1 ? 'selected' : ''}>${i+1}</option>`).join('')}
              </select>
            </div>
            ` : ''}
          </div>
        `).join('')
        : (isGM ? '<div class="cci-drop-hint">Drag active effects here</div>' : '')
      }
    </div>
  `;
  return row;
}
