import { getDef, type ItemInstance, type ItemType } from '$lib/config/items';
import type { StoredItem } from '$lib/store/inventory-manger.svelte';
import type { DropTarget } from '$lib/config/items';
import { getAllowedTypes } from '$lib/config/storages';

export const canPlace = (draggedItem: ItemInstance, allowedTypes: ItemType[]): boolean => {
	const itemDef = getDef(draggedItem.defId);
	return allowedTypes.includes(itemDef.type);
};

export const canAttach = (draggedItem: ItemInstance, targetItem: ItemInstance | null): boolean => {
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
	const allowedTypes = getAllowedTypes(dropTarget.storage);
	if (dropTarget.storage.includes(':attachment')) {
		return canAttach(draggedItem, targetItem);
	}
	return canPlace(draggedItem, allowedTypes) || canAttach(draggedItem, targetItem);
};
