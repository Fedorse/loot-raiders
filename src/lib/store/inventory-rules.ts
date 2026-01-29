import { getDef, type ItemInstance, type ItemCategory } from '$lib/config/items';


export const canPlace = (item: ItemInstance | null, allowedTypes: ItemCategory[]): boolean => {
	if (!item) return false;
	if (!allowedTypes || allowedTypes.length === 0) return true;
	const def = getDef(item.defId);
	return allowedTypes.includes(def.type);
};

export const canAttach = (item: ItemInstance | null, targetItem: ItemInstance | null): boolean => {
	if (!item || !targetItem) return false;
	const itemDef = getDef(item.defId);
	const targetDef = getDef(targetItem.defId);
	return targetDef.attachmentSlots?.some((slot) => slot.type === itemDef.type) ?? false;
};
