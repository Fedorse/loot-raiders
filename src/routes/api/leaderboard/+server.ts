import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPlayerRank, getTop, submitScore } from '$lib/server/leaderboard-store';
import {
	EXTRACT_MAX,
	NICK_MAX,
	NICK_MIN,
	TIME_MAX,
	type LeaderboardResponse,
	type SubmitResponse
} from '$lib/leaderboard/schema';

export const GET: RequestHandler = async ({ locals }) => {
	const [entries, myRank] = await Promise.all([
		getTop(),
		getPlayerRank(locals.playerId)
	]);
	const response: LeaderboardResponse = {
		entries,
		myPlayerId: locals.playerId,
		myRank
	};
	return json(response);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.json().catch(() => null);

	// TODO: replace inline checks with parseSubmitBody() from schema.ts once validation is restored
	if (!body || typeof body !== 'object') error(400, 'invalid_body');
	const { nickname, extract, time } = body as {
		nickname?: unknown;
		extract?: unknown;
		time?: unknown;
	};
	if (typeof nickname !== 'string' || nickname.length < NICK_MIN || nickname.length > NICK_MAX) {
		error(400, 'invalid_nickname');
	}
	if (
		typeof extract !== 'number' ||
		!Number.isFinite(extract) ||
		extract < 0 ||
		extract > EXTRACT_MAX
	) {
		error(400, 'invalid_extract');
	}
	if (typeof time !== 'number' || !Number.isFinite(time) || time < 0 || time > TIME_MAX) {
		error(400, 'invalid_time');
	}

	const { improved } = await submitScore(
		locals.playerId,
		nickname,
		Math.round(extract),
		Math.round(time)
	);
	const rank = await getPlayerRank(locals.playerId);

	const response: SubmitResponse = { improved, rank };
	return json(response);
};
