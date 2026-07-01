<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import { toggleFullscreen, enterFullscreen, isTouchDevice } from '$lib/fullscreen';
	import AudioSettings from './audio-settings.svelte';
	import Video from '$lib/ui-icon/video.svelte';
	import Fullscreen from '$lib/ui-icon/fullscreen.svelte';

	const { audio, device, gameLoop, tutorial } = getGameContext();

	// Replay is gated to the main (idle) menu — never the pause menu, so there is no
	// in-progress run to discard and no confirmation modal is needed.
	const canReplay = $derived(gameLoop.status === 'idle');

	function onFullscreen() {
		audio.play('click');
		toggleFullscreen();
	}

	function howToPlay() {
		audio.play('click');
		if (isTouchDevice()) enterFullscreen();
		tutorial.start();
	}
</script>

{#if canReplay}
	<button
		onclick={howToPlay}
		class="group flex w-full items-center gap-3 rounded-md border border-[#e8e0d2]/15 bg-[#100c09]/60 px-5 py-3.5 text-left transition-all hover:bg-[#1a120c]/75 active:scale-[0.99] 2xl:gap-3.5 2xl:px-6 2xl:py-4 3xl:gap-4 3xl:px-7 3xl:py-4.5 4xl:px-8 4xl:py-5 pointer-coarse:gap-2 pointer-coarse:px-3.5 pointer-coarse:py-2.5"
	>
		<Video
			class="size-5 flex-none text-[#cabfb2] 2xl:size-[22px] 3xl:size-6 4xl:size-7 pointer-coarse:size-4"
		/>
		<span
			class="flex-1 text-[15px] font-semibold tracking-wider text-[#c6bcb0] group-hover:text-[#ece4d6] lg:text-base 2xl:text-[17px] 3xl:text-lg 4xl:text-xl pointer-coarse:text-sm"
			>How to Play</span
		>
	</button>

	<div
		class="my-0.5 hidden h-px w-full bg-[#e8e0d2]/10 md:my-0.5 md:block 2xl:my-1.5 pointer-coarse:hidden"
	></div>
{/if}

<AudioSettings />

<button
	onclick={onFullscreen}
	class="group flex w-full items-center gap-3 rounded-md border border-[#e8e0d2]/15 bg-[#100c09]/60 px-5 py-3.5 text-left transition-all hover:bg-[#1a120c]/75 active:scale-[0.99] 2xl:gap-3.5 2xl:px-6 2xl:py-4 3xl:gap-4 3xl:px-7 3xl:py-4.5 4xl:px-8 4xl:py-5 pointer-coarse:gap-2 pointer-coarse:px-3.5 pointer-coarse:py-2.5"
>
	<Fullscreen
		class="size-5 flex-none text-[#cabfb2] group-hover:text-[#ece4d6] 2xl:size-[22px] 3xl:size-6 4xl:size-7 pointer-coarse:size-4"
	/>
	<span
		class="flex-1 text-[15px] font-semibold tracking-wider text-[#c6bcb0] group-hover:text-[#ece4d6] lg:text-base 2xl:text-[17px] 3xl:text-lg 4xl:text-xl pointer-coarse:text-sm"
		>Fullscreen</span
	>
	<span
		class="font-mono text-[11px] font-bold tracking-wide text-[#9a8e84] uppercase 2xl:text-xs 3xl:text-[13px] 4xl:text-sm pointer-coarse:text-[10px]"
		>{device.isFullscreen ? 'On' : 'Off'}</span
	>
</button>
