<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import { enterFullscreen, isTouchDevice } from '$lib/fullscreen';
	import { getLeaderboard } from '$lib/leaderboard/leaderboard.remote';
	import MenuCommon from './menu-common.svelte';
	import Play from '$lib/ui-icon/play.svelte';
	import LeaderboardIcon from '$lib/ui-icon/leaderboard.svelte';
	import ChevronRight from '$lib/ui-icon/chevron-right.svelte';

	const { audio, overlay, leaderboard, tutorial } = getGameContext();

	const rankQuery = getLeaderboard();
	const myRank = $derived(rankQuery.current?.myRank ?? null);

	function play() {
		audio.play('click');
		if (isTouchDevice()) enterFullscreen();
		tutorial.enter();
	}
	function openLeaderboard() {
		audio.play('click');
		overlay.openLeaderboard();
	}
</script>

<div class="flex flex-col gap-3 lg:gap-3.5 3xl:gap-4 4xl:gap-5 pointer-coarse:gap-2">
	<button
		onclick={play}
		class="group flex w-full items-center gap-3 rounded-md bg-gradient-to-b from-[#efe8db] to-[#d8cebc] px-5 py-4 text-left font-bold transition-all hover:from-[#f4eee2] hover:to-[#e0d7c6] active:scale-[0.99] 2xl:gap-3.5 2xl:px-6 2xl:py-4.5 3xl:gap-4 3xl:px-7 3xl:py-5 4xl:px-8 4xl:py-5.5 pointer-coarse:gap-2 pointer-coarse:px-3.5 pointer-coarse:py-2.5"
	>
		<Play
			class="size-[18px] flex-none text-[#1a120c] 2xl:size-5 3xl:size-6 4xl:size-7 pointer-coarse:size-4"
		/>
		<span
			class="flex-1 text-base font-extrabold tracking-wide text-[#1a120c] 2xl:text-[17px] 3xl:text-lg 4xl:text-xl pointer-coarse:text-sm"
			>Play</span
		>
		<kbd
			class="inline-flex min-w-8 items-center justify-center rounded-md border border-[#8a6a1f]/35 bg-[#c99a3a]/30 px-1.5 py-0.5 text-[9px] font-bold text-[#4a3810] uppercase md:min-w-9 md:text-[10px] 2xl:min-w-10 2xl:text-[11px] 3xl:min-w-11 3xl:px-2 3xl:text-xs 4xl:min-w-12 4xl:text-[13px] pointer-coarse:hidden"
			>space</kbd
		>
	</button>

	<button
		onclick={openLeaderboard}
		class="group flex w-full items-center gap-3 rounded-md border border-[#e8e0d2]/15 bg-[#100c09]/60 px-5 py-3.5 text-left transition-all hover:bg-[#1a120c]/75 active:scale-[0.99] 2xl:gap-3.5 2xl:px-6 2xl:py-4 3xl:gap-4 3xl:px-7 3xl:py-4.5 4xl:px-8 4xl:py-5 pointer-coarse:gap-2 pointer-coarse:px-3.5 pointer-coarse:py-2.5"
	>
		<LeaderboardIcon
			class="size-5 flex-none text-[#cabfb2] group-hover:text-[#ece4d6] 2xl:size-[22px] 3xl:size-6 4xl:size-7 pointer-coarse:size-4"
		/>
		<span
			class="flex-1 text-[15px] font-semibold tracking-wider text-[#c6bcb0] group-hover:text-[#ece4d6] lg:text-base 2xl:text-[17px] 3xl:text-lg 4xl:text-xl pointer-coarse:text-sm"
			>Leaderboard</span
		>
		{#if leaderboard.hasNickname}
			<span
				class="flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider uppercase 2xl:text-[13px] 3xl:text-sm 4xl:text-[15px] pointer-coarse:text-[11px]"
			>
				<span class="text-[#8b8178] group-hover:text-[#c6bcb0]">{leaderboard.nickname}</span>
				{#if myRank !== null}
					<span class="text-[#8b8178]/40">·</span>
					<span class="text-[#e0a63a] tabular-nums">#{myRank}</span>
				{/if}
			</span>
		{/if}
		<ChevronRight
			class="size-[18px] flex-none text-[#8b8178] 2xl:size-5 3xl:size-6 4xl:size-7 pointer-coarse:size-4"
		/>
	</button>

	<MenuCommon />
</div>
