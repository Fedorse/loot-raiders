import type { ItemDefinition } from '$lib/types';
import type { Inventory } from './inventory.svelte';
import { generateLootItems, TRACK_PROFILE } from './loot.svelte';

export interface FeedItem {
	id: string;
	defId: string;
	count: number;
	def: ItemDefinition;
	attachments: (ItemDefinition | null)[] | null;
	matched: boolean;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'over';

const POINTS_PER_MATCH = 10;
const TIME_BONUS = 3;
const INITIAL_TIME = 300;
const INITIAL_SPEED = 30;
const ITEM_HEIGHT = 80;
const WEAPON_HEIGHT = 102;
const ITEM_GAP = 8;

export class GameLoop {
	private inventory: Inventory;
	private rafId = 0;
	private lastTime = 0;

	queue = $state<FeedItem[]>([]);
	scrollOffset = $state(0);
	score = $state(0);
	timeLeft = $state(INITIAL_TIME);
	speed = $state(INITIAL_SPEED);
	status = $state<GameStatus>('idle');

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

	start() {
		this.queue = generateTrackQueue(100);
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

		const distanceToTop = this.totalHeight - this.scrollOffset;
		if (distanceToTop < 2000) {
			this.extendTrack();
		}

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
	private extendTrack() {
		// 1. Генерируем пачку новых предметов
		const newItems = generateTrackQueue(30);

		// 2. Добавляем их в начало (наверх списка)
		// Так как список визуально привязан к низу (-totalHeight),
		// добавление наверх не сдвинет текущие элементы на экране!
		this.queue = [...newItems, ...this.queue];

		// 3. Очистка (Garbage Collection)
		// Удаляем старые элементы снизу, чтобы браузер не умер от тысяч DOM-узлов
		const MAX_ITEMS = 100;
		if (this.queue.length > MAX_ITEMS) {
			const itemsToRemove = this.queue.slice(MAX_ITEMS);

			// Считаем высоту, которую мы сейчас отрежем снизу
			let removedHeight = 0;
			for (const item of itemsToRemove) {
				const h =
					item.def.type === 'weapon' && item.def.attachmentSlots?.length
						? WEAPON_HEIGHT
						: ITEM_HEIGHT;
				removedHeight += h + ITEM_GAP;
			}

			// Отрезаем хвост массива
			this.queue = this.queue.slice(0, MAX_ITEMS);
			// Компенсируем скролл, чтобы список не дернулся вниз
			this.scrollOffset -= removedHeight;
		}
	}
}

function generateTrackQueue(count: number): FeedItem[] {
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
