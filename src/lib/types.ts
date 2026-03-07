//---- Enums ----
export type ItemType = 'loot' | 'weapon' | 'augment' | 'shield' | 'attachment';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type AttachmentType = 'optic' | 'muzzle' | 'magazine' | 'grip' | 'stock' | 'underbarrel';
export type StorageId = 'backpack' | 'lootBack' | 'weapon' | 'augment' | 'shield';

// ---- Universal location ----
export type ItemLocation =
	| { type: 'slot'; storageId: StorageId; index: number }
	| { type: 'attachment'; parentLocation: ItemLocation; attachIndex: number }
	| { type: 'trash' };

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

	// Weapon-specific
	description?: string;
	weaponClass?: string;
	ammoType?: string;
	magazineSize?: number;
	firingMode?: string;
	armorPenetration?: string;

	// Attachment-specific
	statBonuses?: string[];
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

// ---- Tetris ----
export interface TetrisCell {
	uid: string;
	groupId: string;
	defId: string;
	count: number;
}

export interface TetrisPoolEntry {
	defId: string;
	count: number;
	weight: number;
	shape?: [number, number][];
}

export interface TetrisGroup {
	groupId: string;
	defId: string;
	count: number;
	row: number;
	col: number;
	spanRows: number;
	spanCols: number;
}

export interface TetrisConfig {
	cols: number;
	rows: number;
	tickMs: number;
	gravityMs: number;
	pool: TetrisPoolEntry[];
}

export type TetrisPhase = 'idle' | 'playing' | 'gameover';
