//---- Enums ----
export type ItemType = 'loot' | 'weapon' | 'augment' | 'shield' | 'attachment';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type AttachmentType = 'optic' | 'muzzle' | 'magazine' | 'grip' | 'stock' | 'underbarrel';
export type StorageId = 'backpack' | 'lootBack' | 'weapon' | 'augment' | 'shield';

// ---- Universal location ----
export type ItemLocation =
	| { type: 'container'; storageId: StorageId; index: number }
	| { type: 'attachment'; parentLocation: ItemLocation; attachIndex: number };

// ---- Slot states ----
export interface OccupiedSlot {
	location: ItemLocation;
	item: InstanceItem;
}

export interface SlotState {
	location: ItemLocation;
	item: InstanceItem | null;
}

// ---- Drag state ----
export interface DragState {
	item: InstanceItem;
	sourceLocation: ItemLocation;
	isSplit: boolean;
}

// ---- Items ----
export interface InstanceItem {
	uid: string;
	defId: string;
	count: number;
	attachments?: (InstanceItem | null)[];
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

	gradeIcon?: string;
	attachmentSlots?: AttachmentSlotDef[];

	recycling?: RecyclingResult[];
}

// ----Storage config----

export interface StorageConfig {
	name: StorageId;
	size: number;
	allowedTypes: ItemType[];
	placeholder?: string;
	quickMoveTarget?: StorageId;
}
// ---- Rarity visual style ----
export interface RarityStyle {
	border: string;
	bg: string;
	glow: string;
	height: string;
}
