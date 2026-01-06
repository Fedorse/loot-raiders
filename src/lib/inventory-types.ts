// src/lib/game/inventory-types.ts
export type ItemType =
	| 'empty'
	| 'loot'
	| 'weapon'
	| 'augment'
	| 'shield'
	| 'quickUse'
	| 'placeholder';
export type RarityType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface BaseItem {
	id: string;
	type: ItemType;
	image?: string;
	count?: number;
	rare?: RarityType;
}

export type InventorySlot = BaseItem | null;

export type AttachmentKind = 'muzzle' | 'grip' | 'mag' | 'stock' | 'any';

export type WeaponAttachmentSlotDef = {
	key: string; // стабильный ключ слота (не индекс)
	label: string; // "MZ" и т.п.
	kind: AttachmentKind;
};

export type WeaponItem = BaseItem & {
	type: 'weapon';
	ammoCurrent: number;
	ammoMax: number;
	tier: number;

	attachmentLayout: WeaponAttachmentSlotDef[];
	attachments: Record<string, InventorySlot>;
};

export const DEFAULT_WEAPON_SLOTS: WeaponAttachmentSlotDef[] = [
	{ key: 'mz', label: 'MZ', kind: 'muzzle' },
	{ key: 'gr', label: 'GR', kind: 'grip' },
	{ key: 'mg', label: 'MG', kind: 'mag' },
	{ key: 'st', label: 'ST', kind: 'stock' }
];

export function isWeapon(x: InventorySlot): x is WeaponItem {
	return !!x && x.type === 'weapon';
}

export function makeWeapon(params: {
	id: string;
	image?: string;
	count?: number;
	rare?: RarityType;

	ammoCurrent?: number;
	ammoMax?: number;
	tier?: number;

	attachmentLayout?: WeaponAttachmentSlotDef[];
	attachments?: Record<string, InventorySlot>;
}): WeaponItem {
	const layout = params.attachmentLayout ?? DEFAULT_WEAPON_SLOTS;

	const attachments: Record<string, InventorySlot> = {};
	for (const s of layout) {
		attachments[s.key] = params.attachments?.[s.key] ?? null;
	}

	return {
		id: params.id,
		type: 'weapon',
		image: params.image,
		count: params.count ?? 1,
		rare: params.rare ?? 'common',
		ammoCurrent: params.ammoCurrent ?? 0,
		ammoMax: params.ammoMax ?? 30,
		tier: params.tier ?? 1,
		attachmentLayout: layout,
		attachments
	};
}
