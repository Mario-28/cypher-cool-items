/**
 * Cypher Cool Items — v1.1.0
 * GM-edit, Player-read, enhanced fields
 */

const MODULE_ID = 'cypher-cool-items';

const CCI_CONFIG = {
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

class CoolItemData {
  static get(item) { return item.getFlag(MODULE_ID, 'data') || {}; }
  static async set(item, key, value) {
    const data = this.get(item);
    data[key] = value;
    // Save without triggering a re-render — prevents window collapse
    await item.update({ [`flags.${MODULE_ID}.data`]: data }, { render: false });
  }
}

Hooks.once('init', () => {
  console.log(`${MODULE_ID} | v1.1.0 initialized`);

  game.settings.register(MODULE_ID, 'lastWindowPosition', {
    name: 'Last Window Position',
    scope: 'client',
    config: false,
    type: Object,
    default: {}
  });
});

function getActorIdFromApp(app) {
  // Find the actor that owns this item
  const item = app.item || app.document;
  if (item?.actor) return item.actor.id;
  if (app.actor?.id) return app.actor.id;
  // Fallback: try to find from the item's parent
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
  // Apply with multiple delays to override Foundry's defaults
  const doApply = () => {
    const update = { left: pos.left, top: pos.top };
    if (pos.width != null) update.width = pos.width;
    if (pos.height != null) update.height = pos.height;
    app.setPosition(update);
  };
  doApply();
  requestAnimationFrame(() => requestAnimationFrame(doApply));
  setTimeout(doApply, 50);
  setTimeout(doApply, 150);
  setTimeout(doApply, 300);
  setTimeout(doApply, 600);
}

function trackPosition(app, actorId) {
  const el = app.element?.[0] || app.element;
  if (!el) return;

  // Save on window close
  const originalClose = app.close.bind(app);
  app.close = async function(...args) {
    const pos = app.position;
    if (pos?.left != null && pos?.top != null) {
      await savePosition(actorId, pos.left, pos.top, pos.width, pos.height);
    }
    return originalClose(...args);
  };

  // Track mouseup on header to save after drag
  const header = el.querySelector('.window-header');
  if (!header) return;

  let wasDragging = false;
  header.addEventListener('mousedown', () => { wasDragging = false; });
  header.addEventListener('mousemove', () => { wasDragging = true; });
  header.addEventListener('mouseup', async () => {
    if (wasDragging) {
      // Give Foundry time to update position
      setTimeout(async () => {
        const pos = app.position;
        if (pos?.left != null && pos?.top != null) {
          await savePosition(actorId, pos.left, pos.top, pos.width, pos.height);
        }
      }, 50);
    }
  });
}

Hooks.on('renderItemSheet', (app, html, data) => {
  const item = app.item || app.document;
  if (!item) return;

  let el = html instanceof HTMLElement ? html : html?.[0];
  if (!el) return;
  if (el.querySelector('.cci-cool-panel')) return;

  const isGM = game.user.isGM;
  const panel = buildPanel(item, isGM);
  const actorId = getActorIdFromApp(app);

  const content = el.querySelector('.window-content');
  if (content) {
    const form = content.querySelector('form');
    if (form) { form.style.display = 'none'; form.dataset.cciNative = 'true'; }
    content.insertBefore(panel, content.firstChild);
  }

  // Apply saved position (multiple attempts to override Foundry defaults)
  applyPosition(app, actorId);

  // Track position changes
  trackPosition(app, actorId);

  // Resize window to fit compact content
  const doResize = () => {
    const header = el.querySelector('.window-header');
    const headerH = header ? header.offsetHeight : 30;
    const contentH = content.scrollHeight;
    const totalH = headerH + contentH + 8;
    const maxH = window.innerHeight - 80;
    app.setPosition({
      height: Math.min(totalH, maxH),
      width: 350
    });
  };
  requestAnimationFrame(() => requestAnimationFrame(() => {
    doResize();
    setTimeout(doResize, 120);
  }));

  bindEvents(panel, item, isGM);
});

function buildPanel(item, isGM) {
  // Branch by item type
  if (item.type === 'ability') {
    return buildAbilityPanel(item, isGM);
  }
  if (item.type === 'ammo') {
    return buildAmmoPanel(item, isGM);
  }
  if (item.type === 'armor') {
    return buildArmorPanel(item, isGM);
  }
  return buildGenericPanel(item, isGM);
}

function buildAbilityPanel(item, isGM) {
  const data = CoolItemData.get(item);
  const sys = item.system || {};

  // Ability-specific fields
  const abilityType = data.abilityType || 'mundane';
  const activation = data.activation || 'action';
  const durationValue = data.durationValue ?? '';
  const durationUnit = data.durationUnit || 'instant';
  const poolCostPool = data.poolCostPool || 'none';
  const poolCost = data.poolCost ?? '';
  const flavor = data.flavor || '';
  const specialAbilities = data.specialAbilities || [];
  const description = sys.description || '';

  const panel = document.createElement('div');
  panel.className = 'cci-cool-panel cci-ability-panel';
  if (!isGM) panel.classList.add('cci-player-view');

  // Background image
  const bgImg = document.createElement('div');
  bgImg.className = 'cci-bg-image';
  bgImg.style.backgroundImage = `url("${item.img || 'icons/svg/mystery-man.svg'}"))`;
  panel.appendChild(bgImg);

  // === TOP ROW: Image + Info ===
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
        ? `<input type="text" name="name" value="${item.name}" class="cci-name-input" placeholder="Ability Name">`
        : `<div class="cci-name-display">${item.name}</div>`
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

  // === MID ROW: Ability Stats ===
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

  // === SPECIAL: Drop Area for Abilities ===
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

  // === DESCRIPTION ===
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

  // === FLAVOR TEXT ===
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

function buildAmmoPanel(item, isGM) {
  const data = CoolItemData.get(item);
  const sys = item.system || {};

  // Ammo fields
  const rarity = data.rarity || 'common';
  const ammoType = data.ammoType || 'mundane';
  const price = data.price ?? '';
  const coin = data.coin || 'gp';
  const size = data.size || 'small';
  const flavor = data.flavor || '';
  const specialAbilities = data.specialAbilities || [];
  const description = sys.description || '';

  const panel = document.createElement('div');
  panel.className = 'cci-cool-panel cci-ammo-panel';
  if (!isGM) panel.classList.add('cci-player-view');

  // Background image
  const bgImg = document.createElement('div');
  bgImg.className = 'cci-bg-image';
  bgImg.style.backgroundImage = `url("${item.img || 'icons/svg/mystery-man.svg'}")`;
  panel.appendChild(bgImg);

  // === TOP ROW: Image + Info ===
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
        ? `<input type="text" name="name" value="${item.name}" class="cci-name-input" placeholder="Ammo Name">`
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
          <label>Type</label>
          ${isGM
            ? `<select data-prop="ammoType">${opts(CCI_CONFIG.ammoType, ammoType)}</select>`
            : `<div class="cci-readonly">${CCI_CONFIG.ammoType[ammoType]}</div>`
          }
        </div>
      </div>
    </div>
  `;
  panel.appendChild(topRow);

  // === MID ROW: Ammo Stats ===
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

  // === SPECIAL: Drop Area ===
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

  // === DESCRIPTION ===
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

  // === FLAVOR TEXT ===
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

function buildArmorPanel(item, isGM) {
  const data = CoolItemData.get(item);
  const sys = item.system || {};

  // Armor fields
  const rarity = data.rarity || 'common';
  const armorType = data.armorType || 'leather';
  const armorRating = data.armorRating ?? '';
  const armorPenalty = data.armorPenalty ?? '';
  const hasDurability = data.hasDurability !== false;
  const durability = data.durability ?? 100;
  const price = data.price ?? '';
  const coin = data.coin || 'gp';
  const size = data.size || 'medium';
  const flavor = data.flavor || '';
  const specialAbilities = data.specialAbilities || [];
  const description = sys.description || '';

  const panel = document.createElement('div');
  panel.className = 'cci-cool-panel cci-armor-panel';
  if (!isGM) panel.classList.add('cci-player-view');

  // Background image
  const bgImg = document.createElement('div');
  bgImg.className = 'cci-bg-image';
  bgImg.style.backgroundImage = `url("${item.img || 'icons/svg/mystery-man.svg'}")`;
  panel.appendChild(bgImg);

  // === TOP ROW: Image + Info ===
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
        ? `<input type="text" name="name" value="${item.name}" class="cci-name-input" placeholder="Armor Name">`
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
          <label>Type</label>
          ${isGM
            ? `<select data-prop="armorType">${opts(CCI_CONFIG.armorType, armorType)}</select>`
            : `<div class="cci-readonly">${CCI_CONFIG.armorType[armorType]}</div>`
          }
        </div>
      </div>
    </div>
  `;
  panel.appendChild(topRow);

  // === MID ROW: Armor Stats ===
  const midRow = document.createElement('div');
  midRow.className = 'cci-row cci-mid-row';

  const ratingHtml = `
    <div class="cci-stat">
      <label>Armor Rating</label>
      ${isGM
        ? `<input type="number" data-prop="armorRating" value="${armorRating}" min="0" placeholder="—" class="cci-armor-rating">`
        : `<div class="cci-readonly cci-armor-rating">${armorRating !== '' ? armorRating : '—'}</div>`
      }
    </div>
  `;

  const penaltyHtml = `
    <div class="cci-stat">
      <label>Armor Penalty</label>
      ${isGM
        ? `<input type="number" data-prop="armorPenalty" value="${armorPenalty}" min="0" placeholder="—" class="cci-armor-penalty">`
        : `<div class="cci-readonly cci-armor-penalty">${armorPenalty !== '' ? armorPenalty : '—'}</div>`
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

  midRow.innerHTML = `<div class="cci-stats-block">${ratingHtml}${penaltyHtml}${priceHtml}${sizeHtml}</div>`;
  panel.appendChild(midRow);

  // === DURABILITY ROW ===
  if (isGM || hasDurability) {
    const durRow = document.createElement('div');
    durRow.className = 'cci-row cci-durability-row';
    const durColor = durability > 50 ? '#4ade80' : (durability > 20 ? '#fbbf24' : '#ef4444');
    durRow.innerHTML = `
      <div class="cci-durability-header">
        <label>Durability</label>
        ${isGM
          ? `<label class="cci-durability-toggle"><input type="checkbox" data-prop="hasDurability" ${hasDurability ? 'checked' : ''}> Enabled</label>`
          : ''
        }
      </div>
      ${hasDurability
        ? `<div class="cci-durability-track">
            <div class="cci-durability-bar"><div class="cci-durability-fill" style="width:${durability}%; background:${durColor};"></div></div>
            ${isGM
              ? `<input type="number" data-prop="durability" value="${durability}" min="0" max="100" class="cci-durability-input">`
              : `<span class="cci-durability-readonly">${durability}%</span>`
            }
          </div>`
        : '<div class="cci-durability-off">Durability disabled</div>'
      }
    `;
    panel.appendChild(durRow);
  }

  // === SPECIAL: Drop Area ===
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

  // === DESCRIPTION ===
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

  // === FLAVOR TEXT ===
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

function buildGenericPanel(item, isGM) {
  const data = CoolItemData.get(item);
  const sys = item.system || {};
  const basic = sys.basic || {};

  // Read values
  const rarity = data.rarity || 'common';
  const itemType = data.itemType || 'misc';
  const position = data.position || 'none';
  const pool = data.pool || 'none';
  const poolValue = data.poolValue ?? '';
  const hasDurability = data.hasDurability !== false;
  const durability = data.durability ?? 100;
  const price = data.price ?? '';
  const coin = data.coin || 'gp';
  const size = data.size || 'medium';
  const flavor = data.flavor || '';
  const specialAbilities = data.specialAbilities || [];
  const description = sys.description || '';

  const panel = document.createElement('div');
  panel.className = 'cci-cool-panel';
  if (!isGM) panel.classList.add('cci-player-view');

  // Background image (full-panel watermark)
  const bgImg = document.createElement('div');
  bgImg.className = 'cci-bg-image';
  bgImg.style.backgroundImage = `url("${item.img || 'icons/svg/mystery-man.svg'}")`;
  panel.appendChild(bgImg);

  // === TOP ROW: Image + Info ===
  const topRow = document.createElement('div');
  topRow.className = 'cci-row cci-top-row';

  // Image
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
          <label>Level</label>
          ${isGM
            ? `<input type="number" data-prop="level" value="${basic.level || ''}" placeholder="—">`
            : `<div class="cci-readonly">${basic.level || '—'}</div>`
          }
        </div>
        <div class="cci-field-pair">
          <label>Rarity</label>
          ${isGM
            ? `<select data-prop="rarity">${opts(CCI_CONFIG.rarity, rarity)}</select>`
            : `<div class="cci-readonly cci-rarity-badge" style="--rarity-color:${CCI_CONFIG.rarity[rarity]?.color}">${CCI_CONFIG.rarity[rarity]?.label}</div>`
          }
        </div>
        <div class="cci-field-pair">
          <label>Type</label>
          ${isGM
            ? `<select data-prop="itemType">${opts(CCI_CONFIG.itemType, itemType)}</select>`
            : `<div class="cci-readonly">${CCI_CONFIG.itemType[itemType]}</div>`
          }
        </div>
        <div class="cci-field-pair">
          <label>Position</label>
          ${isGM
            ? `<select data-prop="position">${opts(CCI_CONFIG.position, position)}</select>`
            : `<div class="cci-readonly">${CCI_CONFIG.position[position]}</div>`
          }
        </div>
      </div>
    </div>
  `;
  panel.appendChild(topRow);

  // === MID ROW: Stats ===
  const midRow = document.createElement('div');
  midRow.className = 'cci-row cci-mid-row';

  // Pool + Value (always visible)
  const poolHtml = `
    <div class="cci-stat cci-pool-stat">
      <label>Pool</label>
      <div class="cci-pool-row">
        ${isGM
          ? `<select data-prop="pool">${opts(CCI_CONFIG.pool, pool)}</select>`
          : `<div class="cci-readonly">${CCI_CONFIG.pool[pool]}</div>`
        }
        ${isGM
          ? `<input type="number" data-prop="poolValue" value="${poolValue}" placeholder="Value" class="cci-pool-value">`
          : (poolValue !== '' ? `<div class="cci-readonly cci-pool-value">${poolValue}</div>` : '')
        }
      </div>
    </div>
  `;

  // Durability (GM toggle + bar, player sees bar only if enabled)
  let durabilityHtml = '';
  if (isGM) {
    durabilityHtml = `
      <div class="cci-stat">
        <div class="cci-durability-header">
          <label>Durability</label>
          <label class="cci-toggle">
            <input type="checkbox" data-prop="hasDurability" ${hasDurability ? 'checked' : ''}>
            <span>On</span>
          </label>
        </div>
        ${hasDurability ? `
          <div class="cci-durability-bar">
            <div class="cci-durability-fill" style="width:${durability}%"></div>
            <span class="cci-durability-text">${durability}%</span>
          </div>
          <input type="range" data-prop="durability" value="${durability}" min="0" max="100" class="cci-durability-slider">
        ` : '<div class="cci-durability-off">Durability disabled</div>'}
      </div>
    `;
  } else if (hasDurability) {
    durabilityHtml = `
      <div class="cci-stat">
        <label>Durability</label>
        <div class="cci-durability-bar">
          <div class="cci-durability-fill" style="width:${durability}%"></div>
          <span class="cci-durability-text">${durability}%</span>
        </div>
      </div>
    `;
  }

  // Price
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

  // Size
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

  midRow.innerHTML = `<div class="cci-stats-block">${poolHtml}${durabilityHtml}${priceHtml}${sizeHtml}</div>`;
  panel.appendChild(midRow);

  // === SPECIAL: Drop Area for Abilities ===
  // GM always sees it. Player only sees if abilities exist.
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

  // === DESCRIPTION: WYSIWYG for GM, HTML render for players ===
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

  // === FLAVOR TEXT ===
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

function opts(config, selected) {
  return Object.entries(config).map(([k, v]) =>
    `<option value="${k}" ${k === selected ? 'selected' : ''}>${typeof v === 'string' ? v : v.label}</option>`
  ).join('');
}

function bindEvents(panel, item, isGM) {
  // Standard prop changes
  panel.querySelectorAll('[data-prop]').forEach(input => {
    const prop = input.dataset.prop;

    if (input.tagName === 'DIV' && input.contentEditable === 'true') {
      // WYSIWYG blur
      input.addEventListener('blur', async () => {
        const html = input.innerHTML;
        await CoolItemData.set(item, prop, html);
        if (prop === 'description') await item.update({ 'system.description': html }, { render: false });
      });
    } else {
      input.addEventListener('change', async (e) => {
        let value = e.target.value;
        if (e.target.type === 'checkbox') value = e.target.checked;
        else if (e.target.type === 'number' || e.target.type === 'range') value = parseInt(e.target.value) || 0;

        await CoolItemData.set(item, prop, value);

        if (prop === 'description') await item.update({ 'system.description': value }, { render: false });

        // Refresh durability visual
        if (prop === 'durability') {
          const fill = panel.querySelector('.cci-durability-fill');
          const text = panel.querySelector('.cci-durability-text');
          if (fill) fill.style.width = value + '%';
          if (text) text.textContent = value + '%';
        }

        // Refresh if durability toggle changed
        if (prop === 'hasDurability') {
          // Toggle visibility of durability elements without full re-render
          const bar = panel.querySelector('.cci-durability-bar');
          const slider = panel.querySelector('.cci-durability-slider');
          const offMsg = panel.querySelector('.cci-durability-off');
          if (value) {
            if (bar) bar.style.display = '';
            if (slider) slider.style.display = '';
            if (offMsg) offMsg.style.display = 'none';
          } else {
            if (bar) bar.style.display = 'none';
            if (slider) slider.style.display = 'none';
            if (offMsg) offMsg.style.display = '';
          }
        }
      });
    }
  });

  // Name change (GM only)
  const nameInput = panel.querySelector('.cci-name-input');
  if (nameInput) {
    nameInput.addEventListener('change', async (e) => {
      await item.update({ name: e.target.value }, { render: false });
    });
  }

  // === WYSIWYG TOOLBAR ===
  const wysiwyg = panel.querySelector('.cci-wysiwyg');
  if (wysiwyg) {
    panel.querySelectorAll('.cci-wysiwyg-toolbar button[data-cmd]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cmd = btn.dataset.cmd;
        document.execCommand(cmd, false, null);
        wysiwyg.focus();
      });
    });
  }

  // === IMAGE RIGHT-CLICK — Change Item Image (GM only) ===
  const itemImg = panel.querySelector('.cci-item-img');
  if (itemImg && isGM) {
    itemImg.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const fp = new FilePicker({
        type: 'image',
        current: item.img,
        callback: async (path) => {
          // Update WITHOUT re-rendering — prevents window collapse
          await item.update({ img: path }, { render: false });
          // Manually update all visible image elements
          itemImg.src = path;
          const bgEl = panel.querySelector('.cci-bg-image');
          if (bgEl) bgEl.style.backgroundImage = `url("${path}")`;
          // Update item list icon in actor sheet if visible
          const actorSheet = item.actor?.sheet?.element?.[0] || item.actor?.sheet?.element;
          if (actorSheet) {
            actorSheet.querySelectorAll(`img[data-item-id="${item.id}"], .item-image[src="${item.img}"]`).forEach(img => {
              img.src = path;
            });
          }
        }
      });
      fp.render(true);
    });
    itemImg.style.cursor = 'context-menu';
  }

  // === DROP HANDLING for Special abilities ===
  const dropzone = panel.querySelector('[data-drop="special"]');
  if (dropzone && isGM) {
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

      const abilities = CoolItemData.get(item).specialAbilities || [];
      if (abilities.find(a => a.id === droppedItem.id)) return;

      abilities.push({ id: droppedItem.id, name: droppedItem.name, img: droppedItem.img, uuid: data.uuid });
      await CoolItemData.set(item, 'specialAbilities', abilities);

      // Re-render
      const content = panel.parentElement;
      const newPanel = buildPanel(item, isGM);
      content.replaceChild(newPanel, panel);
      bindEvents(newPanel, item, isGM);
    });

    // Remove ability buttons
    panel.querySelectorAll('.cci-remove-ability').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const abilities = (CoolItemData.get(item).specialAbilities || []).filter(a => a.id !== id);
        await CoolItemData.set(item, 'specialAbilities', abilities);

        const content = panel.parentElement;
        const newPanel = buildPanel(item, isGM);
        content.replaceChild(newPanel, panel);
        bindEvents(newPanel, item, isGM);
      });
    });
  }

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

console.log(`${MODULE_ID} | loaded.`);
