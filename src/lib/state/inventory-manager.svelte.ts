import { setContext, getContext } from 'svelte';
import { dndState } from '@thisux/sveltednd';

export type ItemType = 'loot' | 'weapon' | 'augment' | 'shield' | 'attachment';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Item {
	id: string;
	type: ItemType;
	rare: ItemRarity;
	image?: string;
	count?: number;
	attachments?: (Item | null)[];
}

interface SlotRef {
	collection: (Item | null)[];
	index: number;
	allowedTypes: ItemType[];
}

class InventoryManager {
	backpack = $state<(Item | null)[]>(Array(14).fill(null));
	lootBack = $state<(Item | null)[]>(Array(20).fill(null));
	weaponSlots = $state<(Item | null)[]>(Array(2).fill(null));
	equipmentSlots = $state<(Item | null)[]>(Array(2).fill(null));

	private registry = new Map<string, SlotRef>();

	setup(data: {
		backpack?: (Item | null)[];
		lootBack?: (Item | null)[];
		weapons?: (Item | null)[];
		equipment?: (Item | null)[];
	}) {
		if (data.backpack) this.backpack = data.backpack;
		if (data.lootBack) this.lootBack = data.lootBack;
		if (data.weapons) this.weaponSlots = data.weapons;
		if (data.equipment) this.equipmentSlots = data.equipment;
	}

	registerSlot(id: string, ref: SlotRef) {
		this.registry.set(id, ref);

		return () => this.registry.delete(id);
	}

	canMove(sourceId: string, targetId: string) {
		const source = this.registry.get(sourceId);
		const target = this.registry.get(targetId);
		if (!source || !target) return false;

		const item = source.collection[source.index];
		if (!item) return false;

		return target.allowedTypes.includes(item.type);
	}

	swap(sourceId: string, targetId: string) {
		const source = this.registry.get(sourceId);
		const target = this.registry.get(targetId);

		if (source && target && this.canMove(sourceId, targetId)) {
			const temp = target.collection[target.index];
			target.collection[target.index] = source.collection[source.index];
			source.collection[source.index] = temp;
		}
	}
	clearDragState() {
		dndState.invalidDrop = false;
	}
}

const INV_KEY = Symbol('inventory');
export function setInventory() {
	return setContext(INV_KEY, new InventoryManager());
}
export function useInventory() {
	return getContext<InventoryManager>(INV_KEY);
}
