import type { ItemRarity } from './items';

export interface RarityStyle {
	border: string;
	bg: string;
	glow: string;
	height: string;
}

export const RARITY_STYLES: Record<ItemRarity, RarityStyle> = {
	common: {
		border: 'bg-white/20',
		bg: 'bg-white/30',
		glow: 'bg-gray-600',
		height: 'h-[40%]'
	},
	uncommon: {
		border: 'from-green-500 via-green-500 via-5% to-slate-700 to-80%',
		bg: 'bg-green-500',
		glow: 'bg-green-400',
		height: 'h-[50%]'
	},
	rare: {
		border: 'from-blue-500 via-blue-400 via-5% to-slate-700 to-80%',
		bg: 'bg-blue-500',
		glow: 'bg-blue-400',
		height: 'h-[60%]'
	},
	epic: {
		border: 'from-purple-500 via-purple-500 via-5% to-slate-700 to-80%',
		bg: 'bg-purple-500',
		glow: 'bg-purple-400',
		height: 'h-[70%]'
	},
	legendary: {
		border: 'from-yellow-400 via-yellow-500 via-5% to-slate-700 to-80%',
		bg: 'bg-yellow-400',
		glow: 'bg-yellow-300',
		height: 'h-[80%]'
	}
};

export function getRarityStyle(rarity: ItemRarity): RarityStyle {
	return RARITY_STYLES[rarity] ?? RARITY_STYLES.common;
}
