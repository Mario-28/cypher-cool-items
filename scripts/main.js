/**
 * Cypher Cool Items — Main Entry Point
 * Registers all panel builders and event binders
 */

import { registerBuilder, registerBinder, MODULE_ID } from './core.js';
import { buildAbilityPanel, bindAbilityEvents } from './ability.js';
import { buildAmmoPanel, bindAmmoEvents } from './ammo.js';
import { buildArmorPanel, bindArmorEvents } from './armor.js';
import { buildArtifactPanel, bindArtifactEvents } from './artifact.js';
import { buildAttackPanel, bindAttackEvents } from './attack.js';

import { buildCypherPanel, bindCypherEvents } from './cypher.js';
import { buildEquipmentPanel, bindEquipmentEvents } from './equipment.js';
import { buildSkillPanel, bindSkillEvents } from './skill.js';

// Register panel builders
registerBuilder('ability', buildAbilityPanel);
registerBuilder('ammo', buildAmmoPanel);
registerBuilder('armor', buildArmorPanel);
registerBuilder('artifact', buildArtifactPanel);
registerBuilder('attack', buildAttackPanel);
registerBuilder('cypher', buildCypherPanel);
registerBuilder('equipment', buildEquipmentPanel);
registerBuilder('skill', buildSkillPanel);

// Register event binders
registerBinder('ability', bindAbilityEvents);
registerBinder('ammo', bindAmmoEvents);
registerBinder('armor', bindArmorEvents);
registerBinder('artifact', bindArtifactEvents);
registerBinder('attack', bindAttackEvents);
registerBinder('cypher', bindCypherEvents);
registerBinder('equipment', bindEquipmentEvents);
registerBinder('skill', bindSkillEvents);

console.log(`${MODULE_ID} | v2.0.15 modular system loaded.`);
