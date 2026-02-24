import { isEqual } from 'es-toolkit';
import { getStorageConfig } from '$lib/config/storages';
import { SvelteSet } from 'svelte/reactivity';
import { getDef } from '$lib/config/items';
import { getDropActionType, getAttachmentSlotIndex, validateDrop } from './inventory-validation';

import type {
	StoredItem,
	InstanceItem,
	SlotRef,
	StorageId,
	DropTarget,
	DragPayload
} from '$lib/types';

export class Inventory {
	items = $state<StoredItem[]>([]);
	selectedIds = new SvelteSet<string>();

	backpack = $derived(this.items.filter((i) => i.storage.storageId === 'backpack'));
	lootBack = $derived(this.items.filter((i) => i.storage.storageId === 'lootBack'));
	weapon = $derived(this.items.filter((i) => i.storage.storageId === 'weapon'));

	constructor() {
		this.setup();
	}

	validateDrop(payload: DragPayload, dropTarget: DropTarget): boolean {
		return validateDrop(payload, dropTarget);
	}

	executeDrop(payload: DragPayload, dropTarget: DropTarget): void {
		switch (payload.source) {
			case 'inventory_slot':
				this.#handleDraggedInventoryItem(payload.storedItem, dropTarget);
				break;
			case 'weapon_attachment':
				this.#handleDraggedAttachment(payload, dropTarget);
				break;
			case 'split_slot':
				this.#handleSplitDrop(payload, dropTarget);
				break;
		}
	}

	#handleDraggedInventoryItem(dragItem: StoredItem, dropTarget: DropTarget) {
		const action = getDropActionType(dragItem.item, dropTarget);
		if (isEqual(dragItem.storage, dropTarget.storage)) return;
		switch (action) {
			case 'stack':
				this.#executeStack(dragItem, dropTarget);
				break;
			case 'attach':
				this.#executeAttachToWeapon(dragItem.storage, dragItem.item, dropTarget);
				break;
			case 'swap':
				this.#executeSwap(dragItem, dropTarget);
				break;
			case 'move':
				this.#executeMove(dragItem.storage, dropTarget.storage);
				break;
		}
	}

	#handleSplitDrop(
		payload: Extract<DragPayload, { source: 'split_slot' }>,
		dropTarget: DropTarget
	): void {
		// Защита от дропа в самого себя
		if (isEqual(payload.storedItem.storage, dropTarget.storage)) return;

		const originalStoredItem = this.getItem(payload.storedItem.storage);
		if (!originalStoredItem) return;

		// Создаем реальный сплит-предмет
		const splitItem: InstanceItem = {
			uid: crypto.randomUUID(),
			defId: originalStoredItem.item.defId,
			count: payload.splitCount
		};

		const action = getDropActionType(splitItem, dropTarget);

		if (action === 'stack' && dropTarget.item) {
			const targetStored = this.getItem(dropTarget.storage);
			if (!targetStored) return;

			const def = getDef(splitItem.defId);
			const maxStack = def.maxStack!;
			const total = splitItem.count + targetStored.item.count;

			if (total <= maxStack) {
				targetStored.item.count = total;
				originalStoredItem.item.count -= payload.splitCount;
			} else {
				const diffToMax = maxStack - targetStored.item.count;
				targetStored.item.count = maxStack;
				originalStoredItem.item.count -= diffToMax;
			}
		} else if (action === 'move') {
			this.insertItem(dropTarget.storage, splitItem);
			originalStoredItem.item.count -= payload.splitCount;
		}
	}

	#handleDraggedAttachment(
		payload: Extract<DragPayload, { source: 'weapon_attachment' }>,
		dropTarget: DropTarget
	) {
		const { weaponSlotRef, attachIndex } = payload.attachmentRef;

		const attachment = this.detachFromWeapon(weaponSlotRef, attachIndex);
		if (!attachment) return;

		const action = getDropActionType(attachment, dropTarget);

		if (action === 'attach' && dropTarget.item) {
			// Перенос аттачмента с одной пушки на другую
			this.#executeAttachToWeapon(weaponSlotRef, attachment, dropTarget, attachIndex);
		} else if (action === 'move') {
			// Снятие аттачмента в рюкзак
			this.insertItem(dropTarget.storage, attachment);
		} else {
			// Откат, если что-то пошло не так
			this.attachToWeapon(weaponSlotRef, attachIndex, attachment);
		}
	}

	#executeMove(fromSlot: SlotRef, toSlot: SlotRef): void {
		const item = this.getItem(fromSlot)?.item;
		if (!item) return;
		this.removeItem(fromSlot);
		this.insertItem(toSlot, item);
	}

	#executeStack(dragItem: StoredItem, dropTarget: DropTarget): void {
		const targetStored = this.getItem(dropTarget.storage);
		if (!targetStored) return;

		const def = getDef(dragItem.item.defId);
		const maxStack = def.maxStack!;
		const total = dragItem.item.count + targetStored.item.count;

		if (total <= maxStack) {
			targetStored.item.count = total;
			this.removeItem(dragItem.storage);
		} else {
			targetStored.item.count = maxStack;
			dragItem.item.count = total - maxStack;
		}
	}

	#executeSwap(dragItem: StoredItem, dropTarget: DropTarget): void {
		if (!dropTarget.item) return;
		this.removeItem(dragItem.storage);
		this.removeItem(dropTarget.storage);

		this.insertItem(dropTarget.storage, dragItem.item);
		this.insertItem(dragItem.storage, dropTarget.item);
	}

	#executeAttachToWeapon(
		sourceStorageRef: SlotRef,
		attachmentItem: InstanceItem,
		dropTarget: DropTarget,
		originalAttachIndex?: number
	): void {
		const targetWeapon = dropTarget.item!;
		const targetSlotIdx = getAttachmentSlotIndex(attachmentItem, targetWeapon);
		if (targetSlotIdx === -1) return;

		const existingAttachment = targetWeapon.attachments?.[targetSlotIdx] ?? null;

		// Если предмет из инвентаря, удаляем его из старого слота
		if (originalAttachIndex === undefined) {
			this.removeItem(sourceStorageRef);
		}

		// Надеваем новый
		this.attachToWeapon(dropTarget.storage, targetSlotIdx, attachmentItem);

		// Возвращаем старый (если был) на освободившееся место
		if (existingAttachment) {
			if (originalAttachIndex !== undefined) {
				this.attachToWeapon(sourceStorageRef, originalAttachIndex, existingAttachment);
			} else {
				this.insertItem(sourceStorageRef, existingAttachment);
			}
		}
	}

	getItem(slotRef: SlotRef): StoredItem | null {
		return this.items.find((i) => isEqual(i.storage, slotRef)) ?? null;
	}

	insertItem(slotRef: SlotRef, item: InstanceItem): void {
		this.items.push({ storage: slotRef, item });
	}

	removeItem(slotRef: SlotRef): void {
		const idx = this.items.findIndex((i) => isEqual(i.storage, slotRef));
		if (idx !== -1) {
			const uid = this.items[idx].item.uid;
			this.selectedIds.delete(uid);
			this.items.splice(idx, 1);
		}
	}

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

	quickMove(storedItem: StoredItem): boolean {
		const config = getStorageConfig(storedItem.storage.storageId);
		const targetId = config?.quickMoveTarget;
		if (!targetId) return false;
		const emptySlot = this.getFirstEmptySlotRef(targetId);
		if (!emptySlot) return false;

		const dropTarget: DropTarget = { storage: emptySlot, item: null };
		this.#executeMove(storedItem.storage, dropTarget.storage);
		return true;
	}

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
			[{ storageId: 'backpack', index: 10 }, this.createItem('res_arc_circuitry', 10)],

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
