import { isEqual } from 'es-toolkit';
import { getDef, type ItemInstance, type SlotRef, type DropTarget } from '$lib/config/items';
import type { InventoryManager } from './inventory-manger.svelte';
import type { StoredItem } from './inventory-manger.svelte';
import { canDrop } from './inventory-validation';

export class InventoryOperations {
	constructor(private inventory: InventoryManager) {}

	handleDrop(dragOrigin: StoredItem, dropTarget: DropTarget): void {
		if (isEqual(dragOrigin.storage, dropTarget.storage)) return;

		if (this.#tryAttach(dragOrigin, dropTarget)) return;

		this.#moveOrSwap(dragOrigin, dropTarget);
	}

	#moveOrSwap(origin: StoredItem, target: DropTarget): void {
		if (target.item) {
			const reverseStored: StoredItem = { storage: target.storage, item: target.item };
			const reverseDropTarget: DropTarget = { storage: origin.storage, item: origin.item };
			if (!canDrop(reverseStored, reverseDropTarget)) return;
		}
		const itemA = origin.item;
		const itemB = target.item;

		this.inventory.removeItem(origin.storage);
		this.inventory.removeItem(target.storage);

		this.inventory.insertItem(target.storage, itemA);
		if (itemB) {
			this.inventory.insertItem(origin.storage, itemB);
		}
	}

	#tryAttach(dragOrigin: StoredItem, dropTarget: DropTarget): boolean {
		const dragDef = getDef(dragOrigin.item.defId);
		if (dragDef.type !== 'attachment' || !dragDef.attachmentKind) return false;

		let attachSlot: SlotRef | null = null;

		if ('attachIndex' in dropTarget.storage) {
			attachSlot = dropTarget.storage;
		} else if (dropTarget.item && getDef(dropTarget.item.defId).type === 'weapon') {
			const targetDef = getDef(dropTarget.item.defId);
			const slotIdx = targetDef.attachmentSlots?.findIndex(
				(s) => s.type === dragDef.attachmentKind
			);
			if (slotIdx !== undefined && slotIdx !== -1) {
				attachSlot = { ...dropTarget.storage, attachIndex: slotIdx };
			}
		}

		if (!attachSlot) return false;

		const oldAttachment = this.inventory.getItem(attachSlot);

		this.inventory.removeItem(dragOrigin.storage);
		this.inventory.removeItem(attachSlot);

		this.inventory.insertItem(attachSlot, dragOrigin.item);
		if (oldAttachment) {
			this.inventory.insertItem(dragOrigin.storage, oldAttachment.item);
		}

		return true;
	}

	quickMove(storedItem: StoredItem): boolean {
		const storageId =
			'attachIndex' in storedItem.storage
				? storedItem.storage.storageId
				: storedItem.storage.storageId;
		const targetId = this.inventory.getQuickMoveTargetStorage(storageId);
		const empty = this.inventory.getFirstEmptySlotRef(targetId);
		if (!empty) return false;
		const dropTarget: DropTarget = { storage: empty, item: null };
		if (!canDrop(storedItem, dropTarget)) return false;
		this.handleDrop(storedItem, dropTarget);
		return true;
	}
}
