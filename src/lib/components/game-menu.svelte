<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { getGameContext } from '$lib/store/game.svelte';

	const { gameLoop, audio } = getGameContext();
</script>

{#if gameLoop.status !== 'playing'}
	<div
		class="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
	>
		<div class="flex flex-col items-center gap-6" transition:scale={{ duration: 200, start: 0.95 }}>
			{#if gameLoop.status === 'idle'}
				<h1 class="text-4xl font-black tracking-tight text-white uppercase">Loot Raiders</h1>
				<button
					class="rounded-lg bg-white/10 px-8 py-3 text-sm font-bold text-white uppercase transition-colors hover:bg-white/20"
					onclick={() => {
						gameLoop.start();
					}}
				>
					Start
				</button>
			{:else if gameLoop.status === 'paused'}
				<h1 class="text-3xl font-black tracking-tight text-white uppercase">Paused</h1>
				<div class="text-2xl font-bold text-white/80">{gameLoop.score} pts</div>
				<div class="flex gap-3">
					<button
						class="rounded-lg bg-white/10 px-6 py-3 text-sm font-bold text-white uppercase transition-colors hover:bg-white/20"
						onclick={() => {
							gameLoop.resume();
						}}
					>
						Resume
					</button>
					<button
						class="rounded-lg bg-white/10 px-6 py-3 text-sm font-bold text-white/60 uppercase transition-colors hover:bg-white/20 hover:text-white"
						onclick={() => {
							gameLoop.start();
						}}
					>
						Restart
					</button>
				</div>
			{:else if gameLoop.status === 'over'}
				<h1 class="text-3xl font-black tracking-tight text-white uppercase">Game Over</h1>
				<div class="text-4xl font-bold text-white">{gameLoop.score} pts</div>
				<button
					class="rounded-lg bg-white/10 px-8 py-3 text-sm font-bold text-white uppercase transition-colors hover:bg-white/20"
					onclick={() => gameLoop.start()}
				>
					Retry
				</button>
			{/if}
		</div>
	</div>
{/if}
