import { getDef, type ItemInstance, type SlotReference, type DropTarget } from '$lib/config/items';
import { getStorageConfig } from '$lib/config/storages';

export interface StoredItem {
	item: ItemInstance;
	storage: string;
	position: number;
}

export class InventoryManager {
	items = $state<StoredItem[]>([]);

	constructor() {
		this.setup();
	}

	private parseAttachmentStorage(storage: string): {
		weaponStorage: string;
		weaponPosition: number;
	} | null {
		const match = storage.match(/^(.+):(\d+):attachment$/);
		if (!match) return null;
		return {
			weaponStorage: match[1],
			weaponPosition: parseInt(match[2])
		};
	}

	/**
	 * Создает имя виртуального хранилища для attachments оружия
	 */
	private createAttachmentStorage(weaponStorage: string, weaponPosition: number): string {
		return `${weaponStorage}:${weaponPosition}:attachment`;
	}

	getItem(storage: string, position: number): StoredItem | null {
		const storedItem = this.items.find(
			(item) => item.storage === storage && item.position === position
		);
		return storedItem ?? null;
	}

	setItem(storage: string, position: number, item: ItemInstance | null): void {
		// Если это виртуальное хранилище attachments
		if (storage.includes(':attachment')) {
			const attachmentInfo = this.parseAttachmentStorage(storage);
			if (!attachmentInfo) return;

			const index = this.items.findIndex(
				(storedItem) => storedItem.storage === storage && storedItem.position === position
			);

			if (item === null) {
				if (index >= 0) {
					this.items.splice(index, 1);
				}
				// Синхронизируем массив attachments оружия
				this.syncAttachmentToWeaponArray(attachmentInfo, position, null);
				return;
			}

			if (index >= 0) {
				this.items[index] = { item, storage, position };
			} else {
				this.items.push({ item, storage, position });
			}

			// Синхронизируем массив attachments оружия
			this.syncAttachmentToWeaponArray(attachmentInfo, position, item);
			return;
		}

		// Обычное хранилище
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

	/**
	 * Синхронизирует attachment в виртуальном хранилище с массивом attachments оружия
	 */
	private syncAttachmentToWeaponArray(
		attachmentInfo: { weaponStorage: string; weaponPosition: number },
		slotIndex: number,
		attachment: ItemInstance | null
	): void {
		const weaponStored = this.items.find(
			(item) =>
				item.storage === attachmentInfo.weaponStorage &&
				item.position === attachmentInfo.weaponPosition
		);

		if (!weaponStored) return;

		const weaponItem = weaponStored.item;

		// Инициализируем массив attachments если нужно
		if (!weaponItem.attachments) {
			const def = getDef(weaponItem.defId);
			if (def.attachmentSlots) {
				weaponItem.attachments = new Array(def.attachmentSlots.length).fill(null);
			}
		}

		// Обновляем attachment в массиве
		if (weaponItem.attachments) {
			weaponItem.attachments[slotIndex] = attachment;
			// Обновляем оружие в inventory (триггерит реактивность)
			const weaponIndex = this.items.findIndex(
				(item) =>
					item.storage === attachmentInfo.weaponStorage &&
					item.position === attachmentInfo.weaponPosition
			);
			if (weaponIndex >= 0) {
				this.items[weaponIndex] = { ...this.items[weaponIndex], item: weaponItem };
			}
		}
	}

	getStorageCollection(name: string): (ItemInstance | null)[] {
		const config = getStorageConfig(name);
		if (!config) return [];

		return Array.from({ length: config.size }, (_, index) => {
			const stored = this.getItem(name, index);
			return stored?.item ?? null;
		});
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

	handleDrop(dragOrigin: StoredItem, dropTarget: DropTarget) {
		if (dragOrigin.storage === dropTarget.storage && dragOrigin.position === dropTarget.position)
			return;
		const draggedItem = dragOrigin.item;
		const itemInSlot = dropTarget.item;

		if (this.tryAttach(dragOrigin, dropTarget)) return;
		if (dropTarget.storage.includes(':attachment')) return;
		if (dragOrigin.storage.includes(':attachment')) return;
		if (itemInSlot && this.tryStack(dragOrigin, dropTarget, draggedItem, itemInSlot)) return;
		this.swap(dragOrigin, dropTarget);
	}

	swap(dragOrigin: StoredItem, dropTarget: DropTarget) {
		this.setItem(dropTarget.storage, dropTarget.position, dragOrigin.item);
		this.setItem(dragOrigin.storage, dragOrigin.position, dropTarget.item);
	}

	tryStack(
		dragOrigin: StoredItem,
		dropTarget: DropTarget,
		draggedItem: ItemInstance,
		itemInSlot: ItemInstance
	): boolean {
		if (draggedItem.defId !== itemInSlot.defId) return false;
		const def = getDef(draggedItem.defId);
		const maxStack = def.maxStack ?? 1;
		if (maxStack <= 1) return false;
		if (itemInSlot.count >= maxStack) return false;
		const spaceAvailable = maxStack - itemInSlot.count;
		const amountToMove = Math.min(spaceAvailable, draggedItem.count);
		itemInSlot.count += amountToMove;
		draggedItem.count -= amountToMove;
		if (draggedItem.count <= 0) {
			this.setItem(dragOrigin.storage, dragOrigin.position, null);
		} else {
			this.setItem(dragOrigin.storage, dragOrigin.position, draggedItem);
		}
		this.setItem(dropTarget.storage, dropTarget.position, itemInSlot);
		return true;
	}

	splitStack(source: SlotReference): ItemInstance | null {
		const stored = this.getItem(source.storage, source.position);
		if (!stored) return null;
		const originalItem = stored.item;

		if (originalItem.count < 2) return null;

		const splitAmount = Math.ceil(originalItem.count / 2);

		originalItem.count -= splitAmount;
		this.setItem(source.storage, source.position, originalItem);

		return {
			...originalItem,
			uid: crypto.randomUUID(),
			count: splitAmount
		};
	}

	tryAttach(dragOrigin: StoredItem, dropTarget: DropTarget): boolean {
		const targetItem = dropTarget.item;
		if (targetItem === null) return false;

		const sourceItem = dragOrigin.item;
		const sourceDef = getDef(sourceItem.defId);
		const targetDef = getDef(targetItem.defId);

		// Проверяем attachmentKind для attachments
		if (sourceDef.type !== 'attachment' || !sourceDef.attachmentKind) return false;

		// Определяем slotIndex и attachmentStorage
		let slotIndex: number;
		let attachmentStorage: string;

		// Если dropTarget - виртуальное хранилище attachment
		if (dropTarget.storage.includes(':attachment')) {
			const attachmentInfo = this.parseAttachmentStorage(dropTarget.storage);
			if (!attachmentInfo) return false;
			slotIndex = dropTarget.position;
			attachmentStorage = dropTarget.storage;

			// Проверяем, что тип attachment соответствует слоту
			const slotDef = targetDef.attachmentSlots?.[slotIndex];
			if (!slotDef || slotDef.type !== sourceDef.attachmentKind) {
				return false;
			}
		} else {
			// Старый способ: ищем слот по типу (для обратной совместимости)
			if (dropTarget.storage !== 'weapon') return false;

			const foundSlotIndex = targetDef.attachmentSlots?.findIndex(
				(s) => s.type === sourceDef.attachmentKind
			);
			if (foundSlotIndex == null || foundSlotIndex < 0) return false;
			slotIndex = foundSlotIndex;
			attachmentStorage = this.createAttachmentStorage(dropTarget.storage, dropTarget.position);
		}

		// Получаем старый attachment (если был)
		const oldStored = this.getItem(attachmentStorage, slotIndex);
		const oldAttachment = oldStored?.item ?? null;

		// Перемещаем attachment из dragOrigin в виртуальное хранилище
		this.setItem(attachmentStorage, slotIndex, sourceItem);
		this.setItem(dragOrigin.storage, dragOrigin.position, oldAttachment);

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
