import { opts, CCI_CONFIG, CoolItemData } from './core.js';

export function buildCypherPanel(item, isGM) {
  const data = CoolItemData.get(item);
  const sys = item.system || {};

  const rarity = data.rarity || 'common';
  const level = data.level ?? '';
  const cypherForm = data.cypherForm || 'subtle';
  const cypherType = data.cypherType || 'mundane';
  const position = data.position || 'none';
  const price = data.price ?? '';
  const coin = data.coin || 'gp';
  const size = data.size || 'tiny';
  const flavor = data.flavor || '';
  const description = sys.description || '';

  const panel = document.createElement('div');
  panel.className = 'cci-cool-panel cci-cypher-panel';
  if (!isGM) panel.classList.add('cci-player-view');

  const bgImg = document.createElement('div');
  bgImg.className = 'cci-bg-image';
  bgImg.style.backgroundImage = `url("${item.img || 'icons/svg/mystery-man.svg'}")`;
  panel.appendChild(bgImg);

  // === TOP ROW: Image + Name + Rarity/Type ===
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
        ? `<input type="text" name="name" value="${item.name}" class="cci-name-input" placeholder="Cypher Name">`
        : `<div class="cci-name-display">${item.name}</div>`
      }
      <div class="cci-info-fields">
        <div class="cci-field-pair">
          <label>Form</label>
          ${isGM
            ? `<select data-prop="cypherForm">${opts(CCI_CONFIG.cypherForm, cypherForm)}</select>`
            : `<div class="cci-readonly cci-cypher-form-badge">${CCI_CONFIG.cypherForm[cypherForm]}</div>`
          }
        </div>
        <div class="cci-field-pair">
          <label>Type</label>
          ${isGM
            ? `<select data-prop="cypherType">${opts(CCI_CONFIG.cypherType, cypherType)}</select>`
            : `<div class="cci-readonly cci-cypher-type-badge">${CCI_CONFIG.cypherType[cypherType]}</div>`
          }
        </div>
      </div>
    </div>
  `;
  panel.appendChild(topRow);

  // === MID ROW: Stats grid ===
  const midRow = document.createElement('div');
  midRow.className = 'cci-row cci-mid-row';

  const rarityHtml = `
    <div class="cci-stat">
      <label>Rarity</label>
      ${isGM
        ? `<select data-prop="rarity">${opts(CCI_CONFIG.rarity, rarity)}</select>`
        : `<div class="cci-readonly cci-rarity-badge" style="--rarity-color:${CCI_CONFIG.rarity[rarity]?.color}">${CCI_CONFIG.rarity[rarity]?.label}</div>`
      }
    </div>
  `;

  const levelHtml = `
    <div class="cci-stat">
      <label>Level</label>
      ${isGM
        ? `<input type="text" data-prop="level" value="${level}" placeholder="e.g. 1d6+1" class="cci-level-input">`
        : `<div class="cci-readonly">${level !== '' ? level : '—'}</div>`
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

  // Form description hint
  const formDesc = cypherForm === 'subtle' 
    ? 'Effects are internal or invisible — activated by thought, gesture, or proximity.'
    : 'Effects are external and visible — produces a physical phenomenon when activated.';

  const formDescHtml = `
    <div class="cci-stat cci-form-desc-stat">
      <label>Form Description</label>
      <div class="cci-form-description">${formDesc}</div>
    </div>
  `;

  midRow.innerHTML = `<div class="cci-stats-block">${rarityHtml}${levelHtml}${positionHtml}${priceHtml}${sizeHtml}${formDescHtml}</div>`;
  panel.appendChild(midRow);

  // === DESCRIPTION ROW ===
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

  // === FLAVOR ROW ===
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

export function bindCypherEvents(panel, item, isGM) {
  // Cypher form change — update description hint
  const formSelect = panel.querySelector('[data-prop="cypherForm"]');
  if (formSelect && isGM) {
    formSelect.addEventListener('change', async (e) => {
      await CoolItemData.set(item, 'cypherForm', e.target.value);
      // Update the form description text
      const formDescEl = panel.querySelector('.cci-form-description');
      if (formDescEl) {
        formDescEl.textContent = e.target.value === 'subtle'
          ? 'Effects are internal or invisible — activated by thought, gesture, or proximity.'
          : 'Effects are external and visible — produces a physical phenomenon when activated.';
      }
    });
  }
}
