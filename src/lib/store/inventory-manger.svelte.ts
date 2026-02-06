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

	getItem(storage: string, position: number): ItemInstance | null {
		// Если это виртуальное хранилище attachments
		if (storage.includes(':attachment')) {
			const storedItem = this.items.find(
				(item) => item.storage === storage && item.position === position
			);
			return storedItem?.item ?? null;
		}

		// Обычное хранилище
		const storedItem = this.items.find(
			(item) => item.storage === storage && item.position === position
		);

		return storedItem?.item ?? null;
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

		// Если target - виртуальное хранилище attachments, получаем родительское оружие
		let targetItem: ItemInstance | null = null;
		if (target.storage.includes(':attachment')) {
			const attachmentInfo = this.parseAttachmentStorage(target.storage);
			if (attachmentInfo) {
				targetItem = this.getItem(attachmentInfo.weaponStorage, attachmentInfo.weaponPosition);
			}
		} else {
			targetItem = this.getItem(target.storage, target.position);
		}

		if (!sourceItem) return;

		// Пробуем прикрепить attachment
		if (this.tryAttach(source, target, sourceItem, targetItem)) return;

		// Если target - виртуальное хранилище, не делаем swap/stack
		if (target.storage.includes(':attachment')) return;

		// Если source - виртуальное хранилище, не делаем swap/stack
		if (source.storage.includes(':attachment')) return;

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

		const sourceDef = getDef(sourceItem.defId);
		const targetDef = getDef(targetItem.defId);

		// Проверяем attachmentKind для attachments
		if (sourceDef.type !== 'attachment' || !sourceDef.attachmentKind) return false;

		// Определяем slotIndex и attachmentStorage
		let slotIndex: number;
		let attachmentStorage: string;

		// Если target - виртуальное хранилище attachment
		if (target.storage.includes(':attachment')) {
			const attachmentInfo = this.parseAttachmentStorage(target.storage);
			if (!attachmentInfo) return false;
			slotIndex = target.position;
			attachmentStorage = target.storage;

			// Проверяем, что тип attachment соответствует слоту
			const slotDef = targetDef.attachmentSlots?.[slotIndex];
			if (!slotDef || slotDef.type !== sourceDef.attachmentKind) {
				return false;
			}
		} else {
			// Старый способ: ищем слот по типу (для обратной совместимости)
			if (target.storage !== 'weapon') return false;

			const foundSlotIndex = targetDef.attachmentSlots?.findIndex(
				(s) => s.type === sourceDef.attachmentKind
			);
			if (foundSlotIndex == null || foundSlotIndex < 0) return false;
			slotIndex = foundSlotIndex;
			attachmentStorage = this.createAttachmentStorage(target.storage, target.position);
		}

		// Получаем старый attachment (если был)
		const oldAttachment = this.getItem(attachmentStorage, slotIndex);

		// Перемещаем attachment из source в виртуальное хранилище
		this.setItem(attachmentStorage, slotIndex, sourceItem);
		this.setItem(source.storage, source.position, oldAttachment);

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
