//---- Enums ----
export type ItemType = 'loot' | 'weapon' | 'augment' | 'shield' | 'attachment';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type AttachmentType = 'optic' | 'muzzle' | 'magazine' | 'grip' | 'stock' | 'underbarrel';
export type StorageId = 'backpack' | 'lootBack' | 'weapon' | 'augment' | 'shield';

// ---- Slot position ----
export interface SlotRef {
	storageId: StorageId;
	index: number;
}

// ---- Attachment drag reference ----
export interface AttachmentRef {
	weaponSlotRef: SlotRef;
	attachIndex: number;
}

// ---- Items ----
export interface InstanceItem {
	uid: string;
	defId: string;
	count: number;
	attachments?: (InstanceItem | null)[];
}
export interface StoredItem {
	storage: SlotRef;
	item: InstanceItem;
}

export interface DropTarget {
	storage: SlotRef;
	item: InstanceItem | null;
}
//---- Item definition----
export interface AttachmentSlotDef {
	type: AttachmentType;
	placeholder: string;
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
	attachmentKind?: AttachmentType;

	image: string;
	categoryIcon: string;

	weight: number;
	price: number;
	maxStack?: number;

	attachmentSlots?: AttachmentSlotDef[];

	recycling?: RecyclingResult[];
}

// ----Storage config----

export interface StorageConfig {
	name: StorageId;
	size: number;
	allowedTypes: ItemType[];
	placeholder?: string;
}
// ---- Rarity visual style ----
export interface RarityStyle {
	border: string;
	bg: string;
	glow: string;
	height: string;
}
