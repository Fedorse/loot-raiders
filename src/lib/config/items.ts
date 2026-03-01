import type { ItemDefinition } from '$lib/types';

export const ITEM_DB: Record<string, ItemDefinition> = {
	// ──────────────────────────────────────
	// ASSAULT RIFLES
	// ──────────────────────────────────────
	wpn_kettle: {
		id: 'wpn_kettle',
		name: 'Kettle',
		type: 'weapon',
		rarity: 'common',
		weight: 7,
		price: 840,
		image: '/assets/items/weapons/kettle.png',
		categoryIcon: '/assets/ui/ammo_type_assets/light_ammo.png',
		description: 'Quick and accurate, but has low bullet velocity and takes a long time to reload.',
		weaponClass: 'Assault Rifle',
		ammoType: 'Light Ammo',
		magazineSize: 20,
		firingMode: 'Semi-Automatic',
		armorPenetration: 'Very Weak',
		recycling: [
			{ itemId: 'res_metal_parts', amount: 3, name: 'Metal Parts' },
			{ itemId: 'res_rubber_parts', amount: 2, name: 'Rubber Parts' }
		],
		attachmentSlots: [
			{ type: 'muzzle', placeholder: '/assets/ui/mod_slot_assets/muzzle.png' },
			{ type: 'underbarrel', placeholder: '/assets/ui/mod_slot_assets/underbarrel.png' },
			{ type: 'magazine', placeholder: '/assets/ui/mod_slot_assets/light_magazine.png' },
			{ type: 'stock', placeholder: '/assets/ui/mod_slot_assets/stock.png' }
		]
	},
	wpn_rattler: {
		id: 'wpn_rattler',
		name: 'Rattler',
		type: 'weapon',
		rarity: 'common',
		weight: 6,
		price: 1750,
		image: '/assets/items/weapons/rattler.png',
		categoryIcon: '/assets/ui/ammo_type_assets/medium_ammo.png',
		description: 'A cheap offensive option, but has to be reloaded 2 bullets at a time.',
		weaponClass: 'Assault Rifle',
		ammoType: 'Medium Ammo',
		magazineSize: 12,
		firingMode: 'Fully-Automatic',
		armorPenetration: 'Moderate',
		recycling: [{ itemId: 'res_metal_parts', amount: 8, name: 'Metal Parts' }],
		attachmentSlots: [
			{ type: 'muzzle', placeholder: '/assets/ui/mod_slot_assets/muzzle.png' },
			{ type: 'underbarrel', placeholder: '/assets/ui/mod_slot_assets/underbarrel.png' },
			{ type: 'stock', placeholder: '/assets/ui/mod_slot_assets/stock.png' }
		]
	},
	wpn_arpeggio: {
		id: 'wpn_arpeggio',
		name: 'Arpeggio',
		type: 'weapon',
		rarity: 'uncommon',
		weight: 7,
		price: 5500,
		image: '/assets/items/weapons/arpeggio.png',
		categoryIcon: '/assets/ui/ammo_type_assets/medium_ammo.png',
		description: 'Has decent damage output and accuracy.',
		weaponClass: 'Assault Rifle',
		ammoType: 'Medium Ammo',
		magazineSize: 24,
		firingMode: '3-Round Burst',
		armorPenetration: 'Moderate',
		recycling: [
			{ itemId: 'res_mechanical_components', amount: 2, name: 'Mechanical Components' },
			{ itemId: 'res_simple_gun_parts', amount: 2, name: 'Simple Gun Parts' }
		],
		attachmentSlots: [
			{ type: 'muzzle', placeholder: '/assets/ui/mod_slot_assets/muzzle.png' },
			{ type: 'underbarrel', placeholder: '/assets/ui/mod_slot_assets/underbarrel.png' },
			{ type: 'magazine', placeholder: '/assets/ui/mod_slot_assets/medium_magazine.png' },
			{ type: 'stock', placeholder: '/assets/ui/mod_slot_assets/stock.png' }
		]
	},
	wpn_tempest: {
		id: 'wpn_tempest',
		name: 'Tempest',
		type: 'weapon',
		rarity: 'epic',
		weight: 11,
		price: 13000,
		image: '/assets/items/weapons/tempest.png',
		categoryIcon: '/assets/ui/ammo_type_assets/medium_ammo.png',
		description: 'Has moderate fire rate and accuracy.',
		weaponClass: 'Assault Rifle',
		ammoType: 'Medium Ammo',
		magazineSize: 25,
		firingMode: 'Fully-Automatic',
		armorPenetration: 'Moderate',
		recycling: [
			{
				itemId: 'res_adv_mechanical_components',
				amount: 2,
				name: 'Advanced Mechanical Components'
			},
			{ itemId: 'res_medium_gun_parts', amount: 2, name: 'Medium Gun Parts' }
		],
		attachmentSlots: [
			{ type: 'muzzle', placeholder: '/assets/ui/mod_slot_assets/muzzle.png' },
			{ type: 'underbarrel', placeholder: '/assets/ui/mod_slot_assets/underbarrel.png' },
			{ type: 'magazine', placeholder: '/assets/ui/mod_slot_assets/medium_magazine.png' }
		]
	},
	wpn_bettina: {
		id: 'wpn_bettina',
		name: 'Bettina',
		type: 'weapon',
		rarity: 'epic',
		weight: 11,
		price: 8000,
		image: '/assets/items/weapons/bettina.png',
		categoryIcon: '/assets/ui/ammo_type_assets/heavy_ammo.png',
		description: 'Has slow fire rate and high damage output.',
		weaponClass: 'Assault Rifle',
		ammoType: 'Heavy Ammo',
		magazineSize: 22,
		firingMode: 'Fully-Automatic',
		armorPenetration: 'Strong',
		recycling: [
			{
				itemId: 'res_adv_mechanical_components',
				amount: 1,
				name: 'Advanced Mechanical Components'
			},
			{ itemId: 'res_heavy_gun_parts', amount: 2, name: 'Heavy Gun Parts' }
		],
		attachmentSlots: [
			{ type: 'muzzle', placeholder: '/assets/ui/mod_slot_assets/muzzle.png' },
			{ type: 'underbarrel', placeholder: '/assets/ui/mod_slot_assets/underbarrel.png' },
			{ type: 'stock', placeholder: '/assets/ui/mod_slot_assets/stock.png' }
		]
	},

	// ──────────────────────────────────────
	// BATTLE RIFLES
	// ──────────────────────────────────────
	wpn_ferro: {
		id: 'wpn_ferro',
		name: 'Ferro',
		type: 'weapon',
		rarity: 'common',
		weight: 8,
		price: 475,
		image: '/assets/items/weapons/ferro.png',
		categoryIcon: '/assets/ui/ammo_type_assets/heavy_ammo.png',
		description: 'Packs a punch, but must be reloaded between every shot.',
		weaponClass: 'Battle Rifle',
		ammoType: 'Heavy Ammo',
		magazineSize: 1,
		firingMode: 'Break-Action',
		armorPenetration: 'Strong',
		recycling: [
			{ itemId: 'res_metal_parts', amount: 2, name: 'Metal Parts' },
			{ itemId: 'res_rubber_parts', amount: 1, name: 'Rubber Parts' }
		],
		attachmentSlots: [
			{ type: 'muzzle', placeholder: '/assets/ui/mod_slot_assets/muzzle.png' },
			{ type: 'underbarrel', placeholder: '/assets/ui/mod_slot_assets/underbarrel.png' },
			{ type: 'stock', placeholder: '/assets/ui/mod_slot_assets/stock.png' }
		]
	},
	wpn_renegade: {
		id: 'wpn_renegade',
		name: 'Renegade',
		type: 'weapon',
		rarity: 'rare',
		weight: 10,
		price: 7000,
		image: '/assets/items/weapons/renegade.png',
		categoryIcon: '/assets/ui/ammo_type_assets/medium_ammo.png',
		description: 'A powerful weapon in the hands of a skilled marksman.',
		weaponClass: 'Battle Rifle',
		ammoType: 'Medium Ammo',
		magazineSize: 8,
		firingMode: 'Lever-Action',
		armorPenetration: 'Moderate',
		recycling: [
			{
				itemId: 'res_adv_mechanical_components',
				amount: 1,
				name: 'Advanced Mechanical Components'
			},
			{ itemId: 'res_medium_gun_parts', amount: 2, name: 'Medium Gun Parts' }
		],
		attachmentSlots: [
			{ type: 'muzzle', placeholder: '/assets/ui/mod_slot_assets/muzzle.png' },
			{ type: 'magazine', placeholder: '/assets/ui/mod_slot_assets/medium_magazine.png' },
			{ type: 'stock', placeholder: '/assets/ui/mod_slot_assets/stock.png' }
		]
	},
	wpn_aphelion: {
		id: 'wpn_aphelion',
		name: 'Aphelion',
		type: 'weapon',
		rarity: 'legendary',
		weight: 10,
		price: 27500,
		image: '/assets/items/weapons/aphelion.png',
		categoryIcon: '/assets/ui/ammo_type_assets/energy_clip.png',
		description: 'Fires high velocity energy rounds.',
		weaponClass: 'Battle Rifle',
		ammoType: 'Energy Clip',
		magazineSize: 10,
		firingMode: '2-Round Burst',
		armorPenetration: 'Strong',
		recycling: [
			{ itemId: 'res_magnetic_accelerator', amount: 2, name: 'Magnetic Accelerator' },
			{ itemId: 'res_complex_gun_parts', amount: 1, name: 'Complex Gun Parts' }
		],
		attachmentSlots: [
			{ type: 'underbarrel', placeholder: '/assets/ui/mod_slot_assets/underbarrel.png' },
			{ type: 'stock', placeholder: '/assets/ui/mod_slot_assets/stock.png' }
		]
	},

	// ──────────────────────────────────────
	// SMGs
	// ──────────────────────────────────────
	wpn_stitcher: {
		id: 'wpn_stitcher',
		name: 'Stitcher',
		type: 'weapon',
		rarity: 'common',
		weight: 5,
		price: 800,
		image: '/assets/items/weapons/stitcher.png',
		categoryIcon: '/assets/ui/ammo_type_assets/light_ammo.png',
		description: 'Deals good damage, but has quite a low fire-rate and can be hard to control.',
		weaponClass: 'SMG',
		ammoType: 'Light Ammo',
		magazineSize: 20,
		firingMode: 'Fully-Automatic',
		armorPenetration: 'Very Weak',
		recycling: [
			{ itemId: 'res_metal_parts', amount: 3, name: 'Metal Parts' },
			{ itemId: 'res_rubber_parts', amount: 2, name: 'Rubber Parts' }
		],
		attachmentSlots: [
			{ type: 'muzzle', placeholder: '/assets/ui/mod_slot_assets/muzzle.png' },
			{ type: 'underbarrel', placeholder: '/assets/ui/mod_slot_assets/underbarrel.png' },
			{ type: 'magazine', placeholder: '/assets/ui/mod_slot_assets/light_magazine.png' },
			{ type: 'stock', placeholder: '/assets/ui/mod_slot_assets/stock.png' }
		]
	},
	wpn_bobcat: {
		id: 'wpn_bobcat',
		name: 'Bobcat',
		type: 'weapon',
		rarity: 'epic',
		weight: 7,
		price: 13000,
		image: '/assets/items/weapons/bobcat.png',
		categoryIcon: '/assets/ui/ammo_type_assets/light_ammo.png',
		description: 'Has a high fire rate but low accuracy.',
		weaponClass: 'SMG',
		ammoType: 'Light Ammo',
		magazineSize: 20,
		firingMode: 'Fully-Automatic',
		armorPenetration: 'Very Weak',
		recycling: [
			{
				itemId: 'res_adv_mechanical_components',
				amount: 2,
				name: 'Advanced Mechanical Components'
			},
			{ itemId: 'res_light_gun_parts', amount: 2, name: 'Light Gun Parts' }
		],
		attachmentSlots: [
			{ type: 'muzzle', placeholder: '/assets/ui/mod_slot_assets/muzzle.png' },
			{ type: 'underbarrel', placeholder: '/assets/ui/mod_slot_assets/underbarrel.png' },
			{ type: 'magazine', placeholder: '/assets/ui/mod_slot_assets/light_magazine.png' },
			{ type: 'stock', placeholder: '/assets/ui/mod_slot_assets/stock.png' }
		]
	},

	// ──────────────────────────────────────
	// SHOTGUNS
	// ──────────────────────────────────────
	wpn_il_toro: {
		id: 'wpn_il_toro',
		name: 'Il Toro',
		type: 'weapon',
		rarity: 'uncommon',
		weight: 8,
		price: 5000,
		image: '/assets/items/weapons/il_toro.png',
		categoryIcon: '/assets/ui/ammo_type_assets/shotgun_ammo.png',
		description: 'High damage output, capable of downing most Raiders at close range.',
		weaponClass: 'Shotgun',
		ammoType: 'Shotgun Ammo',
		magazineSize: 5,
		firingMode: 'Pump-Action',
		armorPenetration: 'Weak',
		recycling: [
			{ itemId: 'res_mechanical_components', amount: 2, name: 'Mechanical Components' },
			{ itemId: 'res_simple_gun_parts', amount: 2, name: 'Simple Gun Parts' }
		],
		attachmentSlots: [
			{ type: 'muzzle', placeholder: '/assets/ui/mod_slot_assets/shotgun_muzzle.png' },
			{ type: 'underbarrel', placeholder: '/assets/ui/mod_slot_assets/underbarrel.png' },
			{ type: 'magazine', placeholder: '/assets/ui/mod_slot_assets/shotgun_magazine.png' },
			{ type: 'stock', placeholder: '/assets/ui/mod_slot_assets/stock.png' }
		]
	},
	wpn_vulcano: {
		id: 'wpn_vulcano',
		name: 'Vulcano',
		type: 'weapon',
		rarity: 'epic',
		weight: 8,
		price: 10000,
		image: '/assets/items/weapons/vulcano.png',
		categoryIcon: '/assets/ui/ammo_type_assets/shotgun_ammo.png',
		description: 'Has good bullet spread but sharp falloff.',
		weaponClass: 'Shotgun',
		ammoType: 'Shotgun Ammo',
		magazineSize: 6,
		firingMode: 'Semi-Automatic',
		armorPenetration: 'Weak',
		recycling: [
			{
				itemId: 'res_adv_mechanical_components',
				amount: 2,
				name: 'Advanced Mechanical Components'
			},
			{ itemId: 'res_heavy_gun_parts', amount: 2, name: 'Heavy Gun Parts' }
		],
		attachmentSlots: [
			{ type: 'muzzle', placeholder: '/assets/ui/mod_slot_assets/shotgun_muzzle.png' },
			{ type: 'underbarrel', placeholder: '/assets/ui/mod_slot_assets/underbarrel.png' },
			{ type: 'magazine', placeholder: '/assets/ui/mod_slot_assets/shotgun_magazine.png' },
			{ type: 'stock', placeholder: '/assets/ui/mod_slot_assets/stock.png' }
		]
	},

	// ──────────────────────────────────────
	// PISTOLS
	// ──────────────────────────────────────
	wpn_hairpin: {
		id: 'wpn_hairpin',
		name: 'Hairpin',
		type: 'weapon',
		rarity: 'common',
		weight: 3,
		price: 450,
		image: '/assets/items/weapons/hairpin.png',
		categoryIcon: '/assets/ui/ammo_type_assets/light_ammo.png',
		description: 'Has a built-in silencer. Great for stealth, but tricky in combat.',
		weaponClass: 'Pistol',
		ammoType: 'Light Ammo',
		magazineSize: 8,
		firingMode: 'Slide-Action',
		armorPenetration: 'Very Weak',
		recycling: [
			{ itemId: 'res_metal_parts', amount: 2, name: 'Metal Parts' },
			{ itemId: 'res_rubber_parts', amount: 1, name: 'Rubber Parts' }
		],
		attachmentSlots: [
			{ type: 'magazine', placeholder: '/assets/ui/mod_slot_assets/light_magazine.png' }
		]
	},
	wpn_burletta: {
		id: 'wpn_burletta',
		name: 'Burletta',
		type: 'weapon',
		rarity: 'uncommon',
		weight: 4,
		price: 2900,
		image: '/assets/items/weapons/burletta.png',
		categoryIcon: '/assets/ui/ammo_type_assets/light_ammo.png',
		description: 'Has decent damage output and accuracy.',
		weaponClass: 'Pistol',
		ammoType: 'Light Ammo',
		magazineSize: 12,
		firingMode: 'Semi-Automatic',
		armorPenetration: 'Very Weak',
		recycling: [
			{ itemId: 'res_mechanical_components', amount: 1, name: 'Mechanical Components' },
			{ itemId: 'res_simple_gun_parts', amount: 2, name: 'Simple Gun Parts' }
		],
		attachmentSlots: [
			{ type: 'muzzle', placeholder: '/assets/ui/mod_slot_assets/muzzle.png' },
			{ type: 'magazine', placeholder: '/assets/ui/mod_slot_assets/light_magazine.png' }
		]
	},
	wpn_venator: {
		id: 'wpn_venator',
		name: 'Venator',
		type: 'weapon',
		rarity: 'rare',
		weight: 5,
		price: 7000,
		image: '/assets/items/weapons/venator.png',
		categoryIcon: '/assets/ui/ammo_type_assets/medium_ammo.png',
		description: 'Fires two shots at a time. Effective at close- to medium-range combat.',
		weaponClass: 'Pistol',
		ammoType: 'Medium Ammo',
		magazineSize: 10,
		firingMode: 'Semi-Automatic',
		armorPenetration: 'Moderate',
		recycling: [
			{
				itemId: 'res_adv_mechanical_components',
				amount: 1,
				name: 'Advanced Mechanical Components'
			},
			{ itemId: 'res_medium_gun_parts', amount: 2, name: 'Medium Gun Parts' }
		],
		attachmentSlots: [
			{ type: 'underbarrel', placeholder: '/assets/ui/mod_slot_assets/underbarrel.png' },
			{ type: 'magazine', placeholder: '/assets/ui/mod_slot_assets/medium_magazine.png' }
		]
	},

	// ──────────────────────────────────────
	// HAND CANNON
	// ──────────────────────────────────────
	wpn_anvil: {
		id: 'wpn_anvil',
		name: 'Anvil',
		type: 'weapon',
		rarity: 'uncommon',
		weight: 5,
		price: 5000,
		image: '/assets/items/weapons/anvil.png',
		categoryIcon: '/assets/ui/ammo_type_assets/heavy_ammo.png',
		description:
			'Excels at hitting targets at medium-range, but slow firing speed feels clunky at close-range.',
		weaponClass: 'Hand Cannon',
		ammoType: 'Heavy Ammo',
		magazineSize: 6,
		firingMode: 'Single-Action',
		armorPenetration: 'Strong',
		recycling: [
			{ itemId: 'res_mechanical_components', amount: 2, name: 'Mechanical Components' },
			{ itemId: 'res_simple_gun_parts', amount: 2, name: 'Simple Gun Parts' }
		],
		attachmentSlots: [
			{ type: 'muzzle', placeholder: '/assets/ui/mod_slot_assets/muzzle.png' },
			{ type: 'grip', placeholder: '/assets/ui/mod_slot_assets/tech_mod.png' }
		]
	},

	// ──────────────────────────────────────
	// LMG
	// ──────────────────────────────────────
	wpn_torrente: {
		id: 'wpn_torrente',
		name: 'Torrente',
		type: 'weapon',
		rarity: 'rare',
		weight: 12,
		price: 7000,
		image: '/assets/items/weapons/torrente.png',
		categoryIcon: '/assets/ui/ammo_type_assets/medium_ammo.png',
		description: 'Has a large ammo capacity, but is only accurate while crouched.',
		weaponClass: 'LMG',
		ammoType: 'Medium Ammo',
		magazineSize: 60,
		firingMode: 'Fully-Automatic',
		armorPenetration: 'Moderate',
		recycling: [
			{
				itemId: 'res_adv_mechanical_components',
				amount: 1,
				name: 'Advanced Mechanical Components'
			},
			{ itemId: 'res_medium_gun_parts', amount: 2, name: 'Medium Gun Parts' }
		],
		attachmentSlots: [
			{ type: 'muzzle', placeholder: '/assets/ui/mod_slot_assets/muzzle.png' },
			{ type: 'magazine', placeholder: '/assets/ui/mod_slot_assets/medium_magazine.png' },
			{ type: 'stock', placeholder: '/assets/ui/mod_slot_assets/stock.png' }
		]
	},

	// ──────────────────────────────────────
	// SNIPER RIFLES
	// ──────────────────────────────────────
	wpn_osprey: {
		id: 'wpn_osprey',
		name: 'Osprey',
		type: 'weapon',
		rarity: 'rare',
		weight: 7,
		price: 7000,
		image: '/assets/items/weapons/osprey.png',
		categoryIcon: '/assets/ui/ammo_type_assets/medium_ammo.png',
		description: 'Excels at hitting long-range targets with the help of its scope.',
		weaponClass: 'Sniper Rifle',
		ammoType: 'Medium Ammo',
		magazineSize: 8,
		firingMode: 'Bolt-Action',
		armorPenetration: 'Moderate',
		recycling: [
			{
				itemId: 'res_adv_mechanical_components',
				amount: 1,
				name: 'Advanced Mechanical Components'
			},
			{ itemId: 'res_medium_gun_parts', amount: 2, name: 'Medium Gun Parts' }
		],
		attachmentSlots: [
			{ type: 'muzzle', placeholder: '/assets/ui/mod_slot_assets/muzzle.png' },
			{ type: 'underbarrel', placeholder: '/assets/ui/mod_slot_assets/underbarrel.png' },
			{ type: 'magazine', placeholder: '/assets/ui/mod_slot_assets/medium_magazine.png' },
			{ type: 'stock', placeholder: '/assets/ui/mod_slot_assets/stock.png' }
		]
	},
	wpn_jupiter: {
		id: 'wpn_jupiter',
		name: 'Jupiter',
		type: 'weapon',
		rarity: 'legendary',
		weight: 9,
		price: 27500,
		image: '/assets/ui/placeholder/placeholder_weapon.png',
		categoryIcon: '/assets/ui/ammo_type_assets/energy_clip.png',
		description: 'Exceptional damage output and accuracy, but slow handling. Cannot be upgraded.',
		weaponClass: 'Sniper Rifle',
		ammoType: 'Energy Clip',
		magazineSize: 5,
		firingMode: 'Bolt-Action',
		armorPenetration: 'Very Strong',
		recycling: [
			{ itemId: 'res_magnetic_accelerator', amount: 2, name: 'Magnetic Accelerator' },
			{ itemId: 'res_complex_gun_parts', amount: 1, name: 'Complex Gun Parts' }
		]
	},

	// ──────────────────────────────────────
	// SPECIALS
	// ──────────────────────────────────────
	wpn_hullcracker: {
		id: 'wpn_hullcracker',
		name: 'Hullcracker',
		type: 'weapon',
		rarity: 'epic',
		weight: 7,
		price: 10000,
		image: '/assets/items/weapons/hullcracker.png',
		categoryIcon: '/assets/ui/ammo_type_assets/launcher_ammo.png',
		description: 'Fires explosive projectiles that only detonate when hitting ARC.',
		weaponClass: 'Special',
		ammoType: 'Launcher Ammo',
		magazineSize: 5,
		firingMode: 'Pump-Action',
		armorPenetration: 'Very Strong',
		recycling: [
			{
				itemId: 'res_adv_mechanical_components',
				amount: 2,
				name: 'Advanced Mechanical Components'
			},
			{ itemId: 'res_heavy_gun_parts', amount: 2, name: 'Heavy Gun Parts' }
		],
		attachmentSlots: [
			{ type: 'underbarrel', placeholder: '/assets/ui/mod_slot_assets/underbarrel.png' },
			{ type: 'stock', placeholder: '/assets/ui/mod_slot_assets/stock.png' }
		]
	},
	wpn_equalizer: {
		id: 'wpn_equalizer',
		name: 'Equalizer',
		type: 'weapon',
		rarity: 'legendary',
		weight: 14,
		price: 27500,
		image: '/assets/ui/placeholder/placeholder_weapon.png',
		categoryIcon: '/assets/ui/ammo_type_assets/energy_clip.png',
		description: 'A high capacity experimental beam rifle. Cannot be upgraded.',
		weaponClass: 'Special',
		ammoType: 'Energy Clip',
		magazineSize: 50,
		firingMode: 'Fully-Automatic',
		armorPenetration: 'Very Strong',
		recycling: [
			{ itemId: 'res_magnetic_accelerator', amount: 2, name: 'Magnetic Accelerator' },
			{ itemId: 'res_complex_gun_parts', amount: 1, name: 'Complex Gun Parts' }
		]
	},

	// ──────────────────────────────────────
	// RECYCLING RESOURCES
	// ──────────────────────────────────────
	res_metal_parts: {
		id: 'res_metal_parts',
		name: 'Metal Parts',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/CraftingMaterials/MetalParts.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		price: 50,
		weight: 0.5,
		maxStack: 50,
		description: 'Used to craft a wide range of items.',
	},
	res_rubber_parts: {
		id: 'res_rubber_parts',
		name: 'Rubber Parts',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/CraftingMaterials/RubberParts.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		price: 50,
		weight: 0.5,
		maxStack: 50,
		description: 'Used to craft a wide range of items.',
	},
	res_mechanical_components: {
		id: 'res_mechanical_components',
		name: 'Mechanical Components',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/MechanicalComponents.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		price: 150,
		weight: 0.5,
		maxStack: 30,
		description: 'Used to craft a wide range of items. Can be recycled into crafting materials.',
	},
	res_simple_gun_parts: {
		id: 'res_simple_gun_parts',
		name: 'Simple Gun Parts',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/SimpleGunParts.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		price: 200,
		weight: 0.5,
		maxStack: 30,
		description: 'Used to craft weapons.',
	},
	res_adv_mechanical_components: {
		id: 'res_adv_mechanical_components',
		name: 'Advanced Mechanical Components',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/AdvancedMechanicalComponents.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		price: 400,
		weight: 0.5,
		maxStack: 20,
		description: 'Used to craft advanced weapons. Can be recycled into crafting materials.',
	},
	res_light_gun_parts: {
		id: 'res_light_gun_parts',
		name: 'Light Gun Parts',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/LightGunParts.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		price: 200,
		weight: 0.5,
		maxStack: 30,
		description: 'Assorted spare parts used for pistols and SMGs.',
	},
	res_medium_gun_parts: {
		id: 'res_medium_gun_parts',
		name: 'Medium Gun Parts',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/MediumGunParts.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		price: 200,
		weight: 0.5,
		maxStack: 30,
		description: 'Assorted spare parts used for rifles.',
	},
	res_heavy_gun_parts: {
		id: 'res_heavy_gun_parts',
		name: 'Heavy Gun Parts',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/HeavyGunParts.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		price: 350,
		weight: 0.5,
		maxStack: 20,
		description: 'Used to craft weapons.',
	},
	res_complex_gun_parts: {
		id: 'res_complex_gun_parts',
		name: 'Complex Gun Parts',
		type: 'loot',
		rarity: 'epic',
		image: '/assets/items/CraftingMaterials/ComplexGunParts.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		price: 600,
		weight: 0.5,
		maxStack: 15,
		description: 'Used to craft advanced weapons.',
	},
	res_magnetic_accelerator: {
		id: 'res_magnetic_accelerator',
		name: 'Magnetic Accelerator',
		type: 'loot',
		rarity: 'epic',
		image: '/assets/items/CraftingMaterials/MagneticAccelerator.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		price: 800,
		weight: 1,
		maxStack: 10,
		description: 'Used to craft advanced weapons.',
	},
	res_plastic_parts: {
		id: 'res_plastic_parts',
		name: 'Plastic Parts',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/CraftingMaterials/PlasticParts.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		price: 50,
		weight: 0.5,
		maxStack: 50,
		description: 'Used to craft a wide range of items.',
	},
	res_wires: {
		id: 'res_wires',
		name: 'Wires',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/CraftingMaterials/Wires.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		price: 50,
		weight: 0.5,
		maxStack: 50,
		description: 'Used to craft a wide range of items. Can be recycled into crafting materials.',
	},
	res_mod_components: {
		id: 'res_mod_components',
		name: 'Mod Components',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/ModComponents.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		price: 500,
		weight: 0.5,
		maxStack: 20,
		description: 'Used to craft weapon mods. Can be recycled into crafting materials.',
	},
	res_duct_tape: {
		id: 'res_duct_tape',
		name: 'Duct Tape',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/CraftingMaterials/DuctTape.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		price: 75,
		weight: 0.5,
		maxStack: 50,
		description: 'Used to craft a wide range of items. Can be recycled into crafting materials.',
	},
	res_steel_spring: {
		id: 'res_steel_spring',
		name: 'Steel Spring',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/CraftingMaterials/SteelSpring.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		price: 75,
		weight: 0.5,
		maxStack: 50,
		description: 'Used to craft a wide range of items. Can be recycled into crafting materials.',
	},
	res_processor: {
		id: 'res_processor',
		name: 'Processor',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/Processor.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		price: 200,
		weight: 0.5,
		maxStack: 30,
		description: 'Used in crafting.',
	},

	// ──────────────────────────────────────
	// OTHER LOOT
	// ──────────────────────────────────────
	res_arc_circuitry: {
		id: 'res_arc_circuitry',
		name: 'ARC Circuitry',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/CraftingMaterials/ArcCircuitry.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		price: 300,
		weight: 1,
		maxStack: 12,
		description: 'Obtained from ARC enemies or activities. Used to craft components.',
		recycling: [{ itemId: 'res_metal_parts', amount: 10, name: 'Metal Parts' }]
	},
	res_toaster: {
		id: 'res_toaster',
		name: 'Toaster',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/Toaster.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		price: 50,
		weight: 2,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [{ itemId: 'res_metal_parts', amount: 2, name: 'Metal Parts' }]
	},
	res_bastion_cell: {
		id: 'res_bastion_cell',
		name: 'Bastion Cell',
		type: 'loot',
		rarity: 'epic',
		image: '/assets/items/CraftingMaterials/BastionCell.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		price: 500,
		weight: 0.5,
		maxStack: 15,
		description: 'Can be recycled into crafting materials or used to upgrade the Gear Bench.',
	},
	loot_cat_bed: {
		id: 'loot_cat_bed',
		name: 'Cat Bed',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/CatBed.png',
		categoryIcon: '/assets/ui/category_assets/misc.png',
		price: 150,
		weight: 1,
		maxStack: 5,
		description: 'At least a tiny bit more comfortable than your face.',
	},

	// ──────────────────────────────────────
	// EQUIPMENT
	// ──────────────────────────────────────
	eqp_tactical_mk1: {
		id: 'eqp_tactical_mk1',
		name: 'Tactical Mk1',
		type: 'augment',
		rarity: 'uncommon',
		weight: 2,
		price: 300,
		image: '/assets/items/Augments/TacticalMK1.png',
		categoryIcon: '/assets/ui/category_assets/augment.png'
	},
	eqp_light_shield: {
		id: 'eqp_light_shield',
		name: 'Light Shield',
		type: 'shield',
		rarity: 'uncommon',
		image: '/assets/items/Shields/LightShield.png',
		categoryIcon: '/assets/ui/category_assets/shield.png',
		weight: 5,
		price: 400,
		recycling: [{ itemId: 'res_metal_parts', amount: 5, name: 'Metal Parts' }]
	},

	// ──────────────────────────────────────
	// ATTACHMENTS — UNDERBARREL
	// ──────────────────────────────────────
	att_angled_grip_1: {
		id: 'att_angled_grip_1',
		name: 'Angled Grip I',
		type: 'attachment',
		attachmentKind: 'underbarrel',
		rarity: 'common',
		image: '/assets/items/WeaponMods/AngledGrip1.png',
		categoryIcon: '/assets/ui/mod_slot_assets/underbarrel.png',
		weight: 0.25,
		price: 640,
		description: 'Reduces horizontal recoil.',
		statBonuses: ['20% Reduced Horizontal Recoil'],
		recycling: [{ itemId: 'res_plastic_parts', amount: 6, name: 'Plastic Parts' }]
	},
	att_angled_grip_3: {
		id: 'att_angled_grip_3',
		name: 'Angled Grip III',
		type: 'attachment',
		attachmentKind: 'underbarrel',
		rarity: 'rare',
		image: '/assets/items/WeaponMods/AngledGrip3.png',
		categoryIcon: '/assets/ui/mod_slot_assets/underbarrel.png',
		weight: 0.5,
		price: 5000,
		description: 'Greatly reduces horizontal recoil but slows ADS.',
		statBonuses: ['40% Reduced Horizontal Recoil', '30% Reduced ADS Speed'],
		recycling: [
			{ itemId: 'res_mod_components', amount: 1, name: 'Mod Components' },
			{ itemId: 'res_duct_tape', amount: 2, name: 'Duct Tape' }
		]
	},
	att_vertical_grip_1: {
		id: 'att_vertical_grip_1',
		name: 'Vertical Grip I',
		type: 'attachment',
		attachmentKind: 'underbarrel',
		rarity: 'common',
		image: '/assets/items/WeaponMods/VerticalGrip1.png',
		categoryIcon: '/assets/ui/mod_slot_assets/underbarrel.png',
		weight: 0.25,
		price: 640,
		description: 'Reduces vertical recoil.',
		statBonuses: ['20% Reduced Vertical Recoil'],
		recycling: [{ itemId: 'res_plastic_parts', amount: 6, name: 'Plastic Parts' }]
	},
	att_vertical_grip_2: {
		id: 'att_vertical_grip_2',
		name: 'Vertical Grip II',
		type: 'attachment',
		attachmentKind: 'underbarrel',
		rarity: 'uncommon',
		image: '/assets/items/WeaponMods/VerticalGrip2.png',
		categoryIcon: '/assets/ui/mod_slot_assets/underbarrel.png',
		weight: 0.25,
		price: 2000,
		description: 'Reduces vertical recoil.',
		statBonuses: ['30% Reduced Vertical Recoil'],
		recycling: [
			{ itemId: 'res_mechanical_components', amount: 1, name: 'Mechanical Components' },
			{ itemId: 'res_duct_tape', amount: 1, name: 'Duct Tape' }
		]
	},
	att_vertical_grip_3: {
		id: 'att_vertical_grip_3',
		name: 'Vertical Grip III',
		type: 'attachment',
		attachmentKind: 'underbarrel',
		rarity: 'rare',
		image: '/assets/items/WeaponMods/VerticalGrip3.png',
		categoryIcon: '/assets/ui/mod_slot_assets/underbarrel.png',
		weight: 0.5,
		price: 5000,
		description: 'Greatly reduces vertical recoil but slows ADS.',
		statBonuses: ['40% Reduced Vertical Recoil', '30% Reduced ADS Speed'],
		recycling: [
			{ itemId: 'res_mod_components', amount: 1, name: 'Mod Components' },
			{ itemId: 'res_duct_tape', amount: 2, name: 'Duct Tape' }
		]
	},
	att_horizontal_grip: {
		id: 'att_horizontal_grip',
		name: 'Horizontal Grip',
		type: 'attachment',
		attachmentKind: 'underbarrel',
		rarity: 'epic',
		image: '/assets/items/WeaponMods/HorizontalGrip.png',
		categoryIcon: '/assets/ui/mod_slot_assets/underbarrel.png',
		weight: 0.5,
		price: 7000,
		description: 'Reduces all recoil but slows ADS.',
		statBonuses: [
			'30% Reduced Horizontal Recoil',
			'30% Reduced Vertical Recoil',
			'30% Reduced ADS Speed'
		],
		recycling: [
			{ itemId: 'res_mod_components', amount: 1, name: 'Mod Components' },
			{ itemId: 'res_duct_tape', amount: 2, name: 'Duct Tape' }
		]
	},

	// ──────────────────────────────────────
	// ATTACHMENTS — MUZZLE
	// ──────────────────────────────────────
	att_compensator_1: {
		id: 'att_compensator_1',
		name: 'Compensator I',
		type: 'attachment',
		attachmentKind: 'muzzle',
		rarity: 'common',
		image: '/assets/items/WeaponMods/Compensator1.png',
		categoryIcon: '/assets/ui/mod_slot_assets/muzzle.png',
		weight: 0.25,
		price: 640,
		description: 'Reduces shot dispersion.',
		statBonuses: ['20% Reduced Per-Shot Dispersion', '10% Reduced Max Dispersion'],
		recycling: [{ itemId: 'res_metal_parts', amount: 5, name: 'Metal Parts' }]
	},
	att_compensator_2: {
		id: 'att_compensator_2',
		name: 'Compensator II',
		type: 'attachment',
		attachmentKind: 'muzzle',
		rarity: 'uncommon',
		image: '/assets/items/WeaponMods/Compensator2.png',
		categoryIcon: '/assets/ui/mod_slot_assets/muzzle.png',
		weight: 0.25,
		price: 2000,
		description: 'Reduces shot dispersion.',
		statBonuses: ['40% Reduced Per-Shot Dispersion', '20% Reduced Max Dispersion'],
		recycling: [
			{ itemId: 'res_mechanical_components', amount: 1, name: 'Mechanical Components' },
			{ itemId: 'res_wires', amount: 1, name: 'Wires' }
		]
	},
	att_compensator_3: {
		id: 'att_compensator_3',
		name: 'Compensator III',
		type: 'attachment',
		attachmentKind: 'muzzle',
		rarity: 'rare',
		image: '/assets/items/WeaponMods/Compensator3.png',
		categoryIcon: '/assets/ui/mod_slot_assets/muzzle.png',
		weight: 0.5,
		price: 5000,
		description: 'Greatly reduces dispersion but increases durability burn.',
		statBonuses: [
			'60% Reduced Per-Shot Dispersion',
			'30% Reduced Max Dispersion',
			'20% Increased Durability Burn'
		],
		recycling: [
			{ itemId: 'res_mod_components', amount: 1, name: 'Mod Components' },
			{ itemId: 'res_wires', amount: 2, name: 'Wires' }
		]
	},
	att_muzzle_brake_1: {
		id: 'att_muzzle_brake_1',
		name: 'Muzzle Brake I',
		type: 'attachment',
		attachmentKind: 'muzzle',
		rarity: 'common',
		image: '/assets/items/WeaponMods/MuzzleBrake1.png',
		categoryIcon: '/assets/ui/mod_slot_assets/muzzle.png',
		weight: 0.25,
		price: 640,
		description: 'Reduces recoil.',
		statBonuses: ['15% Reduced Horizontal Recoil', '15% Reduced Vertical Recoil'],
		recycling: [{ itemId: 'res_metal_parts', amount: 5, name: 'Metal Parts' }]
	},
	att_muzzle_brake_2: {
		id: 'att_muzzle_brake_2',
		name: 'Muzzle Brake II',
		type: 'attachment',
		attachmentKind: 'muzzle',
		rarity: 'uncommon',
		image: '/assets/items/WeaponMods/MuzzleBrake2.png',
		categoryIcon: '/assets/ui/mod_slot_assets/muzzle.png',
		weight: 0.25,
		price: 2000,
		description: 'Reduces recoil.',
		statBonuses: ['20% Reduced Horizontal Recoil', '20% Reduced Vertical Recoil'],
		recycling: [
			{ itemId: 'res_mechanical_components', amount: 1, name: 'Mechanical Components' },
			{ itemId: 'res_wires', amount: 1, name: 'Wires' }
		]
	},
	att_muzzle_brake_3: {
		id: 'att_muzzle_brake_3',
		name: 'Muzzle Brake III',
		type: 'attachment',
		attachmentKind: 'muzzle',
		rarity: 'rare',
		image: '/assets/items/WeaponMods/MuzzleBrake3.png',
		categoryIcon: '/assets/ui/mod_slot_assets/muzzle.png',
		weight: 0.5,
		price: 5000,
		description: 'Greatly reduces recoil but increases durability burn.',
		statBonuses: [
			'25% Reduced Horizontal Recoil',
			'25% Reduced Vertical Recoil',
			'20% Increased Durability Burn'
		],
		recycling: [
			{ itemId: 'res_mod_components', amount: 1, name: 'Mod Components' },
			{ itemId: 'res_wires', amount: 2, name: 'Wires' }
		]
	},
	att_silencer_1: {
		id: 'att_silencer_1',
		name: 'Silencer I',
		type: 'attachment',
		attachmentKind: 'muzzle',
		rarity: 'uncommon',
		image: '/assets/items/WeaponMods/Silencer1.png',
		categoryIcon: '/assets/ui/mod_slot_assets/muzzle.png',
		weight: 0.25,
		price: 2000,
		description: 'Reduces noise.',
		statBonuses: ['20% Reduced Noise'],
		recycling: [
			{ itemId: 'res_mechanical_components', amount: 1, name: 'Mechanical Components' },
			{ itemId: 'res_wires', amount: 1, name: 'Wires' }
		]
	},
	att_silencer_2: {
		id: 'att_silencer_2',
		name: 'Silencer II',
		type: 'attachment',
		attachmentKind: 'muzzle',
		rarity: 'rare',
		image: '/assets/items/WeaponMods/Silencer2.png',
		categoryIcon: '/assets/ui/mod_slot_assets/muzzle.png',
		weight: 0.5,
		price: 5000,
		description: 'Reduces noise.',
		statBonuses: ['40% Reduced Noise'],
		recycling: [
			{ itemId: 'res_mod_components', amount: 1, name: 'Mod Components' },
			{ itemId: 'res_wires', amount: 2, name: 'Wires' }
		]
	},
	att_extended_barrel: {
		id: 'att_extended_barrel',
		name: 'Extended Barrel',
		type: 'attachment',
		attachmentKind: 'muzzle',
		rarity: 'epic',
		image: '/assets/items/WeaponMods/ExtendedBarrel.png',
		categoryIcon: '/assets/ui/mod_slot_assets/muzzle.png',
		weight: 0.5,
		price: 5000,
		description: 'Increases bullet velocity but adds vertical recoil.',
		statBonuses: ['25% Increased Bullet Velocity', '15% Increased Vertical Recoil'],
		recycling: [
			{ itemId: 'res_mod_components', amount: 1, name: 'Mod Components' },
			{ itemId: 'res_wires', amount: 1, name: 'Wires' }
		]
	},

	// ──────────────────────────────────────
	// ATTACHMENTS — SHOTGUN MUZZLE
	// ──────────────────────────────────────
	att_shotgun_choke_1: {
		id: 'att_shotgun_choke_1',
		name: 'Shotgun Choke I',
		type: 'attachment',
		attachmentKind: 'muzzle',
		rarity: 'common',
		image: '/assets/items/WeaponMods/ShotgunChoke1.png',
		categoryIcon: '/assets/ui/mod_slot_assets/shotgun_muzzle.png',
		weight: 0.25,
		price: 640,
		description: 'Reduces base dispersion.',
		statBonuses: ['10% Reduced Base Dispersion'],
		recycling: [{ itemId: 'res_metal_parts', amount: 5, name: 'Metal Parts' }]
	},
	att_shotgun_choke_2: {
		id: 'att_shotgun_choke_2',
		name: 'Shotgun Choke II',
		type: 'attachment',
		attachmentKind: 'muzzle',
		rarity: 'uncommon',
		image: '/assets/items/WeaponMods/ShotgunChoke2.png',
		categoryIcon: '/assets/ui/mod_slot_assets/shotgun_muzzle.png',
		weight: 0.5,
		price: 2000,
		description: 'Reduces base dispersion.',
		statBonuses: ['20% Reduced Base Dispersion'],
		recycling: [
			{ itemId: 'res_mechanical_components', amount: 1, name: 'Mechanical Components' },
			{ itemId: 'res_wires', amount: 1, name: 'Wires' }
		]
	},
	att_shotgun_choke_3: {
		id: 'att_shotgun_choke_3',
		name: 'Shotgun Choke III',
		type: 'attachment',
		attachmentKind: 'muzzle',
		rarity: 'rare',
		image: '/assets/items/WeaponMods/ShotgunChoke3.png',
		categoryIcon: '/assets/ui/mod_slot_assets/shotgun_muzzle.png',
		weight: 0.75,
		price: 5000,
		description: 'Greatly reduces dispersion but increases durability burn.',
		statBonuses: ['30% Reduced Base Dispersion', '20% Increased Durability Burn'],
		recycling: [
			{ itemId: 'res_mod_components', amount: 1, name: 'Mod Components' },
			{ itemId: 'res_wires', amount: 2, name: 'Wires' }
		]
	},

	// ──────────────────────────────────────
	// ATTACHMENTS — MAGAZINE
	// ──────────────────────────────────────
	att_ext_light_mag_1: {
		id: 'att_ext_light_mag_1',
		name: 'Extended Light Mag I',
		type: 'attachment',
		attachmentKind: 'magazine',
		rarity: 'common',
		image: '/assets/items/WeaponMods/ExtendedLightMag1.png',
		categoryIcon: '/assets/ui/mod_slot_assets/light_magazine.png',
		weight: 0.5,
		price: 640,
		description: 'Increases magazine capacity.',
		statBonuses: ['+5 Magazine Size'],
		recycling: [{ itemId: 'res_plastic_parts', amount: 6, name: 'Plastic Parts' }]
	},
	att_ext_light_mag_2: {
		id: 'att_ext_light_mag_2',
		name: 'Extended Light Mag II',
		type: 'attachment',
		attachmentKind: 'magazine',
		rarity: 'uncommon',
		image: '/assets/items/WeaponMods/ExtendedLightMag2.png',
		categoryIcon: '/assets/ui/mod_slot_assets/light_magazine.png',
		weight: 0.5,
		price: 2000,
		description: 'Increases magazine capacity.',
		statBonuses: ['+10 Magazine Size'],
		recycling: [
			{ itemId: 'res_mechanical_components', amount: 1, name: 'Mechanical Components' },
			{ itemId: 'res_steel_spring', amount: 1, name: 'Steel Spring' }
		]
	},
	att_ext_light_mag_3: {
		id: 'att_ext_light_mag_3',
		name: 'Extended Light Mag III',
		type: 'attachment',
		attachmentKind: 'magazine',
		rarity: 'rare',
		image: '/assets/items/WeaponMods/ExtendedLightMag3.png',
		categoryIcon: '/assets/ui/mod_slot_assets/light_magazine.png',
		weight: 0.75,
		price: 5000,
		description: 'Greatly increases magazine capacity.',
		statBonuses: ['+15 Magazine Size'],
		recycling: [
			{ itemId: 'res_mod_components', amount: 1, name: 'Mod Components' },
			{ itemId: 'res_steel_spring', amount: 2, name: 'Steel Spring' }
		]
	},
	att_ext_medium_mag_1: {
		id: 'att_ext_medium_mag_1',
		name: 'Extended Medium Mag I',
		type: 'attachment',
		attachmentKind: 'magazine',
		rarity: 'common',
		image: '/assets/items/WeaponMods/ExtendedMediumMag1.png',
		categoryIcon: '/assets/ui/mod_slot_assets/medium_magazine.png',
		weight: 0.25,
		price: 640,
		description: 'Increases magazine capacity.',
		statBonuses: ['+4 Magazine Size'],
		recycling: [{ itemId: 'res_plastic_parts', amount: 6, name: 'Plastic Parts' }]
	},
	att_ext_medium_mag_2: {
		id: 'att_ext_medium_mag_2',
		name: 'Extended Medium Mag II',
		type: 'attachment',
		attachmentKind: 'magazine',
		rarity: 'uncommon',
		image: '/assets/items/WeaponMods/ExtendedMediumMag2.png',
		categoryIcon: '/assets/ui/mod_slot_assets/medium_magazine.png',
		weight: 0.5,
		price: 2000,
		description: 'Increases magazine capacity.',
		statBonuses: ['+8 Magazine Size'],
		recycling: [
			{ itemId: 'res_mechanical_components', amount: 1, name: 'Mechanical Components' },
			{ itemId: 'res_steel_spring', amount: 1, name: 'Steel Spring' }
		]
	},
	att_ext_medium_mag_3: {
		id: 'att_ext_medium_mag_3',
		name: 'Extended Medium Mag III',
		type: 'attachment',
		attachmentKind: 'magazine',
		rarity: 'rare',
		image: '/assets/items/WeaponMods/ExtendedMediumMag3.png',
		categoryIcon: '/assets/ui/mod_slot_assets/medium_magazine.png',
		weight: 0.75,
		price: 5000,
		description: 'Greatly increases magazine capacity.',
		statBonuses: ['+12 Magazine Size'],
		recycling: [
			{ itemId: 'res_mod_components', amount: 1, name: 'Mod Components' },
			{ itemId: 'res_steel_spring', amount: 2, name: 'Steel Spring' }
		]
	},
	att_ext_shotgun_mag_1: {
		id: 'att_ext_shotgun_mag_1',
		name: 'Extended Shotgun Mag I',
		type: 'attachment',
		attachmentKind: 'magazine',
		rarity: 'common',
		image: '/assets/items/WeaponMods/ExtendedShotgunMag1.png',
		categoryIcon: '/assets/ui/mod_slot_assets/shotgun_magazine.png',
		weight: 0.25,
		price: 640,
		description: 'Increases magazine capacity.',
		statBonuses: ['+2 Magazine Size'],
		recycling: [{ itemId: 'res_plastic_parts', amount: 6, name: 'Plastic Parts' }]
	},
	att_ext_shotgun_mag_2: {
		id: 'att_ext_shotgun_mag_2',
		name: 'Extended Shotgun Mag II',
		type: 'attachment',
		attachmentKind: 'magazine',
		rarity: 'uncommon',
		image: '/assets/items/WeaponMods/ExtendedShotgunMag2.png',
		categoryIcon: '/assets/ui/mod_slot_assets/shotgun_magazine.png',
		weight: 0.5,
		price: 2000,
		description: 'Increases magazine capacity.',
		statBonuses: ['+4 Magazine Size'],
		recycling: [
			{ itemId: 'res_mechanical_components', amount: 1, name: 'Mechanical Components' },
			{ itemId: 'res_steel_spring', amount: 1, name: 'Steel Spring' }
		]
	},
	att_ext_shotgun_mag_3: {
		id: 'att_ext_shotgun_mag_3',
		name: 'Extended Shotgun Mag III',
		type: 'attachment',
		attachmentKind: 'magazine',
		rarity: 'rare',
		image: '/assets/items/WeaponMods/ExtendedShotgunMag3.png',
		categoryIcon: '/assets/ui/mod_slot_assets/shotgun_magazine.png',
		weight: 0.75,
		price: 5000,
		description: 'Greatly increases magazine capacity.',
		statBonuses: ['+6 Magazine Size'],
		recycling: [
			{ itemId: 'res_mod_components', amount: 1, name: 'Mod Components' },
			{ itemId: 'res_steel_spring', amount: 2, name: 'Steel Spring' }
		]
	},

	// ──────────────────────────────────────
	// ATTACHMENTS — STOCK
	// ──────────────────────────────────────
	att_stable_stock_1: {
		id: 'att_stable_stock_1',
		name: 'Stable Stock I',
		type: 'attachment',
		attachmentKind: 'stock',
		rarity: 'common',
		image: '/assets/items/WeaponMods/StableStock1.png',
		categoryIcon: '/assets/ui/mod_slot_assets/stock.png',
		weight: 0.25,
		price: 640,
		description: 'Reduces recoil and dispersion recovery time.',
		statBonuses: ['20% Reduced Recoil Recovery', '20% Reduced Dispersion Recovery'],
		recycling: [{ itemId: 'res_rubber_parts', amount: 6, name: 'Rubber Parts' }]
	},
	att_stable_stock_2: {
		id: 'att_stable_stock_2',
		name: 'Stable Stock II',
		type: 'attachment',
		attachmentKind: 'stock',
		rarity: 'uncommon',
		image: '/assets/items/WeaponMods/StableStock2.png',
		categoryIcon: '/assets/ui/mod_slot_assets/stock.png',
		weight: 0.25,
		price: 2000,
		description: 'Reduces recoil and dispersion recovery time.',
		statBonuses: ['35% Reduced Recoil Recovery', '35% Reduced Dispersion Recovery'],
		recycling: [
			{ itemId: 'res_mechanical_components', amount: 1, name: 'Mechanical Components' },
			{ itemId: 'res_rubber_parts', amount: 1, name: 'Rubber Parts' }
		]
	},
	att_stable_stock_3: {
		id: 'att_stable_stock_3',
		name: 'Stable Stock III',
		type: 'attachment',
		attachmentKind: 'stock',
		rarity: 'rare',
		image: '/assets/items/WeaponMods/StableStock3.png',
		categoryIcon: '/assets/ui/mod_slot_assets/stock.png',
		weight: 0.5,
		price: 5000,
		description: 'Greatly reduces recovery times but slows equip.',
		statBonuses: [
			'50% Reduced Recoil Recovery',
			'50% Reduced Dispersion Recovery',
			'20% Increased Equip Time'
		],
		recycling: [
			{ itemId: 'res_mod_components', amount: 1, name: 'Mod Components' },
			{ itemId: 'res_rubber_parts', amount: 2, name: 'Rubber Parts' }
		]
	},
	att_padded_stock: {
		id: 'att_padded_stock',
		name: 'Padded Stock',
		type: 'attachment',
		attachmentKind: 'stock',
		rarity: 'epic',
		image: '/assets/items/WeaponMods/PaddedStock.png',
		categoryIcon: '/assets/ui/mod_slot_assets/stock.png',
		weight: 0.5,
		price: 5000,
		description: 'Reduces recoil and dispersion but slows ADS and equip.',
		statBonuses: [
			'15% Reduced Vertical Recoil',
			'15% Reduced Horizontal Recoil',
			'20% Reduced Dispersion',
			'30% Reduced ADS Speed'
		],
		recycling: [
			{ itemId: 'res_mod_components', amount: 1, name: 'Mod Components' },
			{ itemId: 'res_duct_tape', amount: 1, name: 'Duct Tape' }
		]
	},
	att_lightweight_stock: {
		id: 'att_lightweight_stock',
		name: 'Lightweight Stock',
		type: 'attachment',
		attachmentKind: 'stock',
		rarity: 'epic',
		image: '/assets/items/WeaponMods/LightweightStock.png',
		categoryIcon: '/assets/ui/mod_slot_assets/stock.png',
		weight: 0.25,
		price: 5000,
		description: 'Greatly increases ADS speed but adds vertical recoil.',
		statBonuses: [
			'200% Increased ADS Speed',
			'30% Reduced Equip Time',
			'50% Increased Vertical Recoil'
		],
		recycling: [
			{ itemId: 'res_mod_components', amount: 1, name: 'Mod Components' },
			{ itemId: 'res_duct_tape', amount: 1, name: 'Duct Tape' }
		]
	},
	att_kinetic_converter: {
		id: 'att_kinetic_converter',
		name: 'Kinetic Converter',
		type: 'attachment',
		attachmentKind: 'stock',
		rarity: 'legendary',
		image: '/assets/items/WeaponMods/KineticConverter.png',
		categoryIcon: '/assets/ui/mod_slot_assets/stock.png',
		weight: 0.75,
		price: 7000,
		description: 'Increases fire rate but adds recoil.',
		statBonuses: [
			'15% Increased Fire Rate',
			'20% Increased Horizontal Recoil',
			'20% Increased Vertical Recoil'
		],
		recycling: [
			{ itemId: 'res_mod_components', amount: 1, name: 'Mod Components' },
			{ itemId: 'res_duct_tape', amount: 2, name: 'Duct Tape' }
		]
	},

	// ──────────────────────────────────────
	// ATTACHMENTS — TECH MOD
	// ──────────────────────────────────────
	att_anvil_splitter: {
		id: 'att_anvil_splitter',
		name: 'Anvil Splitter',
		type: 'attachment',
		attachmentKind: 'grip',
		rarity: 'legendary',
		image: '/assets/ui/placeholder/placeholder_weapon.png',
		categoryIcon: '/assets/ui/mod_slot_assets/tech_mod.png',
		weight: 0.5,
		price: 7000,
		description: 'Adds projectiles but reduces per-projectile damage.',
		statBonuses: ['+3 Projectiles Per Shot', '70% Reduced Projectile Damage'],
		recycling: [
			{ itemId: 'res_mod_components', amount: 1, name: 'Mod Components' },
			{ itemId: 'res_processor', amount: 1, name: 'Processor' }
		]
	},

	// ──────────────────────────────────────
	// CRAFTING MATERIALS
	// ──────────────────────────────────────
	loot_chemicals: {
		id: 'loot_chemicals',
		name: 'Chemicals',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/CraftingMaterials/Chemicals.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		weight: 0.1,
		price: 50,
		maxStack: 50,
		description: 'Used to craft medical supplies, explosives, and utility items.'
	},
	loot_fabric: {
		id: 'loot_fabric',
		name: 'Fabric',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/CraftingMaterials/Fabric.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		weight: 0.1,
		price: 50,
		maxStack: 50,
		description: 'Used to craft medical supplies and shields.'
	},
	loot_arc_powercell: {
		id: 'loot_arc_powercell',
		name: 'ARC Powercell',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/CraftingMaterials/ArcPowercell.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		weight: 0.5,
		price: 270,
		maxStack: 5,
		description: 'Valuable resource that drops from all ARC enemies.'
	},
	loot_arc_alloy: {
		id: 'loot_arc_alloy',
		name: 'ARC Alloy',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/ArcAlloy.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		weight: 0.25,
		price: 200,
		maxStack: 15,
		description: 'Obtained from ARC enemies. Used to craft components.',
		recycling: [{ itemId: 'res_metal_parts', amount: 2, name: 'Metal Parts' }]
	},
	loot_battery: {
		id: 'loot_battery',
		name: 'Battery',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/Battery.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		weight: 0.25,
		price: 250,
		maxStack: 15,
		description: 'Used to craft a wide range of items.',
		recycling: [{ itemId: 'res_metal_parts', amount: 2, name: 'Metal Parts' }]
	},
	loot_canister: {
		id: 'loot_canister',
		name: 'Canister',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/Canister.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		weight: 0.25,
		price: 300,
		maxStack: 15,
		description: 'Used to craft a wide range of items.',
		recycling: [{ itemId: 'res_plastic_parts', amount: 3, name: 'Plastic Parts' }]
	},
	loot_crude_explosives: {
		id: 'loot_crude_explosives',
		name: 'Crude Explosives',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/CrudeExplosives.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		weight: 0.5,
		price: 270,
		maxStack: 10,
		description: 'Used to craft explosives.',
		recycling: [{ itemId: 'loot_chemicals', amount: 3, name: 'Chemicals' }]
	},
	loot_durable_cloth: {
		id: 'loot_durable_cloth',
		name: 'Durable Cloth',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/DurableCloth.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		weight: 0.25,
		price: 640,
		maxStack: 10,
		description: 'Used to craft medical supplies.',
		recycling: [{ itemId: 'loot_fabric', amount: 6, name: 'Fabric' }]
	},
	loot_electrical_components: {
		id: 'loot_electrical_components',
		name: 'Electrical Components',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/ElectricalComponents.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		weight: 0.5,
		price: 640,
		maxStack: 10,
		description: 'Used to craft a wide range of items.',
		recycling: [
			{ itemId: 'res_plastic_parts', amount: 3, name: 'Plastic Parts' },
			{ itemId: 'res_rubber_parts', amount: 3, name: 'Rubber Parts' }
		]
	},
	loot_magnet: {
		id: 'loot_magnet',
		name: 'Magnet',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/Magnet.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		weight: 0.25,
		price: 300,
		maxStack: 15,
		description: 'Used to craft a wide range of items.',
		recycling: [{ itemId: 'res_metal_parts', amount: 2, name: 'Metal Parts' }]
	},
	loot_oil: {
		id: 'loot_oil',
		name: 'Oil',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/Oil.png',
		categoryIcon: '/assets/ui/category_assets/basic_material.png',
		weight: 0.25,
		price: 300,
		maxStack: 15,
		description: 'Used to craft weapons and explosives.',
		recycling: [{ itemId: 'loot_chemicals', amount: 3, name: 'Chemicals' }]
	},
	loot_great_mullein: {
		id: 'loot_great_mullein',
		name: 'Great Mullein',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/GreatMullein.png',
		categoryIcon: '/assets/ui/category_assets/nature.png',
		weight: 0.25,
		price: 300,
		maxStack: 15,
		description: 'Used to craft medical supplies.',
		recycling: [{ itemId: 'loot_assorted_seeds', amount: 2, name: 'Assorted Seeds' }]
	},
	loot_number_plate: {
		id: 'loot_number_plate',
		name: 'Number Plate',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/NumberPlate.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 0.8,
		price: 270,
		maxStack: 5,
		description: 'Can be recycled into metal parts.',
		recycling: [{ itemId: 'res_metal_parts', amount: 3, name: 'Metal Parts' }]
	},
	loot_crumpled_plastic_bottle: {
		id: 'loot_crumpled_plastic_bottle',
		name: 'Crumpled Plastic Bottle',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/CrumpledPlasticBottle.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 0.8,
		price: 270,
		maxStack: 3,
		description: 'Can be recycled into plastic parts.',
		recycling: [{ itemId: 'res_plastic_parts', amount: 4, name: 'Plastic Parts' }]
	},
	loot_camera_lens: {
		id: 'loot_camera_lens',
		name: 'Camera Lens',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/CameraLens.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 0.8,
		price: 640,
		maxStack: 5,
		description: 'Can be recycled into crafting materials.',
		recycling: [{ itemId: 'res_plastic_parts', amount: 8, name: 'Plastic Parts' }]
	},
	loot_deflated_football: {
		id: 'loot_deflated_football',
		name: 'Deflated Football',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/DeflatedFootball.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 0.8,
		price: 1000,
		maxStack: 3,
		description: 'Just by looking at this, you too start to feel slightly deflated.',
		recycling: [
			{ itemId: 'res_rubber_parts', amount: 9, name: 'Rubber Parts' },
			{ itemId: 'loot_fabric', amount: 9, name: 'Fabric' }
		]
	},
	loot_ruined_baton: {
		id: 'loot_ruined_baton',
		name: 'Ruined Baton',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/RuinedBaton.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 0.8,
		price: 640,
		maxStack: 5,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'res_metal_parts', amount: 6, name: 'Metal Parts' },
			{ itemId: 'res_rubber_parts', amount: 3, name: 'Rubber Parts' }
		]
	},
	loot_ruined_handcuffs: {
		id: 'loot_ruined_handcuffs',
		name: 'Ruined Handcuffs',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/RuinedHandcuffs.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 0.8,
		price: 640,
		maxStack: 5,
		description: 'Can be recycled into crafting materials.',
		recycling: [{ itemId: 'res_metal_parts', amount: 8, name: 'Metal Parts' }]
	},
	loot_ruined_tactical_vest: {
		id: 'loot_ruined_tactical_vest',
		name: 'Ruined Tactical Vest',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/CraftingMaterials/RuinedTacticalVest.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 0.8,
		price: 640,
		maxStack: 5,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'loot_fabric', amount: 5, name: 'Fabric' },
			{ itemId: 'loot_magnet', amount: 1, name: 'Magnet' }
		]
	},
	loot_adv_arc_powercell: {
		id: 'loot_adv_arc_powercell',
		name: 'Advanced ARC Powercell',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/AdvancedArcPowercell.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		weight: 0.5,
		price: 640,
		maxStack: 5,
		description: 'Very valuable resource that drops from certain ARC enemies.',
		recycling: [{ itemId: 'loot_arc_powercell', amount: 2, name: 'ARC Powercell' }]
	},
	loot_adv_electrical: {
		id: 'loot_adv_electrical',
		name: 'Advanced Electrical Components',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/AdvancedElectricalComponents.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		weight: 1,
		price: 1750,
		maxStack: 5,
		description: 'Used to craft a wide range of items.',
		recycling: [
			{ itemId: 'res_wires', amount: 1, name: 'Wires' },
			{ itemId: 'loot_electrical_components', amount: 1, name: 'Electrical Components' }
		]
	},
	loot_antiseptic: {
		id: 'loot_antiseptic',
		name: 'Antiseptic',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/Antiseptic.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		weight: 1,
		price: 1000,
		maxStack: 5,
		description: 'Used to craft medical supplies.',
		recycling: [{ itemId: 'loot_chemicals', amount: 10, name: 'Chemicals' }]
	},
	loot_arc_flex_rubber: {
		id: 'loot_arc_flex_rubber',
		name: 'ARC Flex Rubber',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/ArcFlexRubber.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		weight: 1,
		price: 1000,
		maxStack: 3,
		description: 'Found by scavenging destroyed ARC machines.',
		recycling: [{ itemId: 'res_rubber_parts', amount: 16, name: 'Rubber Parts' }]
	},
	loot_arc_motion_core: {
		id: 'loot_arc_motion_core',
		name: 'ARC Motion Core',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/ArcMotionCore.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		weight: 0.3,
		price: 1000,
		maxStack: 5,
		description: 'Obtained from ARC enemies. Used to craft components.',
		recycling: [{ itemId: 'loot_arc_alloy', amount: 2, name: 'ARC Alloy' }]
	},
	loot_arc_performance_steel: {
		id: 'loot_arc_performance_steel',
		name: 'ARC Performance Steel',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/ArcPerformanceSteel.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		weight: 1,
		price: 1000,
		maxStack: 3,
		description: 'Obtained from ARC enemies. Used to craft components.',
		recycling: [{ itemId: 'res_metal_parts', amount: 12, name: 'Metal Parts' }]
	},
	loot_arc_thermo_lining: {
		id: 'loot_arc_thermo_lining',
		name: 'ARC Thermo Lining',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/ArcThermoLining.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		weight: 1,
		price: 1000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [{ itemId: 'loot_fabric', amount: 16, name: 'Fabric' }]
	},
	loot_coolant: {
		id: 'loot_coolant',
		name: 'Coolant',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/Coolant.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 2,
		price: 1000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'loot_chemicals', amount: 5, name: 'Chemicals' },
			{ itemId: 'loot_oil', amount: 2, name: 'Oil' }
		]
	},
	loot_explosive_compound: {
		id: 'loot_explosive_compound',
		name: 'Explosive Compound',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/ExplosiveCompound.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		weight: 0.3,
		price: 1000,
		maxStack: 5,
		description: 'Used to craft explosives.',
		recycling: [{ itemId: 'loot_crude_explosives', amount: 2, name: 'Crude Explosives' }]
	},
	loot_moss: {
		id: 'loot_moss',
		name: 'Moss',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/Moss.png',
		categoryIcon: '/assets/ui/category_assets/nature.png',
		weight: 0.3,
		price: 500,
		maxStack: 5,
		description: 'Can be used to regain a small amount of health.',
		recycling: [{ itemId: 'loot_assorted_seeds', amount: 3, name: 'Assorted Seeds' }]
	},
	loot_sensors: {
		id: 'loot_sensors',
		name: 'Sensors',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/Sensors.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 0.3,
		price: 500,
		maxStack: 5,
		description: 'Used in crafting.',
		recycling: [
			{ itemId: 'res_wires', amount: 1, name: 'Wires' },
			{ itemId: 'res_metal_parts', amount: 1, name: 'Metal Parts' }
		]
	},
	loot_speaker_component: {
		id: 'loot_speaker_component',
		name: 'Speaker Component',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/SpeakerComponent.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 0.3,
		price: 500,
		maxStack: 5,
		description: 'Used in crafting.',
		recycling: [
			{ itemId: 'res_plastic_parts', amount: 2, name: 'Plastic Parts' },
			{ itemId: 'res_rubber_parts', amount: 3, name: 'Rubber Parts' }
		]
	},
	loot_syringe: {
		id: 'loot_syringe',
		name: 'Syringe',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/Syringe.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 0.3,
		price: 500,
		maxStack: 5,
		description: 'Used to craft medical supplies.',
		recycling: [
			{ itemId: 'res_plastic_parts', amount: 3, name: 'Plastic Parts' },
			{ itemId: 'loot_chemicals', amount: 2, name: 'Chemicals' }
		]
	},
	loot_synthesized_fuel: {
		id: 'loot_synthesized_fuel',
		name: 'Synthesized Fuel',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/SynthesizedFuel.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 0.5,
		price: 700,
		maxStack: 5,
		description: 'Used to craft utility items and explosives. Can be thrown.',
		recycling: [
			{ itemId: 'loot_oil', amount: 1, name: 'Oil' },
			{ itemId: 'res_plastic_parts', amount: 1, name: 'Plastic Parts' }
		]
	},
	loot_voltage_converter: {
		id: 'loot_voltage_converter',
		name: 'Voltage Converter',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/VoltageConverter.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 0.3,
		price: 500,
		maxStack: 5,
		description: 'Used in crafting.',
		recycling: [
			{ itemId: 'res_wires', amount: 1, name: 'Wires' },
			{ itemId: 'res_rubber_parts', amount: 1, name: 'Rubber Parts' }
		]
	},
	loot_dog_collar: {
		id: 'loot_dog_collar',
		name: 'Dog Collar',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/DogCollar.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 0.8,
		price: 640,
		maxStack: 3,
		description: 'After all this time, you can still smell the goodness.',
		recycling: [
			{ itemId: 'loot_fabric', amount: 8, name: 'Fabric' },
			{ itemId: 'res_metal_parts', amount: 1, name: 'Metal Parts' }
		]
	},
	loot_broken_flashlight: {
		id: 'loot_broken_flashlight',
		name: 'Broken Flashlight',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/BrokenFlashlight.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 2,
		price: 1000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'loot_battery', amount: 2, name: 'Battery' },
			{ itemId: 'res_metal_parts', amount: 6, name: 'Metal Parts' }
		]
	},
	loot_broken_guidance_system: {
		id: 'loot_broken_guidance_system',
		name: 'Broken Guidance System',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/BrokenGuidanceSystem.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 3,
		price: 2000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [{ itemId: 'res_processor', amount: 4, name: 'Processor' }]
	},
	loot_damaged_heat_sink: {
		id: 'loot_damaged_heat_sink',
		name: 'Damaged Heat Sink',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/DamagedHeatSink.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 2,
		price: 1000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'res_metal_parts', amount: 6, name: 'Metal Parts' },
			{ itemId: 'res_wires', amount: 2, name: 'Wires' }
		]
	},
	loot_expired_respirator: {
		id: 'loot_expired_respirator',
		name: 'Expired Respirator',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/ExpiredRespirator.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 2,
		price: 640,
		maxStack: 3,
		description: 'The filters are clogged with sand and noxious fumes.',
		recycling: [
			{ itemId: 'res_rubber_parts', amount: 8, name: 'Rubber Parts' },
			{ itemId: 'loot_fabric', amount: 4, name: 'Fabric' }
		]
	},
	loot_freq_mod_box: {
		id: 'loot_freq_mod_box',
		name: 'Frequency Modulation Box',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/FrequencyModulationBox.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 1.5,
		price: 3000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'loot_adv_electrical', amount: 1, name: 'Advanced Electrical Components' },
			{ itemId: 'loot_speaker_component', amount: 1, name: 'Speaker Component' }
		]
	},
	loot_fried_motherboard: {
		id: 'loot_fried_motherboard',
		name: 'Fried Motherboard',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/FriedMotherboard.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 3,
		price: 2000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'res_plastic_parts', amount: 5, name: 'Plastic Parts' },
			{ itemId: 'loot_electrical_components', amount: 2, name: 'Electrical Components' },
			{ itemId: 'res_wires', amount: 5, name: 'Wires' }
		]
	},
	loot_frying_pan: {
		id: 'loot_frying_pan',
		name: 'Frying Pan',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/FryingPan.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 2,
		price: 640,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [{ itemId: 'res_metal_parts', amount: 8, name: 'Metal Parts' }]
	},
	loot_headphones: {
		id: 'loot_headphones',
		name: 'Headphones',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/Headphones.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 2,
		price: 1000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'res_rubber_parts', amount: 7, name: 'Rubber Parts' },
			{ itemId: 'loot_speaker_component', amount: 1, name: 'Speaker Component' }
		]
	},
	loot_industrial_battery: {
		id: 'loot_industrial_battery',
		name: 'Industrial Battery',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/IndustrialBattery.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 2,
		price: 1000,
		maxStack: 3,
		description: 'Can be recycled into materials.',
		recycling: [
			{ itemId: 'loot_chemicals', amount: 7, name: 'Chemicals' },
			{ itemId: 'loot_battery', amount: 2, name: 'Battery' }
		]
	},
	loot_industrial_charger: {
		id: 'loot_industrial_charger',
		name: 'Industrial Charger',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/IndustrialCharger.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 2,
		price: 1000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'res_metal_parts', amount: 5, name: 'Metal Parts' },
			{ itemId: 'loot_voltage_converter', amount: 1, name: 'Voltage Converter' }
		]
	},
	loot_industrial_magnet: {
		id: 'loot_industrial_magnet',
		name: 'Industrial Magnet',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/IndustrialMagnet.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 2,
		price: 1000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'res_metal_parts', amount: 4, name: 'Metal Parts' },
			{ itemId: 'loot_magnet', amount: 2, name: 'Magnet' }
		]
	},
	loot_motor: {
		id: 'loot_motor',
		name: 'Motor',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/Motor.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 3,
		price: 2000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'loot_oil', amount: 2, name: 'Oil' },
			{ itemId: 'res_mechanical_components', amount: 2, name: 'Mechanical Components' }
		]
	},
	loot_polluted_air_filter: {
		id: 'loot_polluted_air_filter',
		name: 'Polluted Air Filter',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/PollutedAirFilter.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 0.8,
		price: 1000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'loot_fabric', amount: 6, name: 'Fabric' },
			{ itemId: 'loot_oil', amount: 2, name: 'Oil' }
		]
	},
	loot_portable_tv: {
		id: 'loot_portable_tv',
		name: 'Portable TV',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/PortableTV.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 3,
		price: 2000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'loot_battery', amount: 2, name: 'Battery' },
			{ itemId: 'res_wires', amount: 6, name: 'Wires' }
		]
	},
	loot_power_bank: {
		id: 'loot_power_bank',
		name: 'Power Bank',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/PowerBank.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 2,
		price: 1000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'loot_battery', amount: 2, name: 'Battery' },
			{ itemId: 'res_wires', amount: 2, name: 'Wires' }
		]
	},
	loot_power_cable: {
		id: 'loot_power_cable',
		name: 'Power Cable',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/PowerCable.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 2,
		price: 1000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [{ itemId: 'res_wires', amount: 4, name: 'Wires' }]
	},
	loot_projector: {
		id: 'loot_projector',
		name: 'Projector',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/Projector.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 2,
		price: 1000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'res_wires', amount: 2, name: 'Wires' },
			{ itemId: 'res_processor', amount: 1, name: 'Processor' }
		]
	},
	loot_ruined_accordion: {
		id: 'loot_ruined_accordion',
		name: 'Ruined Accordion',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/RuinedAccordion.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 3,
		price: 2000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'res_rubber_parts', amount: 18, name: 'Rubber Parts' },
			{ itemId: 'res_steel_spring', amount: 3, name: 'Steel Spring' }
		]
	},
	loot_rusted_gear: {
		id: 'loot_rusted_gear',
		name: 'Rusted Gear',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/RustedGear.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 3,
		price: 2000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'res_metal_parts', amount: 4, name: 'Metal Parts' },
			{ itemId: 'res_mechanical_components', amount: 2, name: 'Mechanical Components' }
		]
	},
	loot_rusted_medical_kit: {
		id: 'loot_rusted_medical_kit',
		name: 'Rusted Shut Medical Kit',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/RustedShutMedicalKit.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 3,
		price: 2000,
		maxStack: 3,
		description: 'Can be recycled into medical crafting materials.',
		recycling: [
			{ itemId: 'loot_syringe', amount: 2, name: 'Syringe' },
			{ itemId: 'loot_antiseptic', amount: 1, name: 'Antiseptic' }
		]
	},
	loot_rusted_tools: {
		id: 'loot_rusted_tools',
		name: 'Rusted Tools',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/RustedTools.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 2,
		price: 1000,
		maxStack: 3,
		description: 'Can be recycled into metal parts.',
		recycling: [
			{ itemId: 'res_metal_parts', amount: 8, name: 'Metal Parts' },
			{ itemId: 'res_steel_spring', amount: 1, name: 'Steel Spring' }
		]
	},
	loot_torn_blanket: {
		id: 'loot_torn_blanket',
		name: 'Torn Blanket',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/TornBlanket.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 2,
		price: 640,
		maxStack: 3,
		description: 'Can be recycled into fabric.',
		recycling: [{ itemId: 'loot_fabric', amount: 12, name: 'Fabric' }]
	},
	loot_turbo_pump: {
		id: 'loot_turbo_pump',
		name: 'Turbo Pump',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/TurboPump.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 3,
		price: 2000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'res_mechanical_components', amount: 1, name: 'Mechanical Components' },
			{ itemId: 'loot_oil', amount: 3, name: 'Oil' }
		]
	},
	loot_wasp_driver: {
		id: 'loot_wasp_driver',
		name: 'Wasp Driver',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/WaspDriver.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 0.6,
		price: 640,
		maxStack: 3,
		description: 'Can be thrown, and will explode if shot.',
		recycling: [
			{ itemId: 'loot_arc_alloy', amount: 1, name: 'ARC Alloy' },
			{ itemId: 'loot_electrical_components', amount: 1, name: 'Electrical Components' }
		]
	},
	loot_water_filter: {
		id: 'loot_water_filter',
		name: 'Water Filter',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/WaterFilter.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 2,
		price: 1000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'res_rubber_parts', amount: 2, name: 'Rubber Parts' },
			{ itemId: 'loot_canister', amount: 3, name: 'Canister' }
		]
	},
	loot_water_pump: {
		id: 'loot_water_pump',
		name: 'Water Pump',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/CraftingMaterials/WaterPump.png',
		categoryIcon: '/assets/ui/category_assets/recyclable.png',
		weight: 2,
		price: 1000,
		maxStack: 3,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'res_metal_parts', amount: 4, name: 'Metal Parts' },
			{ itemId: 'loot_oil', amount: 2, name: 'Oil' }
		]
	},
	loot_power_rod: {
		id: 'loot_power_rod',
		name: 'Power Rod',
		type: 'loot',
		rarity: 'epic',
		image: '/assets/items/CraftingMaterials/PowerRod.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		weight: 1,
		price: 5000,
		maxStack: 3,
		description: 'Used to craft advanced equipment. Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'loot_adv_electrical', amount: 1, name: 'Advanced Electrical Components' },
			{ itemId: 'res_arc_circuitry', amount: 1, name: 'ARC Circuitry' }
		]
	},
	loot_exodus_modules: {
		id: 'loot_exodus_modules',
		name: 'Exodus Modules',
		type: 'loot',
		rarity: 'epic',
		image: '/assets/items/CraftingMaterials/ExodusModules.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		weight: 1,
		price: 2750,
		maxStack: 3,
		description: 'Used to craft a wide range of items.',
		recycling: [
			{ itemId: 'loot_magnet', amount: 2, name: 'Magnet' },
			{ itemId: 'res_processor', amount: 2, name: 'Processor' }
		]
	},
	loot_leaper_pulse_unit: {
		id: 'loot_leaper_pulse_unit',
		name: 'Leaper Pulse Unit',
		type: 'loot',
		rarity: 'epic',
		image: '/assets/items/CraftingMaterials/LeaperPulseUnit.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		weight: 1,
		price: 3000,
		maxStack: 3,
		description: 'Can be thrown to create a violent singularity.',
		recycling: [
			{ itemId: 'res_adv_mechanical_components', amount: 1, name: 'Advanced Mechanical Components' },
			{ itemId: 'loot_arc_alloy', amount: 3, name: 'ARC Alloy' }
		]
	},
	loot_matriarch_reactor: {
		id: 'loot_matriarch_reactor',
		name: 'Matriarch Reactor',
		type: 'loot',
		rarity: 'legendary',
		image: '/assets/items/CraftingMaterials/MatriarchReactor.png',
		categoryIcon: '/assets/ui/category_assets/refined_material.png',
		weight: 10,
		price: 11000,
		maxStack: 1,
		description: 'Can be recycled into crafting materials.',
		recycling: [
			{ itemId: 'loot_power_rod', amount: 1, name: 'Power Rod' },
			{ itemId: 'res_magnetic_accelerator', amount: 1, name: 'Magnetic Accelerator' }
		]
	},

	// ──────────────────────────────────────
	// MISC / TRINKETS
	// ──────────────────────────────────────
	loot_assorted_seeds: {
		id: 'loot_assorted_seeds',
		name: 'Assorted Seeds',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/Misc/Seeds.png',
		categoryIcon: '/assets/ui/category_assets/nature.png',
		weight: 0.05,
		price: 100,
		maxStack: 100,
		description: 'A handful of seeds.'
	},
	loot_rubber_duck: {
		id: 'loot_rubber_duck',
		name: 'Rubber Duck',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/Misc/RubberDuck.png',
		categoryIcon: '/assets/ui/category_assets/trinket.png',
		weight: 0.3,
		price: 1000,
		maxStack: 15,
		description: 'Always there to lend an ear, should you need it.'
	},
	loot_apricot: {
		id: 'loot_apricot',
		name: 'Apricot',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/Misc/Apricot.png',
		categoryIcon: '/assets/ui/category_assets/nature.png',
		weight: 0.2,
		price: 640,
		maxStack: 10,
		description: 'A sun ripe apricot. Can be consumed for a small amount of stamina.',
		recycling: [{ itemId: 'loot_assorted_seeds', amount: 3, name: 'Assorted Seeds' }]
	},
	loot_olives: {
		id: 'loot_olives',
		name: 'Olives',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/Misc/Olives.png',
		categoryIcon: '/assets/ui/category_assets/nature.png',
		weight: 0.2,
		price: 640,
		maxStack: 10,
		description: 'Can be consumed for a small amount of stamina.',
		recycling: [{ itemId: 'loot_assorted_seeds', amount: 2, name: 'Assorted Seeds' }]
	},
	loot_prickly_pear: {
		id: 'loot_prickly_pear',
		name: 'Prickly Pear',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/Misc/PricklyPear.png',
		categoryIcon: '/assets/ui/category_assets/nature.png',
		weight: 0.2,
		price: 640,
		maxStack: 10,
		description: 'Can be consumed for a small amount of stamina.',
		recycling: [{ itemId: 'loot_assorted_seeds', amount: 3, name: 'Assorted Seeds' }]
	},
	loot_mushroom: {
		id: 'loot_mushroom',
		name: 'Mushroom',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/Misc/Mushrooms.png',
		categoryIcon: '/assets/ui/category_assets/nature.png',
		weight: 0.2,
		price: 1000,
		maxStack: 5,
		description: 'Can be consumed to regain a small amount of health.'
	},
	loot_air_freshener: {
		id: 'loot_air_freshener',
		name: 'Air Freshener',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/Misc/AirFreshener.png',
		categoryIcon: '/assets/ui/category_assets/trinket.png',
		weight: 0.3,
		price: 2000,
		maxStack: 5,
		description: 'May be worth a few coins.'
	},
	loot_bloated_tuna_can: {
		id: 'loot_bloated_tuna_can',
		name: 'Bloated Tuna Can',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/Misc/BloatedTunaCan.png',
		categoryIcon: '/assets/ui/category_assets/trinket.png',
		weight: 0.2,
		price: 1000,
		maxStack: 15,
		description: 'Something tells you that you don\'t want to open this...'
	},
	loot_dart_board: {
		id: 'loot_dart_board',
		name: 'Dart Board',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/Misc/DartBoard.png',
		categoryIcon: '/assets/ui/category_assets/trinket.png',
		weight: 1,
		price: 2000,
		maxStack: 3,
		description: 'A trinket that your Raider hasn\'t quite figured out how to repurpose.'
	},
	loot_light_bulb: {
		id: 'loot_light_bulb',
		name: 'Light Bulb',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/Misc/LightBulb.png',
		categoryIcon: '/assets/ui/category_assets/trinket.png',
		weight: 0.2,
		price: 2000,
		maxStack: 5,
		description: 'Good thing we get illumination from these Light Bulbs.'
	},
	loot_very_comfortable_pillow: {
		id: 'loot_very_comfortable_pillow',
		name: 'Very Comfortable Pillow',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/Misc/VeryComfortablePillow.png',
		categoryIcon: '/assets/ui/category_assets/trinket.png',
		weight: 0.3,
		price: 2000,
		maxStack: 3,
		description: 'Like sleeping on an especially ergonomic cloud.'
	},
	loot_music_album: {
		id: 'loot_music_album',
		name: 'Music Album',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/Misc/MusicAlbum.png',
		categoryIcon: '/assets/ui/category_assets/trinket.png',
		weight: 0.3,
		price: 3000,
		maxStack: 3,
		description: 'Perfect for relaxing nights at home and air guitar concerts.'
	},
	loot_fine_wristwatch: {
		id: 'loot_fine_wristwatch',
		name: 'Fine Wristwatch',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/Misc/FineWristwatch.png',
		categoryIcon: '/assets/ui/category_assets/trinket.png',
		weight: 0.2,
		price: 3000,
		maxStack: 3,
		description: 'Perfect for telling the time, and showcasing that you\'re an exceedingly dignified person.'
	},
	loot_silver_teaspoon_set: {
		id: 'loot_silver_teaspoon_set',
		name: 'Silver Teaspoon Set',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/Misc/SilverTeaspoonSet.png',
		categoryIcon: '/assets/ui/category_assets/trinket.png',
		weight: 0.3,
		price: 3000,
		maxStack: 3,
		description: 'A shining shimmering set of refinement and elegance.'
	},
	loot_statuette: {
		id: 'loot_statuette',
		name: 'Statuette',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/Misc/Statuette.png',
		categoryIcon: '/assets/ui/category_assets/trinket.png',
		weight: 0.3,
		price: 3000,
		maxStack: 3,
		description: 'Look at the adorable tiny Statuette.'
	},
	loot_snow_globe: {
		id: 'loot_snow_globe',
		name: 'Breathtaking Snow Globe',
		type: 'loot',
		rarity: 'epic',
		image: '/assets/items/Misc/BreathtakingSnowGlobe.png',
		categoryIcon: '/assets/ui/category_assets/trinket.png',
		weight: 0.2,
		price: 7000,
		maxStack: 1,
		description: 'The envy of every Speranzan. Proof that this world was once thriving and magical.'
	},

	// ──────────────────────────────────────
	// QUICK USE / CONSUMABLES
	// ──────────────────────────────────────
	loot_bandage: {
		id: 'loot_bandage',
		name: 'Bandage',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/QuickUse/Bandage.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.1,
		price: 250,
		maxStack: 5,
		description: 'A medical item that gradually restores health over time.',
		recycling: [{ itemId: 'loot_fabric', amount: 2, name: 'Fabric' }]
	},
	loot_adrenaline_shot: {
		id: 'loot_adrenaline_shot',
		name: 'Adrenaline Shot',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/QuickUse/AdrenalineShot.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.2,
		price: 300,
		maxStack: 5,
		description: 'Fully restores stamina and temporarily increases stamina regeneration.',
		recycling: [
			{ itemId: 'loot_chemicals', amount: 1, name: 'Chemicals' },
			{ itemId: 'res_plastic_parts', amount: 1, name: 'Plastic Parts' }
		]
	},
	loot_blue_light_stick: {
		id: 'loot_blue_light_stick',
		name: 'Blue Light Stick',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/QuickUse/BlueLightStick.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.15,
		price: 150,
		maxStack: 5,
		description: 'A throwable chemical light that illuminates the area.',
		recycling: [{ itemId: 'loot_chemicals', amount: 1, name: 'Chemicals' }]
	},
	loot_green_light_stick: {
		id: 'loot_green_light_stick',
		name: 'Green Light Stick',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/QuickUse/GreenLightStick.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.15,
		price: 150,
		maxStack: 5,
		description: 'A throwable chemical light that illuminates the area.',
		recycling: [{ itemId: 'loot_chemicals', amount: 1, name: 'Chemicals' }]
	},
	loot_red_light_stick: {
		id: 'loot_red_light_stick',
		name: 'Red Light Stick',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/QuickUse/RedLightStick.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.15,
		price: 150,
		maxStack: 5,
		description: 'A throwable chemical light that illuminates the area.',
		recycling: [{ itemId: 'loot_chemicals', amount: 1, name: 'Chemicals' }]
	},
	loot_firecracker: {
		id: 'loot_firecracker',
		name: 'Firecracker',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/QuickUse/FireCracker.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.05,
		price: 270,
		maxStack: 5,
		description: 'A device that sparks and pops in a pleasant manner.',
		recycling: [{ itemId: 'res_plastic_parts', amount: 3, name: 'Plastic Parts' }]
	},
	loot_gas_grenade: {
		id: 'loot_gas_grenade',
		name: 'Gas Grenade',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/QuickUse/GasGrenade.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.2,
		price: 270,
		maxStack: 3,
		description: 'Creates a lingering toxic cloud on impact, draining stamina.',
		recycling: [
			{ itemId: 'loot_chemicals', amount: 1, name: 'Chemicals' },
			{ itemId: 'res_rubber_parts', amount: 1, name: 'Rubber Parts' }
		]
	},
	loot_gas_mine: {
		id: 'loot_gas_mine',
		name: 'Gas Mine',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/QuickUse/GasMine.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.25,
		price: 270,
		maxStack: 3,
		description: 'A proximity-triggered mine that deploys a gas cloud.',
		recycling: [
			{ itemId: 'loot_chemicals', amount: 1, name: 'Chemicals' },
			{ itemId: 'res_rubber_parts', amount: 1, name: 'Rubber Parts' }
		]
	},
	loot_light_impact_grenade: {
		id: 'loot_light_impact_grenade',
		name: 'Light Impact Grenade',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/QuickUse/LightImpactGrenade.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.1,
		price: 270,
		maxStack: 5,
		description: 'Detonates on impact to create a small explosion.',
		recycling: [
			{ itemId: 'loot_chemicals', amount: 1, name: 'Chemicals' },
			{ itemId: 'res_plastic_parts', amount: 1, name: 'Plastic Parts' }
		]
	},
	loot_lil_smoke_grenade: {
		id: 'loot_lil_smoke_grenade',
		name: 'Li\'l Smoke Grenade',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/QuickUse/LilSmokeGrenade.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.15,
		price: 300,
		maxStack: 5,
		description: 'Pops a thick but small smoke cloud on impact.',
		recycling: [
			{ itemId: 'loot_chemicals', amount: 1, name: 'Chemicals' },
			{ itemId: 'res_plastic_parts', amount: 1, name: 'Plastic Parts' }
		]
	},
	loot_door_blocker: {
		id: 'loot_door_blocker',
		name: 'Door Blocker',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/QuickUse/DoorStopper.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.2,
		price: 270,
		maxStack: 3,
		description: 'A locking mechanism that can be placed on large metal doors.',
		recycling: [{ itemId: 'res_metal_parts', amount: 2, name: 'Metal Parts' }]
	},
	loot_binoculars: {
		id: 'loot_binoculars',
		name: 'Binoculars',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/QuickUse/Binoculars.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.5,
		price: 640,
		maxStack: 1,
		description: 'A basic pair of binoculars with two levels of magnification.',
		recycling: [
			{ itemId: 'res_rubber_parts', amount: 2, name: 'Rubber Parts' },
			{ itemId: 'res_plastic_parts', amount: 4, name: 'Plastic Parts' }
		]
	},
	loot_barricade_kit: {
		id: 'loot_barricade_kit',
		name: 'Barricade Kit',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/QuickUse/Barricade.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.4,
		price: 640,
		maxStack: 3,
		description: 'A deployable cover that can block incoming damage.',
		recycling: [{ itemId: 'res_metal_parts', amount: 4, name: 'Metal Parts' }]
	},
	loot_herbal_bandage: {
		id: 'loot_herbal_bandage',
		name: 'Herbal Bandage',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/QuickUse/HerbalBandage.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.15,
		price: 900,
		maxStack: 5,
		description: 'An improvised medical item that gradually restores health.',
		recycling: [
			{ itemId: 'loot_assorted_seeds', amount: 2, name: 'Assorted Seeds' },
			{ itemId: 'loot_fabric', amount: 5, name: 'Fabric' }
		]
	},
	loot_lure_grenade: {
		id: 'loot_lure_grenade',
		name: 'Lure Grenade',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/QuickUse/LureGrenade.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.4,
		price: 1000,
		maxStack: 3,
		description: 'A noisy device that sticks to surfaces, distracting nearby ARC machines.',
		recycling: [{ itemId: 'loot_speaker_component', amount: 1, name: 'Speaker Component' }]
	},
	loot_pulse_mine: {
		id: 'loot_pulse_mine',
		name: 'Pulse Mine',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/QuickUse/PulseMine.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.25,
		price: 470,
		maxStack: 3,
		description: 'A proximity-triggered mine that knocks back anything within its radius.',
		recycling: [{ itemId: 'loot_chemicals', amount: 6, name: 'Chemicals' }]
	},
	loot_recorder: {
		id: 'loot_recorder',
		name: 'Recorder',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/QuickUse/Recorder.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.2,
		price: 1000,
		maxStack: 1,
		description: 'A playable recorder used to attract ARC attention.',
		recycling: [{ itemId: 'res_plastic_parts', amount: 10, name: 'Plastic Parts' }]
	},
	loot_seeker_grenade: {
		id: 'loot_seeker_grenade',
		name: 'Seeker Grenade',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/QuickUse/SeekerGrenade.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.2,
		price: 640,
		maxStack: 5,
		description: 'A homing grenade that targets a single nearby ARC.',
		recycling: [{ itemId: 'loot_crude_explosives', amount: 1, name: 'Crude Explosives' }]
	},
	loot_shaker: {
		id: 'loot_shaker',
		name: 'Shaker',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/QuickUse/Shaker.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.2,
		price: 1000,
		maxStack: 1,
		description: 'A rhythmic instrument used to attract ARC attention.',
		recycling: [{ itemId: 'res_plastic_parts', amount: 10, name: 'Plastic Parts' }]
	},
	loot_shield_recharger: {
		id: 'loot_shield_recharger',
		name: 'Shield Recharger',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/QuickUse/ShieldRecharger.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.15,
		price: 520,
		maxStack: 3,
		description: 'A handheld repair kit that recharges a shield over time.',
		recycling: [{ itemId: 'res_rubber_parts', amount: 4, name: 'Rubber Parts' }]
	},
	loot_shrapnel_grenade: {
		id: 'loot_shrapnel_grenade',
		name: 'Shrapnel Grenade',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/QuickUse/ShrapnelGrenade.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.15,
		price: 800,
		maxStack: 5,
		description: 'Bursts into razor-sharp fragments upon detonation.',
		recycling: [
			{ itemId: 'loot_crude_explosives', amount: 1, name: 'Crude Explosives' },
			{ itemId: 'res_metal_parts', amount: 1, name: 'Metal Parts' }
		]
	},
	loot_snap_blast_grenade: {
		id: 'loot_snap_blast_grenade',
		name: 'Snap Blast Grenade',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/QuickUse/SnapBlastGrenade.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.2,
		price: 800,
		maxStack: 5,
		description: 'Sticks to surfaces, dealing explosive damage after a short delay.',
		recycling: [
			{ itemId: 'loot_chemicals', amount: 1, name: 'Chemicals' },
			{ itemId: 'loot_magnet', amount: 1, name: 'Magnet' }
		]
	},
	loot_noise_maker: {
		id: 'loot_noise_maker',
		name: 'Noise Maker',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/QuickUse/NoiseMaker.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.2,
		price: 500,
		maxStack: 5,
		description: 'A deployable proximity sensor that sounds an alarm when enemy raiders are detected.',
	},
	loot_raider_flare: {
		id: 'loot_raider_flare',
		name: 'Raider Flare',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/items/QuickUse/RaiderFlare.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.2,
		price: 500,
		maxStack: 5,
		description: 'A deployable device that, when manually triggered, launches a Raider Distress Flare.',
	},
	loot_blaze_grenade: {
		id: 'loot_blaze_grenade',
		name: 'Blaze Grenade',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/QuickUse/BlazeGrenade.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.2,
		price: 1600,
		maxStack: 5,
		description: 'Detonates on impact, covering an area in fire.',
		recycling: [
			{ itemId: 'loot_oil', amount: 2, name: 'Oil' },
			{ itemId: 'res_metal_parts', amount: 4, name: 'Metal Parts' }
		]
	},
	loot_blaze_grenade_trap: {
		id: 'loot_blaze_grenade_trap',
		name: 'Blaze Grenade Trap',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/QuickUse/BlazeGrenadeTrap.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.3,
		price: 1000,
		maxStack: 3,
		description: 'A laser trip wire that detonates a Blaze Grenade.'
	},
	loot_defibrillator: {
		id: 'loot_defibrillator',
		name: 'Defibrillator',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/QuickUse/Defibrilator.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.75,
		price: 1000,
		maxStack: 3,
		description: 'Quickly revives downed Raiders and restores some health.',
		recycling: [
			{ itemId: 'res_plastic_parts', amount: 1, name: 'Plastic Parts' },
			{ itemId: 'loot_moss', amount: 1, name: 'Moss' }
		]
	},
	loot_heavy_fuze_grenade: {
		id: 'loot_heavy_fuze_grenade',
		name: 'Heavy Fuze Grenade',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/QuickUse/HeavyFuzeGrenade.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.2,
		price: 1600,
		maxStack: 3,
		description: 'Detonates after a delay, dealing explosive damage in its radius.',
		recycling: [
			{ itemId: 'loot_oil', amount: 1, name: 'Oil' },
			{ itemId: 'res_rubber_parts', amount: 2, name: 'Rubber Parts' }
		]
	},
	loot_jolt_mine: {
		id: 'loot_jolt_mine',
		name: 'Jolt Mine',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/QuickUse/JoltMine.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.2,
		price: 850,
		maxStack: 3,
		description: 'A proximity-triggered mine that stuns anything within its radius.',
		recycling: [
			{ itemId: 'loot_battery', amount: 1, name: 'Battery' },
			{ itemId: 'res_plastic_parts', amount: 2, name: 'Plastic Parts' }
		]
	},
	loot_rope: {
		id: 'loot_rope',
		name: 'Rope',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/QuickUse/Rope.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.3,
		price: 500,
		maxStack: 5,
		description: 'Used in crafting.',
		recycling: [{ itemId: 'loot_fabric', amount: 5, name: 'Fabric' }]
	},
	loot_smoke_grenade: {
		id: 'loot_smoke_grenade',
		name: 'Smoke Grenade',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/QuickUse/SmokeGrenade.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.2,
		price: 1000,
		maxStack: 3,
		description: 'Creates a lingering smoke cloud on impact.',
		recycling: [
			{ itemId: 'loot_chemicals', amount: 2, name: 'Chemicals' },
			{ itemId: 'loot_canister', amount: 1, name: 'Canister' }
		]
	},
	loot_sterilized_bandage: {
		id: 'loot_sterilized_bandage',
		name: 'Sterilized Bandage',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/QuickUse/SteralizedBandage.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.2,
		price: 2000,
		maxStack: 3,
		description: 'Gradually restores a large amount of health over time.',
		recycling: [
			{ itemId: 'loot_fabric', amount: 1, name: 'Fabric' },
			{ itemId: 'loot_antiseptic', amount: 1, name: 'Antiseptic' }
		]
	},
	loot_surge_shield_recharger: {
		id: 'loot_surge_shield_recharger',
		name: 'Surge Shield Recharger',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/QuickUse/SurgeShieldRecharger.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.2,
		price: 1200,
		maxStack: 3,
		description: 'A handheld kit that recharges a shield on use.',
		recycling: [{ itemId: 'loot_electrical_components', amount: 1, name: 'Electrical Components' }]
	},
	loot_tagging_grenade: {
		id: 'loot_tagging_grenade',
		name: 'Tagging Grenade',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/QuickUse/TaggingGrenade.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.4,
		price: 1000,
		maxStack: 5,
		description: 'Tags Raiders and ARC enemies in an area, allowing brief tracking.',
		recycling: [
			{ itemId: 'res_plastic_parts', amount: 1, name: 'Plastic Parts' },
			{ itemId: 'loot_sensors', amount: 1, name: 'Sensors' }
		]
	},
	loot_fireworks_box: {
		id: 'loot_fireworks_box',
		name: 'Fireworks Box',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/QuickUse/FireworksBox.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.5,
		price: 2000,
		maxStack: 1,
		description: 'A remotely triggered arrangement of dazzling fireworks.',
		recycling: [{ itemId: 'loot_explosive_compound', amount: 1, name: 'Explosive Compound' }]
	},
	loot_showstopper_grenade: {
		id: 'loot_showstopper_grenade',
		name: 'Showstopper Grenade',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/QuickUse/ShowstopperGrenade.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 0.2,
		price: 1500,
		maxStack: 3,
		description: 'A grenade that detonates after a delay, stunning enemies within its radius.',
	},
	loot_photoelectric_cloak: {
		id: 'loot_photoelectric_cloak',
		name: 'Photoelectric Cloak',
		type: 'loot',
		rarity: 'epic',
		image: '/assets/items/QuickUse/PhotoelectricCloak.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 1,
		price: 5000,
		maxStack: 1,
		description: 'Allows the user to conceal themselves from ARC.',
		recycling: [
			{ itemId: 'loot_adv_electrical', amount: 1, name: 'Advanced Electrical Components' },
			{ itemId: 'loot_speaker_component', amount: 1, name: 'Speaker Component' }
		]
	},
	loot_deadline: {
		id: 'loot_deadline',
		name: 'Deadline',
		type: 'loot',
		rarity: 'epic',
		image: '/assets/items/QuickUse/DeadlineMine.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 1,
		price: 6000,
		maxStack: 3,
		description: 'A mine that deals damage once the timer runs out.',
		recycling: [
			{ itemId: 'loot_explosive_compound', amount: 1, name: 'Explosive Compound' },
			{ itemId: 'res_arc_circuitry', amount: 1, name: 'ARC Circuitry' }
		]
	},
	loot_acoustic_guitar: {
		id: 'loot_acoustic_guitar',
		name: 'Acoustic Guitar',
		type: 'loot',
		rarity: 'legendary',
		image: '/assets/items/QuickUse/AcousticGuitar.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 1,
		price: 7000,
		maxStack: 1,
		description: 'Used to attract ARC attention, and impress other Raiders.',
		recycling: [
			{ itemId: 'res_wires', amount: 6, name: 'Wires' },
			{ itemId: 'res_metal_parts', amount: 4, name: 'Metal Parts' }
		]
	},
	loot_snap_hook: {
		id: 'loot_snap_hook',
		name: 'Snap Hook',
		type: 'loot',
		rarity: 'legendary',
		image: '/assets/items/QuickUse/SnapHook.png',
		categoryIcon: '/assets/ui/category_assets/quick_use.png',
		weight: 5,
		price: 14000,
		maxStack: 1,
		description: 'Allows the user to scale structures and cover large distances.',
		recycling: [
			{ itemId: 'loot_power_rod', amount: 1, name: 'Power Rod' },
			{ itemId: 'loot_rope', amount: 3, name: 'Rope' }
		]
	},

	// ──────────────────────────────────────
	// AMMUNITION
	// ──────────────────────────────────────
	ammo_light: {
		id: 'ammo_light',
		name: 'Light Ammo',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/Ammunition/LightAmmo.png',
		categoryIcon: '/assets/ui/ammo_type_assets/light_ammo.png',
		weight: 0.01,
		price: 4,
		maxStack: 100,
		description: 'Commonly used by low-caliber weapons.'
	},
	ammo_medium: {
		id: 'ammo_medium',
		name: 'Medium Ammo',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/Ammunition/MediumAmmo.png',
		categoryIcon: '/assets/ui/ammo_type_assets/medium_ammo.png',
		weight: 0.025,
		price: 6,
		maxStack: 80,
		description: 'Used by medium-caliber weapons.'
	},
	ammo_heavy: {
		id: 'ammo_heavy',
		name: 'Heavy Ammo',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/Ammunition/HeavyAmmo.png',
		categoryIcon: '/assets/ui/ammo_type_assets/heavy_ammo.png',
		weight: 0.05,
		price: 12,
		maxStack: 40,
		description: 'Used by high-caliber weapons.'
	},
	ammo_shotgun: {
		id: 'ammo_shotgun',
		name: 'Shotgun Ammo',
		type: 'loot',
		rarity: 'common',
		image: '/assets/items/Ammunition/ShotgunAmmo.png',
		categoryIcon: '/assets/ui/ammo_type_assets/shotgun_ammo.png',
		weight: 0.085,
		price: 20,
		maxStack: 20,
		description: 'Ammo for shotguns.'
	},
	ammo_energy: {
		id: 'ammo_energy',
		name: 'Energy Clip',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/Ammunition/EnergyAmmo.png',
		categoryIcon: '/assets/ui/ammo_type_assets/energy_clip.png',
		weight: 0.3,
		price: 1000,
		maxStack: 5,
		description: 'Ammo used for energy weapons. One clip will fully charge a single weapon.'
	},
	ammo_launcher: {
		id: 'ammo_launcher',
		name: 'Launcher Ammo',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/Ammunition/LauncherAmmo.png',
		categoryIcon: '/assets/ui/ammo_type_assets/launcher_ammo.png',
		weight: 0.1,
		price: 250,
		maxStack: 24,
		description: 'Anti-ARC payloads used mainly by the Hullcracker.'
	},

	// ──────────────────────────────────────
	// AUGMENTS
	// ──────────────────────────────────────
	aug_free_loadout: {
		id: 'aug_free_loadout',
		name: 'Free Loadout Augment',
		type: 'augment',
		rarity: 'common',
		image: '/assets/items/Augments/FreeLoadoutAugment.png',
		categoryIcon: '/assets/ui/category_assets/augment.png',
		weight: 1,
		price: 100,
		maxStack: 1,
		description: 'Basic augment for rookie Raiders.'
	},
	aug_combat_mk1: {
		id: 'aug_combat_mk1',
		name: 'Combat Mk. 1',
		type: 'augment',
		rarity: 'uncommon',
		image: '/assets/items/Augments/CombatMK1.png',
		categoryIcon: '/assets/ui/category_assets/augment.png',
		weight: 1,
		price: 640,
		maxStack: 1,
		description: 'Supports stronger shields, but with limited backpack capacity.',
		recycling: [
			{ itemId: 'res_plastic_parts', amount: 3, name: 'Plastic Parts' },
			{ itemId: 'res_rubber_parts', amount: 3, name: 'Rubber Parts' }
		]
	},
	aug_looting_mk1: {
		id: 'aug_looting_mk1',
		name: 'Looting Mk. 1',
		type: 'augment',
		rarity: 'uncommon',
		image: '/assets/items/Augments/LootingMK1.png',
		categoryIcon: '/assets/ui/category_assets/augment.png',
		weight: 1,
		price: 640,
		maxStack: 1,
		description: 'More backpack slots and weight capacity, but low defensive capability.',
		recycling: [
			{ itemId: 'res_plastic_parts', amount: 3, name: 'Plastic Parts' },
			{ itemId: 'res_rubber_parts', amount: 3, name: 'Rubber Parts' }
		]
	},
	aug_tactical_mk1: {
		id: 'aug_tactical_mk1',
		name: 'Tactical Mk. 1',
		type: 'augment',
		rarity: 'uncommon',
		image: '/assets/items/Augments/TacticalMK1.png',
		categoryIcon: '/assets/ui/category_assets/augment.png',
		weight: 1,
		price: 640,
		maxStack: 1,
		description: 'More Quick Use slots for more tactical choice.',
		recycling: [
			{ itemId: 'res_plastic_parts', amount: 3, name: 'Plastic Parts' },
			{ itemId: 'res_rubber_parts', amount: 3, name: 'Rubber Parts' }
		]
	},
	aug_combat_mk2: {
		id: 'aug_combat_mk2',
		name: 'Combat Mk. 2',
		type: 'augment',
		rarity: 'rare',
		image: '/assets/items/Augments/CombatMK2.png',
		categoryIcon: '/assets/ui/category_assets/augment.png',
		weight: 1,
		price: 2000,
		maxStack: 1,
		description: 'Restores 1 health every 5 seconds. Paused for 30s after taking damage.',
		recycling: [
			{ itemId: 'loot_electrical_components', amount: 1, name: 'Electrical Components' },
			{ itemId: 'loot_magnet', amount: 1, name: 'Magnet' }
		]
	},
	aug_looting_mk2: {
		id: 'aug_looting_mk2',
		name: 'Looting Mk. 2',
		type: 'augment',
		rarity: 'rare',
		image: '/assets/items/Augments/LootingMK2.png',
		categoryIcon: '/assets/ui/category_assets/augment.png',
		weight: 1,
		price: 2000,
		maxStack: 1,
		description: 'Adds trinket slots. Automatically throws off attached Ticks after 1s.',
		recycling: [
			{ itemId: 'loot_magnet', amount: 1, name: 'Magnet' },
			{ itemId: 'loot_electrical_components', amount: 1, name: 'Electrical Components' }
		]
	},
	aug_tactical_mk2: {
		id: 'aug_tactical_mk2',
		name: 'Tactical Mk. 2',
		type: 'augment',
		rarity: 'rare',
		image: '/assets/items/Augments/TacticalMK2.png',
		categoryIcon: '/assets/ui/category_assets/augment.png',
		weight: 1,
		price: 2000,
		maxStack: 1,
		description: 'More backpack space and extra utility slot. Deploys smoke on shield break.',
		recycling: [
			{ itemId: 'loot_electrical_components', amount: 1, name: 'Electrical Components' },
			{ itemId: 'loot_magnet', amount: 1, name: 'Magnet' }
		]
	},
	aug_combat_mk3_aggressive: {
		id: 'aug_combat_mk3_aggressive',
		name: 'Combat Mk. 3 (Aggressive)',
		type: 'augment',
		rarity: 'epic',
		image: '/assets/items/Augments/CombatMK3Aggressive.png',
		categoryIcon: '/assets/ui/category_assets/augment.png',
		weight: 1,
		price: 5000,
		maxStack: 1,
		description: 'Supports more shield types. Restores 2 health every 5 seconds.',
		recycling: [
			{ itemId: 'loot_adv_electrical', amount: 1, name: 'Advanced Electrical Components' },
			{ itemId: 'res_processor', amount: 1, name: 'Processor' },
			{ itemId: 'loot_electrical_components', amount: 2, name: 'Electrical Components' }
		]
	},
	aug_looting_mk3_cautious: {
		id: 'aug_looting_mk3_cautious',
		name: 'Looting Mk. 3 (Cautious)',
		type: 'augment',
		rarity: 'epic',
		image: '/assets/items/Augments/LootingMK3Cautious.png',
		categoryIcon: '/assets/ui/category_assets/augment.png',
		weight: 1,
		price: 5000,
		maxStack: 1,
		description: 'Upon shield break, automatically administers a weak Adrenaline Shot.',
		recycling: [
			{ itemId: 'loot_adv_electrical', amount: 1, name: 'Advanced Electrical Components' },
			{ itemId: 'res_processor', amount: 1, name: 'Processor' }
		]
	},
	aug_looting_mk3_survivor: {
		id: 'aug_looting_mk3_survivor',
		name: 'Looting Mk. 3 (Survivor)',
		type: 'augment',
		rarity: 'epic',
		image: '/assets/items/Augments/LootingMk3Survivor.png',
		categoryIcon: '/assets/ui/category_assets/augment.png',
		weight: 1,
		price: 5000,
		maxStack: 1,
		description: 'While downed, health regenerates up to 75% of max downed health.',
		recycling: [
			{ itemId: 'loot_adv_electrical', amount: 1, name: 'Advanced Electrical Components' },
			{ itemId: 'res_processor', amount: 1, name: 'Processor' }
		]
	},
	aug_tactical_mk3_healing: {
		id: 'aug_tactical_mk3_healing',
		name: 'Tactical Mk. 3 (Healing)',
		type: 'augment',
		rarity: 'epic',
		image: '/assets/items/Augments/TacticalMK3Healing.png',
		categoryIcon: '/assets/ui/category_assets/augment.png',
		weight: 1,
		price: 5000,
		maxStack: 1,
		description: 'When revived, releases a healing cloud that restores 20 health.',
		recycling: [
			{ itemId: 'loot_adv_electrical', amount: 1, name: 'Advanced Electrical Components' },
			{ itemId: 'res_processor', amount: 1, name: 'Processor' }
		]
	},

	// ──────────────────────────────────────
	// SHIELDS
	// ──────────────────────────────────────
	shield_light: {
		id: 'shield_light',
		name: 'Light Shield',
		type: 'shield',
		rarity: 'uncommon',
		image: '/assets/items/Shields/LightShield.png',
		categoryIcon: '/assets/ui/category_assets/shield.png',
		weight: 5,
		price: 640,
		maxStack: 1,
		description: 'Blocks a small portion of incoming damage without impacting mobility.',
		recycling: [
			{ itemId: 'res_plastic_parts', amount: 4, name: 'Plastic Parts' },
			{ itemId: 'loot_arc_alloy', amount: 1, name: 'ARC Alloy' }
		]
	},
	shield_medium: {
		id: 'shield_medium',
		name: 'Medium Shield',
		type: 'shield',
		rarity: 'rare',
		image: '/assets/items/Shields/MediumShield.png',
		categoryIcon: '/assets/ui/category_assets/shield.png',
		weight: 7,
		price: 2000,
		maxStack: 1,
		description: 'Blocks a medium portion of incoming damage at a moderate cost to mobility.',
		recycling: [{ itemId: 'res_arc_circuitry', amount: 1, name: 'ARC Circuitry' }]
	},
	shield_heavy: {
		id: 'shield_heavy',
		name: 'Heavy Shield',
		type: 'shield',
		rarity: 'epic',
		image: '/assets/items/Shields/HeavyShield.png',
		categoryIcon: '/assets/ui/category_assets/shield.png',
		weight: 9,
		price: 5500,
		maxStack: 1,
		description: 'Blocks a large portion of incoming damage, but significant cost to mobility.',
		recycling: [
			{ itemId: 'res_arc_circuitry', amount: 2, name: 'ARC Circuitry' },
			{ itemId: 'loot_voltage_converter', amount: 1, name: 'Voltage Converter' }
		]
	},

	// ──────────────────────────────────────
	// KEYS
	// ──────────────────────────────────────
	key_blue_gate_cellar: {
		id: 'key_blue_gate_cellar',
		name: 'Blue Gate Cellar Key',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/Keys/BlueGateCellarKey.png',
		categoryIcon: '/assets/ui/category_assets/key.png',
		weight: 0.1,
		price: 100,
		maxStack: 1,
		description: 'Unlocks certain cellar doors near the Blue Gate.',
	},
	key_blue_gate_confiscation: {
		id: 'key_blue_gate_confiscation',
		name: 'Blue Gate Confiscation Room Key',
		type: 'loot',
		rarity: 'epic',
		image: '/assets/items/Keys/BlueGateConfiscationKey.png',
		categoryIcon: '/assets/ui/category_assets/key.png',
		weight: 0.1,
		price: 100,
		maxStack: 1,
		description: 'Unlocks a door to the confiscated foods area within the Blue Gate tunnels.',
	},
	key_buried_city_hospital: {
		id: 'key_buried_city_hospital',
		name: 'Buried City Hospital Key',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/Keys/BuriedCityHospitalKey.png',
		categoryIcon: '/assets/ui/category_assets/key.png',
		weight: 0.1,
		price: 100,
		maxStack: 1,
		description: 'Opens a locked room in the Hospital in Buried City.',
	},
	key_raider_hatch: {
		id: 'key_raider_hatch',
		name: 'Raider Hatch Key',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/items/Keys/RaiderHatchKey.png',
		categoryIcon: '/assets/ui/category_assets/key.png',
		weight: 0.1,
		price: 100,
		maxStack: 1,
		description: 'Used to open Raider Hatches to get out of sticky situations Topside.',
	},
};

export const getDef = (defId: string): ItemDefinition => {
	const def = ITEM_DB[defId];
	if (!def) {
		console.warn(`[Inventory] Missing definition for ID: ${defId}`);
		return {
			id: defId,
			name: 'Unknown Item',
			type: 'loot',
			rarity: 'common',
			image: '/assets/ui/placeholder/placeholder_weapon.png',
			categoryIcon: '',
			price: 0,
			weight: 0
		};
	}
	return def;
};
