import { type DropTarget } from '$lib/config/items';
import type { StoredItem } from '$lib/store/inventory-manger.svelte';
import { canDrop } from '$lib/store/inventory-validation';

export type { DropTarget } from '$lib/config/items';

export class DndManager {
	isValidDrop = $state(false);
	dragOrigin = $state<StoredItem | null>(null);
	dropTarget = $state<DropTarget | null>(null);
	pointer = $state({ x: 0, y: 0 });
	offset = $state({ x: 0, y: 0 });

	constructor(private onDropAction: (dragOrigin: StoredItem, dropTarget: DropTarget) => void) {}

	startDrag(dragged: StoredItem, e: PointerEvent, node: HTMLElement) {
		const rect = node.getBoundingClientRect();
		this.dragOrigin = dragged;
		this.pointer = { x: e.clientX, y: e.clientY };
		this.offset = {
			x: (e.clientX - rect.left) / rect.width,
			y: (e.clientY - rect.top) / rect.height
		};
		window.addEventListener('pointermove', this.handlePointerMove);
		window.addEventListener('pointerup', this.endDrag);
	}

	setDropTarget(dropTarget: DropTarget) {
		this.dropTarget = dropTarget;
		this.isValidDrop = this.canAccept(dropTarget);
	}

	canAccept(dropTarget: DropTarget): boolean {
		if (!this.dragOrigin) return false;
		return canDrop(this.dragOrigin, dropTarget);
	}

	clearDropTarget() {
		this.dropTarget = null;
		this.isValidDrop = false;
	}

	private handlePointerMove = (e: PointerEvent) => {
		this.pointer = { x: e.clientX, y: e.clientY };
	};

	private endDrag = () => {
		if (this.isValidDrop) {
			this.onDropAction(this.dragOrigin, this.dropTarget);
		}
		this.reset();
	};

	private reset() {
		this.dragOrigin = null;
		this.dropTarget = null;
		this.isValidDrop = false;
		window.removeEventListener('pointermove', this.handlePointerMove);
		window.removeEventListener('pointerup', this.endDrag);
	}
}
