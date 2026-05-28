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
	import Restart from '$lib/ui-icon/restart.svelte';
	import Leaderboard from '$lib/ui-icon/leaderboard.svelte';

	const TONE_STYLE = {
		good: {
			border: 'border-emerald-500',
			text: 'text-emerald-500',
			tint: 'rgba(34,197,94,0.13)',
			glow: 'rgba(34,197,94,0.4)'
		},
		neutral: {
			border: 'border-amber-400',
			text: 'text-amber-400',
			tint: 'rgba(255,184,0,0.13)',
			glow: 'rgba(255,184,0,0.4)'
		},
		bad: {
			border: 'border-red-500',
			text: 'text-red-500',
			tint: 'rgba(239,68,68,0.13)',
			glow: 'rgba(239,68,68,0.4)'
		}
	} as const;

	const { gameLoop, quest, inventory, loot, audio } = getGameContext();

	function restartGame() {
		audio.play('click');
		if (isTouchDevice()) enterFullscreen();
		gameLoop.restart();
	}

	function onSubmitScore() {
		audio.play('click');
		// TODO: hook up to leaderboard submission
	}

	const augmentItem = inventory.augmentItem;
	const augmentRarity: ItemRarity | null = augmentItem ? getDef(augmentItem.defId).rarity : null;

	const finalExtract = inventory.totalExtract;
	const tier = getExtractionTier(finalExtract);

	const toneStyle = TONE_STYLE[tier.tone];

	const opts = { duration: 1400, easing: cubicOut };
	function countUp(to: number) {
		const t = new Tween(0, opts);
		t.target = to;
		return t;
	}

	const extract = countUp(finalExtract);
	const stages = countUp(quest.stagesCleared);
	const chests = countUp(loot.chestsOpened);
	const time = countUp(Math.floor(gameLoop.elapsedTime));

	const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
</script>

{#snippet breakdownCell(label: string, value: string)}
	<div class="rounded-xs border border-white/8 bg-white/[0.04] px-3 py-1.5 lg:px-3.5 lg:py-3">
		<div class="font-mono text-[9px] font-bold tracking-[0.32em] text-white/50 uppercase">
			{label}
		</div>
		<div
			class="mt-1 font-mono text-[18px] leading-none font-black tracking-[-0.01em] text-white/90 tabular-nums md:text-[22px] 3xl:text-[26px]"
		>
			{value}
		</div>
	</div>
{/snippet}

<div
	in:fade|global={{ duration: 240 }}
	class="relative w-[calc(100vw-1rem)] max-w-[420px] rounded-md bg-background/50 font-sans text-white/90 shadow-[0_30px_80px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md landscape-narrow:max-w-[540px] landscape-mid:max-w-[620px] md:max-w-[680px] lg:max-w-[760px] 3xl:max-w-[840px]"
>
	<div class="flex items-center justify-end border-b border-white/8 px-5 py-3">
		<span
			class="flex items-center gap-2 font-mono text-[10px] font-extrabold tracking-[0.36em] text-amber-400 uppercase"
		>
			<span class="size-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#ffb800]"></span>
			Run Report
		</span>
	</div>

	<div
		class="grid grid-cols-[110px_1fr] items-center gap-4 border-b border-white/8 px-4 py-2 landscape-narrow:grid-cols-[120px_1fr] landscape-mid:grid-cols-[130px_1fr] md:grid-cols-[140px_1fr] md:gap-5 md:px-5 md:py-3 lg:grid-cols-[170px_1fr] lg:gap-7 lg:px-6 lg:py-6"
		in:fly|global={{ y: 8, duration: 420, delay: 80 }}
	>
		<div
			class="relative flex h-[110px] items-center justify-center border-2 landscape-narrow:h-[100px] landscape-mid:h-[110px] md:h-[140px] lg:h-[170px] {toneStyle.border}"
			style="background: radial-gradient(circle at 50% 50%, {toneStyle.tint} 0%, transparent 70%);"
		>
			<span
				aria-hidden="true"
				class="absolute -top-[2px] -left-[2px] size-3.5 border-t-2 border-l-2 border-white/90"
			></span>
			<span
				aria-hidden="true"
				class="absolute -top-[2px] -right-[2px] size-3.5 border-t-2 border-r-2 border-white/90"
			></span>
			<span
				aria-hidden="true"
				class="absolute -bottom-[2px] -left-[2px] size-3.5 border-b-2 border-l-2 border-white/90"
			></span>
			<span
				aria-hidden="true"
				class="absolute -right-[2px] -bottom-[2px] size-3.5 border-r-2 border-b-2 border-white/90"
			></span>

			<span
				class="text-[80px] leading-[0.9] font-black tracking-[-0.06em] font-stretch-condensed landscape-narrow:text-[70px] landscape-mid:text-[80px] md:text-[100px] lg:text-[130px] 3xl:text-[150px] {toneStyle.text}"
				style="font-family: ui-sans-serif, Impact, 'Arial Black', sans-serif; text-shadow: 0 0 24px {toneStyle.glow};"
			>
				{tier.grade}
			</span>

			<span
				class="absolute -top-[10px] left-2 bg-[#0f111a] px-2 py-[2px] font-mono text-[9px] font-extrabold tracking-[0.4em] text-white/50 uppercase"
			>
				Grade
			</span>
		</div>

		<div class="flex flex-col gap-0.5 lg:gap-2.5">
			<div>
				<h1
					class="text-2xl leading-none font-black tracking-[-0.02em] text-white uppercase md:text-3xl lg:text-[32px] 3xl:text-[36px]"
				>
					{tier.title}
				</h1>
				<p class="mt-1.5 max-w-xs font-serif text-xs leading-relaxed text-white/50 italic">
					"{tier.description}"
				</p>
			</div>

			<div
				class="mt-0.5 flex items-end justify-between gap-5 border-t border-dashed border-white/8 pt-1.5 lg:mt-1.5 lg:pt-3"
			>
				<div>
					<div class="font-mono text-[9px] font-extrabold tracking-[0.4em] text-white/50 uppercase">
						Loot Value
					</div>
					<div class="mt-1 flex items-center gap-2">
						<span
							class="font-mono text-[32px] leading-none font-black tracking-[-0.04em] text-amber-400 tabular-nums drop-shadow-[0_0_20px_rgba(255,184,0,0.3)] landscape-mid:text-[36px] md:text-[40px] lg:text-[48px] 3xl:text-[56px]"
						>
							{fmt(extract.current)}
						</span>
						<img
							src="/assets/ui/Coins.webp"
							alt="credits"
							class="size-8 object-contain drop-shadow-[0_0_12px_rgba(255,184,0,0.35)] md:size-9"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div
		class="px-4 pt-2 pb-1.5 md:px-5 lg:px-6 lg:pt-5 lg:pb-6"
		in:fade|global={{ duration: 320, delay: 340 }}
	>
		<div
			class="mb-2 font-mono text-[10px] font-extrabold tracking-[0.36em] text-white/50 uppercase"
		>
			Run Breakdown
		</div>
		<div class="grid grid-cols-4 gap-1.5">
			{@render breakdownCell('Time', formatTime(time.current))}
			{@render breakdownCell('Stages', `${fmt(stages.current)}/${STAGES.length}`)}
			{@render breakdownCell('Chests', fmt(chests.current))}
			<div class="rounded-xs border border-white/8 bg-white/[0.04] px-3 py-2.5 md:px-3.5 md:py-3">
				<div class="font-mono text-[9px] font-bold tracking-[0.32em] text-white/50 uppercase">
					Augment
				</div>
				<div
					class="mt-1 font-mono text-base leading-none font-black tracking-[0.1em] uppercase"
					style="color: {augmentRarity
						? `var(--rarity-${augmentRarity})`
						: 'rgba(255,255,255,0.3)'};"
				>
					{augmentRarity?.toUpperCase() ?? 'NONE'}
				</div>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-px bg-white/8" in:fly|global={{ y: 8, duration: 350, delay: 460 }}>
		<button
			type="button"
			onclick={restartGame}
			class="group flex items-center justify-center gap-2.5 rounded-md border-none bg-gradient-to-b from-amber-400/10 to-amber-400/[0.03] py-3 text-amber-400 transition-all hover:from-amber-400/20 hover:to-amber-400/5 active:scale-[0.99] md:py-4"
		>
			<Restart />
			<span class="text-[13px] font-black tracking-[0.28em] uppercase"> Retry </span>
		</button>
		<button
			type="button"
			onclick={onSubmitScore}
			class="flex items-center justify-center gap-2.5 rounded-md border-none bg-white/[0.03] py-3 text-white/90 transition-all hover:bg-white/[0.06] active:scale-[0.99] md:py-4"
		>
			<Leaderboard />
			<span class="text-[13px] font-black tracking-[0.28em] uppercase"> Submit Score </span>
		</button>
	</div>
</div>
