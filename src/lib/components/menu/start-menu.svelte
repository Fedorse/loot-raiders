<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import { enterFullscreen, isTouchDevice } from '$lib/fullscreen';
	import { getLeaderboard } from '$lib/leaderboard/leaderboard.remote';
	import MenuCommon from './menu-common.svelte';
	import Play from '$lib/ui-icon/play.svelte';
	import LeaderboardIcon from '$lib/ui-icon/leaderboard.svelte';
	import ChevronRight from '$lib/ui-icon/chevron-right.svelte';

	const { gameLoop, audio, overlay, leaderboard } = getGameContext();

	const rankQuery = getLeaderboard();
	const myRank = $derived(rankQuery.current?.myRank ?? null);

	function play() {
		audio.play('click');
		if (isTouchDevice()) enterFullscreen();
		gameLoop.start();
	}
	function openLeaderboard() {
		audio.play('click');
		overlay.openLeaderboard();
	}
</script>

<div class="flex flex-col gap-3 lg:gap-3.5 3xl:gap-4 4xl:gap-5 pointer-coarse:gap-2">
	<button
		onclick={play}
		class="group flex w-full items-center gap-3 rounded-md bg-primary px-5 py-4 text-left font-bold transition-all hover:bg-primary-hover active:scale-[0.99] 2xl:gap-3.5 2xl:px-6 2xl:py-4.5 3xl:gap-4 3xl:px-7 3xl:py-5 4xl:px-8 4xl:py-5.5 pointer-coarse:gap-2 pointer-coarse:px-3.5 pointer-coarse:py-2.5"
	>
		<Play
			class="size-[18px] flex-none text-primary-foreground 2xl:size-5 3xl:size-6 4xl:size-7 pointer-coarse:size-4"
		/>
		<span
			class="flex-1 text-base font-extrabold tracking-wide text-primary-foreground 2xl:text-[17px] 3xl:text-lg 4xl:text-xl pointer-coarse:text-sm"
			>Play</span
		>
		<kbd
			class="inline-flex min-w-8 items-center justify-center rounded-md bg-black/20 px-1.5 py-0.5 text-[9px] font-bold text-black/60 uppercase md:min-w-9 md:text-[10px] 2xl:min-w-10 2xl:text-[11px] 3xl:min-w-11 3xl:px-2 3xl:text-xs 4xl:min-w-12 4xl:text-[13px] pointer-coarse:hidden"
			>space</kbd
		>
	</button>

	<button
		onclick={openLeaderboard}
		class="group flex w-full items-center gap-3 rounded-md border border-[#2a2f4c] bg-[#0c101c]/80 px-5 py-3.5 text-left transition-all hover:bg-[#1a2133] active:scale-[0.99] 2xl:gap-3.5 2xl:px-6 2xl:py-4 3xl:gap-4 3xl:px-7 3xl:py-4.5 4xl:px-8 4xl:py-5 pointer-coarse:gap-2 pointer-coarse:px-3.5 pointer-coarse:py-2.5"
	>
		<LeaderboardIcon
			class="size-5 flex-none text-white/55 group-hover:text-white 2xl:size-[22px] 3xl:size-6 4xl:size-7 pointer-coarse:size-4"
		/>
		<span
			class="flex-1 text-[15px] font-semibold tracking-wider text-white/80 group-hover:text-white lg:text-base 2xl:text-[17px] 3xl:text-lg 4xl:text-xl pointer-coarse:text-sm"
			>Leaderboard</span
		>
		{#if leaderboard.hasNickname}
			<span
				class="flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider uppercase 2xl:text-[13px] 3xl:text-sm 4xl:text-[15px] pointer-coarse:text-[11px]"
			>
				<span class="text-muted group-hover:text-white/70">{leaderboard.nickname}</span>
				{#if myRank !== null}
					<span class="text-white/25">·</span>
					<span class="text-primary tabular-nums">#{myRank}</span>
				{/if}
			</span>
		{/if}
		<ChevronRight
			class="size-[18px] flex-none text-white/40 2xl:size-5 3xl:size-6 4xl:size-7 pointer-coarse:size-4"
		/>
	</button>

	<MenuCommon />
</div>
