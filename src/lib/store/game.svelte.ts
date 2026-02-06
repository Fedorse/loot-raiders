import { setContext, getContext } from 'svelte';
import { InventoryManager } from './inventory-manger.svelte';
import { DndManager } from './ui-state.svelte';
import type { ItemInstance, SlotReference } from '$lib/config/items';

export class Game {
	inventory = new InventoryManager();
	dnd: DndManager;

	constructor() {
		this.dnd = new DndManager((source, target, item) => {
			this.inventory.handleDrop(source, target, item);
		});
	}

	handleDrop(source: SlotReference, target: SlotReference, draggedItem: ItemInstance) {
		this.inventory.handleDrop(source, target, draggedItem);
	}
}

const GAME_KEY = Symbol('GAME');
export const initGame = () => setContext(GAME_KEY, new Game());
export const getGameContext = () => getContext<Game>(GAME_KEY);
