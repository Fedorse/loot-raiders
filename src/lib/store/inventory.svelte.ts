import { isEqual } from 'es-toolkit';
import { getStorageConfig } from '$lib/config/storages';
import { SvelteSet } from 'svelte/reactivity';
import { canDrop } from './inventory-validation';
import { getDef } from '$lib/config/items';
import { isAttachment, isWeapon } from '$lib/utils';
import type { StoredItem, InstanceItem, SlotRef, StorageId, DropTarget } from '$lib/types';

export class Inventory {
	items = $state<StoredItem[]>([]);
	selectedIds = new SvelteSet<string>();

	// attachments = $derived(this.items.filter((i) => 'attachIndex' in i.storage));
	// nonAttachmentItems = $derived(this.items.filter((i) => !('attachIndex' in i.storage)));
	backpack = $derived(this.items.filter((i) => i.storage.storageId === 'backpack'));
	lootBack = $derived(this.items.filter((i) => i.storage.storageId === 'lootBack'));
	weapon = $derived(this.items.filter((i) => i.storage.storageId === 'weapon'));

	constructor() {
		this.setup();
	}

	handleDrop(dragItem: StoredItem, targetDrop: DropTarget): void {
		if (isEqual(dragItem.storage, targetDrop.storage)) return;

		if (this.#tryAttach(dragItem, targetDrop)) return;

		this.#moveOrSwap(dragItem, targetDrop);
	}

	// crud operations

	getItem(slotRef: SlotRef): StoredItem | null {
		return this.items.find((i) => isEqual(i.storage, slotRef)) ?? null;
	}

	insertItem(slotRef: SlotRef, item: InstanceItem): void {
		this.items.push({ storage: slotRef, item });
	}

	updateItem(slotRef: SlotRef, newItem: InstanceItem): void {
		const idx = this.items.findIndex((i) => isEqual(i.storage, slotRef));
		if (idx === -1) return;
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
	// select item operations
	isSelected(uid: string): boolean {
		return this.selectedIds.has(uid);
	}
	selectSingleItem(uid: string): void {
		this.selectedIds.clear();
		this.selectedIds.add(uid);
	}
	toggleSelectionItem(uid: string): void {
		if (this.selectedIds.has(uid)) {
			this.selectedIds.delete(uid);
		} else {
			this.selectedIds.add(uid);
		}
	}
	clearSelectionItem(): void {
		this.selectedIds.clear();
	}
	// move operations
	#moveOrSwap(dragItem: StoredItem, targetDrop: DropTarget): void {
		if (targetDrop.item) {
			this.#swapItems(dragItem, targetDrop);
		} else {
			this.#moveToEmptySlot(dragItem, targetDrop);
		}
	}

	#moveToEmptySlot(dragItem: StoredItem, targetDrop: DropTarget): void {
		this.removeItem(dragItem.storage);
		this.insertItem(targetDrop.storage, dragItem.item);
	}

	#swapItems(dragItem: StoredItem, dropItem: DropTarget): void {
		if (!dropItem.item) return;
		const itemToTarget = dragItem.item;
		const itemToBack = dropItem.item;

		const canReturnBack = canDrop(
			{ storage: dragItem.storage, item: itemToBack },
			{ storage: dropItem.storage, item: itemToTarget }
		);
		if (!canReturnBack) {
			console.warn('Cannot return back item to original slot');
			return;
		}

		this.removeItem(dragItem.storage);
		this.removeItem(dropItem.storage);

		this.insertItem(dropItem.storage, itemToTarget);
		this.insertItem(dragItem.storage, itemToBack);
	}

	#tryAttach(dragItem: StoredItem, dropTarget: DropTarget): boolean {
		const dragDef = getDef(dragItem.item.defId);
		if (dragDef.type !== 'attachment') return false;

		let targetSlotRef: SlotRef | null = null;
		if (isAttachment(dropTarget.storage)) {
			targetSlotRef = dropTarget.storage;
		} else if (isWeapon(dropTarget.item)) {
			const targetDef = getDef(dropTarget.item!.defId);
			const slotIdx = targetDef.attachmentSlots?.findIndex(
				(s) => s.type === dragDef.attachmentKind
			);
			if (slotIdx !== undefined && slotIdx !== -1) {
				targetSlotRef = { ...dropTarget.storage, attachIndex: slotIdx };
			}
		}
		if (!targetSlotRef) return false;

		const attachmentDropTarget: DropTarget = {
			storage: targetSlotRef,

			item: this.getItem(targetSlotRef)?.item ?? null
		};

		this.#moveOrSwap(dragItem, attachmentDropTarget);

		return true;
	}

	quickMove(storedItem: StoredItem): boolean {
		const targetId = this.getQuickMoveTargetStorage(storedItem.storage.storageId);
		const empty = this.getFirstEmptySlotRef(targetId);
		if (!empty) return false;
		const dropTarget: DropTarget = { storage: empty, item: null };
		if (!canDrop(storedItem, dropTarget)) return false;
		this.handleDrop(storedItem, dropTarget);
		return true;
	}

	createItem(defId: string, count = 1): InstanceItem {
		return {
			uid: crypto.randomUUID(),
			defId,
			count
		};
	}

	getQuickMoveTargetStorage(currentStorageId: StorageId): StorageId {
		if (currentStorageId === 'lootBack') return 'backpack';
		if (currentStorageId === 'backpack') return 'lootBack';
		return 'backpack';
	}

	getFirstEmptySlotRef(storageId: StorageId): SlotRef | null {
		const config = getStorageConfig(storageId);
		if (!config) return null;
		for (let i = 0; i < config.size; i++) {
			const ref: SlotRef = { storageId, index: i };
			if (!this.getItem(ref)) return ref;
		}
		return null;
	}

	setup(): void {
		const initial: [SlotRef, InstanceItem][] = [
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
