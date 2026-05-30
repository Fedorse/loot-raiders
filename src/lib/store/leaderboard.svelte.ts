import type {
	LeaderboardEntry,
	LeaderboardResponse,
	SubmitResponse
} from '$lib/leaderboard/schema';

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

export type { LeaderboardEntry };

export class Leaderboard {
	entries = $state<LeaderboardEntry[]>([]);
	myPlayerId = $state<string | null>(null);
	myRank = $state<number | null>(null);
	nickname = $state('');
	loading = $state(false);
	error = $state<string | null>(null);
	pulseMyRow = $state(false);
	initialized = $state(false);

	hasNickname = $derived(this.nickname.trim().length > 0);
	sortedEntries = $derived(this.entries);

	init() {
		if (this.initialized) return;
		this.initialized = true;
		this.nickname = readNickname();
		this.refresh();
	}

	async refresh() {
		this.loading = true;
		this.error = null;
		try {
			const res = await fetch('/api/leaderboard');
			if (!res.ok) throw new Error(`http_${res.status}`);
			const data = (await res.json()) as LeaderboardResponse;
			this.entries = data.entries;
			this.myPlayerId = data.myPlayerId;
			this.myRank = data.myRank;
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'failed_to_load';
		} finally {
			this.loading = false;
		}
	}

	setNickname(value: string) {
		const trimmed = value.trim();
		this.nickname = trimmed;
		writeNickname(trimmed);
	}

	async submit(extract: number, time: number): Promise<boolean> {
		if (!this.hasNickname) return false;
		this.loading = true;
		this.error = null;
		try {
			const res = await fetch('/api/leaderboard', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					nickname: this.nickname,
					extract: Math.max(0, Math.round(extract)),
					time: Math.max(0, Math.round(time))
				})
			});
			if (!res.ok) throw new Error(`http_${res.status}`);
			const data = (await res.json()) as SubmitResponse;
			this.pulseMyRow = true;
			await this.refresh();
			this.myRank = data.rank;
			return true;
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'failed_to_submit';
			return false;
		} finally {
			this.loading = false;
		}
	}

	clearLastSubmitted() {
		this.pulseMyRow = false;
	}
}
