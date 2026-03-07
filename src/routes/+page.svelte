<script lang="ts">
	import Shortcuts from '$lib/components/shortcuts.svelte';
	import { getGameContext } from '$lib/store/game.svelte';
	import { getStorageConfig } from '$lib/config/storages';
	import StorageGrid from '$lib/components/storage-grid.svelte';
	import TetrisGrid from '$lib/components/tetris-grid.svelte';
	import { droppable } from '$lib/actions/actions';
	import type { SlotState, ItemLocation } from '$lib/types';

	const { loot, interaction } = getGameContext();

	const trashLocation: ItemLocation = { type: 'trash' };
	const trashSlotState: SlotState = { location: trashLocation, item: null };
</script>

<div class="flex h-full w-full flex-col items-start gap-6 px-5 py-16">
	<div class="flex items-start justify-center gap-4">
		<div
			class="z-10 flex flex-col gap-4 rounded-lg bg-background/50 px-4 pt-4 pb-12 backdrop-blur-xs"
		>
			<div class="flex items-center gap-1">
				<h2 class="text-base font-bold uppercase">Loot raiders cashes</h2>

				<button
					class="rounded bg-white/10 px-3 py-1 text-sm uppercase hover:bg-white/20
                        disabled:cursor-not-allowed disabled:opacity-30"
					onclick={() => loot.next()}
					disabled={loot.phase === 'loading'}
				>
					next
				</button>
			</div>
			<!-- <div class="text-sm uppercase">filter</div> -->
			<div class="grid grid-cols-4">
				<StorageGrid storageId="lootBack" class="aspect-square h-20 w-20" />
			</div>

			<div
				class="flex min-h-28 w-full flex-col items-center justify-center rounded-lg border transition-all duration-150
					{interaction.status === 'dragging' && interaction.isHovered(trashLocation)
					? 'border-red-500 bg-red-500/15 text-red-400'
					: interaction.status === 'dragging'
						? 'border-red-500/50 text-red-400/70'
						: 'border-gray-500/50 text-gray-500/50'}"
				{@attach droppable(trashSlotState)}
			>
				<div class="">
					<img
						src="assets/ui/drop.png"
						alt=""
						class="size-12 object-contain transition-all duration-150
							{interaction.status === 'dragging' && interaction.isHovered(trashLocation)
							? 'opacity-60 grayscale-0'
							: interaction.status === 'dragging'
								? 'opacity-30 grayscale'
								: 'opacity-20 grayscale'}"
					/>
				</div>
				<span class="uppercase">drop item</span>
			</div>
		</div>

		<div
			class="z-10 flex flex-col items-start gap-4 rounded-lg bg-background/50 px-4 py-4 backdrop-blur-xs"
		>
			<div class="flex items-center">
				<h2 class="text-base font-bold uppercase">loadout</h2>
			</div>
			<div class="flex h-full w-full justify-center gap-8">
				<div class="flex flex-col gap-4">
					<!-- <div class="text-sm uppercase">equipment</div> -->
					<div class="flex gap-4">
						<StorageGrid storageId="augment" class="h-20 w-[120px] " />
						<StorageGrid storageId="shield" class="h-20 w-[120px] " />
					</div>
					<StorageGrid storageId="weapon" class="h-44 w-64" />
				</div>

				<div class="flex flex-col gap-4">
					<div class="grid grid-cols-4">
						<StorageGrid storageId="backpack" class="aspect-square h-20 w-20" />
					</div>
				</div>
			</div>
		</div>
	</div>

	<Shortcuts />

	<div class="fixed top-16 right-5">
		<TetrisGrid />
	</div>
</div>

<style>
	@reference "tailwindcss";
</style>
