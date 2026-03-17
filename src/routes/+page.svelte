<script lang="ts">
	import Shortcuts from '$lib/components/shortcuts.svelte';
	import { getGameContext } from '$lib/store/game.svelte';
	import StorageGrid from '$lib/components/storage-grid.svelte';

	import AnimatedItemList from '$lib/components/track-item.svelte';
	import DropZone from '$lib/components/drop-zone.svelte';

	const { gameLoop } = getGameContext();
</script>

<div class="flex h-full items-center justify-center gap-6">
	<div class="flex h-full flex-col gap-6 pt-4">
		{#if gameLoop.status !== 'idle'}
			<div
				class="z-100 flex w-full items-center justify-center gap-2 text-lg font-bold text-white/80"
			>
				<div class="flex items-center">
					<img src="/assets/ui/Coins.png" alt="coins" class="size-6 object-contain" />
					<span class="">{gameLoop.score}</span>
				</div>
				<span class="text-white/40">|</span>
				<span class={gameLoop.timeLeft < 10 ? 'text-red-400' : ''}>
					{String(Math.floor(Math.ceil(gameLoop.timeLeft) / 60)).padStart(2, '0')}:{String(
						Math.ceil(gameLoop.timeLeft) % 60
					).padStart(2, '0')}
				</span>
			</div>
		{/if}
		<div class="flex items-start justify-center gap-4">
			<div
				class="z-10 flex flex-col gap-4 rounded-lg bg-background/50 px-4 pt-4 pb-12 backdrop-blur-xs"
			>
				<div class="flex items-center gap-1">
					<!-- <button
						class="rounded bg-white/10 px-3 py-1 text-sm uppercase hover:bg-white/20
                        disabled:cursor-not-allowed disabled:opacity-30"
						onclick={() => loot.next()}
						disabled={loot.phase === 'loading' || gameLoop.status !== 'playing'}
					>
						next
					</button> -->
				</div>
				<div class="grid grid-cols-4">
					<StorageGrid storageId="lootBack" class="aspect-square h-24 w-24" />
				</div>

				<DropZone />
			</div>

			<div
				class="z-10 flex flex-col items-start gap-4 rounded-lg bg-background/50 px-4 py-4 backdrop-blur-xs"
			>
				<div class="flex items-center">
					<!-- <h2 class="text-base font-bold uppercase">loadout</h2> -->
				</div>
				<div class="flex h-full w-full justify-center gap-8">
					<div class="flex flex-col gap-4">
						<div class="flex gap-4">
							<StorageGrid storageId="augment" class="h-24 w-[140px] " />
							<StorageGrid storageId="shield" class="h-24 w-[140px] " />
						</div>
						<StorageGrid storageId="weapon" class="h-48 w-[295px]" />
					</div>

					<div class="flex flex-col gap-4">
						<div class="grid grid-cols-4">
							<StorageGrid storageId="backpack" class="aspect-square h-24 w-24" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<Shortcuts />
	</div>
	<AnimatedItemList />
</div>

<style>
	@reference "tailwindcss";
</style>
