import type { StorageConfig, ItemType, StorageId } from '$lib/types';

export const STORAGE_CONFIGS: Record<StorageId, StorageConfig> = {
	lootBack: {
		name: 'lootBack',
		size: 20,
		allowedTypes: ['loot', 'attachment', 'weapon', 'augment']
	},
	augment: {
		name: 'augment',
		size: 1,
		allowedTypes: ['augment'],
		placeholder: '/assets/placeholder/augment_placeholder.png'
	},
	shield: {
		name: 'shield',
		size: 1,
		allowedTypes: ['shield'],
		placeholder: '/assets/placeholder/shield_placeholder.png'
	},
	weapon: {
		name: 'weapon',
		size: 2,
		allowedTypes: ['weapon'],
		placeholder: '/assets/placeholder/placeholder_weapon.png'
	},
	backpack: {
		name: 'backpack',
		size: 14,
		allowedTypes: ['loot', 'weapon', 'augment', 'shield', 'attachment']
	}
};

export const getStorageConfig = (name: StorageId): StorageConfig => {
	return STORAGE_CONFIGS[name];
};

export const getAllowedTypes = (name: StorageId): ItemType[] => {
	const config = getStorageConfig(name);
	return config?.allowedTypes ?? [];
};
