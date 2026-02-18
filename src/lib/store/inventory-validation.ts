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

export const canDrop = (dragOrigin: StoredItem, dropTarget: DropTarget): boolean => {
	const draggedItem = dragOrigin.item;
	const targetItem = dropTarget.item;
	const storageId = dropTarget.storage.storageId;
	const allowedTypes = getAllowedTypes(storageId);
	if ('attachIndex' in dropTarget.storage) {
		return canAttach(draggedItem, targetItem);
	}
	return canPlace(draggedItem, allowedTypes) || canAttach(draggedItem, targetItem);
};
