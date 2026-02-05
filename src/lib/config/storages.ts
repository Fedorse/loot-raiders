import type { ItemType } from './items';

export interface StorageConfig {
	name: string;
	size: number;
	allowedTypes: ItemType[];
	placeholder?: string;
}

export const STORAGE_CONFIGS: StorageConfig[] = [
	{
		name: 'lootBack',
		size: 20,
		allowedTypes: ['loot', 'attachment', 'weapon', 'augment']
	},
	{
		name: 'augment',
		size: 1,
		allowedTypes: ['augment'],
		placeholder: '/assets/placeholder/augment_placeholder.png'
	},
	{
		name: 'shield',
		size: 1,
		allowedTypes: ['shield'],
		placeholder: '/assets/placeholder/shield_placeholder.png'
	},
	{
		name: 'weapon',
		size: 2,
		allowedTypes: ['weapon'],
		placeholder: '/assets/placeholder/placeholder_weapon.png'
	},
	{
		name: 'backpack',
		size: 14,
		allowedTypes: ['loot', 'weapon', 'augment', 'shield', 'attachment']
	}
];

export function getStorageConfig(name: string): StorageConfig | undefined {
	return STORAGE_CONFIGS.find((config) => config.name === name);
}

export function getStorageSize(name: string): number {
	const config = getStorageConfig(name);
	return config?.size ?? 0;
}

export function getAllowedTypes(name: string): ItemType[] {
	const config = getStorageConfig(name);
	return config?.allowedTypes ?? [];
}
