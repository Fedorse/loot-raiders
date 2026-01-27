import { setContext, getContext } from 'svelte';

import { getDef, type ItemInstance, type SlotReference } from '$lib/config/items';

export type ItemType = 'loot' | 'weapon' | 'augment' | 'shield' | 'attachment';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Item {
	id: string;
	type: ItemType;
	rare: ItemRarity;
	image?: string;
	count?: number;
	attachments?: (Item | null)[];
	category: {
		icon: string;
		type: string;
	};
}

class InventoryManager {
	backpack = $state<(ItemInstance | null)[]>(Array(5).fill(null));
	lootBack = $state<(ItemInstance | null)[]>(Array(20).fill(null));
	weaponSlots = $state<(ItemInstance | null)[]>(Array(2).fill(null));
	equipmentSlots = $state<(ItemInstance | null)[]>(Array(2).fill(null));

	constructor() {
		this.setup();
	}

	createItem(defId: string, count = 1): ItemInstance {
		const def = getDef(defId);
		const item: ItemInstance = {
			uid: crypto.randomUUID(),
			defId,
			count
		};

		if (def.type === 'weapon' && def.attachmentSlots) {
			item.attachments = new Array(def.attachmentSlots.length).fill(null);
		}
		return item;
	}

	handleDrop(source: SlotReference, target: SlotReference) {
		if (source.collection === target.collection && source.index === target.index) return;

		const sourceItem = source.collection[source.index];
		const targetItem = target.collection[target.index];

		// weapon_attachment
		if (targetItem && target.collection === this.weaponSlots) {
			const sourceDef = getDef(sourceItem.defId);
			const targetDef = getDef(targetItem.defId);
			const slotIndex = targetDef.attachmentSlots?.findIndex((s) => s.type === sourceDef.type);

			if (slotIndex !== undefined && slotIndex !== -1) {
				const oldAttch = targetItem.attachments[slotIndex];
				targetItem.attachments[slotIndex] = sourceItem;
				source.collection[source.index] = oldAttch;
				return;
			}
		}

		target.collection[target.index] = sourceItem;
		source.collection[source.index] = targetItem;
	}

	setup() {
		this.backpack[0] = this.createItem('res_arc_circuitry', 50);
		this.backpack[1] = this.createItem('eqp_tactical_mk1');
		this.backpack[2] = this.createItem('wpn_kettle');
		this.backpack[3] = this.createItem('wpn_bobcat');
		this.lootBack[0] = this.createItem('att_compensator_1');
		this.lootBack[1] = this.createItem('att_stable_stock_1');

		this.equipmentSlots[0] = this.createItem('eqp_tactical_mk1');
	}
}

const INV_KEY = Symbol('inventory');
export function setInventory() {
	return setContext(INV_KEY, new InventoryManager());
}
export function useInventory() {
	return getContext<InventoryManager>(INV_KEY);
}
