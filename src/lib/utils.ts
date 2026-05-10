import type { ItemLocation } from '$lib/types';

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

export function uuid(): string {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
		(+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)
	);
}

export const formatTime = (seconds: number) => {
	const mins = Math.floor(Math.ceil(seconds) / 60);
	const secs = Math.ceil(seconds) % 60;
	return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
