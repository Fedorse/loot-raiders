<script lang="ts">
	import { setInventory } from '$lib/store/inventory-manger.svelte';
	import type { ItemType, AttachmentType, ItemInstance } from '$lib/config/items';
	import ItemCard from '$lib/components/item-card.svelte';
	import Socket from '$lib/components/socket.svelte';
	import InvalidCard from '$lib/components/invalid-card.svelte';
	import { setDndContext } from '$lib/store/dnd-manger.svelte';
	import DragLayer from '$lib/components/drag-layer.svelte';
	import WeaponCard from '$lib/components/weapon-card.svelte';

	const inventory = setInventory();

	const ATACHMENT: AttachmentType[] = ['muzzle', 'optic', 'stock', 'underbarrel', 'grip'];

	const dnd = setDndContext((source, target) => {
		inventory.handleDrop(source, target);
	});

	const BP_ALLOWED: ItemType[] = ['loot', 'weapon', 'augment', 'shield', ...ATACHMENT];
</script>

<!-- debug -->
{#if dnd.state.isDragging}
	<pre
		class="fixed bottom-4 left-4 z-[9999] w-[420px] rounded-md bg-black/80 p-3 text-xs text-white">
{JSON.stringify(
			{
				dragged: dnd.state.item && dnd.state.item.defId,
				target: dnd.state.target,
				validDrop: dnd.state.isValidDrop,
				pointer: dnd.state.pointer,
				offset: dnd.state.offset
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
				<Socket
					collection={inventory.lootBack}
					{index}
					allowedTypes={BP_ALLOWED}
					className="h-20 w-20 aspect-square"
				>
					{#snippet children(item)}
						<ItemCard {item} className="h-full w-full" />
					{/snippet}
				</Socket>
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
					<Socket
						collection={inventory.equipmentSlots}
						index={0}
						allowedTypes={['augment']}
						className=" h-20 w-[120px] flex-1 items-center justify-center "
					>
						{#snippet children(item, isInvalid)}
							{#if item}
								<ItemCard {item} className="h-full w-full" />
							{:else if isInvalid}
								<InvalidCard />
							{/if}
						{/snippet}
					</Socket>

					<Socket
						collection={inventory.equipmentSlots}
						index={1}
						allowedTypes={['shield']}
						className="flex-1 h-20 w-[120px]  items-center justify-center "
					>
						{#snippet children(item, isInvalid)}
							{#if item}
								<ItemCard {item} className="h-full w-full" />
							{:else if isInvalid}
								<InvalidCard />
							{/if}
						{/snippet}
					</Socket>
				</div>
				<Socket
					collection={inventory.weaponSlots}
					index={0}
					allowedTypes={['weapon']}
					className="h-44 w-64 "
				>
					{#snippet children(item, isInvalid)}
						{#if item}
							<WeaponCard {item} containerId="weapon-0" className="h-full w-full" />
						{:else if isInvalid}
							<InvalidCard />
						{:else}
							<div class="flex h-full flex-col items-center justify-center text-white/20">
								<span class="font-mono text-sm tracking-widest uppercase">Weapon 1</span>
								<span class="text-xs opacity-50">Empty</span>
							</div>
						{/if}
					{/snippet}
				</Socket>
				<Socket
					collection={inventory.weaponSlots}
					index={1}
					allowedTypes={['weapon']}
					className="h-44 w-64"
				>
					{#snippet children(item, isInvalid)}
						{#if item}
							<WeaponCard {item} className="h-full w-full" />
						{:else if isInvalid}
							<InvalidCard />
						{:else}
							<div class="flex h-full flex-col items-center justify-center text-white/20">
								<span class="font-mono text-sm tracking-widest uppercase">Weapon 1</span>
								<span class="text-xs opacity-50">Empty</span>
							</div>
						{/if}
					{/snippet}
				</Socket>
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
						<Socket
							collection={inventory.backpack}
							{index}
							allowedTypes={BP_ALLOWED}
							className="h-20 w-20 aspect-square"
						>
							{#snippet children(item)}
								<ItemCard {item} className="h-full w-full" />
							{/snippet}
						</Socket>
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
