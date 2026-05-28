<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { getGameContext } from '$lib/store/game.svelte';
	import { enterFullscreen, isTouchDevice } from '$lib/fullscreen';
	import AudioSettings from './audio-settings.svelte';
	import GameOverStats from './game-over-stats.svelte';

	let { showPreloader = false }: { showPreloader?: boolean } = $props();

	const { gameLoop, audio } = getGameContext();

	const BTN =
		'group flex w-full min-w-[200px] items-center justify-center rounded-md border border-[#2a2f4c] bg-[#0c101c]/80 py-2.5 transition-all hover:bg-[#1a2133] active:scale-[0.98] md:min-w-[240px] md:py-3 lg:min-w-[280px] lg:py-3.5 2xl:min-w-[320px] 2xl:py-4 3xl:min-w-[380px] 3xl:py-5';
</script>

{#snippet menuButton(label: string, onclick: () => void)}
	<button
		class={BTN}
		onclick={() => {
			audio.play('click');
			onclick();
		}}
	>
		<span
			class="2xl:text-md text-xs font-semibold tracking-wider text-white/80 group-hover:text-white md:text-sm lg:text-[15px] 3xl:text-lg"
		>
			{label}
		</span>
	</button>
{/snippet}

{#if gameLoop.status !== 'playing' && !showPreloader}
	<div
		class="fixed inset-0 z-[30] flex items-center justify-center bg-radial from-black/55 to-black/100 backdrop-blur-xs"
		transition:fade|global={{ duration: gameLoop.status === 'idle' ? 300 : 0 }}
	>
		<div
			class="flex flex-col items-center gap-4 md:gap-5 lg:gap-6 2xl:gap-8 3xl:gap-10"
			in:scale|global={{ duration: 200, start: 0.85 }}
		>
			{#if gameLoop.status === 'idle'}
				<div class="flex flex-col gap-2">
					{@render menuButton('Play', () => {
						if (isTouchDevice()) enterFullscreen();
						gameLoop.start();
					})}
					<AudioSettings />
				</div>
			{:else if gameLoop.status === 'paused'}
				<div class="flex flex-col gap-2">
					{@render menuButton('Resume', () => {
						if (isTouchDevice()) enterFullscreen();
						gameLoop.resume();
					})}
					{@render menuButton('Restart', () => {
						if (isTouchDevice()) enterFullscreen();
						gameLoop.restart();
					})}
					<AudioSettings />
				</div>
			{:else if gameLoop.status === 'over'}
				<GameOverStats />
			{/if}
		</div>

		{#if gameLoop.status === 'paused'}
			<div
				class="absolute bottom-12 left-4 flex gap-4 font-bold text-muted md:bottom-10 md:left-5 md:gap-6 2xl:bottom-14 2xl:left-6 2xl:gap-8 3xl:bottom-28 3xl:left-8 3xl:gap-10 pointer-coarse:hidden"
			>
				<div class="flex items-center gap-1.5 md:gap-2">
					<kbd
						class="inline-flex min-w-7 items-center justify-center rounded-md bg-gradient-to-b from-kbd-from via-kbd-via to-kbd-to px-1.5 py-0.5 text-[7px] font-semibold text-kbd-text uppercase shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_1px_2px_rgba(0,0,0,0.2)] md:min-w-8 md:px-2 md:py-1 md:text-[8px] lg:min-w-9 lg:text-[9px] xl:text-[10px] 2xl:min-w-11 2xl:text-xs 3xl:min-w-12 3xl:text-[13px]"
					>
						esc
					</kbd>
					<span
						class="text-[7px] font-semibold text-muted uppercase md:text-[8px] lg:text-[9px] xl:text-[10px] 2xl:text-xs 3xl:text-[13px]"
						>Resume</span
					>
				</div>
				<div class="flex items-center gap-1.5 md:gap-2">
					<img
						src="/assets/ui/icon-actions.webp"
						alt="category"
						class="size-3.5 object-contain md:size-4 2xl:size-5 3xl:size-6"
					/>
					<span
						class="text-[7px] font-semibold text-muted uppercase md:text-[8px] lg:text-[9px] xl:text-[10px] 2xl:text-xs 3xl:text-[13px]"
						>SELECT</span
					>
				</div>
			</div>
		{/if}
	</div>
{/if}
