import { getDef } from '$lib/config/items';
import { isEqualLocation } from '$lib/utils';
import type { Inventory } from './inventory.svelte';
import type { Overlay } from './overlay.svelte';
import { validateDrop, getDropActionType } from '$lib/store/inventory-validation';

import type { SlotState, ItemLocation, InstanceItem, DragState } from '$lib/types';

const DRAG_THRESHOLD = 1;
const DOUBLE_CLICK_DELAY = 300;

type InteractionStatus = 'idle' | 'pressing' | 'dragging';

export class Interaction {
	private inventory!: Inventory;
	private overlay!: Overlay;

	status = $state<InteractionStatus>('idle');
	dragState = $state<DragState | null>(null);

	hoveredSlot = $state<SlotState | null>(null);
	pointer = $state({ x: 0, y: 0 });
	offset = $state({ x: 0, y: 0 });
	isValidDrop = $derived(
		this.dragState && this.hoveredSlot
			? validateDrop(this.dragState, this.hoveredSlot, this.inventory.getItem.bind(this.inventory))
			: false
	);

	private startPos = { x: 0, y: 0 };
	private dragNode: HTMLElement | null = null;
	private initialSlot: SlotState | null = null;

	private lastClickTime = 0;
	private lastClickUid = '';

	constructor(inventory: Inventory, overlay: Overlay) {
		this.inventory = inventory;
		this.overlay = overlay;
	}

	startInteraction(slot: SlotState, e: PointerEvent, node: HTMLElement) {
		if (e.button !== 0) return;
		if (this.status !== 'idle') return;
		if (!slot.item) return;
		e.stopPropagation();
		e.preventDefault();

		this.status = 'pressing';
		this.initialSlot = slot;
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
		if (this.isValidDrop && this.hoveredSlot && this.dragState) {
			const action = getDropActionType(this.dragState, this.hoveredSlot);

			switch (action) {
				case 'move':
					this.inventory.move(this.dragState, this.hoveredSlot.location);
					break;
				case 'stack':
					this.inventory.stack(this.dragState, this.hoveredSlot.location);
					break;
				case 'swap':
					this.inventory.swap(this.dragState, this.hoveredSlot.location);
					break;
				case 'attach':
					this.inventory.attach(this.dragState, this.hoveredSlot.location);
					break;
			}
		}
	}

	private beginDrag(e: PointerEvent) {
		if (!this.initialSlot?.item) return;
		this.overlay.closeAll();
		this.status = 'dragging';
		const rect = this.dragNode!.getBoundingClientRect();

		this.pointer = { x: e.clientX, y: e.clientY };
		this.offset = {
			x: (this.startPos.x - rect.left) / rect.width,
			y: (this.startPos.y - rect.top) / rect.height
		};

		let isSplit = false;
		let dragItem = this.initialSlot.item;

		if ((e.metaKey || e.altKey) && this.initialSlot.location.type === 'container') {
			const def = getDef(dragItem.defId);
			if (def.maxStack && dragItem.count > 1) {
				const splitCount = Math.floor(dragItem.count / 2);
				isSplit = true;
				dragItem = { ...dragItem, count: splitCount };
			}
		}

		this.dragState = {
			item: dragItem,
			sourceLocation: this.initialSlot.location,
			isSplit
		};

		// Add body CSS class for weapon/attachment pointer-event control
		const def = getDef(dragItem.defId);
		if (def.type === 'weapon') {
			document.body.classList.add('dragging-weapon');
		} else if (def.type === 'attachment') {
			document.body.classList.add('dragging-attachment');
		}
	}

	private handleClick(e: PointerEvent) {
		if (!this.initialSlot?.item) return;

		const itemUid = this.initialSlot.item.uid;

		if (e.altKey || e.metaKey) return;
		if (e.ctrlKey) {
			this.inventory.toggleSelectionItem(itemUid);
			return;
		}
		if (e.shiftKey) {
			this.inventory.quickMove(this.initialSlot.location);
			return;
		}

		const now = Date.now();
		const isDouble = now - this.lastClickTime < DOUBLE_CLICK_DELAY && this.lastClickUid === itemUid;

		if (isDouble) {
			this.inventory.quickMove(this.initialSlot.location);
			this.lastClickTime = 0;
			this.lastClickUid = '';
		} else {
			this.inventory.selectSingleItem(itemUid);
			this.lastClickTime = now;
			this.lastClickUid = itemUid;
		}
	}

	setHoveredSlot(slot: SlotState) {
		this.hoveredSlot = slot;
	}

	isSource(loc: ItemLocation): boolean {
		if (this.status !== 'dragging' || !this.dragState) return false;
		if (this.dragState.isSplit) return false;
		return isEqualLocation(this.dragState.sourceLocation, loc);
	}

	isHovered(loc: ItemLocation): boolean {
		if (!this.hoveredSlot) return false;
		const hl = this.hoveredSlot.location;
		if (isEqualLocation(hl, loc)) return true;
		return hl.type === 'attachment' && isEqualLocation(hl.parentLocation, loc);
	}

	get draggedItem(): InstanceItem | null {
		if (this.status !== 'dragging' || !this.dragState) return null;
		return this.dragState.item;
	}

	getDisplayCount(item: InstanceItem, loc: ItemLocation): number {
		if (
			this.status === 'dragging' &&
			this.dragState?.isSplit &&
			isEqualLocation(this.dragState.sourceLocation, loc)
		) {
			return item.count - this.dragState.item.count;
		}
		return item.count;
	}

	shouldShowInvalidHint(slot: SlotState): boolean {
		if (this.status !== 'dragging' || !this.dragState) return false;

		const resolver = this.inventory.getItem.bind(this.inventory);
		const isValid = validateDrop(this.dragState, slot, resolver);

		if (isValid) return false;

		if (this.dragState.isSplit) {
			if (slot.location.type !== 'container') return true;
			const targetStorageId = slot.location.storageId;
			if (targetStorageId === 'lootBack' || targetStorageId === 'backpack') return false;
			return true;
		}

		// If source is an attachment location
		if (this.dragState.sourceLocation.type === 'attachment') {
			if (slot.location.type !== 'container') return true;
			const targetStorageId = slot.location.storageId;
			if (targetStorageId === 'backpack' || targetStorageId === 'lootBack') return false;
			return true;
		}

		// Source is a container location
		if (this.dragState.sourceLocation.type === 'container') {
			const sourceStorageId = this.dragState.sourceLocation.storageId;

			if (slot.location.type === 'container') {
				if (
					sourceStorageId === 'weapon' &&
					(slot.location.storageId === 'backpack' || slot.location.storageId === 'lootBack')
				)
					return false;
			}

			return true;
		}

		return true;
	}

	clearHoveredSlot() {
		this.hoveredSlot = null;
	}

	private reset() {
		this.status = 'idle';
		this.dragState = null;
		this.dragNode = null;
		this.hoveredSlot = null;
		this.initialSlot = null;

		document.body.classList.remove('dragging-weapon', 'dragging-attachment');

		window.removeEventListener('pointermove', this.handlePointerMove);
		window.removeEventListener('pointerup', this.handlePointerUp);
	}
}
