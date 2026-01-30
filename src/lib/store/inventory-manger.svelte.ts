import { getDef, type ItemInstance, type SlotReference } from '$lib/config/items';

export class InventoryManager {
	backpack = $state<(ItemInstance | null)[]>(Array(5).fill(null));
	lootBack = $state<(ItemInstance | null)[]>(Array(20).fill(null));
	weapon = $state<(ItemInstance | null)[]>(Array(2).fill(null));
	equipment = $state<(ItemInstance | null)[]>(Array(2).fill(null));

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

	handleDrop(source: SlotReference, target: SlotReference, draggedItem: ItemInstance) {
		if (source.collection === target.collection && source.index === target.index) return;

		const sourceItem = source.collection[source.index];
		const targetItem = target.collection[target.index];

		if (this.tryAttach(source, target, sourceItem, targetItem)) return;
		if (targetItem) {
			const stackResult = this.tryStack(source, target, sourceItem, targetItem);
			if (stackResult) return;
		}

		this.swap(source, target, draggedItem, targetItem);
	}

	swap(
		source: SlotReference,
		target: SlotReference,
		sourceItem: ItemInstance,
		targetItem: ItemInstance | null
	) {
		target.collection[target.index] = sourceItem;
		source.collection[source.index] = targetItem;
	}
	tryStack(
		source: SlotReference,
		target: SlotReference,
		sourceItem: ItemInstance,
		targetItem: ItemInstance
	): boolean {
		if (sourceItem.defId !== targetItem.defId) return false;
		const def = getDef(sourceItem.defId);
		const maxStack = def.maxStack ?? 1;
		if (maxStack <= 1) return false;
		if (targetItem.count >= maxStack) return false;
		const spaceAvailable = maxStack - targetItem.count;
		const amountToMove = Math.min(spaceAvailable, sourceItem.count);
		targetItem.count += amountToMove;
		sourceItem.count -= amountToMove;
		if (sourceItem.count <= 0) {
			source.collection[source.index] = null;
		}
		return true;
	}

	tryAttach(
		source: SlotReference,
		target: SlotReference,
		sourceItem: ItemInstance,
		targetItem: ItemInstance
	): boolean {
		if (targetItem === null) return false;
		if (target.collection !== this.weapon) return;

		const sourceDef = getDef(sourceItem.defId);
		const targetDef = getDef(targetItem.defId);

		const slotIndex = targetDef.attachmentSlots?.findIndex((s) => s.type === sourceDef.type);
		if (slotIndex == null || slotIndex < 0) return false;
		const old = targetItem.attachments[slotIndex] ?? null;
		targetItem.attachments[slotIndex] = sourceItem;
		source.collection[source.index] = old;
		return true;
	}

	setup() {
		this.backpack[0] = this.createItem('res_arc_circuitry', 10);
		this.backpack[10] = this.createItem('res_arc_circuitry', 5);
		this.backpack[1] = this.createItem('eqp_tactical_mk1');
		this.backpack[2] = this.createItem('wpn_kettle');
		this.backpack[3] = this.createItem('wpn_bobcat');
		this.lootBack[0] = this.createItem('att_compensator_1');
		this.lootBack[1] = this.createItem('att_stable_stock_1');

		this.equipment[0] = this.createItem('eqp_tactical_mk1');
	}
}
