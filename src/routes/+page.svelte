<script lang="ts">
	import Shortcuts from '$lib/components/shortcuts.svelte';
	import { getGameContext } from '$lib/store/game.svelte';
	import StorageGrid from '$lib/components/storage-grid.svelte';
	import AnimatedItemList from '$lib/components/track-item.svelte';
	import DropZone from '$lib/components/drop-zone.svelte';
	import { formatTime } from '$lib/utils';

	const { gameLoop } = getGameContext();
</script>

<div class="flex h-full items-center justify-center gap-6">
	<div class="flex h-full flex-col gap-6 pt-4">
		<div class="flex items-start justify-center gap-4">
			<div class="z-10 flex flex-col items-start">
				<div
					class="flex h-9 items-center gap-4 rounded-t-xl bg-background/50 px-5 backdrop-blur-md"
				>
					<div class="flex items-center gap-2">
						<kbd
							class="inline-flex min-w-11 items-center justify-center rounded-md bg-gradient-to-b from-kbd-from via-kbd-via to-kbd-to px-2 py-1 text-[11px] font-semibold text-kbd-text uppercase shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_1px_2px_rgba(0,0,0,0.2)]"
						>
							Space
						</kbd>
						<span class="text-[11px] font-semibold text-muted uppercase">Reroll Loot</span>
					</div>
				</div>
				<div
					class="z-10 flex flex-col gap-4 rounded-lg bg-background/50 px-4 pt-4 pb-12 backdrop-blur-xs"
				>
					<div class="grid grid-cols-4">
						<StorageGrid storageId="lootBack" class="aspect-square h-24 w-24" />
					</div>
					<DropZone />
				</div>
			</div>

			<div class="z-10 flex flex-col items-end">
				{@render scoreTimeTab()}
				<div class="flex flex-col gap-4 rounded-lg bg-background/50 p-4 backdrop-blur-xs">
					<div class="flex h-full w-full justify-center gap-8">
						<div class="flex flex-col gap-4">
							<div class="flex gap-4">
								<StorageGrid storageId="augment" class="h-24 w-[140px]" />
								<StorageGrid storageId="shield" class="h-24 w-[140px]" />
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
		</div>

		<Shortcuts />
	</div>

	<AnimatedItemList />
</div>

{#snippet scoreTimeTab()}
	{#if gameLoop.status !== 'idle'}
		<div class="flex h-9 items-center gap-4 rounded-t-xl bg-background/50 px-5 backdrop-blur-md">
			<span
				class="font-mono text-xs font-bold tracking-widest {gameLoop.timeLeft < 10
					? 'text-red-400'
					: 'text-white/90'}"
			>
				{formatTime(gameLoop.timeLeft)}
			</span>

			<div class="h-3 w-[1px] bg-white/20"></div>

			<div class="flex items-center gap-2">
				<img src="/assets/ui/Coins.png" alt="coins" class="size-3.5 object-contain" />
				<span class="text-[11px] font-black tracking-tighter text-white/90 uppercase">
					SCORE: {gameLoop.score}
				</span>
			</div>
		</div>
	{/if}
{/snippet}

<style>
	@reference "tailwindcss";
</style>
