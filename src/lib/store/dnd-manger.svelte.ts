import { type ItemInstance, type SlotReference, type ItemCategory } from '$lib/config/items';
import * as Rules from '$lib/store/inventory-rules';
import { getDef } from '$lib/config/items';

interface DragState {
	isDragging: boolean;
	item: ItemInstance | null; // Что тащим (DraggedItem)
	source: SlotReference | null; // Откуда тащим
	target: SlotReference | null; // Над чем висим (TargetSlot)
	isValidDrop: boolean;
	pointer: { x: number; y: number };
	offset: { x: number; y: number };
}

export class DndManager {
	state = $state<DragState>({
		isDragging: false,
		item: null,
		source: null,
		target: null,
		isValidDrop: false,
		pointer: { x: 0, y: 0 },
		offset: { x: 0, y: 0 }
	});

	constructor(private onDropAction: (source: SlotReference, target: SlotReference) => void) {}

	startDrag(item: ItemInstance, source: SlotReference, e: PointerEvent, element: HTMLElement) {
		const rect = element.getBoundingClientRect();

		this.state.isDragging = true;
		this.state.item = item;
		this.state.source = source;
		this.state.pointer = { x: e.clientX, y: e.clientY };
		this.state.offset = {
			x: (e.clientX - rect.left) / rect.width,
			y: (e.clientY - rect.top) / rect.height
		};
		this.state.isValidDrop = true;

		window.addEventListener('pointermove', this.onPointerMove);
		window.addEventListener('pointerup', this.onPointerUp);
	}

	setTarget(ref: SlotReference, categories: ItemCategory[], currentItem: ItemInstance | null) {
		if (!this.state.isDragging) return;
		this.state.target = ref;
		this.state.isValidDrop =
			Rules.canPlace(this.state.item, categories) || Rules.canAttach(this.state.item, currentItem);
	}

	clearTarget(ref?: SlotReference) {
		if (ref && this.state.target !== ref) return;
		this.state.target = null;
		this.state.isValidDrop = false;
	}

	private onPointerMove = (e: PointerEvent) => {
		this.state.pointer = { x: e.clientX, y: e.clientY };
	};

	private onPointerUp = () => {
		if (this.state.target && this.state.isValidDrop && this.state.source) {
			this.onDropAction(this.state.source, this.state.target);
		}
		this.reset();
	};

	private reset() {
		this.state.isDragging = false;
		this.state.item = null;
		this.state.source = null;
		this.state.target = null;
		this.state.isValidDrop = false;
		window.removeEventListener('pointermove', this.onPointerMove);
		window.removeEventListener('pointerup', this.onPointerUp);
	}
}
