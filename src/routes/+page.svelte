<script lang="ts">
	import { draggable, droppable, dndState, type DragDropState } from '@thisux/sveltednd';
	import { setInventory, type ItemType } from '$lib/state/inventory-manager.svelte';

	import ItemCard from '$lib/components/item-card.svelte';

	//assets
	import item from '$lib/assets/loot_assets/ARC Motion Core.png';
	import item1 from '$lib/assets/loot_assets/Blue Gate Communication Tower Key.png';
	import item2 from '$lib/assets/loot_assets/Blue Gate Cellar Key.png';
	import item3 from '$lib/assets/loot_assets/Industrial Charger.png';
	import augment1 from '$lib/assets/augment-1.png';
	import shield1 from '$lib/assets/shield-1.png';
	import weaponImg from '$lib/assets/weapon-kettle.webp';
	import WeaponCard from '$lib/components/weapon-card.svelte';
	import DndItem from '$lib/components/dnd-item.svelte';
	import InvalidCard from '$lib/components/invalid-card.svelte';
	import ammoTypeImg from '$lib/assets/ammo-type.webp';
	import DragItemGhost from '$lib/components/drag-layer.svelte';

	type ModsType = 'muzzle' | 'optic' | 'light-mag' | 'heavy-mag' | 'stock' | 'underbarrel' | 'grip';

	type ItemType = 'loot' | 'weapon' | 'augment' | 'shield' | ModsType;

	type RarityType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

	interface Item {
		id: string;
		type: ItemType;
		rare: RarityType;
		image?: string;
		count?: number;
		mods?: { type: ModsType; placeholder: string }[];
		modsSlots?: (Item | null)[];
		category?: {
			icon: string;
			type: string;
		};
	}

	const inv = setInventory();

	inv.setup({
		backpack: Array.from({ length: 14 }, (_, i) => {
			if (i === 0)
				return {
					id: 'l-1',
					type: 'loot',
					rare: 'common',
					image: item1,
					count: 50
				};
			if (i === 3) {
				return { type: 'shield', id: 'e-1', image: shield1, count: 1, rare: 'uncommon' };
			}
			if (i === 7) {
				return { type: 'augment', id: 'a-1', image: augment1, count: 1, rare: 'uncommon' };
			}
			if (i === 6) {
				return { type: 'mods', id: 'a-1', image: item3, count: 1, rare: 'legendary' };
			}
			if (i === 4)
				return {
					id: 'w-1',
					type: 'weapon',
					rare: 'uncommon',
					image: weaponImg,
					count: 1,
					category: {
						icon: ammoTypeImg,
						type: 'light'
					},
					mods: [
						{ type: 'light-mag', placeholder: 'MZ' },
						{ type: 'underbarrel', placeholder: 'UB' },
						{ type: 'optic', placeholder: 'LM' },
						{ type: 'grip', placeholder: 'SK' }
					],
					modsSlots: [null, null, null, null]
				};
			return null;
		}),
		lootBack: Array.from({ length: 20 }, (_, i) => {
			if (i === 0)
				return {
					id: 'lb-1',
					type: 'loot',
					rare: 'epic',
					image: item1,
					count: 10
				};
			if (i === 6)
				return {
					type: 'underbarrel',
					id: 'a-1',
					image: item3,
					count: 1,
					rare: 'legendary'
				};
			if (i === 4)
				return {
					type: 'light-mag',
					id: 'a-4',
					image: item1,
					count: 1,
					rare: 'epic'
				};
			if (i === 3)
				return {
					type: 'optic',
					id: 'a-3',
					image: item,
					count: 1,
					rare: 'common'
				};
			if (i === 1)
				return {
					type: 'grip',
					id: 'a-2',
					image: item2,
					count: 1,
					rare: 'uncommon'
				};
		})
	});

	const ALL_MODS_TYPES: ModsType[] = [
		'muzzle',
		'optic',
		'light-mag',
		'heavy-mag',
		'stock',
		'underbarrel',
		'grip'
	];

	const BP_ALLOWED: ItemType[] = ['loot', 'weapon', 'augment', 'shield', ...ALL_MODS_TYPES];
</script>

<!-- debug -->
{#if dndState.isDragging}
	<pre
		class="fixed bottom-4 left-4 z-[9999] w-[420px] rounded-md bg-black/80 p-3 text-xs text-white">
{JSON.stringify(
			{
				dragged: dndState.draggedItem?.item?.id,
				type: dndState.draggedItem?.item?.type,
				source: dndState.sourceContainer,
				target: dndState.targetContainer,
				invalidDrop: dndState.invalidDrop
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
			<span class="text-sm">{inv.lootBack.filter((i) => i).length}/20</span>
		</div>
		<!-- content -->
		<div class="text-sm uppercase">filter</div>
		<div class="grid grid-cols-4 gap-2">
			{#each inv.lootBack as _, index (index)}
				<DndItem
					id="lootBack-{index}"
					collection={inv.lootBack}
					{index}
					allowedTypes={BP_ALLOWED}
					className="h-20 w-20 aspect-square"
				>
					{#snippet children(item)}
						<ItemCard {item} className="h-full w-full" />
					{/snippet}
				</DndItem>
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
					<DndItem
						id="equipment-0"
						collection={inv.equipmentSlots}
						index={0}
						allowedTypes={['augment']}
						className="flex h-20 w-[120px] items-center justify-center rounded-lg border border-white/20"
					>
						{#snippet children(item, isInvalid)}
							{#if item}
								<ItemCard {item} className="h-full w-full" />
							{:else if isInvalid}
								<InvalidCard />
							{:else}
								<div
									class="pointer-events-none flex h-full flex-col items-center justify-center text-white/20"
								>
									<span class="font-mono text-sm tracking-widest uppercase">Equipment 1</span>
									<span class="text-xs opacity-50">Empty</span>
								</div>
							{/if}
						{/snippet}
					</DndItem>

					<DndItem
						id="equipment-1"
						collection={inv.equipmentSlots}
						index={1}
						allowedTypes={['shield']}
						className="flex h-20 w-[120px] items-center justify-center rounded-lg border border-white/20"
					>
						{#snippet children(item, isInvalid)}
							{#if item}
								<ItemCard {item} className="h-full w-full" />
							{:else if isInvalid}
								<InvalidCard />
							{:else}
								<div
									class="pointer-events-none flex h-full flex-col items-center justify-center text-white/20"
								>
									<span class="font-mono text-sm tracking-widest uppercase">Equipment 1</span>
									<span class="text-xs opacity-50">Empty</span>
								</div>
							{/if}
						{/snippet}
					</DndItem>
				</div>
				<DndItem
					id="weapon-0"
					collection={inv.weaponSlots}
					index={0}
					allowedTypes={['weapon']}
					draggbleEnabled={false}
					className="h-44 w-64 border border-white/20 items-center justify-center rounded-lg"
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
				</DndItem>
				<DndItem
					id="weapon-1"
					collection={inv.weaponSlots}
					index={1}
					allowedTypes={['weapon']}
					draggbleEnabled={false}
					className="h-44 w-64 border border-white/20 items-center justify-center rounded-lg"
				>
					{#snippet children(item, isInvalid)}
						{#if item}
							<WeaponCard {item} containerId="weapon-1" className="h-full w-full" />
						{:else if isInvalid}
							<InvalidCard />
						{:else}
							<div class="flex h-full flex-col items-center justify-center text-white/20">
								<span class="font-mono text-sm tracking-widest uppercase">Weapon 1</span>
								<span class="text-xs opacity-50">Empty</span>
							</div>
						{/if}
					{/snippet}
				</DndItem>
			</div>

			<!-- backpack -->
			<div class="flex flex-col gap-4">
				<!-- header -->
				<div class="flex items-center gap-4">
					<div class="text-sm uppercase">backpack</div>
					<span class="text-sm">{inv.backpack.filter((i) => i).length}/14</span>
				</div>

				<div class="grid grid-cols-4 gap-2">
					{#each inv.backpack as _, index (index)}
						<DndItem
							id="backpack-{index}"
							collection={inv.backpack}
							{index}
							allowedTypes={BP_ALLOWED}
							className="h-20 w-20 aspect-square"
						>
							{#snippet children(item)}
								<ItemCard {item} className="h-full w-full" />
							{/snippet}
						</DndItem>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<DragItemGhost />

<style>
	@reference "tailwindcss";
	/* :global(.dragging) {
		@apply opacity- shadow-lg ring-2 ring-blue-400;
	} */
	/* Глобальные стили для призрака */
	:global(.svelte-dnd-dragging) {
		opacity: 0.5;
		cursor: grabbing;
	}
</style>
