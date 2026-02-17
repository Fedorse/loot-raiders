import { setContext, getContext } from 'svelte';
import { InventoryManager } from './inventory-manger.svelte';
import { InventoryOperations } from './inventory-operations.ts';
import { InteractionManager } from './interaction-manager.svelte';

export class Game {
	inventory = new InventoryManager();
	inventoryOperations = new InventoryOperations(this.inventory);
	interaction: InteractionManager;

	constructor() {
		this.interaction = new InteractionManager({
			onDrop: (o, t) => this.inventoryOperations.handleDrop(o, t),
			onSelectSingle: (uid) => this.inventoryOperations.selectSingle(uid),
			onToggleSelection: (uid) => this.inventoryOperations.toggleSelection(uid),
			onQuickMove: (item) => this.inventoryOperations.quickMove(item)
		});
	}
}

const GAME_KEY = Symbol('GAME');
export const initGame = () => setContext(GAME_KEY, new Game());
export const getGameContext = () => getContext<Game>(GAME_KEY);
