import { getGameContext } from '$lib/store/game.svelte';
import type { SlotState } from '$lib/types';

export function droppable(slot: SlotState) {
	return (node: HTMLElement) => {
		const { interaction } = getGameContext();
		const handleEnter = (e: PointerEvent) => {
			e.stopPropagation();
			e.preventDefault();
			interaction.setHoveredSlot(slot);
		};
		const handleLeave = () => interaction.clearHoveredSlot();
		node.addEventListener('pointerover', handleEnter);
		node.addEventListener('pointerleave', handleLeave);
		return () => {
			node.removeEventListener('pointerover', handleEnter);
			node.removeEventListener('pointerleave', handleLeave);
			interaction.clearHoveredSlot();
		};
	};
}

export function draggable(slot: SlotState) {
	return (node: HTMLElement) => {
		const { interaction } = getGameContext();
		const onDown = (e: PointerEvent) => interaction.startInteraction(slot, e, node);

		node.addEventListener('pointerdown', onDown);
		node.style.cursor = 'grab';
		node.style.touchAction = 'none';
		return () => node.removeEventListener('pointerdown', onDown);
	};
}
