import { setContext, getContext } from 'svelte';
import { Inventory } from './inventory.svelte';
import { Interaction } from './interaction.svelte';
import { Overlay } from './overlay.svelte';
import { DebugStore } from './debug.svelte';
import { LootGenerator } from './loot.svelte';
import { Selection } from './selection.svelte';
import { GameLoop } from './game-loop.svelte';
import { AudioManager } from './audio.svelte';
import { Quest } from './quest.svelte';

export class Game {
	audio = new AudioManager();
	selection = new Selection(this.audio);
	inventory = new Inventory(this.selection, this.audio);
	overlay = new Overlay();
	debug = new DebugStore();
	interaction = new Interaction(this.inventory, this.overlay, this.selection, this.audio);
	loot = new LootGenerator(this.inventory, this.audio);
	quest = new Quest(this.inventory, this.audio);
	gameLoop = new GameLoop(
		this.inventory,
		this.audio,
		this.selection,
		this.overlay,
		this.loot,
		this.quest
	);
}

const GAME_KEY = Symbol('GAME');
export const initGame = () => setContext(GAME_KEY, new Game());
export const getGameContext = () => getContext<Game>(GAME_KEY);
