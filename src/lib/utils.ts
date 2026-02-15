import type { AttachmentSlot, SlotRef, StorageSlot, ItemInstance } from './config/items';
import { getDef } from './config/items';
export function isAttachment(slot: SlotRef): slot is AttachmentSlot {
	return 'attachIndex' in slot;
}

export function isBaseSlot(slot: SlotRef): slot is StorageSlot {
	return !('attachIndex' in slot);
}

export function isWeapon(item: ItemInstance | null): boolean {
	if (!item) return false;
	const def = getDef(item.defId);
	return def.type === 'weapon';
}
