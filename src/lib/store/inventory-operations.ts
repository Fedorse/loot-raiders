import { isEqual } from 'es-toolkit';
import { getDef, type SlotRef, type DropTarget } from '$lib/config/items';
import { isAttachment, isWeapon } from '$lib/utils';
import type { InventoryManager } from './inventory-manger.svelte';
import type { StoredItem } from './inventory-manger.svelte';
import { canDrop } from './inventory-validation';

export class InventoryOperations {
	constructor(private inventory: InventoryManager) {}

	handleDrop(dragItem: StoredItem, targetDrop: DropTarget): void {
		if (isEqual(dragItem.storage, targetDrop.storage)) return;

		if (this.#tryAttach(dragItem, targetDrop)) return;

		this.#moveOrSwap(dragItem, targetDrop);
	}

	selectSingle(uid: string): void {
		this.inventory.selectedIds.clear();
		this.inventory.selectedIds.add(uid);
	}
	toggleSelection(uid: string): void {
		if (this.inventory.selectedIds.has(uid)) {
			this.inventory.selectedIds.delete(uid);
		} else {
			this.inventory.selectedIds.add(uid);
		}
	}
	clearSelection(): void {
		this.inventory.selectedIds.clear();
	}

	#moveOrSwap(dragItem: StoredItem, targetDrop: DropTarget): void {
		if (targetDrop.item) {
			this.#swapItems(dragItem, targetDrop);
		} else {
			this.#moveToEmptySlot(dragItem, targetDrop);
		}
	}

	#moveToEmptySlot(dragItem: StoredItem, targetDrop: DropTarget): void {
		this.inventory.removeItem(dragItem.storage);
		this.inventory.insertItem(targetDrop.storage, dragItem.item);
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

		this.inventory.removeItem(dragItem.storage);
		this.inventory.removeItem(dropItem.storage);

		this.inventory.insertItem(dropItem.storage, itemToTarget);
		this.inventory.insertItem(dragItem.storage, itemToBack);
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

			item: this.inventory.getItem(targetSlotRef)?.item ?? null
		};

		this.#moveOrSwap(dragItem, attachmentDropTarget);

		return true;
	}

	quickMove(storedItem: StoredItem): boolean {
		const targetId = this.inventory.getQuickMoveTargetStorage(storedItem.storage.storageId);
		const empty = this.inventory.getFirstEmptySlotRef(targetId);
		if (!empty) return false;
		const dropTarget: DropTarget = { storage: empty, item: null };
		if (!canDrop(storedItem, dropTarget)) return false;
		this.handleDrop(storedItem, dropTarget);
		return true;
	}
}
