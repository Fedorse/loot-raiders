import { ITEM_DB } from '$lib/config/items';
import { MOCK_ITEMS } from '$lib/config/mock-data';
import type { Inventory } from './inventory.svelte';
import type { ItemRarity, ItemDefinition, ItemType, InstanceItem, ItemLocation } from '$lib/types';
import { randInt } from '$lib/utils';
import { SvelteSet } from 'svelte/reactivity';
import type { AudioManager } from './audio.svelte';
import { getDef } from '$lib/config/items';

type ItemPool = Record<ItemType, Record<ItemRarity, ItemDefinition[]>>;

type LoadingStatus = 'idle' | 'loading' | 'done';

export interface LootProfile {
	typeWeights: Record<ItemType, number>;
	typeCaps: Partial<Record<ItemType, number>>;
	rarityWeights: Record<ItemRarity, number>;
	attachmentChance: number;
	getStackRange: (def: ItemDefinition) => [number, number];
}

export interface RawLootItem {
	def: ItemDefinition;
	count: number;
	attachments: (ItemDefinition | null)[] | null;
}

export const DEFAULT_STACK_RANGES: Record<ItemRarity, [number, number]> = {
	common: [1, 5],
	uncommon: [1, 3],
	rare: [1, 2],
	epic: [1, 1],
	legendary: [1, 1]
};

export const STANDARD_CACHE_PROFILE: LootProfile = {
	typeWeights: { loot: 75, attachment: 5, weapon: 8, shield: 2, augment: 3 },
	typeCaps: { weapon: 2, augment: 1, shield: 1 },
	rarityWeights: { common: 40, uncommon: 30, rare: 20, epic: 8, legendary: 2 },
	attachmentChance: 0,
	getStackRange: (def) => DEFAULT_STACK_RANGES[def.rarity]
};

export const TRACK_PROFILE: LootProfile = {
	typeWeights: { loot: 70, attachment: 5, weapon: 15, shield: 8, augment: 5 },
	typeCaps: { weapon: 15, shield: 8, augment: 5 },
	rarityWeights: { common: 40, uncommon: 30, rare: 20, epic: 8, legendary: 2 },
	attachmentChance: 0.2,
	getStackRange: (def) => {
		if (def.categoryIcon.includes('material.png')) {
			const boost: Record<ItemRarity, [number, number]> = {
				common: [3, 20],
				uncommon: [2, 6],
				rare: [1, 4],
				epic: [1, 2],
				legendary: [1, 1]
			};
			return boost[def.rarity];
		}
		return DEFAULT_STACK_RANGES[def.rarity];
	}
};

// ---- Generation functions ----

function buildItemPool(): ItemPool {
	const pool = {} as ItemPool;
	for (const type of ['loot', 'weapon', 'augment', 'shield', 'attachment'] as ItemType[]) {
		pool[type] = { common: [], uncommon: [], rare: [], epic: [], legendary: [] };
	}
	for (const def of Object.values(ITEM_DB)) {
		pool[def.type][def.rarity].push(def);
	}
	return pool;
}

export const itemPool = buildItemPool();

export function weightedRoll<T extends string>(weights: Record<T, number>): T {
	const entries = Object.entries(weights) as [T, number][];
	const total = entries.reduce((sum, [, w]) => sum + w, 0);
	let roll = Math.random() * total;
	for (const [key, weight] of entries) {
		roll -= weight;
		if (roll <= 0) return key;
	}
	return entries[0][0];
}

export function pickRandom<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function rollItemType(profile: LootProfile, currentCounts: Record<string, number>): ItemType {
	const adjustedWeights = { ...profile.typeWeights };
	for (const [type, cap] of Object.entries(profile.typeCaps)) {
		if ((currentCounts[type] ?? 0) >= (cap as number)) {
			adjustedWeights[type as ItemType] = 0;
		}
	}
	return weightedRoll(adjustedWeights);
}

function rollItemRarity(profile: LootProfile, type: ItemType): ItemRarity {
	const adjustedRarity = { ...profile.rarityWeights };
	for (const rarity of Object.keys(adjustedRarity) as ItemRarity[]) {
		if (itemPool[type][rarity].length === 0) {
			adjustedRarity[rarity] = 0;
		}
	}
	return weightedRoll(adjustedRarity);
}

function rollAttachmentsForWeapon(
	profile: LootProfile,
	def: ItemDefinition
): (ItemDefinition | null)[] | null {
	if (profile.attachmentChance <= 0 || def.type !== 'weapon' || !def.attachmentSlots?.length) {
		return null;
	}

	return def.attachmentSlots.map((slot) => {
		if (Math.random() > profile.attachmentChance) return null;

		const candidates = Object.values(ITEM_DB).filter(
			(d) => d.type === 'attachment' && d.attachmentKind === slot.type
		);
		return candidates.length > 0 ? pickRandom(candidates) : null;
	});
}

export function generateLootItems(profile: LootProfile, count: number): RawLootItem[] {
	const typeCounts: Record<string, number> = {};
	const result: RawLootItem[] = [];

	for (let i = 0; i < count; i++) {
		const type = rollItemType(profile, typeCounts);
		typeCounts[type] = (typeCounts[type] ?? 0) + 1;

		const rarity = rollItemRarity(profile, type);

		const def = pickRandom(itemPool[type][rarity]);

		const [min, max] = profile.getStackRange(def);
		const itemCount = type === 'loot' ? randInt(min, Math.min(max, def.maxStack ?? 1)) : 1;

		const attachments = rollAttachmentsForWeapon(profile, def);

		result.push({ def, count: itemCount, attachments });
	}

	return result;
}

export class LootGenerator {
	private inventory: Inventory;
	private audio: AudioManager;
	phase = $state<LoadingStatus>('idle');
	private lootQueue = $state<string[]>([]);
	private scanIndex = $state(-1);
	shineQueue = new SvelteSet<string>();

	constructor(inventory: Inventory, audio: AudioManager) {
		this.inventory = inventory;
		this.audio = audio;
	}

	next(): void {
		this.inventory.clearStorage('lootBack');
		this.shineQueue.clear();

		const items: InstanceItem[] = MOCK_ITEMS.map((mock) =>
			this.inventory.createItem(mock.defId, mock.count)
		);

		this.inventory.fillStorage('lootBack', items);
		this.lootQueue = items.map((i) => i.uid);
		this.scanIndex = 0;
		this.phase = 'loading';
	}

	slotScanned(): void {
		const uid = this.lootQueue[this.scanIndex];
		if (uid) this.shineQueue.add(uid);
		const loc: ItemLocation = { type: 'slot', storageId: 'lootBack', index: this.scanIndex };
		const item = this.inventory.getItem(loc);
		if (item) {
			const def = getDef(item.defId);
			if (def.rarity === 'legendary' || def.rarity === 'epic') {
				this.audio.play('rare_loot');
			}
		}
		this.scanIndex++;
		if (this.scanIndex >= this.lootQueue.length) {
			this.phase = 'done';
		}
	}

	clearShine(uid: string): void {
		this.shineQueue.delete(uid);
	}

	scanning(uid: string): boolean {
		return this.phase === 'loading' && this.lootQueue[this.scanIndex] === uid;
	}

	hidden(uid: string): boolean {
		if (this.phase !== 'loading') return false;
		const idx = this.lootQueue.indexOf(uid);
		return idx >= 0 && idx > this.scanIndex;
	}
}

// next(): void {
// 	this.inventory.clearStorage('lootBack');
// 	const count = randInt(4, 16);
// 	const rawItems = generateLootItems(STANDARD_CACHE_PROFILE, count);
//
// 	const items: InstanceItem[] = rawItems.map((raw) => {
// 		const item = this.inventory.createItem(raw.def.id, raw.count);
// 		if (raw.attachments && item.attachments) {
// 			item.attachments = raw.attachments.map((attDef) =>
// 				attDef ? this.inventory.createItem(attDef.id, 1) : null
// 			);
// 		}
// 		return item;
// 	});
//
// 	this.inventory.fillStorage('lootBack', items);
// 	this.lootQueue = items.map((i) => i.uid);
// 	this.scanIndex = 0;
// 	this.phase = 'loading';
// }
