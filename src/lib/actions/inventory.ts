import type { StoredItem } from '$lib/store/inventory-manger.svelte';
import type { DropTarget, SlotRef } from '$lib/config/items';
import { getGameContext } from '$lib/store/game.svelte';
import { isEqual } from 'es-toolkit';

const DBL_TAP_MS = 350;
let lastTap: { slotRef: SlotRef; time: number } | null = null;

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
		const handleLeave = () => game.dnd.clearDropTarget();
		node.addEventListener('pointerover', handleEnter);
		node.addEventListener('pointerleave', handleLeave);
		return () => {
			node.removeEventListener('pointerover', handleEnter);
			node.removeEventListener('pointerleave', handleLeave);
			game.dnd.clearDropTarget();
		};
	};
}

export function quickActions(stored: StoredItem) {
	return (node: HTMLElement) => {
		const { inventory } = getGameContext();
		const slotRef = stored.storage;

		const handlePointerDown = (e: PointerEvent) => {
			const now = Date.now();
			const isDoubleTap =
				lastTap && isEqual(lastTap.slotRef, slotRef) && now - lastTap.time < DBL_TAP_MS;
			lastTap = { slotRef, time: now };

			if (e.shiftKey || isDoubleTap) {
				e.preventDefault();
				e.stopPropagation();
				inventory.quickMove(stored);
				return;
			}
		};

		// capture: true — срабатываем раньше draggable, тогда успеваем отменить драг
		node.addEventListener('pointerdown', handlePointerDown, { capture: true });
		return () => node.removeEventListener('pointerdown', handlePointerDown, { capture: true });
	};
}
