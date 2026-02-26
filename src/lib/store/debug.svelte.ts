import type { ItemLocation } from '$lib/types';

export interface ActionLogEntry {
	id: number;
	timestamp: number;
	action: string;
	itemName: string;
	from: string;
	to: string;
	detail?: string;
}

export class DebugStore {
	visible = $state(false);
	log = $state<ActionLogEntry[]>([]);
	private nextId = 0;

	toggle() {
		this.visible = !this.visible;
	}

	logAction(entry: Omit<ActionLogEntry, 'id' | 'timestamp'>) {
		this.log.unshift({ ...entry, id: this.nextId++, timestamp: Date.now() });
		if (this.log.length > 30) this.log.pop();
	}

	clearLog() {
		this.log = [];
		this.nextId = 0;
	}
}

export function formatLocation(loc: ItemLocation): string {
	if (loc.type === 'container') {
		return `${loc.storageId}[${loc.index}]`;
	}
	return `${formatLocation(loc.parentLocation)} → attach[${loc.attachIndex}]`;
}
