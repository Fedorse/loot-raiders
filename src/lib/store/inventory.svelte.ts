import { isEqual } from 'es-toolkit';
import { getStorageConfig } from '$lib/config/storages';
import { SvelteSet } from 'svelte/reactivity';
import { canDrop } from './inventory-validation';
import { getDef } from '$lib/config/items';
import { isWeapon } from '$lib/utils';
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

	// 	// =====================================================================
	// 	// 2. ГЛАВНЫЙ КОНТРОЛЛЕР ДЕЙСТВИЙ (Единая точка входа)
	// 	// =====================================================================
	executeDrop(payload: DragPayload, dropTarget: DropTarget): void {
		switch (payload.source) {
			case 'inventory_slot':
				this.#handleDraggedInventoryItem(payload.storedItem, dropTarget);
				break;
			case 'weapon_attachment':
				this.#handleDraggedAttachment(payload, dropTarget);
				break;
		}
	}
	#handleDraggedAttachment(
		payload: Extract<DragPayload, { source: 'weapon_attachment' }>,
		dropTarget: DropTarget
	) {
		const { weaponSlotRef, attachIndex } = payload.attachmentRef;
		const attachment = this.detachFromWeapon(weaponSlotRef, attachIndex);
		if (!attachment) return;

		if (dropTarget.item) {
			this.attachToWeapon(weaponSlotRef, attachIndex, attachment);
		} else {
			this.insertItem(dropTarget.storage, attachment);
		}
	}

	#handleDraggedInventoryItem(dragItem: StoredItem, dropTarget: DropTarget) {
		// 1. Надеваем прицел на пушку?
		if (this.#isAttachingAction(dragItem, dropTarget)) {
			this.#executeAttachToWeapon(dragItem, dropTarget);
			return;
		}

		// 2. Слот занят? Меняем местами.
		if (dropTarget.item) {
			this.#executeSwap(dragItem, dropTarget);
			return;
		}

		// 3. Слот пуст? Перемещаем.
		this.#executeMove(dragItem.storage, dropTarget.storage);
	}

	// 	// =====================================================================
	// 	// 3. ПРИВАТНЫЕ ИСПОЛНИТЕЛИ (Грузчики)
	// 	// =====================================================================

	#executeMove(fromSlot: SlotRef, toSlot: SlotRef): void {
		const item = this.getItem(fromSlot)?.item;
		if (!item) return;
		this.removeItem(fromSlot);
		this.insertItem(toSlot, item);
	}

	#executeSwap(dragItem: StoredItem, dropTarget: DropTarget): void {
		if (!dropTarget.item) return;
		// ВАЖНО: Никакой валидации (canDrop) здесь больше нет. Менеджер уже всё проверил.
		this.removeItem(dragItem.storage);
		this.removeItem(dropTarget.storage);

		this.insertItem(dropTarget.storage, dragItem.item);
		this.insertItem(dragItem.storage, dropTarget.item);
	}

	#executeAttachToWeapon(dragItem: StoredItem, dropTarget: DropTarget): void {
		const dragDef = getDef(dragItem.item.defId);
		const targetDef = getDef(dropTarget.item!.defId);
		const slotIdx = targetDef.attachmentSlots!.findIndex((s) => s.type === dragDef.attachmentKind);

		const existingAttachment = dropTarget.item!.attachments?.[slotIdx] ?? null;

		this.removeItem(dragItem.storage);

		if (existingAttachment) {
			// Если на пушке уже был прицел, кладем его в слот инвентаря вместо нового
			this.insertItem(dragItem.storage, existingAttachment);
		}
		this.attachToWeapon(dropTarget.storage, slotIdx, dragItem.item);
	}

	#isAttachingAction(dragItem: StoredItem, dropTarget: DropTarget): boolean {
		if (!dropTarget.item || !isWeapon(dropTarget.item)) return false;
		return getDef(dragItem.item.defId).type === 'attachment';
	}

	// =====================================================================
	// 4. БАЗОВЫЕ ОПЕРАЦИИ CRUD
	// =====================================================================

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

	// 	// =====================================================================
	// 	// 5. ВЫДЕЛЕНИЕ (Selection)
	// 	// =====================================================================

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

	// 	// =====================================================================
	// 	// 6. ОПЕРАЦИИ С АТТАЧМЕНТАМИ
	// 	// =====================================================================

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
		const config = getStorageConfig(storedItem.storage.storageId);
		const targetId = config?.quickMoveTarget; // берем из конфига!
		if (!targetId) return false;
		const emptySlot = this.getFirstEmptySlotRef(targetId);
		const dropTarget: DropTarget = { storage: emptySlot, item: null };
		// if (!canDrop(storedItem, dropTarget)) return false;
		this.#executeMove(storedItem.storage, dropTarget.storage);
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
