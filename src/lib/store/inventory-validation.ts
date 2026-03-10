import { getDef } from '$lib/config/items';
import { getAllowedTypes } from '$lib/config/storages';
import type { InstanceItem, ItemLocation, DragState, SlotState } from '$lib/types';

export type DropActionType = 'move' | 'stack' | 'attach' | 'swap' | 'delete' | 'invalid';
export type ItemResolver = (loc: ItemLocation) => InstanceItem | null;

export const isAllowedInLocation = (
	item: InstanceItem,
	loc: ItemLocation,
	resolve: ItemResolver
): boolean => {
	if (loc.type === 'trash') return true;
	if (loc.type === 'slot') {
		const itemDef = getDef(item.defId);
		const allowedTypes = getAllowedTypes(loc.storageId);
		return allowedTypes.includes(itemDef.type);
	}
	// attachment location: check weapon's slot definition
	const parent = resolve(loc.parentLocation);
	if (!parent) return false;
	const parentDef = getDef(parent.defId);
	if (parentDef.type !== 'weapon' || !parentDef.attachmentSlots) return false;
	const slotDef = parentDef.attachmentSlots[loc.attachIndex];
	if (!slotDef) return false;
	const itemDef = getDef(item.defId);
	return itemDef.type === 'attachment' && itemDef.attachmentKind === slotDef.type;
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

export const getAttachmentSlotIndex = (
	attachmentItem: InstanceItem,
	weaponItem: InstanceItem
): number => {
	const attachDef = getDef(attachmentItem.defId);
	const weaponDef = getDef(weaponItem.defId);
	if (!weaponDef.attachmentSlots) return -1;
	return weaponDef.attachmentSlots.findIndex((s) => s.type === attachDef.attachmentKind);
};

export const getDropActionType = (drag: DragState, target: SlotState): DropActionType => {
	if (target.location.type === 'trash') return 'delete';
	if (!target.item) return 'move';
	if (canStackItems(drag.item, target.item)) return 'stack';
	if (target.location.type === 'slot' && canAttachToWeapon(drag.item, target.item)) return 'attach';
	if (drag.isSplit) return 'invalid';
	return 'swap';
};

export const validateDrop = (
	drag: DragState,
	target: SlotState,
	resolve: ItemResolver
): boolean => {
	const action = getDropActionType(drag, target);
	if (action === 'invalid') return false;
	if (action === 'delete') return true;

	if (action === 'move' || action === 'stack') {
		return isAllowedInLocation(drag.item, target.location, resolve);
	}

	if (action === 'attach') {
		return canAttachToWeapon(drag.item, target.item!);
	}

	// swap: check both directions
	if (!isAllowedInLocation(drag.item, target.location, resolve)) return false;

	// source item from target must fit in the drag's source location
	if (drag.sourceLocation.type === 'attachment') return false;
	return isAllowedInLocation(target.item!, drag.sourceLocation, resolve);
};
