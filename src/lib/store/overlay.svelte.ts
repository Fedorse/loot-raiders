import type { InstanceItem, ItemLocation, OccupiedSlot } from '$lib/types';

interface MenuState {
	x: number;
	y: number;
	slot: OccupiedSlot;
}

interface TooltipState {
	x: number;
	y: number;
	item: InstanceItem;
}

interface RecycleModalState {
	item: InstanceItem;
	location: ItemLocation;
}

export class Overlay {
	contextMenu = $state<MenuState | null>(null);
	tooltip = $state<TooltipState | null>(null);
	recycleModal = $state<RecycleModalState | null>(null);

	openContextMenu(x: number, y: number, slot: OccupiedSlot) {
		this.hideTooltip();
		const W = 192, H = 200;
		this.contextMenu = {
			x: Math.min(x, window.innerWidth - W - 8),
			y: Math.min(y, window.innerHeight - H - 8),
			slot
		};
	}

	closeContextMenu() {
		this.contextMenu = null;
	}

	openRecycleModal(item: InstanceItem, location: ItemLocation) {
		this.closeAll();
		this.recycleModal = { item, location };
	}

	closeRecycleModal() {
		this.recycleModal = null;
	}

	showTooltip(x: number, y: number, item: InstanceItem) {
		if (this.contextMenu || this.recycleModal) return;
		this.tooltip = { x, y, item };
	}

	handleEscape() {
		if (this.recycleModal) {
			this.closeRecycleModal();
		} else if (this.contextMenu) {
			this.closeContextMenu();
		}
	}

	hideTooltip() {
		this.tooltip = null;
	}

	closeAll() {
		this.contextMenu = null;
		this.tooltip = null;
		this.recycleModal = null;
	}
}
