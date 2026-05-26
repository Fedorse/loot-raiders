<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { fly, fade } from 'svelte/transition';
	import { getGameContext } from '$lib/store/game.svelte';
	import { getDef } from '$lib/config/items';
	import { formatTime } from '$lib/utils';
	import { getExtractionTier } from '$lib/config/extraction';
	import { STAGES } from '$lib/config/stages';
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

	const finalExtract = inventory.totalExtract;
	const finalStages = quest.stagesCleared;
	const finalChests = loot.chestsOpened;
	const finalTime = Math.floor(gameLoop.elapsedTime);

	const tier = getExtractionTier(finalExtract, victory);

	const DURATION = 1400;
	const opts = { duration: DURATION, easing: cubicOut };

	const extract = new Tween(0, opts);
	const stages = new Tween(0, opts);
	const chests = new Tween(0, opts);
	const time = new Tween(0, opts);

	$effect(() => {
		extract.target = finalExtract;
		stages.target = finalStages;
		chests.target = finalChests;
		time.target = finalTime;
	});

	const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
</script>

{#snippet stat(label: string, value: string, accentClass = 'text-white', delay = 0)}
	<div
		in:fly|global={{ y: 6, duration: 280, delay }}
		class="flex flex-col items-center gap-0.5 md:gap-1"
	>
		<span class="font-mono text-sm font-bold tracking-tight tabular-nums md:text-base 2xl:text-lg 3xl:text-xl {accentClass}">
			{value}
		</span>
		<span
			class="text-[7px] font-semibold tracking-[0.25em] text-white/35 uppercase md:text-[8px] 2xl:text-[9px] 3xl:text-[10px]"
		>
			{label}
		</span>
	</div>
{/snippet}

{#snippet divider()}
	<span aria-hidden="true" class="h-3 w-px bg-white/15 md:h-3.5 2xl:h-4"></span>
{/snippet}

<div
	class="flex w-[320px] flex-col items-center gap-5 md:w-[400px] md:gap-6 lg:w-[460px] 2xl:w-[560px] 2xl:gap-7 3xl:w-[640px] 3xl:gap-8"
>
	<!-- Outcome eyebrow -->
	<div in:fade|global={{ duration: 300 }} class="flex items-center gap-2">
		<span
			aria-hidden="true"
			class="h-px w-8 {victory ? 'bg-emerald-400/60' : 'bg-red-400/60'} md:w-10 2xl:w-12"
		></span>
		<span
			class="text-[8px] font-bold tracking-[0.4em] uppercase md:text-[9px] 2xl:text-[10px] 3xl:text-xs {victory
				? 'text-emerald-300'
				: 'text-red-300'}"
		>
			{victory ? 'Extraction Complete' : 'Run Terminated'}
		</span>
		<span
			aria-hidden="true"
			class="h-px w-8 {victory ? 'bg-emerald-400/60' : 'bg-red-400/60'} md:w-10 2xl:w-12"
		></span>
	</div>

	<!-- Tier title as hero -->
	<div in:fly|global={{ y: -6, duration: 350, delay: 80 }} class="text-center">
		<h1
			class="text-2xl font-black tracking-tight uppercase md:text-3xl 2xl:text-4xl 3xl:text-5xl {victory
				? 'text-emerald-200 drop-shadow-[0_0_18px_rgba(110,231,183,0.25)]'
				: 'text-red-200 drop-shadow-[0_0_18px_rgba(252,165,165,0.25)]'}"
		>
			{tier.title}
		</h1>
		<p
			class="mt-2 max-w-[40ch] text-center text-[10px] leading-relaxed text-white/45 italic md:mt-2.5 md:text-[11px] lg:text-xs 2xl:mt-3 2xl:text-[13px] 3xl:text-sm"
		>
			"{tier.description}"
		</p>
	</div>

	<!-- Hero extract -->
	<div
		in:fly|global={{ y: 8, duration: 400, delay: 200 }}
		class="flex flex-col items-center"
	>
		<div class="flex items-baseline gap-2">
			<span
				class="font-mono text-5xl font-black tracking-tight text-amber-100 tabular-nums drop-shadow-[0_0_22px_rgba(251,191,36,0.3)] md:text-6xl 2xl:text-7xl 3xl:text-8xl"
			>
				{fmt(extract.current)}
			</span>
			<span
				class="text-base font-bold tracking-[0.3em] text-amber-300/70 uppercase md:text-lg 2xl:text-xl"
			>
				cr
			</span>
		</div>
		<span
			class="mt-1 text-[8px] font-semibold tracking-[0.3em] text-white/35 uppercase md:text-[9px] 2xl:text-[10px] 3xl:text-xs"
		>
			Total Extract
		</span>
	</div>

	<!-- Ornamental divider -->
	<div
		in:fade|global={{ duration: 300, delay: 300 }}
		aria-hidden="true"
		class="flex w-full items-center gap-3 px-2"
	>
		<span class="h-px flex-1 bg-gradient-to-r from-transparent to-white/15"></span>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			class="size-3 text-white/25 md:size-3.5 2xl:size-4"
		>
			<path d="M12 2 2 12l10 10 10-10z" />
		</svg>
		<span class="h-px flex-1 bg-gradient-to-l from-transparent to-white/15"></span>
	</div>

	<!-- Inline stats row -->
	<div class="flex items-center gap-4 md:gap-5 2xl:gap-7 3xl:gap-9">
		{@render stat('Time', formatTime(time.current), 'text-white', 380)}
		{@render divider()}
		{@render stat('Stages', `${fmt(stages.current)} / ${STAGES.length}`, 'text-white', 440)}
		{@render divider()}
		{@render stat('Chests', fmt(chests.current), 'text-white', 500)}
		{#if augmentRarity}
			{@render divider()}
			<div
				in:fly|global={{ y: 6, duration: 280, delay: 560 }}
				class="flex flex-col items-center gap-0.5 md:gap-1"
			>
				<span
					class="font-mono text-sm font-bold tracking-wider uppercase tabular-nums md:text-base 2xl:text-lg 3xl:text-xl"
					style="color: var(--rarity-{augmentRarity})"
				>
					{augmentRarity}
				</span>
				<span
					class="text-[7px] font-semibold tracking-[0.25em] text-white/35 uppercase md:text-[8px] 2xl:text-[9px] 3xl:text-[10px]"
				>
					Augment
				</span>
			</div>
		{/if}
	</div>

	<!-- Retry -->
	<button
		type="button"
		onclick={onRetry}
		in:fly|global={{ y: 8, duration: 350, delay: 640 }}
		class="group relative mt-1 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-md border px-4 py-2.5 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] md:mt-2 md:py-3 2xl:mt-3 2xl:py-4 {victory
			? 'border-emerald-500/30 bg-emerald-600/10 hover:border-emerald-400/60 hover:bg-emerald-600/15'
			: 'border-red-500/30 bg-red-600/10 hover:border-red-400/60 hover:bg-red-600/15'}"
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
			class="text-xs font-bold tracking-[0.25em] uppercase md:text-sm 2xl:text-base 3xl:text-lg {victory
				? 'text-emerald-300'
				: 'text-red-300'}"
		>
			Retry Extraction
		</span>
	</button>
</div>
