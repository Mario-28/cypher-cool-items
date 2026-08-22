import { buildSpecialRow, opts, CCI_CONFIG, CoolItemData } from './core.js';

export function buildArmorPanel(item, isGM) {
  const data = CoolItemData.get(item);
  const sys = item.system || {};

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

export function bindArmorEvents(panel, item, isGM) {
  // Durability toggle
  const durToggle = panel.querySelector('input[data-prop="hasDurability"]');
  if (durToggle) {
    durToggle.addEventListener('change', async (e) => {
      await CoolItemData.set(item, 'hasDurability', e.target.checked);
      const durRow = panel.querySelector('.cci-durability-row');
      if (durRow) {
        const data = CoolItemData.get(item);
        const hasDur = data.hasDurability !== false;
        const durability = data.durability ?? 100;
        const durColor = durability > 50 ? '#4ade80' : (durability > 20 ? '#fbbf24' : '#ef4444');
        durRow.innerHTML = `
          <div class="cci-durability-header">
            <label>Durability</label>
            <label class="cci-durability-toggle"><input type="checkbox" data-prop="hasDurability" ${hasDur ? 'checked' : ''}> Enabled</label>
          </div>
          ${hasDur
            ? `<div class="cci-durability-track">
                <div class="cci-durability-bar"><div class="cci-durability-fill" style="width:${durability}%; background:${durColor};"></div></div>
                <input type="number" data-prop="durability" value="${durability}" min="0" max="100" class="cci-durability-input">
              </div>`
            : '<div class="cci-durability-off">Durability disabled</div>'
          }
        `;
      }
      bindArmorEvents(panel, item, isGM);
    });
  }
}
