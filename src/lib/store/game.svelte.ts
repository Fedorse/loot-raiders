import { setContext, getContext } from 'svelte';
import { InventoryManager } from './inventory-manger.svelte';
import { DndManager } from './dnd-manger.svelte';
import type { ItemInstance, SlotReference } from '$lib/config/items';

export class Game {
	inventory = new InventoryManager();
	dnd: DndManager;

	constructor() {
		this.dnd = new DndManager(
			(source, target, item) => {
				this.inventory.handleDrop(source, target, item);
			},

			(source) => {
				return this.inventory.splitStack(source);
			}
		);
	}

	handleDrop(source: SlotReference, target: SlotReference, draggedItem: ItemInstance) {
		this.inventory.handleDrop(source, target, draggedItem);
	}
}

const GAME_KEY = Symbol('GAME');
export const initGame = () => setContext(GAME_KEY, new Game());
export const getGameContext = () => getContext<Game>(GAME_KEY);
