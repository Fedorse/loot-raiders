import type { StoredItem } from '$lib/store/inventory-manger.svelte';
import type { DropTarget } from '$lib/config/items';
import { getGameContext } from '$lib/store/game.svelte';

export function draggable(stored: StoredItem) {
	return (node: HTMLElement) => {
		const game = getGameContext();
		const handlePointerDown = (e: PointerEvent) => {
			e.preventDefault();
			e.stopPropagation();
			game.dnd.startDrag(stored, e, node);
		};
		node.addEventListener('pointerdown', handlePointerDown);
		node.style.cursor = 'grab';
		node.style.touchAction = 'none';
		return () => node.removeEventListener('pointerdown', handlePointerDown);
	};
}

export function droppable(dropTarget: DropTarget) {
	return (node: HTMLElement) => {
		const game = getGameContext();
		const handleEnter = (e: PointerEvent) => {
			e.stopPropagation();
			e.preventDefault();
			game.dnd.setDropTarget(dropTarget);
		};
		const handleLeave = () => game.dnd.clearDropTarget(dropTarget);
		node.addEventListener('pointerover', handleEnter);
		node.addEventListener('pointerleave', handleLeave);
		return () => {
			node.removeEventListener('pointerover', handleEnter);
			node.removeEventListener('pointerleave', handleLeave);
			game.dnd.clearDropTarget(dropTarget);
		};
	};
}
