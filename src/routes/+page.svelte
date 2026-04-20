<script lang="ts">
	import Shortcuts from '$lib/components/shortcuts.svelte';
	import { getGameContext } from '$lib/store/game.svelte';
	import StorageGrid from '$lib/components/storage-grid.svelte';
	import QuestBar from '$lib/components/quest-bar.svelte';
	import DropZone from '$lib/components/drop-zone.svelte';
	import { formatTime } from '$lib/utils';

	const { gameLoop, inventory, loot, selection } = getGameContext();
</script>

<div class="flex h-full items-center justify-center gap-6" onpointerdown={() => selection.clear()}>
	<div class="flex h-full flex-col gap-6 pt-4">
		<div class="flex items-start justify-center gap-4">
			<div class="z-10 flex flex-col items-start">
				<div
					class="flex h-9 items-center gap-4 rounded-t-xl bg-background/50 px-5 backdrop-blur-md"
				>
					<span class="text-[11px] font-semibold tracking-wider text-white/90 uppercase"
						>Loot Drop</span
					>

					<div class="h-3 w-[1px] bg-white/20"></div>

					<div class="flex items-center gap-1.5">
						<span class="text-[11px] text-muted uppercase">Next</span>
						<span class="font-mono text-xs font-black text-cyan-400 tabular-nums">
							{Math.ceil(loot.cooldown)}s
						</span>
					</div>

					<div class="h-3 w-[1px] bg-white/20"></div>

					<div class="flex items-center gap-1.5">
						<kbd
							class="inline-flex min-w-11 items-center justify-center rounded-md bg-gradient-to-b from-kbd-from via-kbd-via to-kbd-to px-2 py-1 text-[11px] font-semibold text-kbd-text uppercase shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_1px_2px_rgba(0,0,0,0.2)]"
						>
							Space
						</kbd>
						<span class="text-[11px] font-semibold text-muted uppercase">Open Now</span>
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

		{#if gameLoop.status === 'playing'}
			<Shortcuts />
		{/if}
	</div>

	<div class="self-start pt-4">
		<QuestBar />
	</div>
</div>

{#snippet scoreTimeTab()}
	{#if gameLoop.status !== 'idle'}
		{@const weightPct = Math.min(100, (inventory.totalWeight / inventory.maxWeight) * 100)}
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
				<span class="text-[11px] text-muted uppercase">Extract</span>
				<span class="text-[11px] font-black text-yellow-400 tabular-nums">
					{inventory.totalExtract.toLocaleString()}
				</span>
			</div>

			<div class="h-3 w-[1px] bg-white/20"></div>

			<div class="flex items-center gap-2">
				<span class="text-[11px] text-muted uppercase">Weight</span>
				<span class="flex items-baseline gap-px font-mono tabular-nums">
					<span class="text-xs font-black text-white">{Math.round(inventory.totalWeight)}</span>
					<span class="text-[10px] font-bold text-white/40">/ {inventory.maxWeight}</span>
				</span>
				<div class="h-2 w-16 overflow-hidden rounded-full bg-white/10">
					<div
						class="h-full rounded-full transition-all {weightPct > 90
							? 'bg-red-400'
							: weightPct > 70
								? 'bg-yellow-400'
								: 'bg-cyan-400'}"
						style="width: {weightPct}%"
					></div>
				</div>
			</div>
		</div>
	{/if}
{/snippet}

<style>
	@reference "tailwindcss";
</style>
