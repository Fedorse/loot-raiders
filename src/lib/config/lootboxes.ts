import type { LootboxDef, ItemRarity } from '$lib/types';

export const LOOTBOX_DB: Record<ItemRarity, LootboxDef> = {
	common: {
		rarity: 'common',
		image: '/assets/ui/loot_box_assets/WickerBasket.png',
		slots: 4,
		spinWeight: 50,
		lootTable: [
			// Resources
			{ defId: 'res_metal_parts', weight: 6, countMin: 1, countMax: 3 },
			{ defId: 'res_rubber_parts', weight: 6, countMin: 1, countMax: 3 },
			{ defId: 'res_plastic_parts', weight: 6, countMin: 1, countMax: 3 },
			{ defId: 'res_wires', weight: 6, countMin: 1, countMax: 3 },
			{ defId: 'res_duct_tape', weight: 6, countMin: 1, countMax: 3 },
			{ defId: 'res_steel_spring', weight: 6, countMin: 1, countMax: 3 },
			{ defId: 'res_arc_circuitry', weight: 6, countMin: 1, countMax: 3 },
			// Ammo
			{ defId: 'ammo_light', weight: 5, countMin: 5, countMax: 15 },
			{ defId: 'ammo_medium', weight: 5, countMin: 5, countMax: 15 },
			{ defId: 'ammo_heavy', weight: 5, countMin: 5, countMax: 15 },
			{ defId: 'ammo_shotgun', weight: 5, countMin: 5, countMax: 15 },
			// Loot
			{ defId: 'loot_chemicals', weight: 3 },
			{ defId: 'loot_fabric', weight: 3 },
			{ defId: 'loot_arc_powercell', weight: 3 },
			{ defId: 'loot_assorted_seeds', weight: 3 },
			{ defId: 'loot_rubber_duck', weight: 3 },
			{ defId: 'loot_bloated_tuna_can', weight: 3 },
			{ defId: 'loot_bandage', weight: 3 },
			{ defId: 'loot_adrenaline_shot', weight: 3 },
			{ defId: 'loot_blue_light_stick', weight: 3 },
			{ defId: 'loot_green_light_stick', weight: 3 },
			{ defId: 'loot_red_light_stick', weight: 3 },
			{ defId: 'loot_firecracker', weight: 3 },
			{ defId: 'loot_gas_grenade', weight: 3 },
			{ defId: 'loot_gas_mine', weight: 3 },
			{ defId: 'loot_light_impact_grenade', weight: 3 },
			{ defId: 'loot_lil_smoke_grenade', weight: 3 },
			{ defId: 'loot_door_blocker', weight: 3 },
			{ defId: 'loot_binoculars', weight: 3 },
			// Attachments
			{ defId: 'att_angled_grip_1', weight: 4 },
			{ defId: 'att_vertical_grip_1', weight: 4 },
			{ defId: 'att_compensator_1', weight: 4 },
			{ defId: 'att_muzzle_brake_1', weight: 4 },
			{ defId: 'att_shotgun_choke_1', weight: 4 },
			{ defId: 'att_ext_light_mag_1', weight: 4 },
			{ defId: 'att_ext_medium_mag_1', weight: 4 },
			{ defId: 'att_ext_shotgun_mag_1', weight: 4 },
			{ defId: 'att_stable_stock_1', weight: 4 },
			// Weapons
			{ defId: 'wpn_kettle', weight: 3 },
			{ defId: 'wpn_rattler', weight: 3 },
			{ defId: 'wpn_ferro', weight: 3 },
			{ defId: 'wpn_stitcher', weight: 3 },
			{ defId: 'wpn_hairpin', weight: 3 },
			// Augments
			{ defId: 'aug_free_loadout', weight: 2 }
		]
	},
	uncommon: {
		rarity: 'uncommon',
		image: '/assets/ui/loot_box_assets/Bucket.png',
		slots: 5,
		spinWeight: 25,
		lootTable: [
			// Resources
			{ defId: 'res_mechanical_components', weight: 6, countMin: 1, countMax: 3 },
			{ defId: 'res_simple_gun_parts', weight: 6, countMin: 1, countMax: 3 },
			{ defId: 'res_light_gun_parts', weight: 6, countMin: 1, countMax: 3 },
			{ defId: 'res_medium_gun_parts', weight: 6, countMin: 1, countMax: 3 },
			{ defId: 'res_processor', weight: 6, countMin: 1, countMax: 3 },
			// Loot
			{ defId: 'loot_arc_alloy', weight: 3 },
			{ defId: 'loot_battery', weight: 3 },
			{ defId: 'loot_canister', weight: 3 },
			{ defId: 'loot_crude_explosives', weight: 3 },
			{ defId: 'loot_durable_cloth', weight: 3 },
			{ defId: 'loot_electrical_components', weight: 3 },
			{ defId: 'loot_magnet', weight: 3 },
			{ defId: 'loot_oil', weight: 3 },
			{ defId: 'loot_great_mullein', weight: 3 },
			{ defId: 'loot_number_plate', weight: 3 },
			{ defId: 'loot_crumpled_plastic_bottle', weight: 3 },
			{ defId: 'loot_camera_lens', weight: 3 },
			{ defId: 'loot_deflated_football', weight: 3 },
			{ defId: 'loot_ruined_baton', weight: 3 },
			{ defId: 'loot_ruined_handcuffs', weight: 3 },
			{ defId: 'loot_ruined_tactical_vest', weight: 3 },
			{ defId: 'loot_cat_bed', weight: 3 },
			{ defId: 'loot_apricot', weight: 3 },
			{ defId: 'loot_olives', weight: 3 },
			{ defId: 'loot_prickly_pear', weight: 3 },
			{ defId: 'loot_mushroom', weight: 3 },
			{ defId: 'loot_air_freshener', weight: 3 },
			{ defId: 'loot_dart_board', weight: 3 },
			{ defId: 'loot_light_bulb', weight: 3 },
			{ defId: 'loot_very_comfortable_pillow', weight: 3 },
			{ defId: 'loot_barricade_kit', weight: 3 },
			{ defId: 'loot_herbal_bandage', weight: 3 },
			{ defId: 'loot_lure_grenade', weight: 3 },
			{ defId: 'loot_pulse_mine', weight: 3 },
			{ defId: 'loot_recorder', weight: 3 },
			{ defId: 'loot_seeker_grenade', weight: 3 },
			{ defId: 'loot_shaker', weight: 3 },
			{ defId: 'loot_shield_recharger', weight: 3 },
			{ defId: 'loot_shrapnel_grenade', weight: 3 },
			{ defId: 'loot_snap_blast_grenade', weight: 3 },
			{ defId: 'loot_noise_maker', weight: 3 },
			{ defId: 'loot_raider_flare', weight: 3 },
			// Attachments
			{ defId: 'att_vertical_grip_2', weight: 4 },
			{ defId: 'att_compensator_2', weight: 4 },
			{ defId: 'att_muzzle_brake_2', weight: 4 },
			{ defId: 'att_silencer_1', weight: 4 },
			{ defId: 'att_shotgun_choke_2', weight: 4 },
			{ defId: 'att_ext_light_mag_2', weight: 4 },
			{ defId: 'att_ext_medium_mag_2', weight: 4 },
			{ defId: 'att_ext_shotgun_mag_2', weight: 4 },
			{ defId: 'att_stable_stock_2', weight: 4 },
			// Weapons
			{ defId: 'wpn_arpeggio', weight: 3 },
			{ defId: 'wpn_il_toro', weight: 3 },
			{ defId: 'wpn_burletta', weight: 3 },
			{ defId: 'wpn_anvil', weight: 3 },
			// Augments
			{ defId: 'eqp_tactical_mk1', weight: 2 },
			{ defId: 'aug_combat_mk1', weight: 2 },
			{ defId: 'aug_looting_mk1', weight: 2 },
			{ defId: 'aug_tactical_mk1', weight: 2 },
			// Shields
			{ defId: 'eqp_light_shield', weight: 2 },
			{ defId: 'shield_light', weight: 2 }
		]
	},
	rare: {
		rarity: 'rare',
		image: '/assets/ui/loot_box_assets/PicnicBasket.png',
		slots: 6,
		spinWeight: 15,
		lootTable: [
			// Resources
			{ defId: 'res_adv_mechanical_components', weight: 6, countMin: 1, countMax: 3 },
			{ defId: 'res_heavy_gun_parts', weight: 6, countMin: 1, countMax: 3 },
			{ defId: 'res_mod_components', weight: 6, countMin: 1, countMax: 3 },
			{ defId: 'res_toaster', weight: 6, countMin: 1, countMax: 3 },
			// Ammo
			{ defId: 'ammo_energy', weight: 5, countMin: 5, countMax: 15 },
			{ defId: 'ammo_launcher', weight: 5, countMin: 5, countMax: 15 },
			// Loot
			{ defId: 'loot_adv_arc_powercell', weight: 3 },
			{ defId: 'loot_adv_electrical', weight: 3 },
			{ defId: 'loot_antiseptic', weight: 3 },
			{ defId: 'loot_arc_flex_rubber', weight: 3 },
			{ defId: 'loot_arc_motion_core', weight: 3 },
			{ defId: 'loot_arc_performance_steel', weight: 3 },
			{ defId: 'loot_arc_thermo_lining', weight: 3 },
			{ defId: 'loot_coolant', weight: 3 },
			{ defId: 'loot_explosive_compound', weight: 3 },
			{ defId: 'loot_moss', weight: 3 },
			{ defId: 'loot_sensors', weight: 3 },
			{ defId: 'loot_speaker_component', weight: 3 },
			{ defId: 'loot_syringe', weight: 3 },
			{ defId: 'loot_synthesized_fuel', weight: 3 },
			{ defId: 'loot_voltage_converter', weight: 3 },
			{ defId: 'loot_dog_collar', weight: 3 },
			{ defId: 'loot_broken_flashlight', weight: 3 },
			{ defId: 'loot_broken_guidance_system', weight: 3 },
			{ defId: 'loot_damaged_heat_sink', weight: 3 },
			{ defId: 'loot_expired_respirator', weight: 3 },
			{ defId: 'loot_freq_mod_box', weight: 3 },
			{ defId: 'loot_fried_motherboard', weight: 3 },
			{ defId: 'loot_frying_pan', weight: 3 },
			{ defId: 'loot_headphones', weight: 3 },
			{ defId: 'loot_industrial_battery', weight: 3 },
			{ defId: 'loot_industrial_charger', weight: 3 },
			{ defId: 'loot_industrial_magnet', weight: 3 },
			{ defId: 'loot_motor', weight: 3 },
			{ defId: 'loot_polluted_air_filter', weight: 3 },
			{ defId: 'loot_portable_tv', weight: 3 },
			{ defId: 'loot_power_bank', weight: 3 },
			{ defId: 'loot_power_cable', weight: 3 },
			{ defId: 'loot_projector', weight: 3 },
			{ defId: 'loot_ruined_accordion', weight: 3 },
			{ defId: 'loot_rusted_gear', weight: 3 },
			{ defId: 'loot_rusted_medical_kit', weight: 3 },
			{ defId: 'loot_rusted_tools', weight: 3 },
			{ defId: 'loot_torn_blanket', weight: 3 },
			{ defId: 'loot_turbo_pump', weight: 3 },
			{ defId: 'loot_wasp_driver', weight: 3 },
			{ defId: 'loot_water_filter', weight: 3 },
			{ defId: 'loot_water_pump', weight: 3 },
			{ defId: 'loot_music_album', weight: 3 },
			{ defId: 'loot_fine_wristwatch', weight: 3 },
			{ defId: 'loot_silver_teaspoon_set', weight: 3 },
			{ defId: 'loot_statuette', weight: 3 },
			{ defId: 'loot_blaze_grenade', weight: 3 },
			{ defId: 'loot_blaze_grenade_trap', weight: 3 },
			{ defId: 'loot_defibrillator', weight: 3 },
			{ defId: 'loot_heavy_fuze_grenade', weight: 3 },
			{ defId: 'loot_jolt_mine', weight: 3 },
			{ defId: 'loot_rope', weight: 3 },
			{ defId: 'loot_smoke_grenade', weight: 3 },
			{ defId: 'loot_sterilized_bandage', weight: 3 },
			{ defId: 'loot_surge_shield_recharger', weight: 3 },
			{ defId: 'loot_tagging_grenade', weight: 3 },
			{ defId: 'loot_fireworks_box', weight: 3 },
			{ defId: 'loot_showstopper_grenade', weight: 3 },
			// Keys
			{ defId: 'key_blue_gate_cellar', weight: 1 },
			{ defId: 'key_buried_city_hospital', weight: 1 },
			{ defId: 'key_raider_hatch', weight: 1 },
			// Attachments
			{ defId: 'att_angled_grip_3', weight: 4 },
			{ defId: 'att_vertical_grip_3', weight: 4 },
			{ defId: 'att_compensator_3', weight: 4 },
			{ defId: 'att_muzzle_brake_3', weight: 4 },
			{ defId: 'att_silencer_2', weight: 4 },
			{ defId: 'att_shotgun_choke_3', weight: 4 },
			{ defId: 'att_ext_light_mag_3', weight: 4 },
			{ defId: 'att_ext_medium_mag_3', weight: 4 },
			{ defId: 'att_ext_shotgun_mag_3', weight: 4 },
			{ defId: 'att_stable_stock_3', weight: 4 },
			// Weapons
			{ defId: 'wpn_renegade', weight: 3 },
			{ defId: 'wpn_venator', weight: 3 },
			{ defId: 'wpn_torrente', weight: 3 },
			{ defId: 'wpn_osprey', weight: 3 },
			// Augments
			{ defId: 'aug_combat_mk2', weight: 2 },
			{ defId: 'aug_looting_mk2', weight: 2 },
			{ defId: 'aug_tactical_mk2', weight: 2 },
			// Shields
			{ defId: 'shield_medium', weight: 2 }
		]
	},
	epic: {
		rarity: 'epic',
		image: '/assets/ui/loot_box_assets/Cauldron.png',
		slots: 7,
		spinWeight: 8,
		lootTable: [
			// Resources
			{ defId: 'res_complex_gun_parts', weight: 6, countMin: 1, countMax: 3 },
			{ defId: 'res_magnetic_accelerator', weight: 6, countMin: 1, countMax: 3 },
			{ defId: 'res_bastion_cell', weight: 6, countMin: 1, countMax: 3 },
			// Loot
			{ defId: 'loot_power_rod', weight: 3 },
			{ defId: 'loot_exodus_modules', weight: 3 },
			{ defId: 'loot_leaper_pulse_unit', weight: 3 },
			{ defId: 'loot_snow_globe', weight: 3 },
			{ defId: 'loot_photoelectric_cloak', weight: 3 },
			{ defId: 'loot_deadline', weight: 3 },
			// Keys
			{ defId: 'key_blue_gate_confiscation', weight: 1 },
			// Attachments
			{ defId: 'att_horizontal_grip', weight: 4 },
			{ defId: 'att_extended_barrel', weight: 4 },
			{ defId: 'att_padded_stock', weight: 4 },
			{ defId: 'att_lightweight_stock', weight: 4 },
			// Weapons
			{ defId: 'wpn_tempest', weight: 3 },
			{ defId: 'wpn_bettina', weight: 3 },
			{ defId: 'wpn_bobcat', weight: 3 },
			{ defId: 'wpn_vulcano', weight: 3 },
			{ defId: 'wpn_hullcracker', weight: 3 },
			// Augments
			{ defId: 'aug_combat_mk3_aggressive', weight: 2 },
			{ defId: 'aug_looting_mk3_cautious', weight: 2 },
			{ defId: 'aug_looting_mk3_survivor', weight: 2 },
			{ defId: 'aug_tactical_mk3_healing', weight: 2 },
			// Shields
			{ defId: 'shield_heavy', weight: 2 }
		]
	},
	legendary: {
		rarity: 'legendary',
		image: '/assets/ui/loot_box_assets/AirtightContainer.png',
		slots: 8,
		spinWeight: 2,
		lootTable: [
			// Loot
			{ defId: 'loot_matriarch_reactor', weight: 3 },
			{ defId: 'loot_acoustic_guitar', weight: 3 },
			{ defId: 'loot_snap_hook', weight: 3 },
			// Attachments
			{ defId: 'att_kinetic_converter', weight: 4 },
			{ defId: 'att_anvil_splitter', weight: 4 },
			// Weapons
			{ defId: 'wpn_aphelion', weight: 3 },
			{ defId: 'wpn_jupiter', weight: 3 },
			{ defId: 'wpn_equalizer', weight: 3 }
		]
	}
};

export const LOOTBOX_ORDER: ItemRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export const getLootboxDef = (rarity: ItemRarity): LootboxDef => {
	return LOOTBOX_DB[rarity];
};
