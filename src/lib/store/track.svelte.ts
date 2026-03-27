import { ITEM_DB } from '$lib/config/items';
import { MOCK_ITEMS } from '$lib/config/mock-data';
import type { ItemDefinition } from '$lib/types';
// import { generateLootItems, TRACK_PROFILE } from './loot.svelte';

export interface TrackItem {
	id: string;
	defId: string;
	count: number;
	def: ItemDefinition;
	attachments: (ItemDefinition | null)[] | null;
	matched: boolean;
}

const ITEM_HEIGHT = 96;
const WEAPON_HEIGHT = 120;
const ITEM_GAP = 8;
const VISIBLE_INSET = 100;
// const MAX_ITEMS = 100;

function getItemHeight(item: TrackItem): number {
	return item.def.type === 'weapon' && item.def.attachmentSlots?.length
		? WEAPON_HEIGHT
		: ITEM_HEIGHT;
}

function generateTrackQueue(): TrackItem[] {
	return MOCK_ITEMS.map((mock) => ({
		id: crypto.randomUUID(),
		defId: mock.defId,
		count: mock.count,
		def: ITEM_DB[mock.defId],
		attachments: null,
		matched: false
	}));
}

// function generateTrackQueue(count: number): TrackItem[] {
// 	const rawItems = generateLootItems(TRACK_PROFILE, count);
//
// 	return rawItems.map((raw) => ({
// 		id: crypto.randomUUID(),
// 		defId: raw.def.id,
// 		count: raw.count,
// 		def: raw.def,
// 		attachments: raw.attachments,
// 		matched: false
// 	}));
// }

export class Track {
	queue = $state<TrackItem[]>([]);
	scrollOffset = $state(0);
	containerHeight = $state(0);

	totalHeight = $derived.by(() => {
		let h = 0;
		for (const item of this.queue) {
			if (h > 0) h += ITEM_GAP;
			h += getItemHeight(item);
		}
		return h;
	});

	// Matched items are excluded here so GameLoop.checkMatches skips them immediately.
	// Visual removal happens later via removeMatched() after the scan animation completes.
	visibleItems = $derived.by(() => {
		if (this.containerHeight <= 0) return [];
		const result: TrackItem[] = [];
		let y = 0;
		for (const item of this.queue) {
			const h = getItemHeight(item);
			const top = y - this.totalHeight + this.scrollOffset;
			const bottom = top + h;
			if (bottom > VISIBLE_INSET && top < this.containerHeight - VISIBLE_INSET && !item.matched) {
				result.push(item);
			}
			y += h + ITEM_GAP;
		}
		return result;
	});

	allMatched = $derived(this.queue.length > 0 && this.queue.every((i) => i.matched));

	// ---- Queue lifecycle ----

	reset() {
		this.queue = [...generateTrackQueue()];
		this.scrollOffset = 0;
	}

	markMatched(id: string): void {
		const item = this.queue.find((i) => i.id === id);
		if (item) item.matched = true;
	}

	removeMatched(id: string): void {
		const idx = this.queue.findIndex((i) => i.id === id);
		if (idx === -1) return;

		const item = this.queue[idx];
		const removedHeight = getItemHeight(item) + (this.queue.length > 1 ? ITEM_GAP : 0);

		this.queue = this.queue.filter((i) => i.id !== id);
		this.scrollOffset -= removedHeight;
	}

	// ---- Scrolling ----

	movement(dt: number, speed: number) {
		this.scrollOffset += speed * dt;
		const distanceToTop = this.totalHeight - this.scrollOffset;
		if (distanceToTop < 2000) {
			this.extend();
		}
	}

	// Intentional no-op — scaffolding hook called every tick by movement().
	// Will hold real queue generation once mock data is replaced.
	private extend(): void {
		// const newItems = generateTrackQueue(30);
		// this.queue = [...newItems, ...this.queue];
		//
		// if (this.queue.length > MAX_ITEMS) {
		// 	const itemsToRemove = this.queue.slice(MAX_ITEMS);
		//
		// 	let removedHeight = 0;
		// 	for (const item of itemsToRemove) {
		// 		removedHeight += getItemHeight(item) + ITEM_GAP;
		// 	}
		//
		// 	this.queue = this.queue.slice(0, MAX_ITEMS);
		// 	this.scrollOffset -= removedHeight;
		// }
	}
}
