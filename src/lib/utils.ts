import type { AttachmentSlot, SlotRef, StorageSlot } from './config/items';
export function isAttachment(slot: SlotRef): slot is AttachmentSlot {
	return 'attachIndex' in slot;
}

export function isBaseSlot(slot: SlotRef): slot is StorageSlot {
	return !('attachIndex' in slot);
}
