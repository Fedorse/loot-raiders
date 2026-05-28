import type { LootProfile } from '$lib/store/loot.svelte';
import { DEFAULT_STACK_RANGES } from '$lib/store/loot.svelte';

export interface QuestDef {
	defId: string;
	count: number;
}

export interface StageDef {
	id: number;
	name: string;
	timeLimit: number;
	lootCooldown: number;
	quests: QuestDef[];
	lootProfile: LootProfile;
}

export const STAGES: StageDef[] = [
	{
		id: 1,
		name: 'Scavenger Run',
		timeLimit: 4,
		lootCooldown: 10,
		quests: [
			{ defId: 'wpn_aphelion', count: 1 },
			{ defId: 'loot_battery', count: 3 },
			{ defId: 'loot_fabric', count: 2 },
			{ defId: 'loot_oil', count: 2 },
			{ defId: 'loot_bandage', count: 1 }
		],
		lootProfile: {
			typeWeights: { loot: 85, attachment: 2, weapon: 5, shield: 1, augment: 0 },
			typeCaps: { weapon: 1, augment: 1, shield: 1 },
			rarityWeights: { common: 55, uncommon: 30, rare: 12, epic: 3, legendary: 0 },
			attachmentChance: 0,
			getStackRange: (def) => DEFAULT_STACK_RANGES[def.rarity]
		}
	},
	{
		id: 2,
		name: 'Resource Haul',
		timeLimit: 4,
		lootCooldown: 9,
		quests: [
			{ defId: 'res_metal_parts', count: 3 },
			{ defId: 'res_rubber_parts', count: 2 },
			{ defId: 'res_wires', count: 2 },
			{ defId: 'loot_electrical_components', count: 2 },
			{ defId: 'res_arc_circuitry', count: 2 }
		],
		lootProfile: {
			typeWeights: { loot: 75, attachment: 5, weapon: 8, shield: 2, augment: 0 },
			typeCaps: { weapon: 2, augment: 1, shield: 1 },
			rarityWeights: { common: 40, uncommon: 35, rare: 18, epic: 6, legendary: 1 },
			attachmentChance: 0.1,
			getStackRange: (def) => DEFAULT_STACK_RANGES[def.rarity]
		}
	},
	{
		id: 3,
		name: 'Arms Deal',
		timeLimit: 1,
		lootCooldown: 8,
		quests: [
			{ defId: 'wpn_kettle', count: 1 },
			{ defId: 'wpn_rattler', count: 1 },
			{ defId: 'res_simple_gun_parts', count: 2 },
			{ defId: 'loot_crude_explosives', count: 2 },
			{ defId: 'res_mechanical_components', count: 3 }
		],
		lootProfile: {
			typeWeights: { loot: 55, attachment: 10, weapon: 18, shield: 3, augment: 0 },
			typeCaps: { weapon: 3, augment: 1, shield: 1 },
			rarityWeights: { common: 30, uncommon: 35, rare: 25, epic: 8, legendary: 2 },
			attachmentChance: 0.25,
			getStackRange: (def) => DEFAULT_STACK_RANGES[def.rarity]
		}
	}
	// {
	// 	id: 4,
	// 	name: 'High Value Targets',
	// 	timeLimit: 70,
	// 	lootCooldown: 8,
	// 	quests: [
	// 		{ defId: 'wpn_tempest', count: 1 },
	// 		{ defId: 'loot_industrial_magnet', count: 1 },
	// 		{ defId: 'res_processor', count: 2 },
	// 		{ defId: 'loot_sensors', count: 2 },
	// 		{ defId: 'loot_voltage_converter', count: 1 }
	// 	],
	// 	lootProfile: {
	// 		typeWeights: { loot: 50, attachment: 12, weapon: 18, shield: 5, augment: 0 },
	// 		typeCaps: { weapon: 3, augment: 1, shield: 1 },
	// 		rarityWeights: { common: 20, uncommon: 30, rare: 30, epic: 15, legendary: 5 },
	// 		attachmentChance: 0.4,
	// 		getStackRange: (def) => DEFAULT_STACK_RANGES[def.rarity]
	// 	}
	// },
	// {
	// 	id: 5,
	// 	name: 'Final Extraction',
	// 	timeLimit: 60,
	// 	lootCooldown: 7,
	// 	quests: [
	// 		{ defId: 'wpn_aphelion', count: 1 },
	// 		{ defId: 'loot_exodus_modules', count: 1 },
	// 		{ defId: 'res_bastion_cell', count: 1 },
	// 		{ defId: 'res_magnetic_accelerator', count: 1 },
	// 		{ defId: 'loot_leaper_pulse_unit', count: 1 }
	// 	],
	// 	lootProfile: {
	// 		typeWeights: { loot: 40, attachment: 15, weapon: 22, shield: 8, augment: 0 },
	// 		typeCaps: { weapon: 3, augment: 1, shield: 1 },
	// 		rarityWeights: { common: 10, uncommon: 20, rare: 30, epic: 25, legendary: 15 },
	// 		attachmentChance: 0.5,
	// 		getStackRange: (def) => DEFAULT_STACK_RANGES[def.rarity]
	// 	}
	// }
];
