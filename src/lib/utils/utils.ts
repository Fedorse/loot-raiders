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
		// For attachments, slot.type is AttachmentType; match by attachmentKind
		return (
			targetDef.attachmentSlots?.some(
				(slot) => draggedDef.type === 'attachment' && draggedDef.attachmentKind === slot.type
			) ?? false
		);
	}
	return false;
};
