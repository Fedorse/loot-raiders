import type { Inventory } from './inventory.svelte';
import { Track } from './track.svelte';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'over';

const POINTS_PER_MATCH = 10;
const TIME_BONUS = 3;
const INITIAL_TIME = 300;
const INITIAL_SPEED = 30;

export class GameLoop {
	private inventory: Inventory;
	private rafId = 0;
	private lastTime = 0;

	track = new Track();
	score = $state(0);
	timeLeft = $state(INITIAL_TIME);
	speed = $state(INITIAL_SPEED);
	status = $state<GameStatus>('idle');

	constructor(inventory: Inventory) {
		this.inventory = inventory;
	}

	start() {
		this.track.reset(100);
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

		this.track.movement(dt, this.speed);

		if (this.track.allMatched) {
			this.stop();
			return;
		}

		this.checkMatches();

		this.rafId = requestAnimationFrame((t) => this.tick(t));
	}

	private checkMatches() {
		for (const trackItem of this.track.visibleItems) {
			const available = this.inventory.countInBackpack(trackItem.defId);
			if (available < trackItem.count) continue;

			this.inventory.consumeFromBackpack(trackItem.defId, trackItem.count);
			this.track.markMatched(trackItem.id);
			this.score += POINTS_PER_MATCH;
			this.timeLeft += TIME_BONUS;
		}
	}
}
