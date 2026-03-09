<script lang="ts">
	import Shortcuts from '$lib/components/shortcuts.svelte';
	import { getGameContext } from '$lib/store/game.svelte';
	import { getStorageConfig } from '$lib/config/storages';
	import StorageGrid from '$lib/components/storage-grid.svelte';

	import { droppable } from '$lib/actions/actions';
	import type { SlotState, ItemLocation, ItemDefinition } from '$lib/types';
	import { ITEM_DB } from '$lib/config/items';
	import { getRarityStyle } from '$lib/config/rarity';

	const { loot, interaction } = getGameContext();

	const feedItems = (() => {
		const all = Object.values(ITEM_DB);
		const byType = new Map<string, ItemDefinition[]>();
		for (const d of all) {
			const list = byType.get(d.type) ?? [];
			list.push(d);
			byType.set(d.type, list);
		}
		const picked: ItemDefinition[] = [];
		for (const [, list] of byType) {
			const take = Math.min(list.length, Math.ceil(20 / byType.size));
			picked.push(...list.slice(0, take));
		}
		return picked.slice(0, 20).map((def) => ({
			def,
			count: def.type === 'weapon' ? 1 : Math.floor(Math.random() * 9) + 2
		}));
	})();

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
		<div
			class="scrollbar-none z-10 flex h-[calc(100vh-10rem)] w-28 flex-col gap-2 overflow-y-auto rounded-lg bg-background/50 px-3 py-4 backdrop-blur-xs"
		>
			<h2 class="text-xs font-bold text-white/60 uppercase">Items</h2>
			{#each feedItems as { def, count } (def.id)}
				{@const style = getRarityStyle(def.rarity)}
				<div class="flex w-full justify-center">
					<div
						class="flex h-20 w-20 flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.border}"
					>
						<div
							class="relative flex h-full w-full overflow-hidden rounded-[7px] bg-surface"
						>
							<div
								class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-20 blur-xl {style.glow}"
							></div>
							<img
								src={def.image}
								alt={def.name}
								class="relative z-10 h-full w-full object-contain"
							/>
							{#if def.type !== 'weapon' && count > 1}
								<div
									class="absolute right-1 bottom-1 z-20 flex items-center gap-0.5 rounded bg-black/70 px-1 py-0.5 text-xs leading-none font-medium text-white"
								>
									<span class="text-[9px] text-white/50">x</span>
									<span class="font-sans text-xs tracking-[-0.05em]">{count}</span>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<Shortcuts />

</div>

<style>
	@reference "tailwindcss";
</style>
