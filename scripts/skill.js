import { opts, CCI_CONFIG, CoolItemData } from './core.js';

export function buildSkillPanel(item, isGM) {
  const data = CoolItemData.get(item);
  const sys = item.system || {};

  const skillStat = data.skillStat || 'might';
  const skillTraining = data.skillTraining || 'practiced';
  const skillType = data.skillType || 'physical';
  const flavor = data.flavor || '';
  const description = sys.description || '';

  const panel = document.createElement('div');
  panel.className = 'cci-cool-panel cci-skill-panel';
  if (!isGM) panel.classList.add('cci-player-view');

  const bgImg = document.createElement('div');
  bgImg.className = 'cci-bg-image';
  bgImg.style.backgroundImage = `url("${item.img || 'icons/svg/mystery-man.svg'}")`;
  panel.appendChild(bgImg);

  // === TOP ROW: Image + Name + Type ===
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
        ? `<input type="text" name="name" value="${item.name}" class="cci-name-input" placeholder="Skill Name">`
        : `<div class="cci-name-display">${item.name}</div>`
      }
      <div class="cci-info-fields">
        <div class="cci-field-pair" style="grid-column: 1 / -1;">
          <label>Skill Type</label>
          ${isGM
            ? `<select data-prop="skillType">${opts(CCI_CONFIG.skillType, skillType)}</select>`
            : `<div class="cci-readonly cci-skill-type-badge">${CCI_CONFIG.skillType[skillType]}</div>`
          }
        </div>
      </div>
    </div>
  `;
  panel.appendChild(topRow);

  // === STAT + TRAINING ROW ===
  const statRow = document.createElement('div');
  statRow.className = 'cci-row cci-stat-row';
  statRow.innerHTML = `
    <div class="cci-stats-block cci-skill-stats">
      <div class="cci-stat">
        <label>Stat</label>
        ${isGM
          ? `<select data-prop="skillStat">${opts(CCI_CONFIG.skillStat, skillStat)}</select>`
          : `<div class="cci-readonly cci-skill-stat-badge">${CCI_CONFIG.skillStat[skillStat]}</div>`
        }
      </div>
      <div class="cci-stat">
        <label>Training</label>
        <select data-prop="skillTraining">${opts(CCI_CONFIG.skillTraining, skillTraining)}</select>
      </div>
    </div>
  `;
  panel.appendChild(statRow);

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

export function bindSkillEvents(panel, item, isGM) {
  // Skill-specific events (if needed in the future)
  // Currently all standard field bindings are handled by bindCommonEvents in core.js
}
