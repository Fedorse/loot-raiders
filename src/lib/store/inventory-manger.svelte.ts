import { isEqual } from 'es-toolkit';
import { type ItemInstance, type SlotRef } from '$lib/config/items';
import { getStorageConfig } from '$lib/config/storages';
import { SvelteSet } from 'svelte/reactivity';
import { isAttachment } from '$lib/utils';

export interface StoredItem {
	storage: SlotRef;
	item: ItemInstance;
}

export class InventoryManager {
	items = $state<StoredItem[]>([]);
	selectedIds = new SvelteSet<string>();

	attachments = $derived(this.items.filter((i) => 'attachIndex' in i.storage));
	nonAttachmentItems = $derived(this.items.filter((i) => !('attachIndex' in i.storage)));
	backpack = $derived(this.items.filter((i) => i.storage.storageId === 'backpack'));
	lootBack = $derived(this.items.filter((i) => i.storage.storageId === 'lootBack'));
	weapon = $derived(this.items.filter((i) => i.storage.storageId === 'weapon'));

	constructor() {
		this.setup();
	}

	getItem(slotRef: SlotRef): StoredItem | null {
		return this.items.find((i) => isEqual(i.storage, slotRef)) ?? null;
	}

	insertItem(slotRef: SlotRef, item: ItemInstance): void {
		this.items.push({ storage: slotRef, item });
	}

	updateItem(slotRef: SlotRef, newItem: ItemInstance): void {
		const idx = this.items.findIndex((i) => isEqual(i.storage, slotRef));
		this.items[idx].item = newItem;
	}

	removeItem(slotRef: SlotRef): void {
		const idx = this.items.findIndex((i) => isEqual(i.storage, slotRef));
		if (idx !== -1) {
			const uid = this.items[idx].item.uid;
			this.selectedIds.delete(uid);
			this.items.splice(idx, 1);
		}
	}

	selectedItem(uid: string): boolean {
		return this.selectedIds.has(uid);
	}

	createItem(defId: string, count = 1): ItemInstance {
		return {
			uid: crypto.randomUUID(),
			defId,
			count
		};
	}

	getQuickMoveTargetStorage(currentStorageId: string): string {
		if (currentStorageId === 'lootBack') return 'backpack';
		if (currentStorageId === 'backpack') return 'lootBack';
		return 'backpack';
	}

	getFirstEmptySlotRef(storageId: string): SlotRef | null {
		const config = getStorageConfig(storageId);
		if (!config) return null;
		for (let i = 0; i < config.size; i++) {
			const ref: SlotRef = { storageId, index: i };
			if (!this.getItem(ref)) return ref;
		}
		return null;
	}

	setup(): void {
		const initial: [SlotRef, ItemInstance][] = [
			[{ storageId: 'backpack', index: 0 }, this.createItem('res_arc_circuitry', 10)],
			// [{ storageId: 'backpack', index: 10 }, this.createItem('res_arc_circuitry', 5)],
			// [{ storageId: 'backpack', index: 1 }, this.createItem('eqp_tactical_mk1')],
			[{ storageId: 'backpack', index: 2 }, this.createItem('wpn_kettle')],
			[{ storageId: 'backpack', index: 3 }, this.createItem('wpn_bobcat')],
			[{ storageId: 'lootBack', index: 0 }, this.createItem('att_compensator_1')],
			[{ storageId: 'lootBack', index: 1 }, this.createItem('att_stable_stock_1')]
			// [{ storageId: 'augment', index: 0 }, this.createItem('eqp_tactical_mk1')]
		];
		for (const [slotRef, item] of initial) {
			this.items.push({ storage: slotRef, item });
		}
	}
}
