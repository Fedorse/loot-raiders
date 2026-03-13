import { ITEM_DB } from '$lib/config/items';
import type { ItemDefinition, ItemType } from '$lib/types';
import type { Inventory } from './inventory.svelte';
import { rollType, rollRarity, rollCount, pickRandom, itemPool } from './loot.svelte';

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

// ---- Constants ----

const POINTS_PER_MATCH = 10;
const TIME_BONUS = 3;
const INITIAL_TIME = 300;
const INITIAL_SPEED = 300;
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
		this.queue = generateFeedQueue(100);
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

// ---- Feed generation ----

const FEED_TYPE_CAPS: Partial<Record<ItemType, number>> = {
	weapon: 15,
	shield: 8,
	augment: 5
};

function generateFeedQueue(count: number): FeedItem[] {
	const typeCounts: Record<string, number> = {};

	return Array.from({ length: count }, () => {
		const type = rollType(typeCounts, FEED_TYPE_CAPS);
		typeCounts[type] = (typeCounts[type] ?? 0) + 1;

		const rarity = rollRarity(type);
		const def = pickRandom(itemPool[type][rarity]);
		const itemCount = rollCount(type, rarity, def);
		const attachments = rollAttachments(def);

		return {
			id: crypto.randomUUID(),
			defId: def.id,
			count: itemCount,
			def,
			attachments,
			matched: false
		};
	});
}

function rollAttachments(def: ItemDefinition): (ItemDefinition | null)[] | null {
	if (def.type !== 'weapon' || !def.attachmentSlots?.length) return null;

	return def.attachmentSlots.map((slot) => {
		if (Math.random() > 0.3) return null;

		const candidates = Object.values(ITEM_DB).filter(
			(d) => d.type === 'attachment' && d.attachmentKind === slot.type
		);
		if (candidates.length === 0) return null;

		return pickRandom(candidates);
	});
}
