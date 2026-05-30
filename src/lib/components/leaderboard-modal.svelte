<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { getGameContext } from '$lib/store/game.svelte';
	import { formatTime } from '$lib/utils';
	import Cross from '$lib/ui-icon/cross.svelte';
	import LeaderboardIcon from '$lib/ui-icon/leaderboard.svelte';

	const { overlay, leaderboard, audio } = getGameContext();

	let listEl = $state<HTMLDivElement | undefined>();

	function handleClose() {
		audio.play('click');
		overlay.closeLeaderboard();
		leaderboard.clearLastSubmitted();
	}

	const rows = $derived(
		leaderboard.sortedEntries.map((entry, index) => ({
			entry,
			rank: index + 1,
			isMine: entry.playerId === leaderboard.myPlayerId,
			isLastSubmitted:
				entry.playerId === leaderboard.myPlayerId && leaderboard.pulseMyRow
		}))
	);

	const myRank = $derived(leaderboard.myRank ?? rows.find((r) => r.isMine)?.rank ?? null);

	$effect(() => {
		if (!overlay.leaderboard || !listEl || !leaderboard.myPlayerId) return;
		const target = leaderboard.myPlayerId;
		queueMicrotask(() => {
			const row = listEl?.querySelector<HTMLElement>(`[data-entry-id="${target}"]`);
			row?.scrollIntoView({ block: 'center', behavior: 'smooth' });
		});
	});

	const rankColor = (rank: number) => {
		if (rank === 1) return 'text-amber-400';
		if (rank === 2) return 'text-white/80';
		if (rank === 3) return 'text-orange-400';
		return 'text-white/40';
	};
</script>

{#if overlay.leaderboard}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		onclick={handleClose}
	>
		<div
			class="flex max-h-[88dvh] w-[calc(100vw-1rem)] max-w-[460px] flex-col overflow-hidden rounded-md bg-background/95 shadow-[0_30px_80px_rgba(0,0,0,0.65)] ring-1 ring-white/10 md:max-w-[560px] lg:max-w-[640px]"
			transition:scale={{ duration: 200, start: 0.95 }}
			onclick={(e) => e.stopPropagation()}
		>
			<div class="flex items-center justify-between border-b border-white/10 px-4 py-3 md:px-5 md:py-4">
				<div class="flex items-center gap-2.5 text-amber-400">
					<LeaderboardIcon />
					<span class="font-mono text-[11px] font-extrabold tracking-[0.36em] uppercase md:text-[12px]">
						Leaderboard
					</span>
				</div>
				<button
					type="button"
					aria-label="Close"
					class="flex size-7 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-transform hover:bg-white/10 active:scale-90"
					onclick={handleClose}
				>
					<Cross />
				</button>
			</div>

			{#if myRank !== null}
				<div
					class="flex items-center justify-between border-b border-white/8 bg-amber-400/[0.06] px-5 py-2 font-mono text-[10px] font-extrabold tracking-[0.3em] text-amber-400/80 uppercase"
				>
					<span>Your rank</span>
					<span class="text-base font-black tracking-normal text-amber-400 tabular-nums">
						#{myRank}
					</span>
				</div>
			{/if}

			<div
				class="grid grid-cols-[40px_1fr_90px_64px] gap-3 border-b border-white/8 px-4 py-2 font-mono text-[9px] font-extrabold tracking-[0.3em] text-white/40 uppercase md:grid-cols-[48px_1fr_110px_80px] md:px-5"
			>
				<div class="text-center">#</div>
				<div>Nickname</div>
				<div class="text-right">Loot</div>
				<div class="text-right">Time</div>
			</div>

			<div bind:this={listEl} class="flex-1 overflow-y-auto px-2 py-1 md:px-3">
				{#each rows as row (row.entry.playerId)}
					<div
						data-entry-id={row.entry.playerId}
						class="grid grid-cols-[40px_1fr_90px_64px] items-center gap-3 rounded-sm px-2 py-2 transition-colors md:grid-cols-[48px_1fr_110px_80px] md:px-3"
						class:bg-amber-400-soft={row.isMine}
						class:ring-1={row.isMine}
						class:ring-amber-400-soft={row.isMine}
						class:animate-pulse-once={row.isLastSubmitted}
					>
						<div class="text-center font-mono text-[13px] font-black tabular-nums {rankColor(row.rank)}">
							{row.rank}
						</div>
						<div
							class="truncate text-[13px] font-bold tracking-wide md:text-[14px]"
							class:text-amber-300={row.isMine}
							class:text-white={!row.isMine && row.rank <= 3}
							class:text-white-80={!row.isMine && row.rank > 3}
						>
							{row.entry.nickname}
							{#if row.isMine}
								<span class="ml-1 font-mono text-[8px] font-extrabold tracking-[0.2em] text-amber-400/70 uppercase">
									you
								</span>
							{/if}
						</div>
						<div
							class="text-right font-mono text-[13px] font-black text-amber-400 tabular-nums md:text-[14px]"
						>
							{row.entry.extract.toLocaleString('en-US')}
						</div>
						<div class="text-right font-mono text-[11px] text-white/60 tabular-nums md:text-[12px]">
							{formatTime(row.entry.time)}
						</div>
					</div>
				{/each}
			</div>

			<div class="border-t border-white/8 px-5 py-3 text-center font-mono text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">
				Top runs · all time
			</div>
		</div>
	</div>
{/if}

<style>
	.bg-amber-400-soft {
		background-color: rgb(251 191 36 / 0.08);
	}
	.ring-amber-400-soft {
		--tw-ring-color: rgb(251 191 36 / 0.3);
	}
	.text-white-80 {
		color: rgb(255 255 255 / 0.75);
	}
	@keyframes pulse-once {
		0%,
		100% {
			background-color: rgb(251 191 36 / 0.08);
		}
		50% {
			background-color: rgb(251 191 36 / 0.22);
		}
	}
	.animate-pulse-once {
		animation: pulse-once 1.4s ease-in-out 2;
	}
</style>
