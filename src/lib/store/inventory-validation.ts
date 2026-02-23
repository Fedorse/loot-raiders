import { getDef } from '$lib/config/items';
import { getAllowedTypes } from '$lib/config/storages';
import type { InstanceItem, StorageId, DragPayload, DropTarget } from '$lib/types';

export type DropActionType = 'move' | 'stack' | 'attach' | 'swap' | 'invalid';

export const isTypeAllowed = (item: InstanceItem, storageId: StorageId): boolean => {
	const itemDef = getDef(item.defId);
	const allowedTypes = getAllowedTypes(storageId);
	return allowedTypes.includes(itemDef.type);
};

export const canStackItems = (sourceItem: InstanceItem, targetItem: InstanceItem): boolean => {
	if (sourceItem.defId !== targetItem.defId) return false;

	const def = getDef(targetItem.defId);
	if (!def.maxStack) return false;

	return targetItem.count < def.maxStack;
};

export const canAttachToWeapon = (sourceItem: InstanceItem, targetItem: InstanceItem): boolean => {
	const sourceDef = getDef(sourceItem.defId);
	const targetDef = getDef(targetItem.defId);

	if (sourceDef.type !== 'attachment') return false;
	if (targetDef.type !== 'weapon') return false;

	return targetDef.attachmentSlots?.some((slot) => slot.type === sourceDef.attachmentKind) ?? false;
};

export const getDropActionType = (
	draggedItem: InstanceItem,
	dropTarget: DropTarget
): DropActionType => {
	if (!dropTarget.item) return 'move';
	if (canStackItems(draggedItem, dropTarget.item)) return 'stack';
	if (canAttachToWeapon(draggedItem, dropTarget.item)) return 'attach';
	return 'swap';
};

export const getAttachmentSlotIndex = (
	attachmentItem: InstanceItem,
	weaponItem: InstanceItem
): number => {
	const attachDef = getDef(attachmentItem.defId);
	const weaponDef = getDef(weaponItem.defId);
	if (!weaponDef.attachmentSlots) return -1;
	return weaponDef.attachmentSlots.findIndex((s) => s.type === attachDef.attachmentKind);
};

export const validateDrop = (payload: DragPayload, dropTarget: DropTarget): boolean => {
	// 1. Формируем "виртуальный" предмет на основе намерения пользователя
	let draggedItem: InstanceItem;

	if (payload.source === 'split_slot') {
		draggedItem = { ...payload.storedItem.item, count: payload.splitCount };
	} else if (payload.source === 'weapon_attachment') {
		draggedItem = payload.item;
	} else {
		draggedItem = payload.storedItem.item;
	}

	const targetItem = dropTarget.item;
	const targetStorageId = dropTarget.storage.storageId;

	if (!targetItem) {
		return isTypeAllowed(draggedItem, targetStorageId);
	}

	// Сценарий Б: В целевом слоте УЖЕ ЕСТЬ предмет
	if (canStackItems(draggedItem, targetItem)) return true;
	if (canAttachToWeapon(draggedItem, targetItem)) return true;

	// Сценарий В: СВАП (Смена мест)
	// Предмет в руке должен подходить целевому слоту
	if (!isTypeAllowed(draggedItem, targetStorageId)) return false;

	// Свап запрещен, если мы тащим предмет с оружия или это сплит-предмет
	if (payload.source === 'weapon_attachment' || payload.source === 'split_slot') return false;

	// Предмет из целевого слота должен подходить тому месту, откуда мы взяли предмет в руке
	if (payload.source === 'inventory_slot') {
		const originalStorageId = payload.storedItem.storage.storageId;
		return isTypeAllowed(targetItem, originalStorageId);
	}

	return false;
};
