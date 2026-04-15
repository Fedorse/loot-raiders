import { ITEM_DB } from '$lib/config/items';
import type { Inventory } from './inventory.svelte';
import type { AudioManager } from './audio.svelte';
import type { ItemDefinition } from '$lib/types';

export interface QuestItem {
	id: string;
	defId: string;
	count: number;
	def: ItemDefinition;
	matched: boolean;
}

const MOCK_QUESTS: { defId: string; count: number }[] = [
	{ defId: 'res_arc_circuitry', count: 2 },
	{ defId: 'loot_chemicals', count: 1 },
	{ defId: 'loot_battery', count: 3 },
	{ defId: 'res_metal_parts', count: 2 },
	{ defId: 'wpn_tempest', count: 1 }
];

const POINTS_PER_QUEST = 10;
const TIME_BONUS = 3;

export class Quest {
	private inventory: Inventory;
	private audio: AudioManager;

	items = $state<QuestItem[]>([]);

	completed = $derived(this.items.filter((i) => i.matched).length);
	total = $derived(this.items.length);
	allCompleted = $derived(this.items.length > 0 && this.items.every((i) => i.matched));

	constructor(inventory: Inventory, audio: AudioManager) {
		this.inventory = inventory;
		this.audio = audio;
	}

	reset() {
		this.items = MOCK_QUESTS.map((m) => ({
			id: crypto.randomUUID(),
			defId: m.defId,
			count: m.count,
			def: ITEM_DB[m.defId],
			matched: false
		}));
	}

	getCollected(defId: string): number {
		return this.inventory.countAvailable(defId);
	}

	checkMatches(): { score: number; timeBonus: number } {
		let score = 0;
		let timeBonus = 0;

		for (const quest of this.items) {
			if (quest.matched) continue;
			const available = this.inventory.countAvailable(quest.defId);
			if (available < quest.count) continue;

			this.inventory.consumeMatched(quest.defId, quest.count);
			quest.matched = true;
			score += POINTS_PER_QUEST;
			timeBonus += TIME_BONUS;
			this.audio.play('match');
		}

		return { score, timeBonus };
	}
}
