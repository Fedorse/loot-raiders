import { isEqual } from 'es-toolkit';
import { getDef, type ItemInstance, type SlotRef, type DropTarget } from '$lib/config/items';
import { getStorageConfig } from '$lib/config/storages';
import { canDrop } from './inventory-validation';

export interface StoredItem {
	storage: SlotRef;
	item: ItemInstance;
}

export class InventoryManager {
	items = $state<StoredItem[]>([]);
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
			this.items.splice(idx, 1);
		}
	}

	handleDrop(dragOrigin: StoredItem, dropTarget: DropTarget) {
		if (isEqual(dragOrigin.storage, dropTarget.storage)) return;

		if (this.#tryAttach(dragOrigin, dropTarget)) return;

		this.#moveOrSwap(dragOrigin, dropTarget);
	}

	#moveOrSwap(origin: StoredItem, target: DropTarget) {
		if (target.item) {
			const reverseStored: StoredItem = { storage: target.storage, item: target.item };
			const reverseDropTarget: DropTarget = { storage: origin.storage, item: origin.item };
			if (!canDrop(reverseStored, reverseDropTarget)) return;
		}
		const itemA = origin.item;
		const itemB = target.item;

		this.removeItem(origin.storage);
		this.removeItem(target.storage);

		this.insertItem(target.storage, itemA);
		if (itemB) {
			this.insertItem(origin.storage, itemB);
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

		// Проверка совместимости...
		const oldAttachment = this.getItem(attachSlot);

		// Логика CRUD:
		this.removeItem(dragOrigin.storage); // Убираем аттач из руки
		this.removeItem(attachSlot); // Убираем старый аттач из слота (если был)

		this.insertItem(attachSlot, dragOrigin.item); // Ставим новый
		if (oldAttachment) {
			this.insertItem(dragOrigin.storage, oldAttachment.item); // Возвращаем старый в инвентарь
		}

		return true;
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

	quickMove(storedItem: StoredItem): boolean {
		const storageId =
			'attachIndex' in storedItem.storage
				? storedItem.storage.storageId
				: storedItem.storage.storageId;
		const targetId = this.getQuickMoveTargetStorage(storageId);
		const empty = this.getFirstEmptySlotRef(targetId);
		if (!empty) return false;
		const dropTarget: DropTarget = { storage: empty, item: null };
		if (!canDrop(storedItem, dropTarget)) return false;
		this.handleDrop(storedItem, dropTarget);
		return true;
	}

	setup(): void {
		const initial: [SlotRef, ItemInstance][] = [
			[{ storageId: 'backpack', index: 0 }, this.createItem('res_arc_circuitry', 10)],
			[{ storageId: 'backpack', index: 10 }, this.createItem('res_arc_circuitry', 5)],
			[{ storageId: 'backpack', index: 1 }, this.createItem('eqp_tactical_mk1')],
			[{ storageId: 'backpack', index: 2 }, this.createItem('wpn_kettle')],
			[{ storageId: 'backpack', index: 3 }, this.createItem('wpn_bobcat')],
			[{ storageId: 'lootBack', index: 0 }, this.createItem('att_compensator_1')],
			[{ storageId: 'lootBack', index: 1 }, this.createItem('att_stable_stock_1')],
			[{ storageId: 'augment', index: 0 }, this.createItem('eqp_tactical_mk1')]
		];
		for (const [slotRef, item] of initial) {
			this.items.push({ storage: slotRef, item });
		}
	}
}
