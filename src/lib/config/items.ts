export type ItemType = 'loot' | 'weapon' | 'augment' | 'shield' | 'attachment';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type AttachmentType = 'optic' | 'muzzle' | 'magazine' | 'grip' | 'stock' | 'underbarrel';

export type ItemCategory = ItemType;

export interface ItemInstance {
	uid: string;
	defId: string;
	count: number;
}

export interface StorageSlot {
	storageId: string;
	index: number;
}

export interface AttachmentSlot {
	storageId: string;
	index: number;
	attachIndex: number;
}

export type SlotRef = StorageSlot | AttachmentSlot;

export type SlotReference = SlotRef;

export interface DropTarget {
	storage: SlotRef;
	item: ItemInstance | null;
}

export interface RecyclingResult {
	itemId: string;
	amount: number;
	name: string;
}

export interface ItemDefinition {
	id: string;
	name: string;
	type: ItemType;
	rarity: ItemRarity;
	attachmentKind?: AttachmentType; // Конкретный тип attachment (muzzle, optic и т.д.)

	image: string;
	categoryIcon: string;

	weight: number;
	price: number;
	maxStack?: number;

	attachmentSlots?: {
		type: AttachmentType;
		placeholder: string;
	}[];

	recycling?: RecyclingResult[];
}

export const ITEM_DB: Record<string, ItemDefinition> = {
	wpn_kettle: {
		id: 'wpn_kettle',
		name: 'Kettle',
		type: 'weapon',
		rarity: 'common',
		weight: 5,
		price: 100,
		image: '/assets/weapons/kettle.png',
		categoryIcon: '/assets/cattegory/test.png',
		recycling: [
			{ itemId: 'res_arc_core', amount: 1, name: 'ARC Core' },
			{ itemId: 'res_metal_parts', amount: 5, name: 'Metal Parts' }
		],
		attachmentSlots: [
			{ type: 'muzzle', placeholder: 'MZ' },
			{ type: 'underbarrel', placeholder: 'UB' },
			{ type: 'magazine', placeholder: 'MAG' }
		]
	},
	wpn_bobcat: {
		id: 'wpn_bobcat',
		name: 'Bobcat',
		type: 'weapon',
		rarity: 'epic',
		weight: 10,
		price: 200,
		image: '/assets/weapons/bobcat.png',
		categoryIcon: '/assets/cattegory/test.png',
		recycling: [
			{ itemId: 'res_ind_charger', amount: 4, name: 'Industrial Charger' },
			{ itemId: 'res_toaster', amount: 1, name: 'Toaster' }
		],
		attachmentSlots: [
			{ type: 'stock', placeholder: 'OPT' },
			{ type: 'muzzle', placeholder: 'MAG' }
		]
	},

	res_arc_circuitry: {
		id: 'res_arc_circuitry',
		name: 'ARC Circuitry',
		type: 'loot',
		rarity: 'common',
		image: '/assets/loot/arcCircuitry.png',
		categoryIcon: '/assets/cattegory/test.png',
		price: 300,
		weight: 1,
		maxStack: 12,
		recycling: [{ itemId: 'res_metal_parts', amount: 1, name: 'Metal Parts' }]
	},
	res_toaster: {
		id: 'res_toaster',
		name: 'Toaster',
		type: 'loot',
		rarity: 'rare',
		image: '/assets/loot/toaster.png',
		categoryIcon: '/assets/cattegory/test.png',
		price: 50,
		weight: 2,
		maxStack: 3,
		recycling: [{ itemId: 'res_metal_parts', amount: 2, name: 'Metal Parts' }]
	},
	res_bastion_cell: {
		id: 'res_bastion_cell',
		name: 'Bastion Cell',
		type: 'loot',
		rarity: 'epic',
		image: '/assets/loot/bastionCell.png',
		categoryIcon: '/assets/cattegory/test.png',
		price: 500,
		weight: 0.5,
		maxStack: 15
	},
	loot_cat_bed: {
		id: 'loot_cat_bed',
		name: 'Cat Bed',
		type: 'loot',
		rarity: 'uncommon',
		image: '/assets/loot/catBed.png',
		categoryIcon: '/assets/cattegory/test.png',
		price: 150,
		weight: 1,
		maxStack: 5
	},

	eqp_tactical_mk1: {
		id: 'eqp_tactical_mk1',
		name: 'Tactical Mk1',
		type: 'augment',
		rarity: 'uncommon',
		weight: 2,
		price: 300,
		image: '/assets/equip/Tactical_Mk_1.png',
		categoryIcon: '/assets/cattegory/test.png'
	},
	eqp_light_shield: {
		id: 'eqp_light_shield',
		name: 'Light Shield',
		type: 'shield',
		rarity: 'uncommon',
		image: '/assets/equip/shield-1.png',
		categoryIcon: '/assets/cattegory/test.png',
		weight: 5,
		price: 400,
		recycling: [{ itemId: 'res_metal_parts', amount: 5, name: 'Metal Parts' }]
	},

	att_compensator_1: {
		id: 'att_compensator_1',
		name: 'Compensator I',
		type: 'attachment',
		attachmentKind: 'muzzle',
		rarity: 'uncommon',
		image: '/assets/weapons/Compensator_I.png',
		categoryIcon: '/assets/cattegory/test.png',
		weight: 0.5,
		price: 150,
		recycling: [{ itemId: 'res_metal_parts', amount: 2, name: 'Metal Parts' }]
	},
	att_stable_stock_1: {
		id: 'att_stable_stock_1',
		name: 'Stable Stock I',
		type: 'attachment',
		attachmentKind: 'stock',
		rarity: 'common',
		image: '/assets/weapons/Stable_Stock_I.png',
		categoryIcon: '/assets/cattegory/test.png',
		weight: 1,
		price: 150,
		recycling: [{ itemId: 'res_metal_parts', amount: 3, name: 'Metal Parts' }]
	}
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
			image: '/assets/test.png',
			categoryIcon: '',
			price: 0,
			weight: 0
		};
	}
	return def;
};
