import { setContext, getContext } from 'svelte';
import { InventoryManager } from './inventory-manger.svelte';
import { DndManager } from './dnd-manger.svelte';
import type { SlotReference } from '$lib/config/items';

export class Game {
	inventory = new InventoryManager();
	dnd: DndManager;

	constructor() {
		this.dnd = new DndManager((source, target) => this.handleDrop(source, target));
	}

	handleDrop(source: SlotReference, target: SlotReference) {
		this.inventory.handleDrop(source, target);
	}
}

const GAME_KEY = Symbol('GAME');
export const initGame = () => setContext(GAME_KEY, new Game());
export const getGameContext = () => getContext<Game>(GAME_KEY);
