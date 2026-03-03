import { getStorageConfig } from '$lib/config/storages';
import { SvelteSet } from 'svelte/reactivity';
import { getDef } from '$lib/config/items';
import { getAttachmentSlotIndex } from './inventory-validation';
import { isEqualLocation } from '$lib/utils';

import type { OccupiedSlot, InstanceItem, ItemLocation, StorageId, DragState } from '$lib/types';

export class Inventory {
	items = $state<OccupiedSlot[]>([]);
	selectedIds = new SvelteSet<string>();

	backpack = $derived(
		this.items.filter((i) => i.location.type === 'container' && i.location.storageId === 'backpack')
	);
	lootBack = $derived(
		this.items.filter((i) => i.location.type === 'container' && i.location.storageId === 'lootBack')
	);
	weapon = $derived(
		this.items.filter((i) => i.location.type === 'container' && i.location.storageId === 'weapon')
	);

	constructor() {
		this.setup();
	}

	// ---- Universal accessors ----

	getItem(loc: ItemLocation): InstanceItem | null {
		if (loc.type === 'container') {
			const slot = this.items.find((i) => isEqualLocation(i.location, loc));
			return slot?.item ?? null;
		}
		// attachment: find parent in items, then index into attachments
		const parentSlot = this.items.find((i) => isEqualLocation(i.location, loc.parentLocation));
		if (!parentSlot?.item?.attachments) return null;
		return parentSlot.item.attachments[loc.attachIndex] ?? null;
	}

	private setItem(loc: ItemLocation, item: InstanceItem | null): void {
		if (loc.type === 'container') {
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
		if (item) this.selectedIds.delete(item.uid);
		this.setItem(loc, null);
	}

	// ---- Drop operations (called by Interaction) ----

	move(drag: DragState, targetLoc: ItemLocation): void {
		if (isEqualLocation(drag.sourceLocation, targetLoc)) return;

		if (drag.isSplit) {
			// Create clone with split count, decrement original
			const original = this.getItem(drag.sourceLocation);
			if (!original) return;

			const splitItem: InstanceItem = {
				uid: crypto.randomUUID(),
				defId: original.defId,
				count: drag.item.count
			};
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
		const targetItem = this.getItem(targetLoc);
		if (!targetItem) return;

		const def = getDef(drag.item.defId);
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

		// Remove attachment from source
		const sourceItem = this.getItem(drag.sourceLocation);
		if (!sourceItem) return;

		// Determine if source was also an attachment (cross-weapon swap)
		const isSourceAttachment = drag.sourceLocation.type === 'attachment';

		this.removeItem(drag.sourceLocation);

		// Attach new item
		if (weapon.attachments) {
			weapon.attachments[targetSlotIdx] = sourceItem;
		}

		// Return existing attachment to source location
		if (existingAttachment) {
			if (isSourceAttachment) {
				// Swap between weapons: put old attachment back in source attachment slot
				this.setItem(drag.sourceLocation, existingAttachment);
			} else {
				// From inventory: return to source container slot
				this.setItem(drag.sourceLocation, existingAttachment);
			}
		}
	}

	// ---- Context menu operations ----

	quickMove(loc: ItemLocation): boolean {
		if (loc.type !== 'container') return false;
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
		if (loc.type !== 'container') return false;
		const item = this.getItem(loc);
		if (!item) return false;

		const def = getDef(item.defId);
		if (!def.maxStack || item.count <= 1) return false;

		const emptySlot = this.getFirstEmptySlot(loc.storageId);
		if (!emptySlot) return false;

		const splitCount = Math.floor(item.count / 2);
		item.count -= splitCount;

		this.setItem(emptySlot, {
			uid: crypto.randomUUID(),
			defId: item.defId,
			count: splitCount
		});

		return true;
	}

	recycleItem(loc: ItemLocation): boolean {
		if (loc.type !== 'container') return false;
		const item = this.getItem(loc);
		if (!item) return false;

		const def = getDef(item.defId);
		if (!def.recycling) return false;

		const sourceStorageId = loc.storageId;
		const isEquipSlot =
			sourceStorageId === 'weapon' ||
			sourceStorageId === 'shield' ||
			sourceStorageId === 'augment';
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
				this.setItem(slot, {
					uid: crypto.randomUUID(),
					defId: result.itemId,
					count: result.amount * item.count
				});
			}
		}
		return true;
	}

	// ---- Utilities ----

	getFirstEmptySlot(storageId: StorageId): ItemLocation | null {
		const config = getStorageConfig(storageId);
		if (!config) return null;
		for (let i = 0; i < config.size; i++) {
			const loc: ItemLocation = { type: 'container', storageId, index: i };
			if (!this.getItem(loc)) return loc;
		}
		return null;
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

	isSelected(uid: string): boolean {
		return this.selectedIds.has(uid);
	}

	selectSingleItem(uid: string): void {
		this.selectedIds.clear();
		this.selectedIds.add(uid);
	}

	toggleSelectionItem(uid: string): void {
		if (this.selectedIds.has(uid)) {
			this.selectedIds.delete(uid);
		} else {
			this.selectedIds.add(uid);
		}
	}

	clearSelectionItem(): void {
		this.selectedIds.clear();
	}

	#countEmptySlots(storageId: StorageId): number {
		const config = getStorageConfig(storageId);
		if (!config) return 0;
		let count = 0;
		for (let i = 0; i < config.size; i++) {
			if (!this.getItem({ type: 'container', storageId, index: i })) count++;
		}
		return count;
	}

	setup(): void {
		// Weapon with pre-installed attachments (muzzle, underbarrel, magazine)
		const tempest = this.createItem('wpn_tempest');
		tempest.attachments![0] = this.createItem('att_compensator_2');
		tempest.attachments![1] = this.createItem('att_vertical_grip_1');
		tempest.attachments![2] = this.createItem('att_ext_medium_mag_2');

		// Weapon with one attachment (muzzle slot filled, magazine + stock empty)
		const renegade = this.createItem('wpn_renegade');
		renegade.attachments![0] = this.createItem('att_silencer_1');

		const initial: [ItemLocation, InstanceItem][] = [
			// Backpack: weapons
			[{ type: 'container', storageId: 'backpack', index: 0 }, tempest],
			[{ type: 'container', storageId: 'backpack', index: 1 }, renegade],
			[{ type: 'container', storageId: 'backpack', index: 2 }, this.createItem('wpn_kettle')],
			[{ type: 'container', storageId: 'backpack', index: 3 }, this.createItem('wpn_bobcat')],
			// Backpack: resources
			[
				{ type: 'container', storageId: 'backpack', index: 10 },
				this.createItem('res_arc_circuitry', 10)
			],
			// Loot: loose attachments (разные типы)
			[
				{ type: 'container', storageId: 'lootBack', index: 0 },
				this.createItem('att_compensator_3')
			],
			[
				{ type: 'container', storageId: 'lootBack', index: 1 },
				this.createItem('att_stable_stock_3')
			],
			[
				{ type: 'container', storageId: 'lootBack', index: 2 },
				this.createItem('att_angled_grip_3')
			],
			[
				{ type: 'container', storageId: 'lootBack', index: 3 },
				this.createItem('att_ext_light_mag_3')
			],
			[
				{ type: 'container', storageId: 'lootBack', index: 4 },
				this.createItem('att_muzzle_brake_2')
			],
			[
				{ type: 'container', storageId: 'lootBack', index: 5 },
				this.createItem('att_padded_stock')
			]
		];
		for (const [loc, item] of initial) {
			this.items.push({ location: loc, item });
		}
	}
}
