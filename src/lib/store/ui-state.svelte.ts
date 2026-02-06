import { type ItemInstance, type SlotReference, type ItemCategory } from '$lib/config/items';
import { getAllowedTypes } from '$lib/config/storages';
import * as Rules from '$lib/store/inventory-rules';

export class DndManager {
	isDragging = $state(false);
	isValidDrop = $state(false);
	isSplit = $state(false);
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
		console.log('item', item);
		this.source = source;
		this.isSplit = false;

		this.draggedItem = item;

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
		const draggedItem = this.draggedItem;
		if (this.isValidDrop && this.source && this.target && draggedItem) {
			this.onDropAction(this.source, this.target, draggedItem);
		} else if (this.isSplit && this.source && draggedItem) {
			this.onDropAction(this.source, this.source, draggedItem);
		}
		this.reset();
	};

	isSource(slotRef: SlotReference) {
		if (!this.source) return false;
		return this.source.storage === slotRef.storage && this.source.position === slotRef.position;
	}

	canAccept(storage: string, targetItem: ItemInstance | null) {
		if (!this.draggedItem) return false;

		// Если это виртуальное хранилище attachments
		if (storage.includes(':attachment')) {
			// Для attachment слотов проверяем только canAttach
			return Rules.canAttach(this.draggedItem, targetItem);
		}

		// Обычное хранилище
		const allowedTypes = getAllowedTypes(storage);
		return (
			Rules.canPlace(this.draggedItem, allowedTypes) ||
			Rules.canAttach(this.draggedItem, targetItem)
		);
	}

	setTarget(targetItem: SlotReference, storage: string, item: ItemInstance | null) {
		if (!this.isDragging) return;
		this.target = targetItem;
		this.isValidDrop = this.canAccept(storage, item);
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
