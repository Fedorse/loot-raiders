import { canDrop, canDropAttachment, canDropSplit } from '$lib/store/inventory-validation';
import { getDef } from '$lib/config/items';
import { isEqual } from 'es-toolkit';
import type { Inventory } from './inventory.svelte';

import type { DropTarget, SlotRef, InstanceItem, DragPayload } from '$lib/types';

const DRAG_THRESHOLD = 1;
const DOUBLE_CLICK_DELAY = 300;

type InteractionStatus = 'idle' | 'pressing' | 'dragging';

export class Interaction {
	private inventory: Inventory;

	status = $state<InteractionStatus>('idle');
	dragPayload = $state<DragPayload | null>(null);

	isValidDrop = $state(false);
	dropTarget = $state<DropTarget | null>(null);
	pointer = $state({ x: 0, y: 0 });
	offset = $state({ x: 0, y: 0 });

	private startPos = { x: 0, y: 0 };
	private dragNode: HTMLElement | null = null;

	private lastClickTime = 0;
	private lastClickUid = '';

	constructor(inventory: Inventory) {
		this.inventory = inventory;
	}

	startInteraction(payload: DragPayload, e: PointerEvent, node: HTMLElement) {
		if (e.button !== 0) return;
		if (this.status !== 'idle') return;
		e.stopPropagation();
		e.preventDefault();

		this.status = 'pressing';
		this.dragPayload = payload;
		this.startPos = { x: e.clientX, y: e.clientY };
		this.dragNode = node;

		window.addEventListener('pointermove', this.handlePointerMove);
		window.addEventListener('pointerup', this.handlePointerUp);
	}

	private handlePointerMove = (e: PointerEvent) => {
		if (this.status === 'pressing') {
			this.checkDragThreshold(e);
		} else if (this.status === 'dragging') {
			this.updatePointerPosition(e);
		}
	};
	private handlePointerUp = (e: PointerEvent) => {
		if (this.status === 'pressing') {
			this.handleClick(e);
		} else if (this.status === 'dragging') {
			this.handleDropAction();
		}
		this.reset();
	};

	private checkDragThreshold(e: PointerEvent) {
		const dx = e.clientX - this.startPos.x;
		const dy = e.clientY - this.startPos.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance > DRAG_THRESHOLD) {
			this.beginDrag(e);
		}
	}
	private updatePointerPosition(e: PointerEvent) {
		this.pointer = { x: e.clientX, y: e.clientY };
	}
	private handleDropAction() {
		if (this.isValidDrop && this.dropTarget && this.dragPayload) {
			this.inventory.executeDrop(this.dragPayload, this.dropTarget);
		}
	}

	highlightHoverSlot(slotRef: SlotRef) {
		return this.dropTarget ? isEqual(this.dropTarget.storage, slotRef) : false;
	}

	private beginDrag(e: PointerEvent) {
		this.status = 'dragging';
		const rect = this.dragNode!.getBoundingClientRect();

		this.pointer = { x: e.clientX, y: e.clientY };
		this.offset = {
			x: (this.startPos.x - rect.left) / rect.width,
			y: (this.startPos.y - rect.top) / rect.height
		};

		if ((e.metaKey || e.altKey) && this.dragPayload?.source === 'inventory_slot') {
			const storedItem = this.dragPayload.storedItem;
			const def = getDef(storedItem.item.defId);

			if (def.maxStack && storedItem.item.count > 1) {
				const splitCount = Math.floor(storedItem.item.count / 2);

				this.dragPayload = {
					source: 'split_slot',
					storedItem,
					splitCount
				};
			}
		}
	}

	private handleClick(e: PointerEvent) {
		if (this.dragPayload?.source !== 'inventory_slot') return;

		const itemUid = this.dragPayload.storedItem.item.uid;

		if (e.altKey || e.metaKey) return;
		if (e.shiftKey) {
			this.inventory.toggleSelectionItem(itemUid);
			return;
		}

		const now = Date.now();
		const isDouble = now - this.lastClickTime < DOUBLE_CLICK_DELAY && this.lastClickUid === itemUid;

		if (isDouble) {
			this.inventory.quickMove(this.dragPayload.storedItem);
			this.lastClickTime = 0;
			this.lastClickUid = '';
		} else {
			this.inventory.selectSingleItem(itemUid);
			this.lastClickTime = now;
			this.lastClickUid = itemUid;
		}
	}
	setDropTarget(dropTarget: DropTarget) {
		this.dropTarget = dropTarget;

		if (!this.dragPayload) {
			this.isValidDrop = false;
			return;
		}

		if (this.dragPayload.source === 'split_slot') {
			// Создаем виртуальный предмет для валидации
			const virtualSplitItem = {
				...this.dragPayload.storedItem.item,
				count: this.dragPayload.splitCount
			};
			this.isValidDrop = canDropSplit(virtualSplitItem, dropTarget);
		} else if (this.dragPayload.source === 'weapon_attachment') {
			this.isValidDrop = canDropAttachment(this.dragPayload.item, dropTarget);
		} else {
			this.isValidDrop = canDrop(this.dragPayload.storedItem, dropTarget);
		}
	}

	get draggedItem(): InstanceItem | null {
		if (this.status !== 'dragging' || !this.dragPayload) return null;

		if (this.dragPayload.source === 'split_slot') {
			// Возвращаем виртуальный предмет с нужным количеством, чтобы DragLayer нарисовал правильную цифру
			return {
				...this.dragPayload.storedItem.item,
				count: this.dragPayload.splitCount
			};
		}

		return this.dragPayload.source === 'inventory_slot'
			? this.dragPayload.storedItem.item
			: this.dragPayload.item;
	}

	isDraggingUid(uid: string): boolean {
		if (this.status !== 'dragging' || !this.dragPayload) return false;
		// Если мы сплитим, оригинальный слот НЕ ДОЛЖЕН пропадать из инвентаря
		if (this.dragPayload.source === 'split_slot') return false;

		return this.draggedItem?.uid === uid;
	}

	canAccept(dropTarget: DropTarget): boolean {
		if (this.status !== 'dragging' || !this.dragPayload) return true;
		if (this.dragPayload.source === 'weapon_attachment') return true;

		if (this.dragPayload.source === 'split_slot') {
			const virtualSplitItem = {
				...this.dragPayload.storedItem.item,
				count: this.dragPayload.splitCount
			};
			return canDropSplit(virtualSplitItem, dropTarget);
		}

		return canDrop(this.dragPayload.storedItem, dropTarget);
	}

	getDisplayCount(item: InstanceItem): number {
		if (
			this.status === 'dragging' &&
			this.dragPayload?.source === 'split_slot' &&
			this.dragPayload.storedItem.item.uid === item.uid
		) {
			return item.count - this.dragPayload.splitCount;
		}
		return item.count;
	}

	clearDropTarget() {
		this.dropTarget = null;
		this.isValidDrop = false;
	}

	private reset() {
		// Никакого сложного rollback'а! Все чисто.
		this.status = 'idle';
		this.dragPayload = null;
		this.dragNode = null;
		this.dropTarget = null;
		this.isValidDrop = false;

		window.removeEventListener('pointermove', this.handlePointerMove);
		window.removeEventListener('pointerup', this.handlePointerUp);
	}
}
