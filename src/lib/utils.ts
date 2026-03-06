import type { InstanceItem, ItemLocation } from '$lib/types';
import { getDef } from './config/items';

export function isWeapon(item: InstanceItem | null): boolean {
	if (!item) return false;
	const def = getDef(item.defId);
	return def.type === 'weapon';
}

export function isEqualLocation(a: ItemLocation, b: ItemLocation): boolean {
	if (a.type !== b.type) return false;
	if (a.type === 'slot' && b.type === 'slot') {
		return a.storageId === b.storageId && a.index === b.index;
	}
	if (a.type === 'attachment' && b.type === 'attachment') {
		if (a.attachIndex !== b.attachIndex) return false;
		const pa = a.parentLocation;
		const pb = b.parentLocation;
		return (
			pa.type === 'slot' &&
			pb.type === 'slot' &&
			pa.storageId === pb.storageId &&
			pa.index === pb.index
		);
	}
	return false;
}

export function randInt(min: number, max: number): number {
	return min + Math.floor(Math.random() * (max - min + 1));
}
