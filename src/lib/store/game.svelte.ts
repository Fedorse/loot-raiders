import { setContext, getContext } from 'svelte';
import { Inventory } from './inventory.svelte';
import { Interaction } from './interaction.svelte';
import { Overlay } from './overlay.svelte';
import { DebugStore } from './debug.svelte';

export class Game {
	inventory = new Inventory();
	overlay = new Overlay();
	debug = new DebugStore();
	interaction = new Interaction(this.inventory, this.overlay, this.debug);
}

const GAME_KEY = Symbol('GAME');
export const initGame = () => setContext(GAME_KEY, new Game());
export const getGameContext = () => getContext<Game>(GAME_KEY);
