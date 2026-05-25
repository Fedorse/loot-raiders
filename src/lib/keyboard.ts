import type { Game } from '$lib/store/game.svelte';

export function handleGlobalKeydown(e: KeyboardEvent, game: Game): void {
	const { gameLoop, loot, overlay } = game;

	if (e.key === 'Escape') {
		if (gameLoop.status === 'playing') {
			gameLoop.pause();
		} else if (gameLoop.status === 'paused') {
			gameLoop.resume();
		} else {
			overlay.handleEscape();
		}
		return;
	}

	if (e.key === ' ' && gameLoop.status === 'playing') {
		e.preventDefault();
		loot.next();
	}
}
