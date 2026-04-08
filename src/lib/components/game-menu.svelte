<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { getGameContext } from '$lib/store/game.svelte';
	import AudioSettings from './audio-settings.svelte';

	const { gameLoop, audio } = getGameContext();

	const BTN =
		'group flex w-full min-w-[320px] items-center justify-center  rounded-md border border-[#2a2f4c] bg-[#0c101c]/80  py-4  transition-all hover:bg-[#1a2133] active:scale-[0.98]';
</script>

{#snippet menuButton(label: string, onclick: () => void)}
	<button
		class={BTN}
		onclick={() => {
			audio.play('click');
			onclick();
		}}
	>
		<span class="text-md font-semibold tracking-wider text-white/80 group-hover:text-white">
			{label}
		</span>
	</button>
{/snippet}

{#if gameLoop.status !== 'playing'}
	<div
		class="fixed inset-0 z-[10] flex items-center justify-center bg-black/70 backdrop-blur-xs"
		transition:fade={{ duration: 150 }}
	>
		<div class="flex flex-col items-center gap-8" transition:scale={{ duration: 200, start: 0.5 }}>
			{#if gameLoop.status === 'idle'}
				<div class="flex flex-col gap-2">
					{@render menuButton('Play', () => gameLoop.start())}
					<AudioSettings />
				</div>
			{:else if gameLoop.status === 'paused'}
				<div class="flex flex-col gap-2">
					{@render menuButton('Resume', () => gameLoop.resume())}
					{@render menuButton('Restart', () => gameLoop.restart())}
					<AudioSettings />
				</div>
			{:else if gameLoop.status === 'over'}
				<h1 class="text-3xl font-black tracking-tight text-white uppercase">Game Over</h1>
				<div class="text-4xl font-bold text-white">{gameLoop.score} pts</div>

				<div class="flex flex-col gap-2">
					{@render menuButton('Retry', () => gameLoop.start())}
					<AudioSettings />
				</div>
			{/if}
		</div>

		{#if gameLoop.status !== 'idle'}
			<div class="text-md absolute bottom-24 left-6 flex gap-8 font-bold text-muted">
				<div class="flex items-center gap-2">
					<kbd
						class="inline-flex min-w-11 items-center justify-center rounded-md bg-gradient-to-b from-kbd-from via-kbd-via to-kbd-to px-2 py-1 text-xs font-semibold text-kbd-text uppercase shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_1px_2px_rgba(0,0,0,0.2)]"
					>
						esc
					</kbd>
					<span class="text-xs font-semibold text-muted uppercase">Resume</span>
				</div>
				<div class="flex items-center gap-2">
					<img src="/assets/ui/icon-actions.png" alt="category" class="size-5 object-contain" />
					<span class="text-xs font-semibold text-muted uppercase">SELECT</span>
				</div>
			</div>
		{/if}
	</div>
{/if}
