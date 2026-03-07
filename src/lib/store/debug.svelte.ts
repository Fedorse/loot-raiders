import type { ItemLocation } from '$lib/types';

export class DebugStore {
	visible = $state(false);

	toggle() {
		this.visible = !this.visible;
	}
}

export function formatLocation(loc: ItemLocation): string {
	if (loc.type === 'slot') {
		return `${loc.storageId}[${loc.index}]`;
	}
	if (loc.type === 'trash') {
		return 'trash';
	}
	return `${formatLocation(loc.parentLocation)} → attach[${loc.attachIndex}]`;
}
