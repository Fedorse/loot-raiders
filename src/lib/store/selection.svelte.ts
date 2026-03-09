import { SvelteSet } from 'svelte/reactivity';

export class Selection {
	ids = new SvelteSet<string>();

	isSelected(uid: string): boolean {
		return this.ids.has(uid);
	}

	select(uid: string): void {
		this.ids.clear();
		this.ids.add(uid);
	}

	toggle(uid: string): void {
		if (this.ids.has(uid)) {
			this.ids.delete(uid);
		} else {
			this.ids.add(uid);
		}
	}

	deselect(uid: string): void {
		this.ids.delete(uid);
	}

	clear(): void {
		this.ids.clear();
	}
}
