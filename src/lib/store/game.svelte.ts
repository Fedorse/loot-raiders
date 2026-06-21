import { setContext, getContext } from 'svelte';
import { Inventory } from './inventory.svelte';
import { Interaction } from './interaction.svelte';
import { Overlay } from './overlay.svelte';
import { LootGenerator } from './loot.svelte';
import { Selection } from './selection.svelte';
import { GameLoop } from './game-loop.svelte';
import { AudioManager } from './audio.svelte';
import { Quest } from './quest.svelte';
import { Augment } from './augment.svelte';
import { Device } from './device.svelte';
import { Leaderboard } from './leaderboard.svelte';
import { Notifications } from './notifications.svelte';
import { Tutorial } from './tutorial.svelte';

export class Game {
	audio = new AudioManager();
	selection = new Selection(this.audio);
	inventory = new Inventory(this.selection, this.audio);
	overlay = new Overlay();
	notifications = new Notifications();
	augment = new Augment(this.inventory, this.notifications);
	device = new Device();
	interaction = new Interaction(this.inventory, this.overlay, this.selection, this.audio);
	quest = new Quest(this.inventory, this.audio);
	loot = new LootGenerator(this.inventory, this.audio, this.quest, this.overlay, this.interaction);
	gameLoop = new GameLoop(
		this.inventory,
		this.audio,
		this.selection,
		this.overlay,
		this.loot,
		this.quest,
		this.notifications,
		this.augment
	);
	leaderboard = new Leaderboard();
	tutorial = new Tutorial(this.gameLoop, this.loot, this.inventory, this.quest, this.augment);
}

const GAME_KEY = Symbol('GAME');
export const initGame = () => setContext(GAME_KEY, new Game());
export const getGameContext = () => getContext<Game>(GAME_KEY);
