/**
 * Cypher Cool Items — Core Module
 * Shared config, data class, hooks, and utility functions
 */

export const MODULE_ID = 'cypher-cool-items';

export const CCI_CONFIG = {
  rarity: {
    common:     { label: 'Common',     color: '#9ca3af' },
    uncommon:   { label: 'Uncommon',   color: '#4ade80' },
    rare:       { label: 'Rare',       color: '#60a5fa' },
    epic:       { label: 'Epic',       color: '#c084fc' },
    legendary:  { label: 'Legendary',  color: '#fbbf24' }
  },
  itemType: {
    weapon: 'Weapon', armor: 'Armor', consumable: 'Consumable',
    tool: 'Tool', material: 'Material', misc: 'Misc'
  },
  depletion: {
    d6: '1 in 1d6',
    d10: '1 in 1d10',
    d20: '1 in 1d20',
    d100: '1 in 1d100'
  },
  position: {
    none: '—', hands: 'Hands', body: 'Body', head: 'Head',
    feet: 'Feet', accessory: 'Accessory'
  },
  pool: {
    none: '—', might: 'Might', speed: 'Speed', intellect: 'Intellect',
    effort: 'Effort', xp: 'XP'
  },
  coin: {
    cp: 'CP', sp: 'SP', gp: 'GP', pp: 'PP'
  },
  attackType: {
    ability: 'Ability',
    melee: 'Melee Weapon',
    ranged: 'Ranged Weapon'
  },
  range: {
    immediate: 'Immediate',
    short: 'Short',
    long: 'Long',
    veryLong: 'Very Long'
  },
  abilityType: {
    mundane: 'Mundane', martial: 'Martial', stealth: 'Stealth',
    arcane: 'Arcane', divine: 'Divine', occult: 'Occult',
    psionic: 'Psionic', technological: 'Technological',
    alchemical: 'Alchemical', cybernetic: 'Cybernetic',
    biological: 'Biological', undead: 'Undead',
    avalon: 'Avalon', cypher: 'Cypher', artifact: 'Artifact'
  },
  activation: {
    action: 'Action', enabler: 'Enabler', permanent: 'Permanent'
  },
  durationUnit: {
    instant: 'Instant', round: 'Round', minute: 'Minute',
    hour: 'Hour', day: 'Day', week: 'Week',
    month: 'Month', year: 'Year', permanent: 'Permanent'
  },
  ammoType: {
    mundane: 'Mundane', magical: 'Magical', other: 'Other'
  },
  armorType: {
    cloth_padded: 'Cloth / Padded',
    leather: 'Leather',
    reinforced_leather: 'Reinforced Leather',
    brigandine: 'Brigandine',
    chainmail: 'Chainmail',
    scale_armor: 'Scale Armor',
    plate_armor: 'Plate Armor',
    runic_armor: 'Runic Armor',
    arcane_weave: 'Arcane-Weave Armor',
    steam_powered: 'Steam-Powered Armor',
    alchemical: 'Alchemical Armor',
    clockwork: 'Clockwork Armor',
    cybernetic: 'Cybernetic Armor',
    undead_bone: 'Undead Bone Armor',
    dragonhide: 'Dragonhide Armor',
    avalon_suit: 'Avalon Pilot Suit',
    avalon_plating: 'Avalon Plating',
    magical_barrier: 'Magical Barrier',
    energy_shield: 'Energy Shield',
    force_field: 'Force Field'
  },
  cypherForm: {
    subtle: 'Subtle',
    manifest: 'Manifest'
  },
  cypherType: {
    mundane: 'Mundane',
    arcane: 'Arcane',
    technology: 'Technology',
    alchemy: 'Alchemy',
    biological: 'Biological',
    psionic: 'Psionic',
    occult: 'Occult',
    divine: 'Divine',
    other: 'Other'
  },
  equipmentType: {
    clothes: 'Clothes',
    edibles: 'Edibles',
    tools: 'Tools',
    outdoor_gear: 'Outdoor Gear',
    containers: 'Containers',
    lighting: 'Lighting',
    navigation: 'Navigation',
    medical: 'Medical / Healing',
    communication: 'Communication',
    restraints: 'Restraints',
    climbing_gear: 'Climbing Gear',
    camping_gear: 'Camping Gear',
    transportation: 'Transportation',
    mounts: 'Mounts',
    writing: 'Writing / Documentation',
    musical: 'Musical Instruments',
    jewelry: 'Jewelry / Accessories',
    alchemical_supplies: 'Alchemical Supplies',
    magical_components: 'Magical Components',
    technological: 'Technological Devices',
    cybernetic: 'Cybernetic Parts',
    artifacts: 'Artifacts',
    cyphers: 'Cyphers',
    keys_locks: 'Keys / Locks',
    traps: 'Traps',
    fuel: 'Fuel / Power Sources',
    repair_kits: 'Repair Kits',
    survival: 'Survival Gear',
    luxury: 'Luxury Goods'
  },
  skillStat: {
    might: 'Might',
    speed: 'Speed',
    intellect: 'Intellect'
  },
  skillTraining: {
    inability: 'Inability',
    practiced: 'Practiced',
    trained: 'Trained',
    specialized: 'Specialized'
  },
  skillType: {
    physical: 'Physical',
    movement: 'Movement',
    stealth: 'Stealth',
    interaction: 'Interaction / Social',
    knowledge: 'Knowledge',
    investigation: 'Investigation',
    tech_crafting: 'Tech / Crafting',
    travel_piloting: 'Travel / Piloting',
    combat: 'Combat',
    survival: 'Survival',
    medical: 'Medical / Healing',
    perception: 'Perception',
    performance: 'Performance / Artistry',
    arcane: 'Arcane / Magical Practice',
    alchemical: 'Alchemical',
    cybernetic: 'Cybernetic / Mechanical Maintenance',
    leadership: 'Leadership / Command',
    navigation: 'Navigation',
    lore: 'Lore / Occult Knowledge',
    avalon: 'Avalon Systems Operation'
  },
  size: {
    tiny:     { label: 'Tiny',     dims: 'Under 5 cm',        weight: 'Under 50 g',    desc: 'Fits in a coin pouch or between two fingers; easy to palm, swallow, or lose',                     examples: 'Cyphers, rings, keys, gears, bullets, small gemstones, sewing needles, lockpicks' },
    small:    { label: 'Small',    dims: '5–20 cm',           weight: '50 g–1 kg',       desc: 'Fits in a pocket or belt pouch; carried without noticing the weight',                              examples: 'Daggers, wands, potion vials, pocket communicators, compasses, revolvers, small tools' },
    medium:   { label: 'Medium',   dims: '20–60 cm',          weight: '1–5 kg',          desc: 'Needs a hand or a sling/holster; noticeable but not cumbersome',                                   examples: 'Swords, rifles, spellbooks, lanterns, satchels, medium artifacts, Ben\'s enchanted pistols' },
    large:    { label: 'Large',    dims: '60 cm–1.5 m',       weight: '5–25 kg',         desc: 'Requires two hands or a strap across the body; awkward to conceal',                                examples: 'Greatswords, war-hammers, backpacks, portable Arcancore housings, small chests, battle standards' },
    bulky:    { label: 'Bulky',    dims: '1.5–3 m',           weight: '25–150 kg',       desc: 'Needs a cart, a strong back, or mechanical assistance to move',                                    examples: 'Ballistae, workshop forges, siege ladders, large containment vessels, small automatons' },
    massive:  { label: 'Massive',  dims: '3–10 m',            weight: '150 kg–5 tons',   desc: 'Requires a vehicle, crane, or dedicated crew to transport; usually installed rather than carried',   examples: 'Carriage engines, cannon batteries, airship anchors, large automaton frames, gate mechanisms' },
    colossal: { label: 'Colossal', dims: 'Over 10 m',         weight: 'Over 5 tons',     desc: 'Operates on the scale of Avalons and fortifications; effectively a structure or vehicle',          examples: 'Avalon frames and limbs, airship hulls, fortress gates, large Arcancore containment arrays' }
  }
};

export class CoolItemData {
  static get(item) { return item.getFlag(MODULE_ID, 'data') || {}; }
  static async set(item, key, value) {
    const data = this.get(item);
    data[key] = value;
    await item.update({ [`flags.${MODULE_ID}.data`]: data }, { render: false });
  }
}

Hooks.once('init', () => {
  console.log(`${MODULE_ID} | v2.0.14 initialized`);
  game.settings.register(MODULE_ID, 'lastWindowPosition', {
    name: 'Last Window Position',
    scope: 'client',
    config: false,
    type: Object,
    default: {}
  });
});

function getActorIdFromApp(app) {
  const item = app.item || app.document;
  if (item?.actor) return item.actor.id;
  if (app.actor?.id) return app.actor.id;
  if (item?.parent?.documentName === 'Actor') return item.parent.id;
  return 'global';
}

function getSavedPosition(actorId) {
  const all = game.settings.get(MODULE_ID, 'lastWindowPosition') || {};
  return all[actorId] || null;
}

async function savePosition(actorId, left, top, width, height) {
  const all = game.settings.get(MODULE_ID, 'lastWindowPosition') || {};
  all[actorId] = { left, top, width, height };
  await game.settings.set(MODULE_ID, 'lastWindowPosition', all);
}

function applyPosition(app, actorId) {
  const pos = getSavedPosition(actorId);
  if (!pos || pos.left == null || pos.top == null) return;
  const doApply = () => {
    const update = { left: pos.left, top: pos.top };
    if (pos.width != null) update.width = pos.width;
    if (pos.height != null) update.height = pos.height;
    app.setPosition(update);
  };
  doApply();
  requestAnimationFrame(() => requestAnimationFrame(doApply));
}

function trackPosition(app, actorId) {
  const el = app.element?.[0] || app.element;
  if (!el) return;
  const originalClose = app.close.bind(app);
  app.close = async function(...args) {
    const pos = app.position;
    if (pos?.left != null && pos?.top != null) {
      await savePosition(actorId, pos.left, pos.top, pos.width, pos.height);
    }
    return originalClose(...args);
  };
  const header = el.querySelector('.window-header');
  if (!header) return;
  let wasDragging = false;
  header.addEventListener('mousedown', () => { wasDragging = false; });
  header.addEventListener('mousemove', () => { wasDragging = true; });
  header.addEventListener('mouseup', async () => {
    if (wasDragging) {
      setTimeout(async () => {
        const pos = app.position;
        if (pos?.left != null && pos?.top != null) {
          await savePosition(actorId, pos.left, pos.top, pos.width, pos.height);
        }
      }, 50);
    }
  });
}

// Registry for panel builders and event binders
const _builders = {};
const _binders = {};

export function registerBuilder(type, builderFn) {
  _builders[type] = builderFn;
}

export function registerBinder(type, binderFn) {
  _binders[type] = binderFn;
}

export function buildPanel(item, isGM) {
  const builder = _builders[item.type];
  if (builder) return builder(item, isGM);
  return buildGenericPanel(item, isGM);
}

export function bindEvents(panel, item, isGM) {
  // Common bindings first
  bindCommonEvents(panel, item, isGM);
  // Type-specific bindings
  const type = item.type;
  const binder = _binders[type];
  if (binder) binder(panel, item, isGM);
}

function buildGenericPanel(item, isGM) {
  const data = CoolItemData.get(item);
  const sys = item.system || {};
  const itemType = data.itemType || 'misc';
  const rarity = data.rarity || 'common';
  const price = data.price ?? '';
  const coin = data.coin || 'gp';
  const size = data.size || 'medium';
  const flavor = data.flavor || '';
  const specialAbilities = data.specialAbilities || [];
  const description = data.description || sys.description || '';

  const panel = document.createElement('div');
  panel.className = 'cci-cool-panel';
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
        ? `<input type="text" name="name" value="${item.name}" class="cci-name-input" placeholder="Item Name">`
        : `<div class="cci-name-display">${item.name}</div>`
      }
      <div class="cci-info-fields">
        <div class="cci-field-pair">
          <label>Type</label>
          ${isGM
            ? `<select data-prop="itemType">${opts(CCI_CONFIG.itemType, itemType)}</select>`
            : `<div class="cci-readonly">${CCI_CONFIG.itemType[itemType]}</div>`
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

  const midRow = document.createElement('div');
  midRow.className = 'cci-row cci-mid-row';

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

  midRow.innerHTML = `<div class="cci-stats-block">${priceHtml}${sizeHtml}</div>`;
  panel.appendChild(midRow);

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

export function buildSpecialRow(item, isGM) {
  const data = CoolItemData.get(item);
  const specialAbilities = data.specialAbilities || [];
  const row = document.createElement('div');
  row.className = 'cci-row cci-special-row';
  row.innerHTML = `
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
  return row;
}

export function opts(config, selected) {
  return Object.entries(config).map(([k, v]) => {
    const label = typeof v === 'object' ? v.label : v;
    return `<option value="${k}" ${k === selected ? 'selected' : ''}>${label}</option>`;
  }).join('');
}

function updateNativeForm(panel, updates) {
  const content = panel?.closest('.window-content');
  if (!content) return;
  const form = content.querySelector('form');
  if (!form) return;
  for (const [key, value] of Object.entries(updates)) {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) input.value = value;
  }
}

function bindCommonEvents(panel, item, isGM) {
  // === NAME, SELECT, INPUT ===
  panel.querySelectorAll('[data-prop], [name="name"]').forEach(input => {
    if (input.closest('.cci-wysiwyg-toolbar') || input.dataset.cmd || input.type === 'checkbox') return;
    input.addEventListener('change', async (e) => {
      if (input.dataset.prop) {
        let val = e.target.value;
        if (e.target.type === 'number' || ['poolCost','armorRating','armorPenalty','level','price','durability','durationValue'].includes(e.target.dataset.prop)) {
          val = Number(val);
          if (isNaN(val)) val = 0;
        }
        await CoolItemData.set(item, input.dataset.prop, val);

        // === SKILL SYNC: Training ↔ Rating ===
        // Cypher System v2 canonical field: system.settings.level
        if (item.type === 'skill' && input.dataset.prop === 'skillTraining') {
          const trainingToLevel = { inability: -1, practiced: 0, trained: 1, specialized: 2 };
          const trainingToBasic = { inability: 'Inability', practiced: 'Practiced', trained: 'Trained', specialized: 'Specialized' };
          const level = trainingToLevel[val];
          const basicRating = trainingToBasic[val];
          const update = {};
          // Canonical Cypher System v2 field
          if (level !== undefined) update['system.settings.level'] = level;
          // Keep backward-compat fields
          if (level !== undefined) update['system.rating'] = level;
          if (basicRating !== undefined) update['system.basic.rating'] = basicRating;
          if (Object.keys(update).length > 0) {
            try {
              await item.update(update, { render: false });
              // Sync hidden native form so close/submit doesn't overwrite
              updateNativeForm(panel, update);
              // Re-render actor sheet so Skill tab shows updated rating
              if (item.actor?.sheet?.rendered) {
                item.actor.sheet.render(false);
              }
            } catch (err) {
              console.error('[CCI] Skill training sync failed:', err);
            }
          }
        }
        // === SKILL SYNC: Stat ===
        // Cypher System v2 canonical field: system.settings.pool
        if (item.type === 'skill' && input.dataset.prop === 'skillStat') {
          try {
            const update = { 'system.settings.pool': val, 'system.stat': val };
            await item.update(update, { render: false });
            updateNativeForm(panel, update);
            if (item.actor?.sheet?.rendered) item.actor.sheet.render(false);
          } catch (err) {
            console.error('[CCI] Skill stat sync failed:', err);
          }
        }
      } else if (input.name === 'name') {
        await item.update({ name: input.value }, { render: false });
      }
    });
  });

  // === WYSIWYG TOOLBAR ===
  panel.querySelectorAll('.cci-wysiwyg-toolbar button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cmd = btn.dataset.cmd;
      if (cmd) document.execCommand(cmd, false, null);
    });
  });

  // === WYSIWYG DESCRIPTION ===
  const wysiwyg = panel.querySelector('.cci-wysiwyg[data-prop="description"]');
  if (wysiwyg) {
    wysiwyg.addEventListener('blur', async () => {
      const html = wysiwyg.innerHTML;
      await CoolItemData.set(item, 'description', html);
      // === SKILL SYNC: Description → native ===
      if (item.type === 'skill') {
        try {
          await item.update({ 'system.description': html }, { render: false });
          if (item.actor?.sheet?.rendered) item.actor.sheet.render(false);
        } catch (err) {
          console.error('[CCI] Skill description sync failed:', err);
        }
      }
    });
  }

  // === IMAGE CLICK (GM only) ===
  const itemImg = panel.querySelector('.cci-item-img');
  if (itemImg && isGM) {
    itemImg.style.cursor = 'pointer';
    itemImg.addEventListener('click', async () => {
      try {
        const current = item.img || 'icons/svg/mystery-man.svg';
        const FP = foundry.applications?.apps?.FilePicker || FilePicker;
        const fp = new FP({
          type: 'image',
          current: current,
          callback: async (path) => {
            if (!path) return;
            try {
              if (item.actor) {
                await item.actor.updateEmbeddedDocuments('Item', [{ _id: item.id, img: path }]);
              } else {
                await item.update({ img: path });
              }
              ui.notifications.info('Item image updated.');
            } catch (err) {
              console.error('[CCI] Image update failed:', err);
              ui.notifications.error('Failed to update image: ' + (err.message || err));
            }
          }
        });
        await fp.render(true);
      } catch (err) {
        console.error('[CCI] FilePicker failed:', err);
        ui.notifications.error('Could not open image picker.');
      }
    });
  }

  // === SPECIAL DROPZONES ===
  panel.querySelectorAll('.cci-special-dropzone[data-drop="special"]').forEach(dropzone => {
    if (!isGM) return;
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
      const existing = CoolItemData.get(item).specialAbilities || [];
      if (existing.find(a => a.id === droppedItem.id)) return;
      existing.push({ id: droppedItem.id, name: droppedItem.name, img: droppedItem.img, uuid: data.uuid });
      await CoolItemData.set(item, 'specialAbilities', existing);
      const row = panel.querySelector('.cci-special-row');
      if (row) row.replaceWith(buildSpecialRow(item, isGM));
      bindEvents(panel, item, isGM);
    });
    dropzone.querySelectorAll('.cci-remove-ability').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const existing = CoolItemData.get(item).specialAbilities || [];
        await CoolItemData.set(item, 'specialAbilities', existing.filter(a => a.id !== id));
        const row = panel.querySelector('.cci-special-row');
        if (row) row.replaceWith(buildSpecialRow(item, isGM));
        bindEvents(panel, item, isGM);
      });
    });
  });

  // === SIZE TOOLTIP ===
  const sizeEl = panel.querySelector('.cci-size-select, .cci-size-badge');
  if (sizeEl) {
    const sizeKey = sizeEl.dataset.prop === 'size' ? sizeEl.value : null;
    const cfg = sizeKey ? CCI_CONFIG.size[sizeKey] : CCI_CONFIG.size[CoolItemData.get(item).size || 'medium'];
    if (cfg) {
      const tt = document.createElement('div');
      tt.className = 'cci-size-tooltip';
      tt.innerHTML = `
        <div class="cci-tt-title">${cfg.label}</div>
        <div class="cci-tt-row"><span class="cci-tt-label">Dimensions:</span><span class="cci-tt-value">${cfg.dims}</span></div>
        <div class="cci-tt-row"><span class="cci-tt-label">Weight:</span><span class="cci-tt-value">${cfg.weight}</span></div>
        <div class="cci-tt-row"><span class="cci-tt-label">Desc:</span><span class="cci-tt-value">${cfg.desc}</span></div>
        <div class="cci-tt-examples">e.g. ${cfg.examples}</div>
      `;
      document.body.appendChild(tt);
      const show = (e) => {
        const rect = sizeEl.getBoundingClientRect();
        tt.style.left = rect.left + 'px';
        tt.style.top = (rect.bottom + 6) + 'px';
        tt.classList.add('cci-visible');
      };
      const hide = () => tt.classList.remove('cci-visible');
      sizeEl.addEventListener('mouseenter', show);
      sizeEl.addEventListener('mouseleave', hide);
      sizeEl.addEventListener('focus', show);
      sizeEl.addEventListener('blur', hide);
    }
  }
}

Hooks.on('renderItemSheet', (app, html, data) => {
  const item = app.item || app.document;
  if (!item) return;

  let el = html instanceof HTMLElement ? html : html?.[0];
  if (!el) return;

  const isGM = game.user.isGM;
  const actorId = getActorIdFromApp(app);
  const content = el.querySelector('.window-content');
  if (!content) return;

  // Always hide the native form
  const form = content.querySelector('form');
  if (form) { form.style.display = 'none'; form.dataset.cciNative = 'true'; }

  // Check if panel already exists — if so, don't rebuild (preserve focus & state)
  let panel = content.querySelector('.cci-cool-panel');
  if (!panel) {
    panel = buildPanel(item, isGM);
    content.insertBefore(panel, content.firstChild);
    bindEvents(panel, item, isGM);

    // One-time auto-size on first open
    const saved = getSavedPosition(actorId);
    if (!saved && !app._cciSized) {
      app._cciSized = true;
      const header = el.querySelector('.window-header');
      const headerH = header ? header.offsetHeight : 30;
      const contentH = content.scrollHeight;
      const totalH = headerH + contentH + 8;
      const maxH = window.innerHeight - 80;
      app.setPosition({
        height: Math.max(Math.min(totalH, maxH), 400),
        width: 350
      });
    }
  } else {
    // Panel exists — sync image if it changed (e.g. after image picker)
    const imgEl = panel.querySelector('.cci-item-img');
    const bgEl = panel.querySelector('.cci-bg-image');
    const currentSrc = imgEl?.src;
    const newSrc = item.img || 'icons/svg/mystery-man.svg';
    // Compare pathname to handle absolute vs relative URLs
    const currentPath = currentSrc ? new URL(currentSrc, window.location.href).pathname.replace(/^\//, '') : '';
    const newPath = new URL(newSrc, window.location.href).pathname.replace(/^\//, '');
    if (currentPath !== newPath) {
      if (imgEl) imgEl.src = newSrc;
      if (bgEl) bgEl.style.backgroundImage = `url("${newSrc}")`;
    }
  }

  applyPosition(app, actorId);
  trackPosition(app, actorId);
});

console.log(`${MODULE_ID} | core loaded.`);
