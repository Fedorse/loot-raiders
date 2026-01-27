import { getDef, type ItemCategory, type ItemInstance } from '$lib/config/items';

export const checkValidation = (
	draggedItem: ItemInstance,
	slotCattegories: ItemCategory[],
	targetItem?: ItemInstance
) => {
	if (!draggedItem) return false;

	const draggedDef = getDef(draggedItem.defId);

	if (slotCattegories.includes(draggedDef.type)) return true;

	if (targetItem) {
		const targetDef = getDef(targetItem.defId);
		return targetDef.attachmentSlots?.some((slot) => slot.type === draggedDef.type) ?? false;
	}
	return false;
};
