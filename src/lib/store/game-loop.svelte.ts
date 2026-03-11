import { getDef } from '$lib/config/items';
import type { ItemDefinition } from '$lib/types';
import type { Inventory } from './inventory.svelte';

// ---- Types ----

export interface FeedItem {
	id: string;
	defId: string;
	count: number;
	def: ItemDefinition;
	attachments: (ItemDefinition | null)[] | null;
	matched: boolean;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'over';

// ---- Hardcoded test pool (shared with loot.svelte.ts) ----

export const TEST_ITEM_IDS = [
	// weapons (4)
	'wpn_kettle',
	'wpn_rattler',
	'wpn_arpeggio',
	'wpn_hairpin',
	// loot (10)
	'loot_chemicals',
	'loot_fabric',
	'loot_battery',
	'loot_oil',
	'loot_bandage',
	'loot_rubber_duck',
	'loot_frying_pan',
	'loot_light_bulb',
	'loot_mushroom',
	'loot_firecracker',
	// resources (4)
	'res_metal_parts',
	'res_rubber_parts',
	'res_wires',
	'res_plastic_parts',
	// ammo (2)
	'ammo_light',
	'ammo_medium'
];

// ---- Constants ----

const POINTS_PER_MATCH = 10;
const TIME_BONUS = 3;
const INITIAL_TIME = 300;
const INITIAL_SPEED = 10;
const ITEM_HEIGHT = 80;
const WEAPON_HEIGHT = 92;
const ITEM_GAP = 8;

export class GameLoop {
	private inventory: Inventory;
	private rafId = 0;
	private lastTime = 0;

	// ---- Reactive state ----

	queue = $state<FeedItem[]>([]);
	scrollOffset = $state(0);
	score = $state(0);
	timeLeft = $state(INITIAL_TIME);
	speed = $state(INITIAL_SPEED);
	status = $state<GameStatus>('idle');

	// ---- Positional visibility tracking ----

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
		const result: FeedItem[] = [];
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

	constructor(inventory: Inventory) {
		this.inventory = inventory;
	}

	// ---- Public API ----

	start() {
		this.queue = createTestQueue();
		this.scrollOffset = 0;
		this.score = 0;
		this.timeLeft = INITIAL_TIME;
		this.speed = INITIAL_SPEED;
		this.status = 'playing';

		this.lastTime = performance.now();
		this.rafId = requestAnimationFrame((t) => this.tick(t));
	}

	stop() {
		cancelAnimationFrame(this.rafId);
		this.status = 'over';
	}

	pause() {
		if (this.status !== 'playing') return;
		cancelAnimationFrame(this.rafId);
		this.status = 'paused';
	}

	resume() {
		if (this.status !== 'paused') return;
		this.status = 'playing';
		this.lastTime = performance.now();
		this.rafId = requestAnimationFrame((t) => this.tick(t));
	}

	toggle() {
		if (this.status === 'playing') this.pause();
		else if (this.status === 'paused') this.resume();
	}

	// ---- Game loop ----

	private tick(now: number) {
		const dt = (now - this.lastTime) / 1000;
		this.lastTime = now;

		this.timeLeft -= dt;
		if (this.timeLeft <= 0) {
			this.timeLeft = 0;
			this.stop();
			return;
		}

		this.scrollOffset += this.speed * dt;

		if (this.allMatched) {
			this.stop();
			return;
		}

		this.checkMatches();

		this.rafId = requestAnimationFrame((t) => this.tick(t));
	}

	private checkMatches() {
		const backpack = this.inventory.backpack;

		for (const feedItem of this.visibleItems) {
			const match = backpack.find((bp) => bp.item.defId === feedItem.defId);
			if (!match) continue;

			feedItem.matched = true;
			this.inventory.removeItem(match.location);
			this.score += POINTS_PER_MATCH;
			this.timeLeft += TIME_BONUS;
		}
	}
}

// ---- Hardcoded test queue ----

function createTestQueue(): FeedItem[] {
	return TEST_ITEM_IDS.map((defId) => {
		const def = getDef(defId);
		return {
			id: crypto.randomUUID(),
			defId,
			count: 1,
			def,
			attachments: null,
			matched: false
		};
	});
}

// ---- Random generation (commented out for now) ----

// function generateQueue(count: number): FeedItem[] {
// 	const all = Object.values(ITEM_DB);
//
// 	const attachmentsByKind = new Map<AttachmentType, ItemDefinition[]>();
// 	for (const d of all) {
// 		if (d.type === 'attachment' && d.attachmentKind) {
// 			const list = attachmentsByKind.get(d.attachmentKind) ?? [];
// 			list.push(d);
// 			attachmentsByKind.set(d.attachmentKind, list);
// 		}
// 	}
//
// 	return Array.from({ length: count }, () => {
// 		const def = all[Math.floor(Math.random() * all.length)];
//
// 		let attachments: (ItemDefinition | null)[] | null = null;
// 		if (def.type === 'weapon' && def.attachmentSlots?.length) {
// 			attachments = def.attachmentSlots.map((slot) => {
// 				if (Math.random() < 0.5) return null;
// 				const pool = attachmentsByKind.get(slot.type);
// 				if (!pool?.length) return null;
// 				return pool[Math.floor(Math.random() * pool.length)];
// 			});
// 		}
//
// 		return {
// 			id: crypto.randomUUID(),
// 			defId: def.id,
// 			count: 1,
// 			def,
// 			attachments,
// 			matched: false
// 		};
// 	});
// }
