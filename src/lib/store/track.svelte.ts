import type { ItemDefinition } from '$lib/types';
import { generateLootItems, TRACK_PROFILE } from './loot.svelte';

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
const MAX_ITEMS = 100;

function generateTrackQueue(count: number): TrackItem[] {
	const rawItems = generateLootItems(TRACK_PROFILE, count);

	return rawItems.map((raw) => ({
		id: crypto.randomUUID(),
		defId: raw.def.id,
		count: raw.count,
		def: raw.def,
		attachments: raw.attachments,
		matched: false
	}));
}

export class Track {
	queue = $state<TrackItem[]>([]);
	scrollOffset = $state(0);
	containerHeight = $state(0);

	totalHeight = $derived.by(() => {
		let h = 0;
		for (const item of this.queue) {
			if (h > 0) h += ITEM_GAP;
			h +=
				item.def.type === 'weapon' && item.def.attachmentSlots?.length
					? WEAPON_HEIGHT
					: ITEM_HEIGHT;
		}
		return h;
	});

	visibleItems = $derived.by(() => {
		if (this.containerHeight <= 0) return [];
		const result: TrackItem[] = [];
		let y = 0;
		for (const item of this.queue) {
			const h =
				item.def.type === 'weapon' && item.def.attachmentSlots?.length
					? WEAPON_HEIGHT
					: ITEM_HEIGHT;
			const top = y - this.totalHeight + this.scrollOffset;
			const bottom = top + h;
			if (bottom > 0 && top < this.containerHeight && !item.matched) {
				result.push(item);
			}
			y += h + ITEM_GAP;
		}
		return result;
	});

	allMatched = $derived(this.queue.length > 0 && this.queue.every((i) => i.matched));

	reset(count: number) {
		this.queue = [...generateTrackQueue(count)];
		this.scrollOffset = 0;
	}

	movement(dt: number, speed: number) {
		this.scrollOffset += speed * dt;
		const distanceToTop = this.totalHeight - this.scrollOffset;
		if (distanceToTop < 2000) {
			this.extend();
		}
	}
	markMatched(id: string): void {
		const item = this.queue.find((i) => i.id === id);
		if (item) item.matched = true;
	}

	removeMatched(id: string): void {
		const idx = this.queue.findIndex((i) => i.id === id);
		if (idx === -1) return;

		const item = this.queue[idx];
		const isWeapon = item.def.type === 'weapon' && !!item.def.attachmentSlots?.length;
		const itemHeight = isWeapon ? WEAPON_HEIGHT : ITEM_HEIGHT;
		const removedHeight = itemHeight + (this.queue.length > 1 ? ITEM_GAP : 0);

		this.queue = this.queue.filter((i) => i.id !== id);
		this.scrollOffset -= removedHeight;
	}

	private extend(): void {
		const newItems = generateTrackQueue(30);
		this.queue = [...newItems, ...this.queue];

		if (this.queue.length > MAX_ITEMS) {
			const itemsToRemove = this.queue.slice(MAX_ITEMS);

			let removedHeight = 0;
			for (const item of itemsToRemove) {
				const h =
					item.def.type === 'weapon' && item.def.attachmentSlots?.length
						? WEAPON_HEIGHT
						: ITEM_HEIGHT;
				removedHeight += h + ITEM_GAP;
			}

			this.queue = this.queue.slice(0, MAX_ITEMS);
			this.scrollOffset -= removedHeight;
		}
	}
}
