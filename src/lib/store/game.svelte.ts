import { setContext, getContext } from 'svelte';
import { InventoryManager } from './inventory-manger.svelte';
import { InventoryOperations } from './inventory-operations.ts';
import { DndManager } from './ui-state.svelte';
import type { StoredItem } from '$lib/store/inventory-manger.svelte';
import type { DropTarget } from '$lib/config/items';

export class Game {
	inventory = new InventoryManager();
	inventoryOperations = new InventoryOperations(this.inventory);
	dnd: DndManager;

	constructor() {
		this.dnd = new DndManager((dragOrigin: StoredItem, dropTarget: DropTarget) => {
			this.inventoryOperations.handleDrop(dragOrigin, dropTarget);
		});
	}
}

const GAME_KEY = Symbol('GAME');
export const initGame = () => setContext(GAME_KEY, new Game());
export const getGameContext = () => getContext<Game>(GAME_KEY);
