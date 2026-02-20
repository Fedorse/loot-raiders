import type { InstanceItem } from '$lib/types';
import { getDef } from './config/items';

export function isWeapon(item: InstanceItem | null): boolean {
	if (!item) return false;
	const def = getDef(item.defId);
	return def.type === 'weapon';
}
