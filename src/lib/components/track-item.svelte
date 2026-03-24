<script lang="ts">
	import type { ItemDefinition, RarityStyle } from '$lib/types';
	import { getRarityStyle } from '$lib/config/rarity';
	import { getGameContext } from '$lib/store/game.svelte';
	import Scanner from './scanner.svelte';

	const { gameLoop } = getGameContext();
	const track = gameLoop.track;
</script>

{#snippet scanerMatch(itemId: string, duration: number)}
	<div class="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[7px]">
		<Scanner
			wipe
			{duration}
			direction="vertical"
			pause={gameLoop.status === 'paused'}
			onscanned={() => track.removeMatched(itemId)}
		/>
	</div>
{/snippet}

{#snippet itemImage(def: ItemDefinition, style: RarityStyle)}
	<div class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-20 blur-xl {style.glow}"></div>
	<img src={def.image} alt={def.name} class="relative z-10 h-full w-full object-contain" />
{/snippet}

<div
	bind:clientHeight={track.containerHeight}
	class="relative z-10 flex h-full w-62 flex-col overflow-hidden bg-background/50"
>
	{#if gameLoop.status !== 'idle'}
		<div
			class="flex flex-col gap-2 px-3 pb-4"
			style="transform: translateY({-track.totalHeight + track.scrollOffset}px)"
		>
			{#each track.queue as item (item.id)}
				{@const style = getRarityStyle(item.def.rarity)}
				{@const isWeapon = item.def.type === 'weapon' && !!item.def.attachmentSlots?.length}

				<div
					class="flex w-full justify-center"
					class:track-shrink={item.matched}
					style:--shrink-h="{isWeapon ? 120 : 96}px"
					style:--shrink-dur="1s"
					style:animation-play-state={gameLoop.status === 'paused' ? 'paused' : 'running'}
				>
					{#if isWeapon}
						<!-- Weapon with attachment slots -->
						<div
							class="flex h-[120px] w-52 flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.border}"
						>
							<div class="relative flex flex-col overflow-hidden rounded-[7px] bg-surface">
								{#if item.matched}
									{@render scanerMatch(item.id, 1)}
								{/if}
								<div class="relative flex h-16 items-center justify-center">
									{@render itemImage(item.def, style)}
								</div>
								<div class="z-10 flex items-center justify-center gap-0.5 px-1 py-3">
									{#each item.def.attachmentSlots as slot, i (slot.type + i)}
										{@const att = item.attachments?.[i]}
										{#if att}
											{@const attStyle = getRarityStyle(att.rarity)}
											<div
												class="flex size-9 items-center justify-center overflow-hidden rounded bg-linear-to-tr p-[0.5px] {attStyle.border}"
											>
												<div
													class="flex h-full w-full items-center justify-center rounded-sm bg-surface"
												>
													<img
														src={att.image}
														alt={att.name}
														class="size-7 scale-125 object-contain"
													/>
												</div>
											</div>
										{:else}
											<div
												class="flex size-9 items-center justify-center rounded border border-white/15"
											>
												<img
													src={slot.placeholder}
													alt={slot.type}
													class="size-7 object-contain opacity-30"
												/>
											</div>
										{/if}
									{/each}
								</div>
							</div>
						</div>
					{:else}
						<div
							class="flex h-24 w-52 flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.border}"
						>
							<div class="relative flex h-full w-full overflow-hidden rounded-[7px] bg-surface">
								{#if item.matched}
									{@render scanerMatch(item.id, 1)}
								{/if}
								{@render itemImage(item.def, style)}
								{#if item.count > 1 && !item.matched}
									<div
										class="absolute right-0 bottom-0 z-30 flex min-w-11 items-center justify-center rounded-tl-md border-t border-l bg-black/40 px-2 py-1"
										style="border-color: color-mix(in srgb, var(--rarity-{item.def
											.rarity}) 50%, transparent); box-shadow: 0 0 10px color-mix(in srgb, var(--rarity-{item
											.def.rarity}) 50%, transparent)"
									>
										<span class="font-mono text-xs leading-none text-white tabular-nums"
											>x {item.count}</span
										>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<div
			class="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-linear-to-b from-background via-background/70 to-transparent"
		></div>

		<div
			class="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-linear-to-t from-background via-background/70 to-transparent"
		></div>
	{/if}
</div>

<style>
	.track-shrink {
		overflow: hidden;
		transform-origin: center top;
		animation: track-collapse var(--shrink-dur) ease-in forwards;
	}

	@keyframes track-collapse {
		0% {
			max-height: var(--shrink-h);
			opacity: 1;
			transform: scale(1);
			filter: brightness(1) blur(0);
		}
		55% {
			max-height: var(--shrink-h);
			opacity: 1;
			transform: scale(1);
		}
		100% {
			max-height: 0;
			opacity: 0;
			transform: scale(0.92);
			filter: brightness(1.4) blur(2px);
		}
	}
</style>
