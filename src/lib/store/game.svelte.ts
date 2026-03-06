import { setContext, getContext } from 'svelte';
import { Inventory } from './inventory.svelte';
import { Interaction } from './interaction.svelte';
import { Overlay } from './overlay.svelte';
import { DebugStore } from './debug.svelte';
import { LootGenerator } from './loot.svelte';
import { Tetris } from './tetris.svelte';
import { TETRIS_CONFIG } from '$lib/config/tetris';

export class Game {
	inventory = new Inventory();
	overlay = new Overlay();
	debug = new DebugStore();
	interaction = new Interaction(this.inventory, this.overlay);
	loot = new LootGenerator(this.inventory);
	tetris = new Tetris(this.inventory, TETRIS_CONFIG);
}

const GAME_KEY = Symbol('GAME');
export const initGame = () => setContext(GAME_KEY, new Game());
export const getGameContext = () => getContext<Game>(GAME_KEY);
