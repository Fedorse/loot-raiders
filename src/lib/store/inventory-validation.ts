import { getDef } from '$lib/config/items';
import { getAllowedTypes } from '$lib/config/storages';
import type { StoredItem, DropTarget, InstanceItem, ItemType } from '$lib/types';

export const canPlace = (draggedItem: InstanceItem, allowedTypes: ItemType[]): boolean => {
	const itemDef = getDef(draggedItem.defId);
	return allowedTypes.includes(itemDef.type);
};

export const canAttach = (draggedItem: InstanceItem, targetItem: InstanceItem | null): boolean => {
	if (!targetItem) return false;
	const itemDef = getDef(draggedItem.defId);
	const targetDef = getDef(targetItem.defId);
	if (itemDef.type === 'attachment') {
		return targetDef.attachmentSlots?.some((slot) => slot.type === itemDef.attachmentKind) ?? false;
	}

	return false;
};

export const canDropAttachment = (draggedItem: InstanceItem, dropTarget: DropTarget): boolean => {
	if (dropTarget.item) {
		return canAttach(draggedItem, dropTarget.item);
	}
	const allowedTypes = getAllowedTypes(dropTarget.storage.storageId);
	return allowedTypes.includes('attachment');
};

export const canStack = (draggedItem: InstanceItem, targetItem: InstanceItem | null): boolean => {
	if (!targetItem) return false;
	if (draggedItem.defId !== targetItem.defId) return false;
	const def = getDef(targetItem.defId);
	if (!def.maxStack) return false;
	return targetItem.count < def.maxStack;
};

export const canDrop = (dragOrigin: StoredItem, dropTarget: DropTarget): boolean => {
	const draggedItem = dragOrigin.item;
	const targetItem = dropTarget.item;
	const storageId = dropTarget.storage.storageId;
	const allowedTypes = getAllowedTypes(storageId);
	return canPlace(draggedItem, allowedTypes) || canAttach(draggedItem, targetItem);
};

export const canDropSplit = (draggedItem: InstanceItem, dropTarget: DropTarget): boolean => {
	const allowedTypes = getAllowedTypes(dropTarget.storage.storageId);
	if (!canPlace(draggedItem, allowedTypes)) return false;
	if (dropTarget.item) return canStack(draggedItem, dropTarget.item);
	return true;
};
