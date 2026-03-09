import { setContext, getContext } from 'svelte';
import { Inventory } from './inventory.svelte';
import { Interaction } from './interaction.svelte';
import { Overlay } from './overlay.svelte';
import { DebugStore } from './debug.svelte';
import { LootGenerator } from './loot.svelte';
import { Selection } from './selection.svelte';


export class Game {
	selection = new Selection();
	inventory = new Inventory(this.selection);
	overlay = new Overlay();
	debug = new DebugStore();
	interaction = new Interaction(this.inventory, this.overlay, this.selection);
	loot = new LootGenerator(this.inventory);

}

const GAME_KEY = Symbol('GAME');
export const initGame = () => setContext(GAME_KEY, new Game());
export const getGameContext = () => getContext<Game>(GAME_KEY);
