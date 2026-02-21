import { getGameContext } from '$lib/store/game.svelte';
import type { DropTarget, StoredItem, SlotRef, InstanceItem } from '$lib/types';

export function droppable(dropTarget: DropTarget) {
	return (node: HTMLElement) => {
		const { interaction } = getGameContext();
		const handleEnter = (e: PointerEvent) => {
			e.stopPropagation();
			e.preventDefault();
			interaction.setDropTarget(dropTarget);
		};
		const handleLeave = () => interaction.clearDropTarget();
		node.addEventListener('pointerover', handleEnter);
		node.addEventListener('pointerleave', handleLeave);
		return () => {
			node.removeEventListener('pointerover', handleEnter);
			node.removeEventListener('pointerleave', handleLeave);
			interaction.clearDropTarget();
		};
	};
}

export function slotInteractions(storedItem: StoredItem) {
	return (node: HTMLElement) => {
		const { interaction } = getGameContext();
		const payload = { source: 'inventory_slot', storedItem } as const;
		const onDown = (e: PointerEvent) => interaction.startInteraction(payload, e, node);

		node.addEventListener('pointerdown', onDown);
		node.style.cursor = 'grab';
		node.style.touchAction = 'none';
		return () => node.removeEventListener('pointerdown', onDown);
	};
}

export function attachmentInteractions(
	weaponSlotRef: SlotRef,
	attachIndex: number,
	attachment: InstanceItem
) {
	return (node: HTMLElement) => {
		const { interaction } = getGameContext();
		const payload = {
			source: 'weapon_attachment',
			attachmentRef: { weaponSlotRef, attachIndex },
			item: attachment
		} as const;

		const onDown = (e: PointerEvent) => interaction.startInteraction(payload, e, node);

		node.addEventListener('pointerdown', onDown);
		node.style.cursor = 'grab';
		node.style.touchAction = 'none';
		return () => node.removeEventListener('pointerdown', onDown);
	};
}
