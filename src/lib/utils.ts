import type { InstanceItem, ItemLocation } from '$lib/types';
import { getDef } from './config/items';

export function isWeapon(item: InstanceItem | null): boolean {
	if (!item) return false;
	const def = getDef(item.defId);
	return def.type === 'weapon';
}

export function isEqualLocation(a: ItemLocation, b: ItemLocation): boolean {
	if (a.type !== b.type) return false;
	if (a.type === 'container' && b.type === 'container') {
		return a.storageId === b.storageId && a.index === b.index;
	}
	if (a.type === 'attachment' && b.type === 'attachment') {
		return a.attachIndex === b.attachIndex && isEqualLocation(a.parentLocation, b.parentLocation);
	}
	return false;
}
