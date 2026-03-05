import type { LootboxDef, ItemRarity } from '$lib/types';

export const LOOTBOX_DB: Record<ItemRarity, LootboxDef> = {
	common: {
		rarity: 'common',
		image: '/assets/ui/loot_box_assets/WickerBasket.png',
		slots: 4,
		spinWeight: 50,
		rarityWeights: { common: 80, uncommon: 15, rare: 5, epic: 0, legendary: 0 }
	},
	uncommon: {
		rarity: 'uncommon',
		image: '/assets/ui/loot_box_assets/Bucket.png',
		slots: 5,
		spinWeight: 25,
		rarityWeights: { common: 30, uncommon: 50, rare: 15, epic: 5, legendary: 0 }
	},
	rare: {
		rarity: 'rare',
		image: '/assets/ui/loot_box_assets/PicnicBasket.png',
		slots: 6,
		spinWeight: 15,
		rarityWeights: { common: 10, uncommon: 30, rare: 40, epic: 15, legendary: 5 }
	},
	epic: {
		rarity: 'epic',
		image: '/assets/ui/loot_box_assets/Cauldron.png',
		slots: 7,
		spinWeight: 8,
		rarityWeights: { common: 0, uncommon: 10, rare: 30, epic: 50, legendary: 10 }
	},
	legendary: {
		rarity: 'legendary',
		image: '/assets/ui/loot_box_assets/AirtightContainer.png',
		slots: 8,
		spinWeight: 2,
		rarityWeights: { common: 0, uncommon: 0, rare: 15, epic: 40, legendary: 45 }
	}
};

export const LOOTBOX_ORDER: ItemRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export const getLootboxDef = (rarity: ItemRarity): LootboxDef => {
	return LOOTBOX_DB[rarity];
};
