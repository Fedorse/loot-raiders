import { getDef } from '$lib/config/items';
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
	private appliedShieldRarities = new Set<string>();
	private pendingMatchScore = 0;

	score = $state(0);
	timeLeft = $state(0);
	elapsedTime = $state(0);
	status = $state<GameStatus>('idle');
	gameOverReason = $state<'victory' | 'defeat' | null>(null);
	shieldTimeBonus = $state(0);

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

		$effect.root(() => {
			$effect(() => {
				const shield = this.inventory.shieldItem;
				if (!shield) return;
				const def = getDef(shield.defId);
				if (this.appliedShieldRarities.has(def.rarity)) return;
				const bonus = def.timeBonus ?? 0;
				this.timeLeft += bonus;
				this.shieldTimeBonus = bonus;
				this.appliedShieldRarities.add(def.rarity);
				if (this.status === 'playing') {
					this.audio.play('sheild');
				}
			});

			$effect(() => {
				if (this.status !== 'playing') return;
				const ms = this.quest.checkMatches();
				if (ms > 0) this.pendingMatchScore += ms;
			});
		});
	}

	start() {
		cancelAnimationFrame(this.rafId);
		this.quest.reset();
		this.score = 0;
		this.elapsedTime = 0;
		this.gameOverReason = null;

		const augItem = this.inventory.createItem('aug_free_loadout', 1);
		this.inventory.fillStorage('augment', [augItem]);

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

	attachAutoPause(): () => void {
		const isFullscreen = () =>
			!!(
				document.fullscreenElement ||
				(document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement
			);
		const pauseIfPlaying = () => {
			if (this.status === 'playing') this.pause();
		};
		const onFullscreenChange = () => {
			if (!isFullscreen()) pauseIfPlaying();
		};
		const onVisibilityChange = () => {
			if (document.hidden) pauseIfPlaying();
		};

		document.addEventListener('fullscreenchange', onFullscreenChange);
		document.addEventListener('webkitfullscreenchange', onFullscreenChange);
		document.addEventListener('visibilitychange', onVisibilityChange);

		return () => {
			document.removeEventListener('fullscreenchange', onFullscreenChange);
			document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
			document.removeEventListener('visibilitychange', onVisibilityChange);
		};
	}

	private tick(now: number) {
		const dt = (now - this.lastTime) / 1000;
		this.lastTime = now;

		this.timeLeft -= dt;
		this.elapsedTime += dt;
		if (this.timeLeft <= 0) {
			this.timeLeft = 0;
			this.gameOverReason = this.quest.allStagesCompleted ? 'victory' : 'defeat';
			this.stop();
			return;
		}

		this.loot.tick(dt);

		if (this.pendingMatchScore > 0) {
			this.score += this.pendingMatchScore;
			this.pendingMatchScore = 0;
		}

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
		this.appliedShieldRarities.clear();
		this.pendingMatchScore = 0;

		this.start();
	}
}
