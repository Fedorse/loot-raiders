<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import { enterFullscreen, isTouchDevice } from '$lib/fullscreen';
	import MenuCommon from './menu-common.svelte';
	import Play from '$lib/ui-icon/play.svelte';
	import Restart from '$lib/ui-icon/restart.svelte';

	const { gameLoop, audio } = getGameContext();

	function resume() {
		audio.play('click');
		if (isTouchDevice()) enterFullscreen();
		gameLoop.resume();
	}
	function restart() {
		audio.play('click');
		if (isTouchDevice()) enterFullscreen();
		gameLoop.restart();
	}
</script>

<div class="flex flex-col gap-3 lg:gap-3.5 3xl:gap-4 4xl:gap-5 pointer-coarse:gap-2">
	<button
		onclick={resume}
		class="group flex w-full items-center gap-3 rounded-md bg-primary px-5 py-4 text-left font-bold transition-all hover:bg-primary-hover active:scale-[0.99] 2xl:gap-3.5 2xl:px-6 2xl:py-4.5 3xl:gap-4 3xl:px-7 3xl:py-5 4xl:px-8 4xl:py-5.5 pointer-coarse:gap-2 pointer-coarse:px-3.5 pointer-coarse:py-2.5"
	>
		<Play
			class="size-[18px] flex-none text-primary-foreground 2xl:size-5 3xl:size-6 4xl:size-7 pointer-coarse:size-4"
		/>
		<span
			class="flex-1 text-base font-extrabold tracking-wide text-primary-foreground 2xl:text-[17px] 3xl:text-lg 4xl:text-xl pointer-coarse:text-sm"
			>Resume</span
		>
		<kbd
			class="inline-flex min-w-8 items-center justify-center rounded-md bg-black/20 px-1.5 py-0.5 text-[9px] font-bold text-black/60 uppercase md:min-w-9 md:text-[10px] 2xl:min-w-10 2xl:text-[11px] 3xl:min-w-11 3xl:px-2 3xl:text-xs 4xl:min-w-12 4xl:text-[13px] pointer-coarse:hidden"
			>esc</kbd
		>
	</button>

	{#if !gameLoop.pausedTutorial}
		<button
			onclick={restart}
			class="group flex w-full items-center gap-3 rounded-md border border-[#2a2f4c] bg-[#0c101c]/80 px-5 py-3.5 text-left transition-all hover:bg-[#1a2133] active:scale-[0.99] 2xl:gap-3.5 2xl:px-6 2xl:py-4 3xl:gap-4 3xl:px-7 3xl:py-4.5 4xl:px-8 4xl:py-5 pointer-coarse:gap-2 pointer-coarse:px-3.5 pointer-coarse:py-2.5"
		>
			<Restart
				class="size-5 flex-none text-white/55 group-hover:text-white 2xl:size-[22px] 3xl:size-6 4xl:size-7 pointer-coarse:size-4"
			/>
			<span
				class="flex-1 text-[15px] font-semibold tracking-wider text-white/80 group-hover:text-white lg:text-base 2xl:text-[17px] 3xl:text-lg 4xl:text-xl pointer-coarse:text-sm"
				>Restart</span
			>
		</button>
	{/if}

	<MenuCommon />
</div>
