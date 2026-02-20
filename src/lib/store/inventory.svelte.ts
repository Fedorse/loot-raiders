import { isEqual } from 'es-toolkit';
import { getStorageConfig } from '$lib/config/storages';
import { SvelteSet } from 'svelte/reactivity';
import { canDrop } from './inventory-validation';
import { getDef } from '$lib/config/items';
import { isWeapon } from '$lib/utils';
import type { StoredItem, InstanceItem, SlotRef, StorageId, DropTarget } from '$lib/types';

export class Inventory {
	items = $state<StoredItem[]>([]);
	selectedIds = new SvelteSet<string>();

	backpack = $derived(this.items.filter((i) => i.storage.storageId === 'backpack'));
	lootBack = $derived(this.items.filter((i) => i.storage.storageId === 'lootBack'));
	weapon = $derived(this.items.filter((i) => i.storage.storageId === 'weapon'));

	constructor() {
		this.setup();
	}

	// ---- Drop handling ----

	handleDrop(dragItem: StoredItem, targetDrop: DropTarget): void {
		if (isEqual(dragItem.storage, targetDrop.storage)) return;

		if (this.#tryAttach(dragItem, targetDrop)) return;

		this.#moveOrSwap(dragItem, targetDrop);
	}

	handleAttachmentDrop(
		weaponSlotRef: SlotRef,
		attachIndex: number,
		targetDrop: DropTarget
	): void {
		const attachment = this.detachFromWeapon(weaponSlotRef, attachIndex);
		if (!attachment) return;

		if (targetDrop.item) {
			this.attachToWeapon(weaponSlotRef, attachIndex, attachment);
		} else {
			this.insertItem(targetDrop.storage, attachment);
		}
	}

	// ---- CRUD ----

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

	// ---- Selection ----

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

	// ---- Attachment operations ----

	getAttachment(weaponSlotRef: SlotRef, attachIndex: number): InstanceItem | null {
		const stored = this.getItem(weaponSlotRef);
		if (!stored?.item.attachments) return null;
		return stored.item.attachments[attachIndex] ?? null;
	}

	attachToWeapon(weaponSlotRef: SlotRef, attachIndex: number, attachment: InstanceItem): void {
		const stored = this.getItem(weaponSlotRef);
		if (!stored?.item.attachments) return;
		stored.item.attachments[attachIndex] = attachment;
	}

	detachFromWeapon(weaponSlotRef: SlotRef, attachIndex: number): InstanceItem | null {
		const stored = this.getItem(weaponSlotRef);
		if (!stored?.item.attachments) return null;
		const attachment = stored.item.attachments[attachIndex];
		stored.item.attachments[attachIndex] = null;
		return attachment;
	}

	// ---- Quick move ----

	quickMove(storedItem: StoredItem): boolean {
		const targetId = this.getQuickMoveTargetStorage(storedItem.storage.storageId);
		const empty = this.getFirstEmptySlotRef(targetId);
		if (!empty) return false;
		const dropTarget: DropTarget = { storage: empty, item: null };
		if (!canDrop(storedItem, dropTarget)) return false;
		this.handleDrop(storedItem, dropTarget);
		return true;
	}

	// ---- Helpers ----

	createItem(defId: string, count = 1): InstanceItem {
		const def = getDef(defId);
		const item: InstanceItem = {
			uid: crypto.randomUUID(),
			defId,
			count
		};
		if (def.attachmentSlots) {
			item.attachments = def.attachmentSlots.map(() => null);
		}
		return item;
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

	// ---- Private ----

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
		if (!isWeapon(dropTarget.item)) return false;

		const targetDef = getDef(dropTarget.item!.defId);
		const slotIdx = targetDef.attachmentSlots?.findIndex(
			(s) => s.type === dragDef.attachmentKind
		);
		if (slotIdx === undefined || slotIdx === -1) return false;

		const existing = dropTarget.item!.attachments?.[slotIdx] ?? null;
		if (existing) {
			this.removeItem(dragItem.storage);
			this.insertItem(dragItem.storage, existing);
			this.attachToWeapon(dropTarget.storage, slotIdx, dragItem.item);
		} else {
			this.removeItem(dragItem.storage);
			this.attachToWeapon(dropTarget.storage, slotIdx, dragItem.item);
		}

		return true;
	}

	// ---- Setup ----

	setup(): void {
		const initial: [SlotRef, InstanceItem][] = [
			[{ storageId: 'backpack', index: 0 }, this.createItem('res_arc_circuitry', 10)],
			[{ storageId: 'backpack', index: 2 }, this.createItem('wpn_kettle')],
			[{ storageId: 'backpack', index: 3 }, this.createItem('wpn_bobcat')],
			[{ storageId: 'lootBack', index: 0 }, this.createItem('att_compensator_1')],
			[{ storageId: 'lootBack', index: 1 }, this.createItem('att_stable_stock_1')]
		];
		for (const [slotRef, item] of initial) {
			this.items.push({ storage: slotRef, item });
		}
	}
}
