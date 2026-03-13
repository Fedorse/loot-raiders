import { ITEM_DB } from '$lib/config/items';
import type { Inventory } from './inventory.svelte';
import type { ItemRarity, ItemDefinition, ItemType } from '$lib/types';
import { randInt } from '$lib/utils';

export const TYPE_WEIGHTS: Partial<Record<ItemType, number>> = {
	loot: 75,
	attachment: 5,
	weapon: 8,
	shield: 2
};

export const TYPE_CAPS: Partial<Record<ItemType, number>> = {
	weapon: 2,
	augment: 1,
	shield: 1
};

export const RARITY_WEIGHTS: Record<ItemRarity, number> = {
	common: 40,
	uncommon: 30,
	rare: 20,
	epic: 8,
	legendary: 2
};

export const STACK_RANGES: Record<ItemRarity, [number, number]> = {
	common: [1, 5],
	uncommon: [1, 3],
	rare: [1, 2],
	epic: [1, 1],
	legendary: [1, 1]
};

type ItemPool = Record<ItemType, Record<ItemRarity, ItemDefinition[]>>;

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

// ---- Roll one item (3 layers) ----

export function rollType(
	typeCounts: Record<string, number>,
	caps: Partial<Record<ItemType, number>> = TYPE_CAPS
): ItemType {
	// Respect caps: zero out weight for types that hit their cap
	const adjusted = { ...TYPE_WEIGHTS } as Record<ItemType, number>;
	for (const [type, cap] of Object.entries(caps)) {
		if ((typeCounts[type] ?? 0) >= (cap as number)) {
			adjusted[type as ItemType] = 0;
		}
	}
	return weightedRoll(adjusted);
}

export function rollRarity(type: ItemType): ItemRarity {
	// If pool is empty for a rarity, zero out its weight
	const adjusted = { ...RARITY_WEIGHTS };
	for (const rarity of Object.keys(adjusted) as ItemRarity[]) {
		if (itemPool[type][rarity].length === 0) {
			adjusted[rarity] = 0;
		}
	}
	return weightedRoll(adjusted);
}

export function rollCount(type: ItemType, rarity: ItemRarity, def: ItemDefinition): number {
	if (type !== 'loot') return 1;
	const [min, max] = STACK_RANGES[rarity];
	const maxStack = def.maxStack ?? 1;
	return randInt(min, Math.min(max, maxStack));
}

type LoadingStatus = 'idle' | 'loading' | 'done';

export class LootGenerator {
	private inventory: Inventory;

	phase = $state<LoadingStatus>('idle');
	loadingIndex = $state(-1);
	totalItems = $state(0);
	constructor(inventory: Inventory) {
		this.inventory = inventory;
	}

	next(): void {
		this.inventory.clearStorage('lootBack');
		const count = randInt(4, 16);
		const items = this.generateLoot(count);
		this.inventory.fillStorage('lootBack', items);
		this.totalItems = count;
		this.loadingIndex = 0;
		this.phase = 'loading';
	}
	slotScanned(): void {
		this.loadingIndex++;
		if (this.loadingIndex >= this.totalItems) {
			this.phase = 'done';
		}
	}

	scanning(index: number): boolean {
		return this.phase === 'loading' && index === this.loadingIndex;
	}

	hidden(index: number): boolean {
		return this.phase === 'loading' && index > this.loadingIndex;
	}

	private generateLoot(count: number) {
		const typeCounts: Record<string, number> = {};
		return Array.from({ length: count }, () => {
			// Layer 1: type
			const type = rollType(typeCounts);
			typeCounts[type] = (typeCounts[type] ?? 0) + 1;

			// Layer 2: rarity
			const rarity = rollRarity(type);

			// Pick random item from pool
			const def = pickRandom(itemPool[type][rarity]);

			// Layer 3: count
			const itemCount = rollCount(type, rarity, def);

			return this.inventory.createItem(def.id, itemCount);
		});
	}
}
