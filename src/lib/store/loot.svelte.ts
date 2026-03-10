import { ITEM_DB, getDef } from '$lib/config/items';
import type { Inventory } from './inventory.svelte';
import type { ItemRarity, ItemDefinition } from '$lib/types';
import { randInt } from '$lib/utils';
import { TEST_ITEM_IDS } from './game-loop.svelte';

// ---- Random generation (commented out for now) ----

// const RARITY_WEIGHTS: Record<ItemRarity, number> = {
// 	common: 40,
// 	uncommon: 30,
// 	rare: 20,
// 	epic: 8,
// 	legendary: 2
// };
//
// const itemsByRarity: Record<ItemRarity, ItemDefinition[]> = {
// 	common: [],
// 	uncommon: [],
// 	rare: [],
// 	epic: [],
// 	legendary: []
// };
//
// for (const def of Object.values(ITEM_DB)) {
// 	itemsByRarity[def.rarity].push(def);
// }

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
		const count = randInt(6, 16);
		const items = Array.from({ length: count }, () => this.rollItem());
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

	private rollItem() {
		// Hardcoded: pick random item from TEST_ITEM_IDS pool
		const defId = TEST_ITEM_IDS[Math.floor(Math.random() * TEST_ITEM_IDS.length)];
		return this.inventory.createItem(defId, 1);
	}

	// ---- Random generation (commented out for now) ----

	// private rollItem() {
	// 	const rarity = weightedRoll(RARITY_WEIGHTS);
	// 	const pool = itemsByRarity[rarity];
	// 	const def = pool[Math.floor(Math.random() * pool.length)];
	// 	const count = def.type === 'loot' ? randInt(1, 3) : 1;
	// 	return this.inventory.createItem(def.id, count);
	// }
}

// function weightedRoll(weights: Record<ItemRarity, number>): ItemRarity {
// 	const entries = Object.entries(weights) as [ItemRarity, number][];
// 	const total = entries.reduce((sum, [, w]) => sum + w, 0);
// 	let roll = Math.random() * total;
// 	for (const [rarity, weight] of entries) {
// 		roll -= weight;
// 		if (roll <= 0) return rarity;
// 	}
// 	return entries[0][0];
// }
