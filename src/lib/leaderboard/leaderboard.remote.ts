import { command, getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import * as db from '$lib/server/leaderboard-db';
import { rateLimit } from '$lib/server/rate-limit';
import { submitSchema } from '$lib/server/leaderboard-validation';
import type { LeaderboardResponse, SubmitResponse } from '$lib/leaderboard/schema';

const SUBMIT_WINDOW_SEC = 60;
const SUBMIT_MAX_PER_PLAYER = 10;
const SUBMIT_MAX_PER_IP = 30;

export const getLeaderboard = query(async (): Promise<LeaderboardResponse> => {
	const { locals } = getRequestEvent();
	const [entries, myRank] = await Promise.all([
		db.getTopEntries(),
		db.getPlayerRank(locals.playerId)
	]);
	return { entries, myPlayerId: locals.playerId, myRank };
});

export const submitScore = command(
	submitSchema,
	async ({ nickname, extract, time }): Promise<SubmitResponse> => {
		const event = getRequestEvent();
		const { playerId } = event.locals;
		const ip = event.getClientAddress();

		const [playerOk, ipOk] = await Promise.all([
			rateLimit(`rl:submit:pid:${playerId}`, SUBMIT_MAX_PER_PLAYER, SUBMIT_WINDOW_SEC),
			rateLimit(`rl:submit:ip:${ip}`, SUBMIT_MAX_PER_IP, SUBMIT_WINDOW_SEC)
		]);
		if (!playerOk || !ipOk) {
			error(429, 'Too many submissions. Please wait a moment and try again.');
		}

		const { improved } = await db.submitScore(playerId, nickname, extract, time);
		const rank = await db.getPlayerRank(playerId);
		void getLeaderboard().refresh();

		return { improved, rank };
	}
);
