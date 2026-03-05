<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import { LOOTBOX_ORDER, getLootboxDef } from '$lib/config/lootboxes';
	import { getRarityStyle } from '$lib/config/rarity';
	import { getStorageConfig } from '$lib/config/storages';
	import { tweened } from 'svelte/motion';
	import StorageGrid from './storage-grid.svelte';

	const { lootbox, inventory } = getGameContext();
	const lootBackConfig = getStorageConfig('lootBack');

	const REPEATS = 6;
	const BOX_W = 256;
	const BOX_H = 176;
	const GAP = 12;
	const CELL = BOX_H + GAP;
	const STRIP_LENGTH = LOOTBOX_ORDER.length * REPEATS;

	const boxes = Array.from({ length: STRIP_LENGTH }, (_, i) => {
		const id = LOOTBOX_ORDER[i % LOOTBOX_ORDER.length];
		return getLootboxDef(id);
	});

	function slotMachineEase(t: number): number {
		return 1 - Math.pow(1 - t, 4);
	}

	const stripOffset = tweened(0, { duration: 2000, easing: slotMachineEase });
	const centerRepeat = Math.floor(REPEATS / 2);

	async function handleSpin() {
		stripOffset.set(0, { duration: 0 });
		lootbox.spin();
		const targetIdx = centerRepeat * LOOTBOX_ORDER.length + lootbox.resultIndex;
		await stripOffset.set(targetIdx * CELL);
		lootbox.onSpinComplete();
	}
</script>

<div class="flex flex-col gap-4 rounded-lg bg-background/50 px-4 pt-4 pb-12 backdrop-blur-xs">
	{#if lootbox.phase === 'opened'}
		<div class="flex items-center gap-4">
			<h2 class="text-base font-bold uppercase">{lootbox.selectedBox.rarity}</h2>
			<span class="text-sm">{inventory.lootBack.length}/{lootBackConfig.size}</span>
		</div>
		<div class="grid grid-cols-4">
			<StorageGrid storageId="lootBack" class="aspect-square h-20 w-20" />
		</div>
		<button
			class="mt-2 cursor-pointer rounded bg-white/10 px-6 py-2 text-sm font-bold tracking-wider text-white uppercase transition-colors hover:bg-white/20"
			onclick={() => lootbox.close()}
		>
			Close
		</button>
	{:else}
		<h2 class="text-base font-bold uppercase">Loot Raiders Cashes</h2>

		<!-- Carousel viewport -->
		<div
			class="relative overflow-hidden rounded-lg"
			style="width: {BOX_W}px; height: {BOX_H * 2 + GAP}px;"
		>
			<!-- Center indicator -->
			<div
				class="pointer-events-none absolute top-0 bottom-0 z-10 border-2 border-yellow-400/80"
				style="left: 0; width: {BOX_W}px; top: {BOX_H / 2 + GAP / 2}px; bottom: auto; height: {BOX_H}px;"
			></div>

			<!-- Strip -->
			<div
				class="flex flex-col"
				style="gap: {GAP}px; transform: translateY({-$stripOffset + BOX_H / 2 + GAP / 2}px);"
			>
				{#each boxes as box, i (i)}
					{@const style = getRarityStyle(box.rarity)}
					{@const isWinner =
						lootbox.phase === 'result' &&
						i === centerRepeat * LOOTBOX_ORDER.length + lootbox.resultIndex}
					<div
						class="relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b p-[2px]
							{style.border}"
						class:ring-2={isWinner}
						class:ring-yellow-400={isWinner}
						style="width: {BOX_W}px; height: {BOX_H}px;"
					>
						<div class="flex h-full w-full items-center justify-center rounded-md bg-black/60">
							<img
								src={box.image}
								alt={box.rarity}
								class="h-full w-full object-contain drop-shadow-lg"
							/>
						</div>
						<!-- Rarity glow -->
						<div
							class="pointer-events-none absolute right-0 bottom-0 left-0 {style.height} opacity-20 blur-xl {style.glow}"
						></div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Controls -->
		{#if lootbox.phase === 'idle'}
			<button
				class="mt-2 cursor-pointer rounded bg-yellow-500/90 px-6 py-2 text-sm font-bold tracking-wider text-black uppercase transition-colors hover:bg-yellow-400"
				onclick={handleSpin}
			>
				Roll
			</button>
		{:else if lootbox.phase === 'result'}
			<button
				class="mt-2 cursor-pointer rounded bg-green-500/90 px-6 py-2 text-sm font-bold tracking-wider text-black uppercase transition-colors hover:bg-green-400"
				onclick={() => lootbox.open()}
			>
				Open {lootbox.selectedBox.rarity}
			</button>
		{:else if lootbox.phase === 'spinning'}
			<div
				class="mt-2 px-6 py-2 text-center text-sm font-bold tracking-wider text-white/50 uppercase"
			>
				Spinning...
			</div>
		{/if}
	{/if}
</div>

<style>
	@reference "tailwindcss";
</style>
