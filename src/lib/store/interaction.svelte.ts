import { canDrop } from '$lib/store/inventory-validation';
import { isEqual } from 'es-toolkit';
import type { Inventory } from './inventory.svelte';

import type { DropTarget, SlotRef, StoredItem, AttachmentRef, InstanceItem } from '$lib/types';

const DRAG_THRESHOLD = 5;
const DOUBLE_CLICK_DELAY = 300;

type InteractionStatus = 'idle' | 'pressing' | 'dragging';

type DragPayload =
	| { type: 'item'; storedItem: StoredItem }
	| {
			type: 'attachment';
			weaponSlotRef: SlotRef;
			attachIndex: number;
			item: InstanceItem;
	  };

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
		if (!this.isValidDrop || !this.dropTarget || !this.dragPayload) return;

		if (this.dragPayload.type === 'attachment') {
			this.inventory.handleAttachmentDrop(
				this.dragPayload.weaponSlotRef,
				this.dragPayload.attachIndex,
				this.dropTarget
			);
		} else {
			this.inventory.handleDrop(this.dragPayload.storedItem, this.dropTarget);
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
			x: (e.clientX - rect.left) / rect.width,
			y: (e.clientY - rect.top) / rect.height
		};
	}

	private handleClick(e: PointerEvent) {
		if (this.dragPayload?.type !== 'item') return;

		const itemUid = this.dragPayload.storedItem.item.uid;

		if (e.altKey) return;
		if (e.shiftKey) {
			this.inventory.toggleSelectionItem(itemUid);
			return;
		}

		// Логика двойного клика
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

		if (this.dragPayload.type === 'attachment') {
			this.isValidDrop = true;
		} else {
			this.isValidDrop = canDrop(this.dragPayload.storedItem, dropTarget);
		}
	}

	get draggedItem(): InstanceItem | null {
		if (this.status !== 'dragging' || !this.dragPayload) return null;
		return this.dragPayload.type === 'item'
			? this.dragPayload.storedItem.item
			: this.dragPayload.item;
	}

	isDraggingUid(uid: string): boolean {
		return this.status === 'dragging' && this.draggedItem?.uid === uid;
	}

	canAccept(dropTarget: DropTarget): boolean {
		// Если мы прямо сейчас ничего не тащим, скрываем все крестики
		if (this.status !== 'dragging' || !this.dragPayload) return true;

		// Если тащим аттачмент — разрешаем (либо тут твоя логика для аттачментов)
		if (this.dragPayload.type === 'attachment') return true;

		// Проверяем через твою функцию валидации
		return canDrop(this.dragPayload.storedItem, dropTarget);
	}

	clearDropTarget() {
		this.dropTarget = null;
		this.isValidDrop = false;
	}

	private reset() {
		this.status = 'idle';
		this.dragPayload = null;
		this.dragNode = null;
		this.dropTarget = null;
		this.isValidDrop = false;

		window.removeEventListener('pointermove', this.handlePointerMove);
		window.removeEventListener('pointerup', this.handlePointerUp);
	}
}
