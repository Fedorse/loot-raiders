// import { canDrop, canDropAttachment, canDropSplit } from '$lib/store/inventory-validation';
import { getDef } from '$lib/config/items';
import { isEqual } from 'es-toolkit';
import type { Inventory } from './inventory.svelte';
import { validateDrop } from '$lib/store/inventory-validation';

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

		this.isValidDrop = validateDrop(this.dragPayload, dropTarget);
	}

	get draggedItem(): InstanceItem | null {
		if (this.status !== 'dragging' || !this.dragPayload) return null;

		if (this.dragPayload.source === 'split_slot') {
			// Возвращаем виртуальный предмет с нужным количеством, чтобы DragLayer нарисовал правильную цифру
			return {
				...this.dragPayload.storedItem.item,
				count: this.dragPayload.splitCount
			};
		} else if (this.dragPayload.source === 'weapon_attachment') {
			return this.dragPayload.item;
		} else {
			return this.dragPayload.storedItem.item;
		}
	}

	isDraggingUid(uid: string): boolean {
		if (this.status !== 'dragging' || !this.dragPayload) return false;

		if (this.dragPayload.source === 'split_slot') return false;

		return this.draggedItem?.uid === uid;
	}

	shouldShowInvalidHint(dropTarget: DropTarget): boolean {
		if (this.status !== 'dragging' || !this.dragPayload) return false;

		// 2. Спрашиваем инвентарь: валиден ли слот?
		const isValid = this.inventory.validateDrop(this.dragPayload, dropTarget);

		// Если слот ВАЛИДЕН (можно бросить) — крестик точно НЕ нужен
		if (isValid) return false;

		if (this.dragPayload.source === 'split_slot') {
			const targetStorageId = dropTarget.storage.storageId;
			if (targetStorageId === 'lootBack' || targetStorageId === 'backpack') return false;
			return true;
		}

		// UX-Правило 2: Если тащим оружие прямо из слота 'weapon' — скрываем крестики
		if (this.dragPayload.source === 'inventory_slot') {
			const sourceStorageId = this.dragPayload.storedItem.storage.storageId;

			if (
				(sourceStorageId === 'weapon' && dropTarget.storage.storageId === 'backpack') ||
				dropTarget.storage.storageId === 'lootBack'
			)
				return false;

			return true;
		}

		// UX-Правило 3: При снятии аттачмента крестики нужны ТОЛЬКО на слотах экипировки
		if (this.dragPayload.source === 'weapon_attachment') {
			const targetStorageId = dropTarget.storage.storageId;
			// Скрываем крестики в рюкзаках
			if (targetStorageId === 'backpack' || targetStorageId === 'lootBack') return false;
			// На weapon, shield, augment — показываем
			return true;
		}

		// Дефолт: для всех остальных невалидных случаев показываем крестик
		return true;
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
