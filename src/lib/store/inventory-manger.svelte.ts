import { getDef, type ItemInstance, type SlotReference } from '$lib/config/items';
import { getStorageConfig } from '$lib/config/storages';

interface StoredItem {
	item: ItemInstance;
	storage: string;
	position: number;
}

export class InventoryManager {
	items = $state<StoredItem[]>([]);

	constructor() {
		this.setup();
	}

	getItem(storage: string, position: number): ItemInstance | null {
		const storedItem = this.items.find(
			(item) => item.storage === storage && item.position === position
		);
		return storedItem?.item ?? null;
	}

	setItem(storage: string, position: number, item: ItemInstance | null): void {
		const index = this.items.findIndex(
			(storedItem) => storedItem.storage === storage && storedItem.position === position
		);

		if (item === null) {
			if (index >= 0) {
				this.items.splice(index, 1);
			}
			return;
		}

		if (index >= 0) {
			this.items[index] = { item, storage, position };
		} else {
			this.items.push({ item, storage, position });
		}
	}

	getStorageCollection(name: string): (ItemInstance | null)[] {
		const config = getStorageConfig(name);
		if (!config) return [];

		return Array.from({ length: config.size }, (_, index) => this.getItem(name, index));
	}

	createItem(defId: string, count = 1): ItemInstance {
		const def = getDef(defId);
		const item: ItemInstance = {
			uid: crypto.randomUUID(),
			defId,
			count
		};

		if (def.type === 'weapon' && def.attachmentSlots) {
			item.attachments = new Array(def.attachmentSlots.length).fill(null);
		}
		return item;
	}

	handleDrop(source: SlotReference, target: SlotReference, draggedItem: ItemInstance) {
		if (source.storage === target.storage && source.position === target.position) return;

		const sourceItem = this.getItem(source.storage, source.position);
		const targetItem = this.getItem(target.storage, target.position);

		if (!sourceItem) return;

		if (this.tryAttach(source, target, sourceItem, targetItem)) return;
		if (targetItem) {
			const stackResult = this.tryStack(source, target, sourceItem, targetItem);
			if (stackResult) return;
		}

		this.swap(source, target, sourceItem, targetItem);
	}

	swap(
		source: SlotReference,
		target: SlotReference,
		sourceItem: ItemInstance,
		targetItem: ItemInstance | null
	) {
		this.setItem(target.storage, target.position, sourceItem);
		this.setItem(source.storage, source.position, targetItem);
	}
	tryStack(
		source: SlotReference,
		target: SlotReference,
		sourceItem: ItemInstance,
		targetItem: ItemInstance
	): boolean {
		if (sourceItem.defId !== targetItem.defId) return false;
		const def = getDef(sourceItem.defId);
		const maxStack = def.maxStack ?? 1;
		if (maxStack <= 1) return false;
		if (targetItem.count >= maxStack) return false;
		const spaceAvailable = maxStack - targetItem.count;
		const amountToMove = Math.min(spaceAvailable, sourceItem.count);
		targetItem.count += amountToMove;
		sourceItem.count -= amountToMove;
		if (sourceItem.count <= 0) {
			this.setItem(source.storage, source.position, null);
		} else {
			this.setItem(source.storage, source.position, sourceItem);
		}
		this.setItem(target.storage, target.position, targetItem);
		return true;
	}

	splitStack(source: SlotReference): ItemInstance | null {
		const originalItem = this.getItem(source.storage, source.position);

		if (!originalItem || originalItem.count < 2) return null;

		const splitAmount = Math.ceil(originalItem.count / 2);

		originalItem.count -= splitAmount;
		this.setItem(source.storage, source.position, originalItem);

		return {
			...originalItem,
			uid: crypto.randomUUID(),
			count: splitAmount
		};
	}

	tryAttach(
		source: SlotReference,
		target: SlotReference,
		sourceItem: ItemInstance,
		targetItem: ItemInstance | null
	): boolean {
		if (targetItem === null) return false;
		if (target.storage !== 'weapon') return false;

		const sourceDef = getDef(sourceItem.defId);
		const targetDef = getDef(targetItem.defId);

		// Проверяем attachmentKind для attachments
		if (sourceDef.type !== 'attachment' || !sourceDef.attachmentKind) return false;

		const slotIndex = targetDef.attachmentSlots?.findIndex(
			(s) => s.type === sourceDef.attachmentKind
		);
		if (slotIndex == null || slotIndex < 0) return false;
		if (!targetItem.attachments && targetDef.attachmentSlots) {
			targetItem.attachments = new Array(targetDef.attachmentSlots.length).fill(null);
		}
		const old = targetItem.attachments?.[slotIndex] ?? null;
		if (targetItem.attachments) {
			targetItem.attachments[slotIndex] = sourceItem;
		}
		this.setItem(target.storage, target.position, targetItem);
		this.setItem(source.storage, source.position, old);
		return true;
	}

	setup() {
		this.setItem('backpack', 0, this.createItem('res_arc_circuitry', 10));
		this.setItem('backpack', 10, this.createItem('res_arc_circuitry', 5));
		this.setItem('backpack', 1, this.createItem('eqp_tactical_mk1'));
		this.setItem('backpack', 2, this.createItem('wpn_kettle'));
		this.setItem('backpack', 3, this.createItem('wpn_bobcat'));
		this.setItem('lootBack', 0, this.createItem('att_compensator_1'));
		this.setItem('lootBack', 1, this.createItem('att_stable_stock_1'));

		this.setItem('augment', 0, this.createItem('eqp_tactical_mk1'));
	}
}
