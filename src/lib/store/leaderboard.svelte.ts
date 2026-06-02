const STORAGE_NICKNAME = 'lr:nickname:v1';

function readNickname(): string {
	if (typeof window === 'undefined') return '';
	try {
		return window.localStorage.getItem(STORAGE_NICKNAME) ?? '';
	} catch {
		return '';
	}
}

function writeNickname(value: string) {
	if (typeof window === 'undefined') return;
	try {
		window.localStorage.setItem(STORAGE_NICKNAME, value);
	} catch {
		// quota exceeded or storage disabled — silently ignore
	}
}

export class Leaderboard {
	nickname = $state('');
	initialized = $state(false);

	hasNickname = $derived(this.nickname.trim().length > 0);

	init() {
		if (this.initialized) return;
		this.initialized = true;
		this.nickname = readNickname();
	}

	setNickname(value: string) {
		const trimmed = value.trim();
		this.nickname = trimmed;
		writeNickname(trimmed);
	}
}
