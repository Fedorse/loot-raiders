<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { getGameContext } from '$lib/store/game.svelte';
	import { formatTime } from '$lib/utils';
	import { STAGES } from '$lib/config/stages';
	import GameOverStats from './game-over-stats.svelte';
	import StartMenu from './start-menu.svelte';
	import PauseMenu from './pause-menu.svelte';
	import Disclaimer from './disclaimer.svelte';
	import Wordmark from './wordmark.svelte';

	let { showPreloader = false }: { showPreloader?: boolean } = $props();

	const { gameLoop, inventory, quest } = getGameContext();

	const runTime = $derived(formatTime(gameLoop.timeLeft));
	const runLoot = $derived(inventory.scoredExtract.toLocaleString('en-US'));
	const runStage = $derived(`${quest.currentStage + 1}/${STAGES.length}`);
</script>

{#if !gameLoop.inSession && !showPreloader}
	<div
		class="fixed inset-0 z-30 bg-gradient-to-r from-black/90 via-black/55 to-black/15 backdrop-blur-xs"
		transition:fade|global={{ duration: gameLoop.status === 'idle' ? 300 : 0 }}
	>
		{#if gameLoop.status === 'over'}
			<div class="flex h-full w-full items-center justify-center">
				<GameOverStats />
			</div>
		{:else}
			<div class="flex h-full flex-col overflow-y-auto">
				<div
					class="flex shrink-0 items-start justify-between pt-7 pr-6 pl-10 md:pr-10 md:pl-14 2xl:pt-9 3xl:pt-12 3xl:pr-14 3xl:pl-20 4xl:pt-16 4xl:pr-20 4xl:pl-28"
				>
					<div>
						<div
							class="hidden pl-12 md:block pointer-coarse:hidden"
							in:fly|global={{ y: -10, duration: 300 }}
						>
							<Wordmark />
						</div>

						{#if gameLoop.status === 'paused'}
							<div
								class="mt-4 flex items-center gap-4 lg:gap-5 2xl:mt-5 3xl:mt-6 3xl:gap-6 4xl:mt-8 4xl:gap-7"
								in:fly|global={{ y: 8, duration: 280, delay: 80 }}
							>
								<span
									class="h-0.5 w-7 rounded-full bg-gradient-to-r from-primary to-transparent 3xl:h-[3px] 3xl:w-9 4xl:w-12"
								></span>
								<span
									class="font-mono text-[9px] font-bold tracking-[0.3em] text-muted uppercase 3xl:text-[10px] 4xl:text-[11px]"
									>Run</span
								>
								{@render runStat('Time', runTime, 'text-white')}
								{@render runStat('Loot', runLoot, 'text-primary')}
								{@render runStat('Stage', runStage, 'text-white')}
							</div>
						{/if}
					</div>
				</div>

				<div
					class="my-auto flex shrink-0 items-center pr-6 pl-10 md:pr-10 md:pl-14 3xl:pr-14 3xl:pl-20 4xl:pr-20 4xl:pl-28"
				>
					<div
						class="w-[400px] 2xl:w-[440px] 3xl:w-[500px] 4xl:w-[580px] pointer-coarse:w-[340px]"
						in:fly|global={{ x: -16, duration: 280, delay: 40 }}
					>
						{#if gameLoop.status === 'idle'}
							<StartMenu />
						{:else}
							<PauseMenu />
						{/if}
					</div>
				</div>
			</div>

			<div class="absolute top-1/2 right-0 z-10 hidden -translate-y-1/2 pr-12 pointer-coarse:block">
				<Wordmark />
			</div>

			<Disclaimer />
		{/if}
	</div>
{/if}

{#snippet runStat(label: string, value: string, valueClass: string)}
	<div class="flex items-center gap-1.5 3xl:gap-2">
		<span
			class="font-mono text-[9px] font-bold tracking-[0.25em] text-muted uppercase 3xl:text-[10px] 4xl:text-[11px]"
			>{label}</span
		>
		<span
			class="font-mono text-[13px] font-black tabular-nums 2xl:text-sm 3xl:text-base 4xl:text-lg {valueClass}"
			>{value}</span
		>
	</div>
{/snippet}
