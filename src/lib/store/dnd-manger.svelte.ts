import { getContext, setContext } from 'svelte';
import { getDef, type ItemInstance, type ItemType, type ItemCategory } from '$lib/config/items';
import { chekValidation } from '$lib/utils/utils';

export interface SlotReference {
	collection: ItemInstance[];
	index: number;
}

interface DragState {
	isDragging: boolean;
	item: ItemInstance | null;
	source: SlotReference | null;
	target: SlotReference | null;
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
		const clickX = e.clientX - rect.left;
		const clickY = e.clientY - rect.top;

		this.state.isDragging = true;
		this.state.item = item;
		this.state.source = source;
		this.state.pointer = { x: e.clientX, y: e.clientY };
		this.state.offset = { x: clickX / rect.width, y: clickY / rect.height };
		this.state.isValidDrop = true;

		window.addEventListener('pointermove', this.pointerMove);
		window.addEventListener('pointerup', this.pointerUp);
	}

	pointerMove = (e: PointerEvent) => {
		this.state.pointer = { x: e.clientX, y: e.clientY };
	};

	pointerUp = (e: PointerEvent) => {
		if (this.state.target && this.state.isValidDrop && this.state.source) {
			this.onDropAction(this.state.source, this.state.target);
		}
		this.reset();
	};

	hover(target: SlotReference, categories: ItemCategory[]) {
		if (!this.state.isDragging || !this.state.item) return;

		this.state.target = target;

		this.state.isValidDrop = chekValidation(this.state.item, categories);
	}

	leave() {
		this.state.target = null;
		this.state.isValidDrop = false;
	}

	reset() {
		this.state.isDragging = false;
		this.state.item = null;
		this.state.source = null;
		this.state.target = null;
		this.state.isValidDrop = false;

		window.removeEventListener('pointermove', this.pointerMove);
		window.removeEventListener('pointerup', this.pointerUp);
	}
}

const DND_KEY = Symbol('dnd');

export function setDndContext(onDrop: (source: SlotReference, target: SlotReference) => void) {
	return setContext(DND_KEY, new DndManager(onDrop));
}

export function getDndContext() {
	return getContext<DndManager>(DND_KEY);
}
