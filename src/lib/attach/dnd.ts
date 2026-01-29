// lib/attach/dnd.ts
import type { ItemInstance, SlotReference, ItemCategory } from '$lib/config/items';
import type { DndManager } from '$lib/store/dnd-manger.svelte';

export function draggable(item: ItemInstance | null, slotRef: SlotReference, dnd: DndManager) {
	return (node: HTMLElement) => {
		if (!item) return;

		const handleDown = (e: PointerEvent) => {
			e.preventDefault();
			e.stopPropagation();
			dnd.startDrag(item, slotRef, e, node);
		};

		node.addEventListener('pointerdown', handleDown);
		node.style.cursor = 'grab';
		node.style.touchAction = 'none';

		return () => node.removeEventListener('pointerdown', handleDown);
	};
}

export function droppable(
	slotRef: SlotReference,
	allowedTypes: ItemCategory[],
	dnd: DndManager,
	currentItem: ItemInstance | null
) {
	return (node: HTMLElement) => {
		const handleEnter = (e: PointerEvent) => {
			e.stopPropagation();
			e.preventDefault();
			dnd.setTarget(slotRef, allowedTypes, currentItem);
		};

		const handleLeave = () => {
			dnd.clearTarget(slotRef);
		};

		node.addEventListener('pointerover', handleEnter);
		node.addEventListener('pointerleave', handleLeave);

		return () => {
			node.removeEventListener('pointerover', handleEnter);
			node.removeEventListener('pointerleave', handleLeave);
		};
	};
}
