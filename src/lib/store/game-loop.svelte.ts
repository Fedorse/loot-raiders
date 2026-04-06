import type { Inventory } from './inventory.svelte';
import type { AudioManager } from './audio.svelte';
import type { Track } from './track.svelte';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'over';

const POINTS_PER_MATCH = 10;
const TIME_BONUS = 3;
const INITIAL_TIME = 300;
const INITIAL_SPEED = 30;

export class GameLoop {
	private inventory: Inventory;
	private audio: AudioManager;
	private rafId = 0;
	private lastTime = 0;

	track: Track;
	score = $state(0);
	timeLeft = $state(INITIAL_TIME);
	speed = $state(INITIAL_SPEED);
	status = $state<GameStatus>('idle');

	constructor(inventory: Inventory, track: Track, audio: AudioManager) {
		this.audio = audio;
		this.inventory = inventory;
		this.track = track;
	}

	start() {
		cancelAnimationFrame(this.rafId);
		this.track.reset();
		this.score = 0;
		this.timeLeft = INITIAL_TIME;
		this.speed = INITIAL_SPEED;
		this.status = 'playing';

		this.audio.playBGM();

		this.lastTime = performance.now();
		this.rafId = requestAnimationFrame((t) => this.tick(t));
	}

	stop() {
		cancelAnimationFrame(this.rafId);
		this.status = 'over';
		this.audio.duckBGM();
	}

	pause() {
		if (this.status !== 'playing') return;
		cancelAnimationFrame(this.rafId);
		this.status = 'paused';
		this.audio.duckBGM();
	}

	resume() {
		if (this.status !== 'paused') return;
		this.status = 'playing';
		this.lastTime = performance.now();
		this.rafId = requestAnimationFrame((t) => this.tick(t));
		this.audio.unduckBGM();
	}

	// ---- Tick / loop ----

	private tick(now: number) {
		const dt = (now - this.lastTime) / 1000;
		this.lastTime = now;

		// Game over: timer expired
		this.timeLeft -= dt;
		if (this.timeLeft <= 0) {
			this.timeLeft = 0;
			this.stop();
			return;
		}

		this.track.movement(dt, this.speed);

		// Game over: every track item has been matched
		if (this.track.allMatched) {
			this.stop();
			return;
		}

		this.checkMatches();

		this.rafId = requestAnimationFrame((t) => this.tick(t));
	}

	private checkMatches() {
		for (const trackItem of this.track.visibleItems) {
			const available = this.inventory.countAvailable(trackItem.defId);
			if (available < trackItem.count) continue;

			this.inventory.consumeMatched(trackItem.defId, trackItem.count);
			this.track.markMatched(trackItem.id);
			this.score += POINTS_PER_MATCH;
			this.timeLeft += TIME_BONUS;
			this.audio.play('match');
		}
	}
}
