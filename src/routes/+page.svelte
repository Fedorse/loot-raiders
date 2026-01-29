<script lang="ts">
	import type { ItemType, AttachmentType, ItemInstance, ItemCategory } from '$lib/config/items';
	import ItemCard from '$lib/components/item-card.svelte';
	import Slot from '$lib/components/slot.svelte';
	import InvalidCard from '$lib/components/invalid-card.svelte';
	import DragLayer from '$lib/components/drag-layer.svelte';
	import WeaponCard from '$lib/components/weapon-card.svelte';
	import { initGame } from '$lib/store/game.svelte';

	const game = initGame();
	const { inventory, dnd } = game;
</script>

<!-- debug -->
{#if dnd.state.isDragging}
	<pre
		class="fixed bottom-4 left-4 z-[9999] w-[420px] rounded-md bg-black/80 p-3 text-xs text-white">
{JSON.stringify(
			{
				dragged: dnd.state.item && dnd.state.item.defId,
				target: {
					slot: dnd.state.target?.collection[dnd.state.target.index],
					index: dnd.state.target?.index
				},
				validDrop: dnd.state.isValidDrop,
				pointer: dnd.state.pointer,
				source: {
					item: dnd.state.source?.collection[dnd.state.source.index],
					index: dnd.state.source?.index
				}
			},
			null,
			2
		)}
	</pre>
{/if}

<div class="flex h-full w-full items-start justify-center gap-4 px-5 py-16">
	<!-- lootback -->
	<div class="z-10 flex flex-col gap-4 rounded-lg bg-[#0b0c15]/80 px-4 pt-4 pb-12 backdrop-blur-xs">
		<!-- header -->
		<div class="flex items-center gap-4">
			<h2 class="text-base font-bold uppercase">Loot raiders cashes</h2>
			<span class="text-sm">{inventory.lootBack.filter((i) => i).length}/20</span>
		</div>
		<!-- content -->
		<div class="text-sm uppercase">filter</div>
		<div class="grid grid-cols-4 gap-2">
			{#each inventory.lootBack as _, index (index)}
				<Slot collection={inventory.lootBack} {index} className="h-20 w-20 aspect-square">
					{#snippet children(item)}
						<ItemCard {item} className="h-full w-full" />
					{/snippet}
				</Slot>
			{/each}
		</div>
	</div>
	<div
		class="z-10 flex flex-col items-start gap-4 rounded-lg bg-[#0b0c15]/80 px-4 py-4 backdrop-blur-xs"
	>
		<!-- main header -->
		<div class="flex items-center">
			<h2 class="text-base font-bold uppercase">loadout</h2>
		</div>
		<div class="flex h-full w-full justify-center gap-8">
			<div class="flex flex-col gap-4">
				<div class="text-sm uppercase">equipment</div>
				<div class="flex gap-4">
					<Slot
						collection={inventory.equipment}
						index={0}
						allowedTypes={['augment']}
						className=" h-20 w-[120px] flex-1 items-center justify-center "
					>
						{#snippet children(item)}
							<ItemCard {item} className="h-full w-full" />
						{/snippet}
						{#snippet placeholder()}
							<img
								src="/assets/placeholder/augment_placeholder.png"
								alt="placeholder"
								class="w-full object-contain opacity-50"
							/>
						{/snippet}
					</Slot>

					<Slot
						collection={inventory.equipment}
						index={1}
						allowedTypes={['shield']}
						className="flex-1 h-20 w-[120px]  items-center justify-center "
					>
						{#snippet children(item)}
							<ItemCard {item} className="h-full w-full" />
						{/snippet}
						{#snippet placeholder()}
							<img
								src="/assets/placeholder/shield_placeholder.png"
								alt="placeholder"
								class="w-full object-contain opacity-50"
							/>
						{/snippet}
					</Slot>
				</div>
				<Slot
					collection={inventory.weapon}
					index={0}
					allowedTypes={['weapon']}
					className="h-44 w-64"
				>
					{#snippet children(item)}
						<WeaponCard {item} className="h-full w-full" />
					{/snippet}
					{#snippet placeholder()}
						<img
							src="/assets/placeholder/placeholder_weapon.png"
							alt="placeholder"
							class="w-1/2 object-contain opacity-50"
						/>
					{/snippet}
				</Slot>
				<Slot
					collection={inventory.weapon}
					index={1}
					allowedTypes={['weapon']}
					className="h-44 w-64"
				>
					{#snippet children(item)}
						<WeaponCard {item} className="h-full w-full" />
					{/snippet}
					{#snippet placeholder()}
						<img
							src="/assets/placeholder/placeholder_weapon.png"
							alt="placeholder"
							class="w-1/2 object-contain opacity-50"
						/>
					{/snippet}
				</Slot>
			</div>

			<!-- backpack -->
			<div class="flex flex-col gap-4">
				<!-- header -->
				<div class="flex items-center gap-4">
					<div class="text-sm uppercase">backpack</div>
					<span class="text-sm">{inventory.backpack.filter((i) => i).length}/14</span>
				</div>

				<div class="grid grid-cols-4 gap-2">
					{#each inventory.backpack as _, index (index)}
						<Slot collection={inventory.backpack} {index} className="h-20 w-20 aspect-square">
							{#snippet children(item)}
								<ItemCard {item} className="h-full w-full" />
							{/snippet}
						</Slot>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<DragLayer />

<style>
	@reference "tailwindcss";
	/* :global(.dragging) {
		@apply opacity- shadow-lg ring-2 ring-blue-400;
	} */
</style>
