import type { LootboxDef } from '$lib/types';

export const LOOTBOX_DB: Record<string, LootboxDef> = {
	box_wicker: {
		id: 'box_wicker',
		name: 'Wicker Basket',
		rarity: 'common',
		image: '/assets/ui/loot_box_assets/WickerBasket.png',
		slots: 4,
		lootTable: [
			{ defId: 'res_metal_parts', weight: 10, countMin: 2, countMax: 5 },
			{ defId: 'res_rubber_parts', weight: 10, countMin: 2, countMax: 4 },
			{ defId: 'res_plastic_parts', weight: 10, countMin: 2, countMax: 5 },
			{ defId: 'res_wires', weight: 8, countMin: 1, countMax: 3 },
			{ defId: 'res_duct_tape', weight: 8, countMin: 1, countMax: 3 },
			{ defId: 'loot_chemicals', weight: 6, countMin: 1, countMax: 2 },
			{ defId: 'loot_fabric', weight: 6, countMin: 1, countMax: 2 },
			{ defId: 'att_angled_grip_1', weight: 3 },
			{ defId: 'att_compensator_1', weight: 3 },
			{ defId: 'att_ext_light_mag_1', weight: 3 },
			{ defId: 'att_stable_stock_1', weight: 3 }
		]
	},
	box_bucket: {
		id: 'box_bucket',
		name: 'Bucket',
		rarity: 'uncommon',
		image: '/assets/ui/loot_box_assets/Bucket.png',
		slots: 5,
		lootTable: [
			{ defId: 'res_mechanical_components', weight: 8, countMin: 2, countMax: 4 },
			{ defId: 'res_simple_gun_parts', weight: 8, countMin: 1, countMax: 3 },
			{ defId: 'res_steel_spring', weight: 6, countMin: 1, countMax: 3 },
			{ defId: 'loot_oil', weight: 5, countMin: 1, countMax: 2 },
			{ defId: 'loot_battery', weight: 5, countMin: 1, countMax: 2 },
			{ defId: 'wpn_kettle', weight: 3 },
			{ defId: 'wpn_rattler', weight: 3 },
			{ defId: 'att_vertical_grip_1', weight: 4 },
			{ defId: 'att_muzzle_brake_1', weight: 4 },
			{ defId: 'att_ext_medium_mag_1', weight: 3 }
		]
	},
	box_picnic: {
		id: 'box_picnic',
		name: 'Picnic Basket',
		rarity: 'rare',
		image: '/assets/ui/loot_box_assets/PicnicBasket.png',
		slots: 6,
		lootTable: [
			{ defId: 'res_adv_mechanical_components', weight: 6, countMin: 1, countMax: 3 },
			{ defId: 'res_light_gun_parts', weight: 6, countMin: 1, countMax: 2 },
			{ defId: 'res_mod_components', weight: 5, countMin: 1, countMax: 3 },
			{ defId: 'loot_arc_powercell', weight: 4, countMin: 1, countMax: 2 },
			{ defId: 'wpn_arpeggio', weight: 3 },
			{ defId: 'wpn_bobcat', weight: 3 },
			{ defId: 'eqp_tactical_mk1', weight: 2 },
			{ defId: 'att_compensator_2', weight: 4 },
			{ defId: 'att_vertical_grip_2', weight: 4 },
			{ defId: 'att_ext_light_mag_2', weight: 3 },
			{ defId: 'att_stable_stock_2', weight: 3 }
		]
	},
	box_cauldron: {
		id: 'box_cauldron',
		name: 'Cauldron',
		rarity: 'epic',
		image: '/assets/ui/loot_box_assets/Cauldron.png',
		slots: 7,
		lootTable: [
			{ defId: 'res_medium_gun_parts', weight: 5, countMin: 1, countMax: 2 },
			{ defId: 'res_complex_gun_parts', weight: 4, countMin: 1, countMax: 2 },
			{ defId: 'res_processor', weight: 4, countMin: 1, countMax: 2 },
			{ defId: 'wpn_tempest', weight: 3 },
			{ defId: 'wpn_bettina', weight: 3 },
			{ defId: 'wpn_ferro', weight: 3 },
			{ defId: 'eqp_light_shield', weight: 2 },
			{ defId: 'att_compensator_3', weight: 3 },
			{ defId: 'att_angled_grip_3', weight: 3 },
			{ defId: 'att_silencer_1', weight: 3 },
			{ defId: 'att_ext_medium_mag_2', weight: 3 }
		]
	},
	box_airtight: {
		id: 'box_airtight',
		name: 'Airtight Container',
		rarity: 'legendary',
		image: '/assets/ui/loot_box_assets/AirtightContainer.png',
		slots: 8,
		lootTable: [
			{ defId: 'res_heavy_gun_parts', weight: 4, countMin: 1, countMax: 2 },
			{ defId: 'res_magnetic_accelerator', weight: 3, countMin: 1, countMax: 2 },
			{ defId: 'res_arc_circuitry', weight: 3, countMin: 1, countMax: 3 },
			{ defId: 'wpn_renegade', weight: 3 },
			{ defId: 'wpn_aphelion', weight: 2 },
			{ defId: 'wpn_vulcano', weight: 2 },
			{ defId: 'wpn_il_toro', weight: 2 },
			{ defId: 'att_silencer_2', weight: 3 },
			{ defId: 'att_stable_stock_3', weight: 3 },
			{ defId: 'att_ext_light_mag_3', weight: 3 },
			{ defId: 'att_kinetic_converter', weight: 2 }
		]
	}
};

export const LOOTBOX_ORDER: string[] = [
	'box_wicker',
	'box_bucket',
	'box_picnic',
	'box_cauldron',
	'box_airtight'
];

export const getLootboxDef = (id: string): LootboxDef => {
	return LOOTBOX_DB[id];
};
