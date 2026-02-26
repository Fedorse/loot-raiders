import type { ItemLocation } from '$lib/types';

export class DebugStore {
	visible = $state(false);

	toggle() {
		this.visible = !this.visible;
	}
}

export function formatLocation(loc: ItemLocation): string {
	if (loc.type === 'container') {
		return `${loc.storageId}[${loc.index}]`;
	}
	return `${formatLocation(loc.parentLocation)} → attach[${loc.attachIndex}]`;
}
