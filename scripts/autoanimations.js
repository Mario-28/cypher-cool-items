/**
 * Cypher Cool Items — AutoAnimations integration.
 *
 * Fires Automated Animations (theripper93/autoanimations) effects when a CCI
 * attack item is used/rolled. Which animation plays is decided entirely by AA:
 *   - item-level config set via AA's "A-A" header button on the item sheet, or
 *   - the global Automatic Recognition menu, matched by item name.
 *
 * Triggers:
 *   - `cciAttackUsed` — fired by Cypher NPC Elegance's token HUD after targets
 *     are confirmed and before the defense flow starts.
 *   - `cciAbilityUsed` — fired by cypher-taskbar's ability-use dialog after the
 *     pool cost is paid and the use chat card is posted.
 * PC-side rolls that go through the native Cypher roll dialog land in chat and
 * are processed by AA's built-in cyphersystem handler — this module covers the
 * custom paths that bypass chat.
 *
 * No-op when the AutoAnimations module (id "autoanimations") is not active.
 */

import { MODULE_ID } from './core.js';

const AA_MODULE_ID = 'autoanimations';

/** @returns {boolean} true while the AutoAnimations module is active. */
export function aaActive() {
  return game.modules.get(AA_MODULE_ID)?.active === true;
}

/**
 * Resolve the canvas token representing the item's owner.
 * Prefers an active (placed) token; falls back to a controlled token of the
 * same actor so un-placed actors still animate somewhere sensible.
 * @param {Item} item
 * @returns {Token|null}
 */
function _resolveSourceToken(item) {
  const actor = item?.actor ?? item?.parent;
  if (!actor) return null;
  const tokens = actor.getActiveTokens?.() ?? [];
  if (tokens.length) return tokens[0];
  const controlled = canvas.tokens?.controlled?.find(t => t.actor?.id === actor.id);
  return controlled ?? null;
}

/**
 * Play the designated AutoAnimations effect for an item.
 * Safe to call from anywhere — returns false without side effects when AA
 * is inactive, the API is missing, or no source token can be resolved.
 *
 * @param {Item}   item             The item being used/rolled
 * @param {object} [opts]           Options
 * @param {Token}  [opts.token]     Source token override (default: resolved from item)
 * @param {Array|Set} [opts.targets] Target tokens (default: current user targets)
 * @returns {Promise<boolean>}      true if the effect was dispatched to AA
 */
export async function playItemAnimation(item, { token = null, targets = null } = {}) {
  if (!aaActive()) return false;
  const api = window.AutomatedAnimations;
  if (typeof api?.playAnimation !== 'function') return false;

  const source = token || _resolveSourceToken(item);
  if (!source) {
    console.warn(`${MODULE_ID} | AutoAnimations: no source token on canvas for "${item?.name}"`);
    return false;
  }

  const tgts = targets ?? Array.from(game.user.targets ?? []);
  try {
    await api.playAnimation(source, item, { targets: tgts });
    return true;
  } catch (err) {
    console.warn(`${MODULE_ID} | AutoAnimations play failed:`, err?.message || err);
    return false;
  }
}

/** Register the cciAttackUsed listener. Safe to call at module load. */
export function registerAutoAnimations() {
  // Attacks: fired by Cypher NPC Elegance's token HUD after targets are
  // confirmed. Abilities: fired by cypher-taskbar's ability-use dialog after
  // the pool cost is paid. PC-side rolls through the native Cypher dialog go
  // to chat and are handled by AA's built-in cyphersystem support.
  const FIRE_HOOKS = ['cciAttackUsed', 'cciAbilityUsed'];
  for (const hookName of FIRE_HOOKS) {
    // Always listen — the active check happens at fire time, so load-order
    // between CCI and AA never matters.
    Hooks.on(hookName, (item) => {
      playItemAnimation(item);
    });
  }

  Hooks.once('ready', () => {
    if (aaActive()) {
      console.log(`${MODULE_ID} | AutoAnimations integration active — effects fire on item use/roll.`);
    } else {
      console.log(`${MODULE_ID} | AutoAnimations module not active — integration idle.`);
    }
  });

  // Expose for sibling modules (e.g. cypher-taskbar custom roll paths)
  window.CCI_AA = { play: playItemAnimation, active: aaActive };
}
