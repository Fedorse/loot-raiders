import type { Inventory } from './inventory.svelte';
import type { AudioManager } from './audio.svelte';
import type { LootGenerator } from './loot.svelte';
import type { Selection } from './selection.svelte';
import type { Overlay } from './overlay.svelte';
import type { Quest } from './quest.svelte';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'over';

export class GameLoop {
	private inventory: Inventory;
	private audio: AudioManager;
	private selection: Selection;
	private overlay: Overlay;
	private loot: LootGenerator;
	private quest: Quest;
	private rafId = 0;
	private lastTime = 0;

	score = $state(0);
	timeLeft = $state(0);
	status = $state<GameStatus>('idle');
	gameOverReason = $state<'victory' | 'defeat' | null>(null);

	constructor(
		inventory: Inventory,
		audio: AudioManager,
		selection: Selection,
		overlay: Overlay,
		loot: LootGenerator,
		quest: Quest
	) {
		this.audio = audio;
		this.inventory = inventory;
		this.selection = selection;
		this.overlay = overlay;
		this.loot = loot;
		this.quest = quest;
	}

	start() {
		cancelAnimationFrame(this.rafId);
		this.quest.reset();
		this.score = 0;
		this.gameOverReason = null;

		this.timeLeft = this.quest.stageDef.timeLimit;

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

	private tick(now: number) {
		const dt = (now - this.lastTime) / 1000;
		this.lastTime = now;

		this.timeLeft -= dt;
		if (this.timeLeft <= 0) {
			this.timeLeft = 0;
			this.gameOverReason = this.quest.allStagesCompleted ? 'victory' : 'defeat';
			this.stop();
			return;
		}

		this.loot.tick(dt);

		this.score += this.quest.checkMatches();

		if (this.quest.stageCompleted && !this.quest.allStagesCompleted) {
			const nextStage = this.quest.advanceStage();
			if (nextStage) {
				this.timeLeft += nextStage.timeLimit;
			}
		}

		this.rafId = requestAnimationFrame((t) => this.tick(t));
	}

	restart() {
		cancelAnimationFrame(this.rafId);
		this.gameOverReason = null;

		this.selection.clear();
		this.overlay.closeAll();
		this.loot.reset();
		this.quest.reset();
		this.inventory.clearStorage('backpack');
		this.inventory.clearStorage('lootBack');
		this.inventory.clearStorage('weapon');
		this.inventory.clearStorage('augment');
		this.inventory.clearStorage('shield');

		this.start();
	}
}
