import type { ItemType } from './items';

export interface StorageConfig {
	name: string;
	size: number;
	allowedTypes: ItemType[];
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
		allowedTypes: ['augment']
	},
	{
		name: 'shield',
		size: 1,
		allowedTypes: ['shield']
	},
	{
		name: 'weapon',
		size: 2,
		allowedTypes: ['weapon']
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
