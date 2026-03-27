import { getStorageConfig } from '$lib/config/storages';
import { getDef } from '$lib/config/items';
import { getAttachmentSlotIndex } from '../inventory-validation';
import { isEqualLocation } from '$lib/utils';
import type { Selection } from './selection.svelte';

import type { OccupiedSlot, InstanceItem, ItemLocation, StorageId, DragState } from '$lib/types';

export class Inventory {
	items = $state<OccupiedSlot[]>([]);
	private selection: Selection;

	constructor(selection: Selection) {
		this.selection = selection;
	}

	// ---- Read accessors ----

	getItem(loc: ItemLocation): InstanceItem | null {
		if (loc.type === 'trash') return null;
		if (loc.type === 'slot') {
			const slot = this.items.find((i) => isEqualLocation(i.location, loc));
			return slot?.item ?? null;
		}
		// attachment: find parent in items, then index into attachments
		const parentSlot = this.items.find((i) => isEqualLocation(i.location, loc.parentLocation));
		if (!parentSlot?.item?.attachments) return null;
		return parentSlot.item.attachments[loc.attachIndex] ?? null;
	}

	getFirstEmptySlot(storageId: StorageId): ItemLocation | null {
		const config = getStorageConfig(storageId);
		if (!config) return null;
		for (let i = 0; i < config.size; i++) {
			const loc: ItemLocation = { type: 'slot', storageId, index: i };
			if (!this.getItem(loc)) return loc;
		}
		return null;
	}

	countAvailable(defId: string): number {
		return this.items
			.filter(
				(slot) =>
					slot.location.type === 'slot' &&
					slot.location.storageId !== 'lootBack' &&
					slot.item.defId === defId &&
					!slot.item.match
			)
			.reduce((sum, slot) => sum + slot.item.count, 0);
	}

	#countEmptySlots(storageId: StorageId): number {
		const config = getStorageConfig(storageId);
		if (!config) return 0;
		let count = 0;
		for (let i = 0; i < config.size; i++) {
			if (!this.getItem({ type: 'slot', storageId, index: i })) count++;
		}
		return count;
	}

	// ---- Write accessors ----

	private setItem(loc: ItemLocation, item: InstanceItem | null): void {
		if (loc.type === 'trash') return;
		if (loc.type === 'slot') {
			if (item === null) {
				const idx = this.items.findIndex((i) => isEqualLocation(i.location, loc));
				if (idx !== -1) this.items.splice(idx, 1);
			} else {
				const existing = this.items.find((i) => isEqualLocation(i.location, loc));
				if (existing) {
					existing.item = item;
				} else {
					this.items.push({ location: loc, item });
				}
			}
			return;
		}
		// attachment: find parent in items, then set on attachments array
		const parentSlot = this.items.find((i) => isEqualLocation(i.location, loc.parentLocation));
		if (!parentSlot?.item?.attachments) return;
		parentSlot.item.attachments[loc.attachIndex] = item;
	}

	removeItem(loc: ItemLocation): void {
		const item = this.getItem(loc);
		if (item) this.selection.deselect(item.uid);
		this.setItem(loc, null);
	}

	// ---- Domain operations: drop (called by Interaction) ----

	move(drag: DragState, targetLoc: ItemLocation): void {
		if (isEqualLocation(drag.sourceLocation, targetLoc)) return;

		if (drag.isSplit) {
			const original = this.getItem(drag.sourceLocation);
			if (!original) return;

			const splitItem = this.createItem(original.defId, drag.item.count);
			original.count -= drag.item.count;
			this.setItem(targetLoc, splitItem);
		} else {
			const item = this.getItem(drag.sourceLocation);
			if (!item) return;
			this.removeItem(drag.sourceLocation);
			this.setItem(targetLoc, item);
		}
	}

	stack(drag: DragState, targetLoc: ItemLocation): void {
		if (isEqualLocation(drag.sourceLocation, targetLoc)) return;
		const targetItem = this.getItem(targetLoc);
		if (!targetItem) return;

		const def = getDef(drag.item.defId);
		// Caller (Interaction) guarantees maxStack exists via canStackItems validation
		const maxStack = def.maxStack!;
		const total = drag.item.count + targetItem.count;

		if (drag.isSplit) {
			const original = this.getItem(drag.sourceLocation);
			if (!original) return;

			if (total <= maxStack) {
				targetItem.count = total;
				original.count -= drag.item.count;
			} else {
				const diffToMax = maxStack - targetItem.count;
				targetItem.count = maxStack;
				original.count -= diffToMax;
			}
		} else {
			if (total <= maxStack) {
				targetItem.count = total;
				this.removeItem(drag.sourceLocation);
			} else {
				targetItem.count = maxStack;
				const sourceItem = this.getItem(drag.sourceLocation);
				if (sourceItem) sourceItem.count = total - maxStack;
			}
		}
	}

	swap(drag: DragState, targetLoc: ItemLocation): void {
		if (isEqualLocation(drag.sourceLocation, targetLoc)) return;
		const sourceItem = this.getItem(drag.sourceLocation);
		const targetItem = this.getItem(targetLoc);
		if (!sourceItem || !targetItem) return;

		this.removeItem(drag.sourceLocation);
		this.removeItem(targetLoc);
		this.setItem(targetLoc, sourceItem);
		this.setItem(drag.sourceLocation, targetItem);
	}

	attach(drag: DragState, weaponLoc: ItemLocation): void {
		const weapon = this.getItem(weaponLoc);
		if (!weapon) return;

		const targetSlotIdx = getAttachmentSlotIndex(drag.item, weapon);
		if (targetSlotIdx === -1) return;

		const existingAttachment = weapon.attachments?.[targetSlotIdx] ?? null;

		if (drag.isSplit) return; // Can't attach a split

		const sourceItem = this.getItem(drag.sourceLocation);
		if (!sourceItem) return;

		this.removeItem(drag.sourceLocation);

		if (weapon.attachments) {
			weapon.attachments[targetSlotIdx] = sourceItem;
		}

		// Return existing attachment to source location (works for both inventory and cross-weapon swaps)
		if (existingAttachment) {
			this.setItem(drag.sourceLocation, existingAttachment);
		}
	}

	// ---- Domain operations: context actions ----

	quickMove(loc: ItemLocation): boolean {
		if (loc.type !== 'slot') return false;
		const config = getStorageConfig(loc.storageId);
		const targetId = config?.quickMoveTarget;
		if (!targetId) return false;
		const emptySlot = this.getFirstEmptySlot(targetId);
		if (!emptySlot) return false;

		const item = this.getItem(loc);
		if (!item) return false;
		this.removeItem(loc);
		this.setItem(emptySlot, item);
		return true;
	}

	splitStack(loc: ItemLocation): boolean {
		if (loc.type !== 'slot') return false;
		const item = this.getItem(loc);
		if (!item) return false;

		const def = getDef(item.defId);
		if (!def.maxStack || item.count <= 1) return false;

		const emptySlot = this.getFirstEmptySlot(loc.storageId);
		if (!emptySlot) return false;

		const splitCount = Math.floor(item.count / 2);
		item.count -= splitCount;

		this.setItem(emptySlot, this.createItem(item.defId, splitCount));

		return true;
	}

	recycleItem(loc: ItemLocation): boolean {
		if (loc.type !== 'slot') return false;
		const item = this.getItem(loc);
		if (!item) return false;

		const def = getDef(item.defId);
		if (!def.recycling) return false;

		const sourceStorageId = loc.storageId;
		const isEquipSlot =
			sourceStorageId === 'weapon' || sourceStorageId === 'shield' || sourceStorageId === 'augment';
		const targetStorageId = isEquipSlot ? 'backpack' : sourceStorageId;

		const attachments: InstanceItem[] =
			item.attachments?.filter((a): a is InstanceItem => a !== null) ?? [];

		const slotsNeeded = def.recycling.length + attachments.length;
		const emptySlots = this.#countEmptySlots(targetStorageId);
		const availableSlots = emptySlots + 1;

		if (slotsNeeded > availableSlots) return false;

		this.removeItem(loc);

		for (const att of attachments) {
			const slot = this.getFirstEmptySlot(targetStorageId);
			if (slot) this.setItem(slot, att);
		}

		for (const result of def.recycling) {
			const slot = this.getFirstEmptySlot(targetStorageId);
			if (slot) {
				this.setItem(slot, this.createItem(result.itemId, result.amount * item.count));
			}
		}
		return true;
	}

	// ---- Domain operations: match (called by GameLoop / track-item) ----

	// Sets match=true even on partial consumption — this is intentional:
	// the flag triggers the UI scan animation while count may still be > 0
	consumeMatched(defId: string, count: number): void {
		let remaining = count;

		for (let i = this.items.length - 1; i >= 0; i--) {
			if (remaining <= 0) break;

			const slot = this.items[i];
			if (slot.location.type !== 'slot') continue;
			if (slot.location.storageId === 'lootBack') continue;
			if (slot.item.defId !== defId) continue;

			if (slot.item.count <= remaining) {
				remaining -= slot.item.count;
				slot.item.count = 0;
				slot.item.match = true;
			} else {
				slot.item.count -= remaining;
				slot.item.match = true;
				remaining = 0;
			}
		}
	}

	// If fully consumed (count <= 0): remove from inventory.
	// If partially consumed (count > 0): clear match flag so the item remains usable.
	removeMatch(uid: string): void {
		const idx = this.items.findIndex((i) => i.item.uid === uid);
		if (idx === -1) return;
		if (this.items[idx].item.count <= 0) {
			this.selection.deselect(uid);
			this.items.splice(idx, 1);
		} else {
			this.items[idx].item.match = false;
		}
	}

	// ---- Helper / internal utilities ----

	clearStorage(storageId: StorageId): void {
		this.items = this.items.filter((slot) => {
			if (slot.location.type === 'slot' && slot.location.storageId === storageId) {
				this.selection.deselect(slot.item.uid);
				return false;
			}
			return true;
		});
	}

	fillStorage(storageId: StorageId, newItems: InstanceItem[]): void {
		for (const item of newItems) {
			const loc = this.getFirstEmptySlot(storageId);
			if (!loc) break;
			this.setItem(loc, item);
		}
	}

	createItem(defId: string, count = 1): InstanceItem {
		const def = getDef(defId);
		const item: InstanceItem = {
			uid: crypto.randomUUID(),
			defId,
			count
		};
		if (def.attachmentSlots) {
			item.attachments = def.attachmentSlots.map(() => null);
		}
		return item;
	}
}
