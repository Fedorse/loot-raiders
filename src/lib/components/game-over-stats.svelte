<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { getGameContext } from '$lib/store/game.svelte';
	import { getDef } from '$lib/config/items';
	import { formatTime } from '$lib/utils';
	import { getExtractionTier } from '$lib/config/extraction';
	import { enterFullscreen, isTouchDevice } from '$lib/fullscreen';
	import type { ItemRarity } from '$lib/types';

	const { gameLoop, quest, inventory, loot, audio } = getGameContext();

	function onRetry() {
		audio.play('click');
		if (isTouchDevice()) enterFullscreen();
		gameLoop.restart();
	}

	const victory = gameLoop.gameOverReason === 'victory';

	const augmentItem = inventory.getItem({ type: 'slot', storageId: 'augment', index: 0 });
	const augmentRarity: ItemRarity | null = augmentItem ? getDef(augmentItem.defId).rarity : null;

	const finalScore = gameLoop.score;
	const finalExtract = inventory.totalExtract;
	const finalQuests = quest.totalQuestsCompleted;
	const finalStages = quest.stagesCleared;
	const finalChests = loot.chestsOpened;
	const finalTime = Math.floor(gameLoop.elapsedTime);

	const tier = getExtractionTier(finalExtract, victory);

	const DURATION = 1400;
	const opts = { duration: DURATION, easing: cubicOut };

	const score = new Tween(0, opts);
	const extract = new Tween(0, opts);
	const quests = new Tween(0, opts);
	const stages = new Tween(0, opts);
	const chests = new Tween(0, opts);
	const time = new Tween(0, opts);

	$effect(() => {
		score.target = finalScore;
		extract.target = finalExtract;
		quests.target = finalQuests;
		stages.target = finalStages;
		chests.target = finalChests;
		time.target = finalTime;
	});

	const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
</script>

{#snippet row(label: string, value: string, hint?: string)}
	<div
		class="flex items-center justify-between rounded-md bg-background/40 px-3 py-2 backdrop-blur-sm md:px-4 md:py-2.5 2xl:px-5 2xl:py-3"
	>
		<span
			class="text-[8px] font-semibold tracking-wider text-white/60 uppercase md:text-[9px] lg:text-[10px] 2xl:text-xs 3xl:text-sm"
		>
			{label}
		</span>
		<span class="flex items-baseline gap-1.5">
			<span
				class="font-mono text-sm font-bold tracking-tight text-white tabular-nums md:text-base lg:text-lg 2xl:text-xl 3xl:text-2xl"
			>
				{value}
			</span>
			{#if hint}
				<span
					class="text-[7px] font-semibold tracking-wider text-white/40 uppercase md:text-[8px] lg:text-[9px] 2xl:text-[10px]"
				>
					{hint}
				</span>
			{/if}
		</span>
	</div>
{/snippet}

<div
	class="flex w-[300px] flex-col gap-2 md:w-[360px] md:gap-2.5 lg:w-[420px] lg:gap-3 2xl:w-[520px] 2xl:gap-4 3xl:w-[600px] 3xl:gap-5"
>
	<div class="flex flex-col items-start gap-0.5 md:gap-1">
		<span
			class="text-[8px] font-semibold tracking-[0.3em] text-white/40 uppercase md:text-[9px] 2xl:text-[10px] 3xl:text-xs"
		>
			Extraction Report
		</span>
		<h1
			class="text-2xl font-black tracking-tight uppercase md:text-3xl 2xl:text-4xl 3xl:text-5xl"
			class:text-emerald-400={victory}
			class:text-red-400={!victory}
		>
			{victory ? 'Victory' : 'Defeated'}
		</h1>
		<p
			class="font-mono text-xs font-bold tracking-wider uppercase md:text-sm 2xl:text-base 3xl:text-lg"
			class:text-emerald-300={victory}
			class:text-red-300={!victory}
		>
			{tier.title}
		</p>
		<p
			class="mt-1 max-w-[95%] text-[10px] leading-snug text-white/50 italic md:mt-1.5 md:text-[11px] lg:text-xs 2xl:text-[13px] 3xl:text-sm"
		>
			{tier.description}
		</p>
	</div>

	<div
		class="flex items-center justify-between rounded-md border border-white/5 px-3 py-2.5 backdrop-blur-md md:px-4 md:py-3 2xl:px-5 2xl:py-4 {victory
			? 'bg-emerald-950/30'
			: 'bg-red-950/30'}"
	>
		<span
			class="text-[9px] font-bold tracking-wider text-white/70 uppercase md:text-[10px] lg:text-[11px] 2xl:text-xs 3xl:text-sm"
		>
			Round Total
		</span>
		<span
			class="font-mono text-2xl font-black tracking-tight tabular-nums md:text-3xl 2xl:text-4xl 3xl:text-5xl"
			class:text-emerald-400={victory}
			class:text-red-400={!victory}
		>
			{fmt(score.current)}
		</span>
	</div>

	<div class="flex flex-col gap-1 md:gap-1.5">
		{@render row('Time on Surface', formatTime(time.current))}
		{@render row('Stages Cleared', `${fmt(stages.current)} / 5`)}
		{@render row('Quests Completed', fmt(quests.current))}
		{@render row('Chests Opened', fmt(chests.current))}
		{@render row('Total Extract', fmt(extract.current), 'cr')}
		{#if augmentRarity}
			<div
				class="flex items-center justify-between rounded-md bg-background/40 px-3 py-2 backdrop-blur-sm md:px-4 md:py-2.5 2xl:px-5 2xl:py-3"
			>
				<span
					class="text-[8px] font-semibold tracking-wider text-white/60 uppercase md:text-[9px] lg:text-[10px] 2xl:text-xs 3xl:text-sm"
				>
					Augment Tier
				</span>
				<span
					class="font-mono text-sm font-bold tracking-wider uppercase tabular-nums md:text-base lg:text-lg 2xl:text-xl 3xl:text-2xl"
					style="color: var(--rarity-{augmentRarity})"
				>
					{augmentRarity}
				</span>
			</div>
		{/if}
	</div>

	<button
		type="button"
		onclick={onRetry}
		class="group relative mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-md border px-4 py-2.5 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] md:mt-1.5 md:py-3 2xl:mt-2 2xl:py-4 {victory
			? 'border-emerald-500/30 bg-emerald-600/10 hover:border-emerald-400/60 hover:bg-emerald-600/20'
			: 'border-red-500/30 bg-red-600/10 hover:border-red-400/60 hover:bg-red-600/20'}"
	>
		<span
			class="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
		></span>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="size-3.5 md:size-4 2xl:size-5 {victory ? 'text-emerald-300' : 'text-red-300'}"
		>
			<path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
			<path d="M3 3v5h5" />
		</svg>
		<span
			class="text-xs font-bold tracking-[0.2em] uppercase md:text-sm 2xl:text-base 3xl:text-lg {victory
				? 'text-emerald-300'
				: 'text-red-300'}"
		>
			Retry Extraction
		</span>
	</button>
</div>
