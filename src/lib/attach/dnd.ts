import type { Attachment } from 'svelte/attachments';
import type { DndManager } from '$lib/store/dnd-manger.svelte';
import type { ItemInstance, ItemType, SlotReference } from '$lib/config/items';

export function draggable(
	item: ItemInstance | null,
	slotRef: SlotReference,
	dndManager: DndManager
): Attachment {
	return (node: Element) => {
		if (!item) return;

		const el = node as HTMLElement;

		const handleDown = (e: PointerEvent) => {
			e.preventDefault();
			e.stopPropagation();
			dndManager.startDrag(item, slotRef, e, el);
		};
		el.addEventListener('pointerdown', handleDown);
		el.style.touchAction = 'none'; // disable browser touch actions
		el.style.cursor = 'grab';

		return () => {
			el.removeEventListener('pointerdown', handleDown);
		};
	};
}

export function droppable(
	targetRef: SlotReference,
	allowedTypes: ItemType[],
	dndManager: DndManager
): Attachment {
	return (node: Element) => {
		const handleEnter = () => {
			dndManager.hover(targetRef, allowedTypes);
		};
		const handleLeave = () => {
			dndManager.leave();
		};
		node.addEventListener('pointerenter', handleEnter);
		node.addEventListener('pointerleave', handleLeave);

		return () => {
			node.removeEventListener('pointerenter', handleEnter);
			node.removeEventListener('pointerleave', handleLeave);
		};
	};
}
