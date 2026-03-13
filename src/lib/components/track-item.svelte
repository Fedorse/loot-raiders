<script lang="ts">
	import { getRarityStyle } from '$lib/config/rarity';
	import { getGameContext } from '$lib/store/game.svelte';

	const { gameLoop } = getGameContext();
	const track = gameLoop.track;
</script>

<div
	bind:clientHeight={track.containerHeight}
	class="relative z-10 flex h-[calc(100vh-10rem)] w-52 flex-col overflow-hidden rounded-lg bg-background/50"
>
	{#if gameLoop.status === 'playing' || gameLoop.status === 'paused' || gameLoop.status === 'over'}
		<!-- Scrolling feed -->
		<div
			class="flex flex-col gap-2 px-3 pb-4"
			style="transform: translateY({-track.totalHeight + track.scrollOffset}px)"
		>
			{#each track.queue as item (item.id)}
				{@const style = getRarityStyle(item.def.rarity)}
				<div
					class="flex w-full justify-center transition-opacity duration-300"
					class:opacity-20={item.matched}
				>
					{#if item.def.type === 'weapon' && item.def.attachmentSlots?.length}
						<!-- Weapon with attachment slots -->
						<div
							class="flex h-[102px] w-44 flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.border}"
						>
							<div class="relative flex flex-col overflow-hidden rounded-[7px] bg-surface">
								<div class="relative flex h-16 items-center justify-center">
									<div
										class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-20 blur-xl {style.glow}"
									></div>
									<img
										src={item.def.image}
										alt={item.def.name}
										class="relative z-10 h-full w-full object-contain"
									/>
								</div>
								<div class="z-10 flex items-center justify-center gap-0.5 px-1 py-1">
									{#each item.def.attachmentSlots as slot, i}
										{@const att = item.attachments?.[i]}
										{#if att}
											{@const attStyle = getRarityStyle(att.rarity)}
											<div
												class="flex size-7 items-center justify-center overflow-hidden rounded bg-linear-to-tr p-[0.5px] {attStyle.border}"
											>
												<div
													class="flex h-full w-full items-center justify-center rounded-sm bg-surface"
												>
													<img
														src={att.image}
														alt={att.name}
														class="size-8 scale-125 object-contain"
													/>
												</div>
											</div>
										{:else}
											<div
												class="flex size-7 items-center justify-center rounded border border-white/15"
											>
												<img
													src={slot.placeholder}
													alt={slot.type}
													class="size-8 object-contain opacity-30"
												/>
											</div>
										{/if}
									{/each}
								</div>
							</div>
						</div>
					{:else}
						<!-- Simple item -->
						<div
							class="flex h-20 w-44 flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.border}"
						>
							<div class="relative flex h-full w-full overflow-hidden rounded-[7px] bg-surface">
								<div
									class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-20 blur-xl {style.glow}"
								></div>
								<img
									src={item.def.image}
									alt={item.def.name}
									class="relative z-10 h-full w-full object-contain"
								/>
								{#if item.count > 1}
									<div
										class="absolute right-1 bottom-1 z-20 flex items-center gap-0.5 rounded bg-black/70 px-1 py-0.5 text-xs leading-none font-medium text-white"
									>
										<span class="text-[9px] text-white/50">x</span>
										<span class="font-sans text-xs tracking-[-0.05em]">{item.count}</span>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
