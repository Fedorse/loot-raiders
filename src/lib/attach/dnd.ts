import type { ItemInstance, SlotReference } from '$lib/config/items';

import { getGameContext } from '$lib/store/game.svelte';

interface DropData {
	slotRef: SlotReference;
	storage: string;
	/** When provided (e.g. attachment slots), used instead of inventory.getItem(storage, position) */
	item?: ItemInstance | null;
}

interface DragData {
	item: ItemInstance | null;
	slotRef: SlotReference;
}

export function draggable(params: DragData) {
	return (node: HTMLElement) => {
		const { item, slotRef } = params;
		if (!item) return;

		const game = getGameContext();
		const { dnd } = game;

		const handlePointerDown = (e: PointerEvent) => {
			e.preventDefault();
			e.stopPropagation();
			dnd.startDrag(item, slotRef, e, node);
		};

		node.addEventListener('pointerdown', handlePointerDown);
		node.style.cursor = 'grab';
		node.style.touchAction = 'none';

		return () => node.removeEventListener('pointerdown', handlePointerDown);
	};
}

export function droppable(params: DropData) {
	return (node: HTMLElement) => {
		const { slotRef, storage, item: itemParam } = params;
		const game = getGameContext();
		const { dnd, inventory } = game;
		const item = itemParam !== undefined ? itemParam : inventory.getItem(storage, slotRef.position);
		const handleEnter = (e: PointerEvent) => {
			e.stopPropagation();
			e.preventDefault();
			dnd.setTarget(slotRef, storage, item);
		};

		const handleLeave = () => {
			dnd.clearTarget(slotRef);
		};

		node.addEventListener('pointerover', handleEnter);
		node.addEventListener('pointerleave', handleLeave);

		return () => {
			node.removeEventListener('pointerover', handleEnter);
			node.removeEventListener('pointerleave', handleLeave);
			dnd.clearTarget(slotRef);
		};
	};
}
