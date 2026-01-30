import { type ItemInstance, type SlotReference, type ItemCategory } from '$lib/config/items';
import * as Rules from '$lib/store/inventory-rules';

export class DndManager {
	isDragging = $state(false);
	isValidDrop = $state(false);
	draggedItem = $state<ItemInstance | null>(null);
	source = $state<SlotReference | null>(null);
	target = $state<SlotReference | null>(null);
	pointer = $state({ x: 0, y: 0 });
	offset = $state({ x: 0, y: 0 });

	constructor(
		private onDropAction: (
			source: SlotReference,
			target: SlotReference,
			draggedItem: ItemInstance
		) => void
	) {}

	startDrag(item: ItemInstance, source: SlotReference, e: PointerEvent, node: HTMLElement) {
		const rect = node.getBoundingClientRect();

		this.isDragging = true;
		this.draggedItem = item;
		this.source = source;

		this.pointer = { x: e.clientX, y: e.clientY };
		this.offset = {
			x: (e.clientX - rect.left) / rect.width,
			y: (e.clientY - rect.top) / rect.height
		};

		window.addEventListener('pointermove', this.handlePointerMove);
		window.addEventListener('pointerup', this.endDrag);
	}

	private handlePointerMove = (e: PointerEvent) => {
		this.pointer = { x: e.clientX, y: e.clientY };
	};

	private endDrag = () => {
		if (this.isValidDrop) {
			this.onDropAction(this.source, this.target, this.draggedItem);
		}
		this.reset();
	};

	isSource(slotRef: SlotReference) {
		return this.source?.collection === slotRef.collection && this.source.index === slotRef.index;
	}

	canAccept(collection: ItemCategory[], targetItem: ItemInstance | null) {
		return (
			Rules.canPlace(this.draggedItem, collection) || Rules.canAttach(this.draggedItem, targetItem)
		);
	}

	setTarget(targetItem: SlotReference, collection: ItemCategory[], item: ItemInstance | null) {
		if (!this.isDragging) return;
		this.target = targetItem;
		this.isValidDrop = this.canAccept(collection, item);
	}

	clearTarget(ref?: SlotReference) {
		if (ref && this.target !== ref) return;
		this.target = null;
		this.isValidDrop = false;
	}

	private reset() {
		this.isDragging = false;
		this.draggedItem = null;
		this.source = null;
		this.target = null;
		this.isValidDrop = false;
		window.removeEventListener('pointermove', this.handlePointerMove);
		window.removeEventListener('pointerup', this.endDrag);
	}
}
