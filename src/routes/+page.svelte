<script lang="ts">
	import ItemCard from '$lib/components/item-card.svelte';
	import Slot from '$lib/components/slot.svelte';
	import DragLayer from '$lib/components/drag-layer.svelte';
	import WeaponCard from '$lib/components/weapon-card.svelte';
	import { initGame } from '$lib/store/game.svelte';
	import { getStorageConfig } from '$lib/config/storages';
	import type { ItemInstance } from '$lib/config/items';

	const game = initGame();
	const { inventory, dnd } = game;

	const lootBackConfig = getStorageConfig('lootBack');
	const backpackConfig = getStorageConfig('backpack');
	const weaponConfig = getStorageConfig('weapon');
	const augmentConfig = getStorageConfig('augment');
	const shieldConfig = getStorageConfig('shield');

	const lootBackCollection = $derived(inventory.getStorageCollection('lootBack'));
	const backpackCollection = $derived(inventory.getStorageCollection('backpack'));
	const weaponCollection = $derived(inventory.getStorageCollection('weapon'));
	const augmentCollection = $derived(inventory.getStorageCollection('augment'));
	const shieldCollection = $derived(inventory.getStorageCollection('shield'));
</script>

<!-- debug -->
{#if dnd.isDragging}
	<pre
		class="fixed bottom-4 left-4 z-[9999] w-[420px] rounded-md bg-black/80 p-3 text-xs text-white">
{JSON.stringify(
			{
				dragged: dnd.draggedItem && dnd.draggedItem.defId,
				target: {
					storage: dnd.target?.storage,
					position: dnd.target?.position,
					item: dnd.target && inventory.getItem(dnd.target.storage, dnd.target.position)
				},
				validDrop: dnd.isValidDrop,
				pointer: dnd.pointer,
				source: {
					storage: dnd.source?.storage,
					position: dnd.source?.position,
					item: dnd.source && inventory.getItem(dnd.source.storage, dnd.source.position)
				}
			},
			null,
			2
		)}
	</pre>
{/if}

<div class="flex h-full w-full items-start justify-center gap-4 px-5 py-16">
	<div class="z-10 flex flex-col gap-4 rounded-lg bg-[#0b0c15]/80 px-4 pt-4 pb-12 backdrop-blur-xs">
		<div class="flex items-center gap-4">
			<h2 class="text-base font-bold uppercase">Loot raiders cashes</h2>
			{#if lootBackConfig}
				<span class="text-sm"
					>{lootBackCollection.filter((i) => i).length}/{lootBackConfig.size}</span
				>
			{/if}
		</div>
		<div class="text-sm uppercase">filter</div>
		<div class="grid grid-cols-4 gap-2">
			{#if lootBackConfig}
				{#each Array(lootBackConfig.size) as _, index (index)}
					<Slot storage="lootBack" position={index} className="h-20 w-20 aspect-square">
						{#snippet children(item: ItemInstance | null)}
							<ItemCard {item} className="h-full w-full" />
						{/snippet}
					</Slot>
				{/each}
			{/if}
		</div>
	</div>
	<div
		class="z-10 flex flex-col items-start gap-4 rounded-lg bg-[#0b0c15]/80 px-4 py-4 backdrop-blur-xs"
	>
		<div class="flex items-center">
			<h2 class="text-base font-bold uppercase">loadout</h2>
		</div>
		<div class="flex h-full w-full justify-center gap-8">
			<div class="flex flex-col gap-4">
				<div class="text-sm uppercase">equipment</div>
				<div class="flex gap-4">
					{#if augmentConfig}
						{#each Array(augmentConfig.size) as _, index (index)}
							<Slot
								storage="augment"
								position={index}
								className=" h-20 w-[120px] flex-1 items-center justify-center "
							>
								{#snippet children(item: ItemInstance | null)}
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
						{/each}
					{/if}

					{#if shieldConfig}
						{#each Array(shieldConfig.size) as _, index (index)}
							<Slot
								storage="shield"
								position={index}
								className="flex-1 h-20 w-[120px]  items-center justify-center "
							>
								{#snippet children(item: ItemInstance | null)}
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
						{/each}
					{/if}
				</div>

				{#if weaponConfig}
					{#each Array(weaponConfig.size) as _, index (index)}
						<Slot storage="weapon" position={index} className="h-44 w-64">
							{#snippet children(item: ItemInstance | null)}
								{#if item}
									<WeaponCard {item} className="h-full w-full" />
								{/if}
							{/snippet}
							{#snippet placeholder()}
								<img
									src="/assets/placeholder/placeholder_weapon.png"
									alt="placeholder"
									class="w-1/2 object-contain opacity-50"
								/>
							{/snippet}
						</Slot>
					{/each}
				{/if}
			</div>

			<!-- backpack -->
			<div class="flex flex-col gap-4">
				<!-- header -->
				<div class="flex items-center gap-4">
					<div class="text-sm uppercase">backpack</div>
					{#if backpackConfig}
						<span class="text-sm"
							>{backpackCollection.filter((i) => i).length}/{backpackConfig.size}</span
						>
					{/if}
				</div>

				<div class="grid grid-cols-4 gap-2">
					{#if backpackConfig}
						{#each Array(backpackConfig.size) as _, index (index)}
							<Slot storage="backpack" position={index} className="h-20 w-20 aspect-square">
								{#snippet children(item: ItemInstance | null)}
									<ItemCard {item} className="h-full w-full" />
								{/snippet}
							</Slot>
						{/each}
					{/if}
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
