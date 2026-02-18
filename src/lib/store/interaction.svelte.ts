import { canDrop } from '$lib/store/inventory-validation';
import { isEqual } from 'es-toolkit';
import { isBaseSlot, isAttachment } from '$lib/utils';
import type { Inventory } from './inventory.svelte';

import type { DropTarget, SlotRef, StoredItem } from '$lib/types';

const DRAG_THRESHOLD = 5;
const DOUBLE_CLICK_DELAY = 300;

export class Interaction {
	private inventory: Inventory;
	isValidDrop = $state(false);
	dragOrigin = $state<StoredItem | null>(null);
	dropTarget = $state<DropTarget | null>(null);
	pointer = $state({ x: 0, y: 0 });
	offset = $state({ x: 0, y: 0 });

	private pending: {
		storedItem: StoredItem;
		startX: number;
		startY: number;
		node: HTMLElement;
	} | null = null;
	private lastClickTime = 0;
	private lastClickUid = '';

	constructor(inventory: Inventory) {
		this.inventory = inventory;
	}

	handlePointerDown(storedItem: StoredItem, e: PointerEvent, node: HTMLElement) {
		if (e.button !== 0) return;
		if (this.pending || this.dragOrigin) return;
		e.stopPropagation();
		e.preventDefault();

		this.pending = { storedItem, startX: e.clientX, startY: e.clientY, node };

		window.addEventListener('pointermove', this.handlePointerMove);
		window.addEventListener('pointerup', this.handlePointerUp);
	}

	highlightHoverSlot(slotRef: SlotRef) {
		if (!this.dropTarget) return false;
		const target = this.dropTarget.storage;

		if (isEqual(target, slotRef)) return true;

		if (isBaseSlot(slotRef) && isAttachment(target)) {
			return target.storageId === slotRef.storageId && target.index === slotRef.index;
		}

		return false;
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
		if (this.pending) {
			const dx = e.clientX - this.pending.startX;
			const dy = e.clientY - this.pending.startY;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance > DRAG_THRESHOLD) {
				this.beginDrag(e);
			}
			return;
		}

		if (this.dragOrigin) {
			this.pointer = { x: e.clientX, y: e.clientY };
		}
	};

	private handlePointerUp = (e: PointerEvent) => {
		if (this.pending) {
			this.resolveClick(this.pending.storedItem, e);
			this.pending = null;
			this.removeWindowListeners();
			return;
		}

		if (this.dragOrigin) {
			this.endDrag();
		}
	};

	private beginDrag(e: PointerEvent) {
		const { storedItem, node } = this.pending!;
		const rect = node.getBoundingClientRect();

		this.dragOrigin = storedItem;
		this.pointer = { x: e.clientX, y: e.clientY };
		this.offset = {
			x: (e.clientX - rect.left) / rect.width,
			y: (e.clientY - rect.top) / rect.height
		};

		this.pending = null;
	}

	private resolveClick(storedItem: StoredItem, e: PointerEvent) {
		const uid = storedItem.item.uid;

		if (e.altKey) {
			// Future: split stack
			return;
		}

		if (e.shiftKey) {
			this.inventory.toggleSelectionItem(uid);
			return;
		}

		const now = Date.now();
		const isDouble = now - this.lastClickTime < DOUBLE_CLICK_DELAY && this.lastClickUid === uid;

		if (isDouble) {
			this.inventory.quickMove(storedItem);
			this.lastClickTime = 0;
			this.lastClickUid = '';
		} else {
			this.inventory.selectSingleItem(uid);
			this.lastClickTime = now;
			this.lastClickUid = uid;
		}
	}

	private endDrag() {
		if (this.isValidDrop && this.dragOrigin != null && this.dropTarget != null) {
			this.inventory.handleDrop(this.dragOrigin, this.dropTarget);
		}
		this.reset();
	}

	private reset() {
		this.dragOrigin = null;
		this.dropTarget = null;
		this.isValidDrop = false;
		this.pending = null;
		this.removeWindowListeners();
	}

	private removeWindowListeners() {
		window.removeEventListener('pointermove', this.handlePointerMove);
		window.removeEventListener('pointerup', this.handlePointerUp);
	}
}
