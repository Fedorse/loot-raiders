import { LOOTBOX_ORDER, getLootboxDef } from '$lib/config/lootboxes';
import { getDef, ITEM_DB } from '$lib/config/items';
import type { Inventory } from './inventory.svelte';
import type { LootboxPhase, InstanceItem, ItemRarity, ItemDefinition } from '$lib/types';

const itemsByRarity: Record<ItemRarity, ItemDefinition[]> = {
	common: [],
	uncommon: [],
	rare: [],
	epic: [],
	legendary: []
};

for (const def of Object.values(ITEM_DB)) {
	itemsByRarity[def.rarity].push(def);
}

export class Lootbox {
	private inventory!: Inventory;

	phase = $state<LootboxPhase>('idle');
	resultIndex = $state(0);
	selectedBox = $derived(getLootboxDef(LOOTBOX_ORDER[this.resultIndex]));

	constructor(inventory: Inventory) {
		this.inventory = inventory;
	}

	spin(): void {
		if (this.phase !== 'idle') return;

		const boxes = LOOTBOX_ORDER.map((rarity) => getLootboxDef(rarity));
		const totalWeight = boxes.reduce((sum, box) => sum + box.spinWeight, 0);

		let roll = Math.random() * totalWeight;

		for (let i = 0; i < boxes.length; i++) {
			roll -= boxes[i].spinWeight;
			if (roll <= 0) {
				this.resultIndex = i;
				break;
			}
		}
		this.phase = 'spinning';
	}

	onSpinComplete(): void {
		this.phase = 'result';
	}

	open(): void {
		if (this.phase !== 'result') return;
		const box = this.selectedBox;
		this.inventory.clearStorage('lootBack');
		const items = this.getRandomLoot(box.rarityWeights, box.slots);
		this.inventory.fillStorage('lootBack', items);
		this.phase = 'opened';
	}

	close(): void {
		if (this.phase !== 'opened') return;
		this.inventory.clearStorage('lootBack');
		this.phase = 'idle';
	}

	private getRandomLoot(
		rarityWeights: Record<ItemRarity, number>,
		count: number
	): InstanceItem[] {
		const items: InstanceItem[] = [];

		for (let i = 0; i < count; i++) {
			const rarity = this.rollRarity(rarityWeights);
			const pool = itemsByRarity[rarity];
			if (!pool.length) continue;

			const def = pool[Math.floor(Math.random() * pool.length)];
			const itemCount = this.getCountForType(def.type);

			items.push(this.inventory.createItem(def.id, itemCount));
		}
		return items;
	}

	private rollRarity(weights: Record<ItemRarity, number>): ItemRarity {
		const entries = Object.entries(weights) as [ItemRarity, number][];
		const total = entries.reduce((sum, [, w]) => sum + w, 0);
		let roll = Math.random() * total;

		for (const [rarity, weight] of entries) {
			roll -= weight;
			if (roll <= 0) return rarity;
		}
		return entries[0][0];
	}

	private getCountForType(type: string): number {
		switch (type) {
			case 'loot':
				return 1 + Math.floor(Math.random() * 3);
			default:
				return 1;
		}
	}
}
