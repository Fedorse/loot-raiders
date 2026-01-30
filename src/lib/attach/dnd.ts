import type { ItemInstance, SlotReference, ItemCategory, ItemType } from '$lib/config/items';
import type { DndManager } from '$lib/store/dnd-manger.svelte';

interface DropData {
	item: ItemInstance | null;
	slotRef: SlotReference;
	allowedTypes: ItemType[];
	dnd: DndManager;
}

interface DragData {
	item: ItemInstance | null;
	slotRef: SlotReference;
	dnd: DndManager;
}

export function draggable(params: DragData) {
	return (node: HTMLElement) => {
		const { item, slotRef, dnd } = params;
		if (!item) return;

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
		const { item, slotRef, allowedTypes, dnd } = params;
		const handleEnter = (e: PointerEvent) => {
			e.stopPropagation();
			e.preventDefault();
			dnd.setTarget(slotRef, allowedTypes, item);
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
