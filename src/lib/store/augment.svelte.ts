import { getDef } from '$lib/config/items';
import { getRarityStyleTooltip } from '$lib/config/rarity';
import { getAugmentUpgrade, getAugmentLevel } from '$lib/config/augments';
import type { Inventory } from './inventory.svelte';
import type { Overlay } from './overlay.svelte';

export class Augment {
	private inventory: Inventory;
	private overlay: Overlay;

	constructor(inventory: Inventory, overlay: Overlay) {
		this.inventory = inventory;
		this.overlay = overlay;
	}

	info = $derived.by(() => {
		const augment = this.inventory.augmentItem;
		if (!augment) return null;

		const def = getDef(augment.defId);
		const style = getRarityStyleTooltip(def.rarity);
		const level = getAugmentLevel(augment.defId);

		const upgradeAugment = getAugmentUpgrade(augment.defId);

		if (!upgradeAugment) {
			return { def, style, level, isMaxLevel: true as const };
		}

		const nextDef = getDef(upgradeAugment.nextDefId);
		const nextStyle = getRarityStyleTooltip(nextDef.rarity);
		const costDef = getDef(upgradeAugment.materials.defId);
		const costHave = this.inventory.countAvailable(upgradeAugment.materials.defId);
		const canAfford = costHave >= upgradeAugment.materials.count;
		const futureBackpackSlots =
			this.inventory.getStorageSize('backpack') + upgradeAugment.bonusSlots;

		return {
			def,
			style,
			level,
			isMaxLevel: false as const,
			upgradeAugment,
			nextDef,
			nextStyle,
			costDef,
			costHave,
			canAfford,
			futureBackpackSlots
		};
	});

	doUpgrade(): void {
		const data = this.info;
		if (!data || data.isMaxLevel || !data.canAfford) return;

		const { materials, nextDefId } = data.upgradeAugment;

		this.inventory.consumeItems(materials.defId, materials.count);
		this.inventory.removeItem({ type: 'slot', storageId: 'augment', index: 0 });
		this.inventory.fillStorage('augment', [this.inventory.createItem(nextDefId)]);
		this.overlay.closeAugmentUpgrade();
	}
}
