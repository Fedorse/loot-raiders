import { getDef, type ItemCategory, type ItemInstance } from '$lib/config/items';

export const chekValidation = (item: ItemInstance, category: ItemCategory[]): boolean => {
	const def = getDef(item.defId);
	if (category.includes(def.type)) return true;
	if (def.type === 'attachment' && category.includes(def.attachmentType)) {
		if (category.includes(def.attachmentType)) return true;
	}
	return false;
};
