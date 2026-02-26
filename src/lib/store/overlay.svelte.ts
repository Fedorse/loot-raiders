import type { InstanceItem, OccupiedSlot } from '$lib/types';

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

export class Overlay {
	contextMenu = $state<MenuState | null>(null);
	tooltip = $state<TooltipState | null>(null);

	openContextMenu(x: number, y: number, slot: OccupiedSlot) {
		this.hideTooltip();
		this.contextMenu = { x, y, slot };
	}

	closeContextMenu() {
		this.contextMenu = null;
	}

	showTooltip(x: number, y: number, item: InstanceItem) {
		if (this.contextMenu) return;
		this.tooltip = { x, y, item };
	}

	hideTooltip() {
		this.tooltip = null;
	}

	closeAll() {
		this.contextMenu = null;
		this.tooltip = null;
	}
}
