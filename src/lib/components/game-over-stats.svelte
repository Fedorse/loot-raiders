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
	import { NICK_MAX, NICK_MIN, sanitizeNickname } from '$lib/leaderboard/schema';
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

	const { gameLoop, quest, inventory, loot, audio, leaderboard, overlay } = getGameContext();

	let submitted = $state(false);
	let nicknameInput = $state(sanitizeNickname(leaderboard.nickname));
	let showNicknameForm = $state(false);

	const canSubmit = $derived(nicknameInput.length >= NICK_MIN);

	function restartGame() {
		audio.play('click');
		if (isTouchDevice()) enterFullscreen();
		gameLoop.restart();
	}

	async function doSubmit() {
		const ok = await leaderboard.submit(inventory.totalExtract, gameLoop.elapsedTime);
		if (!ok) return;
		submitted = true;
		overlay.openLeaderboard();
	}

	function onSubmitClick() {
		audio.play('click');
		if (!leaderboard.hasNickname) {
			showNicknameForm = true;
			return;
		}
		doSubmit();
	}

	function onNickInput(e: Event) {
		nicknameInput = sanitizeNickname((e.target as HTMLInputElement).value);
	}

	function onSaveNickname(e: SubmitEvent) {
		e.preventDefault();
		if (!canSubmit) return;
		audio.play('click');
		leaderboard.setNickname(nicknameInput);
		showNicknameForm = false;
		doSubmit();
	}

	function onChangeNickname() {
		audio.play('click');
		nicknameInput = sanitizeNickname(leaderboard.nickname);
		showNicknameForm = true;
	}

	function onOpenLeaderboard() {
		audio.play('click');
		overlay.openLeaderboard();
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
	class="relative w-[calc(100vw-1rem)] max-w-[420px] rounded-md bg-background/50 font-sans text-white/90 shadow-[0_30px_80px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md md:max-w-[680px] lg:max-w-[760px] 3xl:max-w-[840px] pointer-coarse:border pointer-coarse:border-white/15 landscape-narrow:max-w-[540px] landscape-mid:max-w-[620px]"
>
	<div class="flex items-center justify-between gap-3 border-b border-white/8 px-5 py-3">
		{#if leaderboard.hasNickname && !submitted && !showNicknameForm}
			<span class="font-mono text-[9px] font-bold tracking-[0.24em] text-white/35 uppercase">
				as <span class="font-extrabold text-amber-400/80">{leaderboard.nickname}</span>
				·
				<button
					type="button"
					onclick={onChangeNickname}
					class="underline decoration-dotted underline-offset-2 hover:text-white/70"
				>
					change
				</button>
			</span>
		{:else}
			<span></span>
		{/if}

		<span
			class="flex items-center gap-2 font-mono text-[10px] font-extrabold tracking-[0.36em] text-amber-400 uppercase"
		>
			<span class="size-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#ffb800]"></span>
			Run Report
		</span>
	</div>

	<div
		class="grid grid-cols-[110px_1fr] items-center gap-4 border-b border-white/8 px-4 py-2 md:grid-cols-[140px_1fr] md:gap-5 md:px-5 md:py-3 lg:grid-cols-[170px_1fr] lg:gap-7 lg:px-6 lg:py-6 landscape-narrow:grid-cols-[120px_1fr] landscape-mid:grid-cols-[130px_1fr]"
		in:fly|global={{ y: 8, duration: 420, delay: 80 }}
	>
		<div
			class="relative flex h-[110px] items-center justify-center border-2 md:h-[140px] lg:h-[170px] landscape-narrow:h-[100px] landscape-mid:h-[110px] {toneStyle.border}"
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
				class="text-[80px] leading-[0.9] font-black tracking-[-0.06em] font-stretch-condensed md:text-[100px] lg:text-[130px] 3xl:text-[150px] landscape-narrow:text-[70px] landscape-mid:text-[80px] {toneStyle.text}"
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
							class="font-mono text-[32px] leading-none font-black tracking-[-0.04em] text-amber-400 tabular-nums drop-shadow-[0_0_20px_rgba(255,184,0,0.3)] md:text-[40px] lg:text-[48px] 3xl:text-[56px] landscape-mid:text-[36px]"
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
		class="px-4 pt-2 pb-2 md:px-5 lg:px-6 lg:pt-5 lg:pb-6"
		in:fade|global={{ duration: 320, delay: 340 }}
	>
		{#if showNicknameForm}
			<div class="flex justify-between">
				<div
					class="mb-2 font-mono text-[10px] font-extrabold tracking-[0.36em] text-white/50 uppercase"
				>
					Nickname
				</div>
				<div class=" font-sans text-[11px] text-white/30 md:text-xs">
					Public on leaderboard · letters, numbers, and dashes only
				</div>
			</div>
			<form
				class="relative flex h-[40px] items-stretch rounded-md border border-white/20 shadow-[0_0_0_1px_rgba(255,184,0,0.09),0_0_16px_rgba(255,184,0,0.08),0_0_45px_rgba(255,184,0,0.03),0_10px_28px_rgba(0,0,0,0.45)] transition-shadow duration-200 ease-out focus-within:shadow-[0_0_0_1px_rgba(255,184,0,0.26),0_0_20px_rgba(255,184,0,0.22),0_0_55px_rgba(255,184,0,0.1),0_10px_28px_rgba(0,0,0,0.45)] md:h-[50px]"
				onsubmit={onSaveNickname}
			>
				<input
					id="leaderboard-nickname"
					type="text"
					value={nicknameInput}
					oninput={onNickInput}
					autocomplete="off"
					autocapitalize="characters"
					spellcheck="false"
					maxlength={NICK_MAX}
					aria-label="Choose your nickname"
					class="min-w-0 flex-1 border-0 bg-transparent px-4 font-sans text-base font-semibold tracking-[0.02em] text-white caret-[#ffb800] outline-none placeholder:text-white/20 md:px-4.5 md:text-[19px]"
				/>

				<div
					class="flex items-center px-3 font-mono text-[11px] font-semibold tracking-[0.04em] text-white/30 tabular-nums md:px-3.5 md:text-xs"
				>
					{nicknameInput.length} / {NICK_MAX}
				</div>

				<button
					type="submit"
					disabled={!canSubmit}
					class="m-1.5 flex items-center gap-2 rounded-md border-none bg-amber-400 px-4 font-sans text-[12px] font-bold tracking-[0.04em] text-[#1a0e02] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 md:px-5.5 md:text-[13px]"
				>
					<span>Save</span>
				</button>
			</form>
		{:else}
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
		{/if}
	</div>

	<div class="grid grid-cols-2" in:fly|global={{ y: 8, duration: 350, delay: 460 }}>
		<button
			type="button"
			onclick={restartGame}
			class="flex items-center justify-center gap-2.5 rounded-bl-md border border-white/5 bg-[#0c101c] py-2 text-white/80 transition-colors hover:bg-[#161927] active:scale-[0.99] md:py-2.5 lg:py-4"
		>
			<Restart />
			<span class="text-[10px] font-black tracking-[0.28em] uppercase">Retry</span>
		</button>
		{#if submitted}
			<button
				type="button"
				onclick={onOpenLeaderboard}
				class="flex items-center justify-center gap-2.5 rounded-br-md bg-amber-400 py-2 text-[#1a0e02] transition-colors hover:bg-amber-300 active:scale-[0.99] md:py-2.5 lg:py-4"
			>
				<Leaderboard />
				<span class="text-[13px] font-black tracking-[0.28em] uppercase">Leaderboard</span>
			</button>
		{:else}
			<button
				type="button"
				onclick={onSubmitClick}
				class="flex items-center justify-center gap-2.5 rounded-br-md border border-white/5 bg-amber-400/70 py-2 text-[#1a0e02] transition-colors hover:bg-amber-300 active:scale-[0.99] md:py-2.5 lg:py-4"
			>
				<Leaderboard />
				<span class="text-[10px] font-black tracking-[0.28em] uppercase">Submit Score</span>
			</button>
		{/if}
	</div>
</div>
