export const NICK_MIN = 2;
export const NICK_MAX = 12;

export const EXTRACT_MAX = 1_000_000;
export const TIME_MAX = 600;

export const LEADERBOARD_TOP_N = 100;

export interface LeaderboardEntry {
	playerId: string;
	nickname: string;
	extract: number;
	time: number;
	createdAt: number;
}

export interface LeaderboardResponse {
	entries: LeaderboardEntry[];
	myPlayerId: string | null;
	myRank: number | null;
}

export interface SubmitRequest {
	nickname: string;
	extract: number;
	time: number;
}

export interface SubmitResponse {
	improved: boolean;
	rank: number | null;
}

const NICK_STRIP_REGEX = /[^A-Z0-9-]/g;

export function sanitizeNickname(raw: string): string {
	return raw.toUpperCase().replace(NICK_STRIP_REGEX, '').slice(0, NICK_MAX);
}

// TODO: nickname validation (length + allowed chars)
// TODO: parseSubmitBody — server-side body parsing with extract/time bounds check
