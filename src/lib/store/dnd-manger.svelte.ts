import { getContext, setContext } from 'svelte';
import { getDef, type ItemInstance, type ItemType } from '$lib/config/items';

export interface SlotReference {
	collection: (ItemInstance | null)[];
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
		console.log(rect);

		this.state.isDragging = true;
		this.state.item = item;
		this.state.source = source;
		this.state.pointer = { x: e.clientX, y: e.clientY };
		this.state.offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
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

	hover(target: SlotReference, allowedTypes: ItemType[]) {
		// allowedTypes может содержать 'muzzle', 'optic' и т.д.
		if (!this.state.isDragging || !this.state.item) return;

		this.state.target = target;
		const def = getDef(this.state.item.defId);

		// Логика валидации
		let isCompatible = false;

		// 1. Прямое совпадение (weapon -> weapon)
		if (allowedTypes.includes(def.type)) {
			isCompatible = true;
		}
		// 2. Совпадение по типу аттачмента (muzzle -> muzzle)
		else if (def.type === 'attachment' && def.attachmentType) {
			// TS может ругаться, что attachmentType нет в ItemType,
			// поэтому можно привести типы или расширить ItemType
			if (allowedTypes.includes(def.attachmentType as any)) {
				isCompatible = true;
			}
		}

		this.state.isValidDrop = isCompatible;
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
