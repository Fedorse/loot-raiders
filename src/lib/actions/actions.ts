import type { DropTarget } from '$lib/config/items';
import type { StoredItem } from '$lib/store/inventory-manger.svelte';
import { getGameContext } from '$lib/store/game.svelte';

export function droppable(dropTarget: DropTarget) {
	return (node: HTMLElement) => {
		const game = getGameContext();
		const handleEnter = (e: PointerEvent) => {
			e.stopPropagation();
			e.preventDefault();
			game.interaction.setDropTarget(dropTarget);
		};
		const handleLeave = () => game.interaction.clearDropTarget();
		node.addEventListener('pointerover', handleEnter);
		node.addEventListener('pointerleave', handleLeave);
		return () => {
			node.removeEventListener('pointerover', handleEnter);
			node.removeEventListener('pointerleave', handleLeave);
			game.interaction.clearDropTarget();
		};
	};
}

export function slotInteractions(storedItem: StoredItem) {
	return (node: HTMLElement) => {
		const { interaction } = getGameContext();
		const onDown = (e: PointerEvent) => interaction.handlePointerDown(storedItem, e, node);
		node.addEventListener('pointerdown', onDown);
		node.style.cursor = 'grab';
		node.style.touchAction = 'none';
		return () => node.removeEventListener('pointerdown', onDown);
	};
}
