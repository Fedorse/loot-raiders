import { LOOTBOX_ORDER, getLootboxDef } from '$lib/config/lootboxes';
import type { Inventory } from './inventory.svelte';
import type { LootboxPhase, LootItem, InstanceItem } from '$lib/types';

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
		const items = this.getRandomLoot(box.lootTable, box.slots);
		this.inventory.fillStorage('lootBack', items);
		this.phase = 'opened';
	}

	close(): void {
		if (this.phase !== 'opened') return;
		this.inventory.clearStorage('lootBack');
		this.phase = 'idle';
	}

	private getRandomLoot(table: LootItem[], count: number): InstanceItem[] {
		const totalWeight = table.reduce((sum, item) => sum + item.weight, 0);
		const items: InstanceItem[] = [];

		for (let i = 0; i < count; i++) {
			let roll = Math.random() * totalWeight;

			for (const entry of table) {
				roll -= entry.weight;
				if (roll <= 0) {
					const min = entry.countMin ?? 1;
					const max = entry.countMax ?? 1;
					const itemCount = min + Math.floor(Math.random() * (max - min + 1));
					items.push(this.inventory.createItem(entry.defId, itemCount));
					break;
				}
			}
		}
		return items;
	}
}
