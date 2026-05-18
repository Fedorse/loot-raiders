import { ITEM_DB } from '$lib/config/items';
import type { Inventory } from './inventory.svelte';
import type { Quest } from './quest.svelte';
import type { Overlay } from './overlay.svelte';
import type { Interaction } from './interaction.svelte';
import type { ItemRarity, ItemDefinition, ItemType, InstanceItem, ItemLocation } from '$lib/types';
import { randInt } from '$lib/utils';
import { SvelteSet } from 'svelte/reactivity';
import type { AudioManager } from './audio.svelte';
import { getDef } from '$lib/config/items';

function isInLootBack(loc: ItemLocation): boolean {
	if (loc.type === 'slot') return loc.storageId === 'lootBack';
	if (loc.type === 'attachment') return isInLootBack(loc.parentLocation);
	return false;
}

type ItemPool = Record<ItemType, Record<ItemRarity, ItemDefinition[]>>;

type LoadingStatus = 'idle' | 'loading' | 'done';

export interface LootProfile {
	typeWeights: Record<ItemType, number>;
	typeCaps: Partial<Record<ItemType, number>>;
	rarityWeights: Record<ItemRarity, number>;
	attachmentChance: number;
	getStackRange: (def: ItemDefinition) => [number, number];
}

interface RawLootItem {
	def: ItemDefinition;
	count: number;
	attachments: (ItemDefinition | null)[] | null;
}

export const DEFAULT_STACK_RANGES: Record<ItemRarity, [number, number]> = {
	common: [1, 5],
	uncommon: [1, 3],
	rare: [1, 2],
	epic: [1, 1],
	legendary: [1, 1]
};

function buildItemPool(): ItemPool {
	const pool = {} as ItemPool;
	for (const type of ['loot', 'weapon', 'augment', 'shield', 'attachment'] as ItemType[]) {
		pool[type] = { common: [], uncommon: [], rare: [], epic: [], legendary: [] };
	}
	for (const def of Object.values(ITEM_DB)) {
		pool[def.type][def.rarity].push(def);
	}
	return pool;
}

const itemPool = buildItemPool();

function weightedRoll<T extends string>(weights: Record<T, number>): T {
	const entries = Object.entries(weights) as [T, number][];
	const total = entries.reduce((sum, [, w]) => sum + w, 0);
	let roll = Math.random() * total;
	for (const [key, weight] of entries) {
		roll -= weight;
		if (roll <= 0) return key;
	}
	return entries[0][0];
}

function pickRandom<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function rollItemType(profile: LootProfile, currentCounts: Record<string, number>): ItemType {
	const adjustedWeights = { ...profile.typeWeights };
	for (const [type, cap] of Object.entries(profile.typeCaps)) {
		if ((currentCounts[type] ?? 0) >= (cap as number)) {
			adjustedWeights[type as ItemType] = 0;
		}
	}
	return weightedRoll(adjustedWeights);
}

function rollItemRarity(profile: LootProfile, type: ItemType): ItemRarity {
	const adjustedRarity = { ...profile.rarityWeights };
	for (const rarity of Object.keys(adjustedRarity) as ItemRarity[]) {
		if (itemPool[type][rarity].length === 0) {
			adjustedRarity[rarity] = 0;
		}
	}
	return weightedRoll(adjustedRarity);
}

function rollAttachmentsForWeapon(
	profile: LootProfile,
	def: ItemDefinition
): (ItemDefinition | null)[] | null {
	if (profile.attachmentChance <= 0 || def.type !== 'weapon' || !def.attachmentSlots?.length) {
		return null;
	}

	return def.attachmentSlots.map((slot) => {
		if (Math.random() > profile.attachmentChance) return null;

		const candidates = Object.values(ITEM_DB).filter(
			(d) => d.type === 'attachment' && d.attachmentKind === slot.type
		);
		return candidates.length > 0 ? pickRandom(candidates) : null;
	});
}

function generateLootItems(profile: LootProfile, count: number): RawLootItem[] {
	const typeCounts: Record<string, number> = {};
	const result: RawLootItem[] = [];

	for (let i = 0; i < count; i++) {
		const type = rollItemType(profile, typeCounts);
		typeCounts[type] = (typeCounts[type] ?? 0) + 1;

		const rarity = rollItemRarity(profile, type);

		const def = pickRandom(itemPool[type][rarity]);

		const [min, max] = profile.getStackRange(def);
		const itemCount = type === 'loot' ? randInt(min, Math.min(max, def.maxStack ?? 1)) : 1;

		const attachments = rollAttachmentsForWeapon(profile, def);

		result.push({ def, count: itemCount, attachments });
	}

	return result;
}

export class LootGenerator {
	private inventory: Inventory;
	private audio: AudioManager;
	private quest: Quest;
	private overlay: Overlay;
	private interaction: Interaction;
	phase = $state<LoadingStatus>('idle');
	private lootQueue = $state<string[]>([]);
	private scanIndex = $state(-1);
	shineQueue = new SvelteSet<string>();
	cooldown = $state(0);
	chestsOpened = $state(0);

	constructor(
		inventory: Inventory,
		audio: AudioManager,
		quest: Quest,
		overlay: Overlay,
		interaction: Interaction
	) {
		this.inventory = inventory;
		this.audio = audio;
		this.quest = quest;
		this.overlay = overlay;
		this.interaction = interaction;
	}

	tick(dt: number): void {
		if (this.phase === 'loading') return;
		this.cooldown -= dt;
		if (this.cooldown <= 0) {
			this.next();
		}
	}

	private generateQuestItems(): InstanceItem[] {
		const unmatched = this.quest.items.filter((q) => !q.matched);
		if (unmatched.length === 0) return [];

		const picks = unmatched.length === 1 ? [unmatched[0]] : [];
		if (unmatched.length > 1) {
			const shuffled = [...unmatched].sort(() => Math.random() - 0.5);
			picks.push(shuffled[0], shuffled[1]);
		}

		return picks.map((q) => {
			const def = ITEM_DB[q.defId];
			const count =
				def.maxStack && def.maxStack > 1 ? randInt(1, Math.min(q.count, def.maxStack)) : 1;
			return this.inventory.createItem(q.defId, count);
		});
	}

	next(): void {
		const modal = this.overlay.recycleModal;
		if (modal && isInLootBack(modal.location)) {
			this.overlay.closeRecycleModal();
		}

		const drag = this.interaction.dragState;
		if (drag && isInLootBack(drag.sourceLocation)) {
			this.interaction.cancel();
		}

		const { lootCooldown, lootProfile } = this.quest.stageDef;
		this.cooldown = lootCooldown;
		this.inventory.clearStorage('lootBack');
		this.shineQueue.clear();

		const questItems = this.generateQuestItems();
		const randomCount = randInt(4, 16) - questItems.length;
		const rawItems = generateLootItems(lootProfile, randomCount);

		const items: InstanceItem[] = rawItems.map((raw) => {
			const item = this.inventory.createItem(raw.def.id, raw.count);
			if (raw.attachments && item.attachments) {
				item.attachments = raw.attachments.map((attDef) =>
					attDef ? this.inventory.createItem(attDef.id, 1) : null
				);
			}
			return item;
		});

		// Insert quest items at random positions
		for (const qi of questItems) {
			const pos = randInt(0, items.length);
			items.splice(pos, 0, qi);
		}

		this.inventory.fillStorage('lootBack', items);
		this.lootQueue = items.map((i) => i.uid);
		this.scanIndex = 0;
		this.phase = 'loading';
		this.chestsOpened++;
	}

	slotScanned(): void {
		const uid = this.lootQueue[this.scanIndex];
		if (uid) this.shineQueue.add(uid);
		const loc: ItemLocation = { type: 'slot', storageId: 'lootBack', index: this.scanIndex };
		const item = this.inventory.getItem(loc);
		if (item) {
			const def = getDef(item.defId);
			if (def.rarity === 'legendary' || def.rarity === 'epic') {
				this.audio.play('rare_loot');
			}
		}
		this.scanIndex++;
		if (this.scanIndex >= this.lootQueue.length) {
			this.phase = 'done';
		}
	}

	clearShine(uid: string): void {
		this.shineQueue.delete(uid);
	}

	scanning(uid: string): boolean {
		return this.phase === 'loading' && this.lootQueue[this.scanIndex] === uid;
	}

	hidden(uid: string): boolean {
		if (this.phase !== 'loading') return false;
		const idx = this.lootQueue.indexOf(uid);
		return idx >= 0 && idx > this.scanIndex;
	}
	reset() {
		this.phase = 'idle';
		this.scanIndex = -1;
		this.lootQueue = [];
		this.shineQueue.clear();
		this.chestsOpened = 0;
	}
}
