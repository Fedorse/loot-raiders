<script lang="ts">
	import { draggable, droppable, dndState, type DragDropState } from '@thisux/sveltednd';
	import LootItem from '$lib/components/loot-item.svelte';

	//assets
	import item from '$lib/assets/loot_assets/ARC Motion Core.png';
	import item1 from '$lib/assets/loot_assets/Blue Gate Communication Tower Key.png';
	import item2 from '$lib/assets/loot_assets/Blue Gate Cellar Key.png';
	import item3 from '$lib/assets/loot_assets/Industrial Charger.png';
	import augment1 from '$lib/assets/augment-1.png';
	import shield1 from '$lib/assets/shield-1.png';
	import weaponImg from '$lib/assets/weapon-kettle.webp';
	import { flip } from 'svelte/animate';

	type ItemType = 'empty' | 'loot' | 'weapon' | 'augment' | 'shield' | 'quickUse';

	type RarityType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

	interface BaseItem {
		id: string;
		type: ItemType;
		image?: string;
		count?: number;
		rare?: RarityType;
	}

	interface DragData {
		item: BaseItem;
		sourceContainerId: string;
	}

	type InventorySlot = BaseItem | null;

	const BACKPACK_SIZE = 20;
	const RAIDER_CASHES = 20;
	const FLIP_DURATION_MS = 50;
	const QUICK_USE_SIZE = 5;

	let backpack: InventorySlot[] = $state(
		Array.from({ length: BACKPACK_SIZE }, (_, i) => {
			if (i === 0) return { type: 'loot', id: 'l-1', image: item, count: 50, rare: 'common' };
			if (i === 1) return { type: 'loot', id: 'l-2', image: item1, count: 3, rare: 'uncommon' };
			if (i === 2) return { type: 'loot', id: 'l-3', image: item2, count: 1, rare: 'epic' };
			if (i === 3) return { type: 'loot', id: 'l-4', image: item3, count: 1, rare: 'legendary' };
			if (i === 4) return { type: 'weapon', id: 'w-1', image: weaponImg, count: 1, rare: 'common' };
			if (i === 5)
				return { type: 'augment', id: 'a-1', image: augment1, count: 1, rare: 'uncommon' };
			if (i === 6) return { type: 'shield', id: 'e-1', image: shield1, count: 1, rare: 'uncommon' };

			return null;
		})
	);

	let raidersCahses: InventorySlot[] = $state(
		Array.from({ length: RAIDER_CASHES }, (_, i) => {
			if (i === 0) return { type: 'loot', id: 'l-1', image: item, count: 50, rare: 'common' };
			if (i === 1) return { type: 'loot', id: 'l-2', image: item1, count: 3, rare: 'uncommon' };
			if (i === 2) return { type: 'loot', id: 'l-3', image: item2, count: 1, rare: 'epic' };

			return null;
		})
	);
	let usableItem = $state({
		quickUse: Array.from({ length: QUICK_USE_SIZE }, (_, i) => {
			return null;
		}),
		agumentSlots: [null, null],
		safePocket: [null, null, null]
	});

	let weaponSlots = $state([null, null]);
	let equipmentSlots = $state([null, null]);

	const raidersCahsesFilled = $derived(raidersCahses.filter((item) => item !== null).length);
	const backpackFilled = $derived(backpack.filter((item) => item !== null).length);

	const dragDropCallbacks = {
		onDragOver: (state: DragDropState<DragData>) => {
			validateOnDragOver(state);
		},
		onDrop: (state: DragDropState<DragData>) => {
			if (dndState.invalidDrop) return;

			const { sourceContainer, targetContainer } = state;

			if (!targetContainer || sourceContainer === targetContainer) return;

			const source = getListRef(sourceContainer);
			const target = getListRef(targetContainer);
			const itemFrom = source.list[source.index];
			const itemTo = target.list[target.index];

			target.list[target.index] = itemFrom;
			source.list[source.index] = itemTo;
		},
		onDragEnd: () => {
			dndState.invalidDrop = false;
		}
	};
</script>

<div class="flex h-full w-full items-center justify-center gap-4 px-5 py-16">
	<div
		class="z-10 flex h-full w-[35%] flex-col items-start gap-4 rounded-lg bg-[#0b0c15]/80 px-4 py-4 backdrop-blur-xs"
	>
		<!-- header -->
		<div class="flex items-center gap-4">
			<h2 class="text-base font-bold uppercase">Loot raiders cashes</h2>
			<span class="text-sm">{raidersCahsesFilled}/{RAIDER_CASHES}</span>
		</div>
		<!-- content -->
		<div class="text-sm uppercase">filter</div>
		<div class="grid grid-cols-4 gap-2">
			{#each raidersCahses as item, index (item ? item.id : `empty-cashes-${index}`)}
				<div
					use:droppable={{
						container: `raiders-cahses-${index}`,
						callbacks: dragDropCallbacks,
						attributes: {
							dragOverClass: 'valid-drop'
						}
					}}
					class="aspect-square h-20 w-20"
					animate:flip={{ duration: FLIP_DURATION_MS }}
				>
					{#if item}
						<div
							use:draggable={{ container: `backpack-${index}`, dragData: { item } }}
							class="h-full w-full"
						>
							<LootItem {item} className="h-full w-full" />
						</div>
					{:else}
						<LootItem
							item={{ type: 'empty', id: `empty-${index}` }}
							className="h-full w-full pointer-events-none"
						/>
					{/if}
				</div>
			{/each}
		</div>
	</div>
	<div
		class="z-10 flex h-full w-full flex-col items-start gap-4 rounded-lg bg-[#0b0c15]/80 px-4 py-4 backdrop-blur-xs"
	>
		<!-- main header -->
		<div class="flex items-center">
			<h2 class="text-base font-bold uppercase">loadout</h2>
		</div>
		<div class="flex h-full w-full gap-10">
			<!-- equipment slots -->
			<div class="flex flex-col gap-4">
				<div class="text-sm uppercase">equipment</div>
				<div class="flex gap-4">
					{#each equipmentSlots as item, index (item ? item.id : `equipment-empty-${index}`)}
						<div
							use:droppable={{
								container: `equipment-${index}`,
								callbacks: dragDropCallbacks,
								attributes: {
									dragOverClass: dndState.invalidDrop ? 'invalid-drop' : 'valid-drop'
								}
							}}
							class="flex aspect-video h-20 items-center justify-center
           rounded-lg border border-white/20"
						>
							{#if item}
								<div
									use:draggable={{
										container: `equipment-${index}`,
										dragData: { item, sourceContainerId: `equipment-${index}` }
									}}
									class="h-full w-full"
								>
									<LootItem {item} className="h-full w-full" />
								</div>
							{:else}
								<div
									class="pointer-events-none flex flex-col items-center justify-center text-white/20"
								>
									<span class="font-mono text-sm tracking-widest uppercase"
										>Equipment {index + 1}</span
									>
									<span class="text-xs opacity-50">Empty</span>
								</div>
							{/if}
						</div>
					{/each}
				</div>
				{#each weaponSlots as item, index (item ? item.id : `weapon-empty-${index}`)}
					<div
						use:droppable={{
							container: `weapon-${index}`,
							callbacks: dragDropCallbacks,
							attributes: {
								dragOverClass: dndState.invalidDrop ? 'invalid-drop' : 'valid-drop'
							}
						}}
						class="flex aspect-video h-40 items-center justify-center overflow-hidden
           rounded-lg border border-white/20"
					>
						{#if item}
							<div
								use:draggable={{
									container: `weapon-${index}`,
									dragData: { item, sourceContainerId: `weapon-${index}` }
								}}
								class="h-full w-full"
							>
								<LootItem {item} className="h-full w-full" />
							</div>
						{:else}
							<div
								class="pointer-events-none flex flex-col items-center justify-center text-white/20"
							>
								<span class="font-mono text-sm tracking-widest uppercase">Weapon {index + 1}</span>
								<span class="text-xs opacity-50">Empty</span>
							</div>
						{/if}
					</div>
				{/each}
			</div>
			<!-- backpack -->
			<div class="flex flex-col gap-4">
				<!-- header -->
				<div class="flex items-center gap-4">
					<div class="text-sm uppercase">backpack</div>
					<span class="text-sm">{backpackFilled}/{BACKPACK_SIZE}</span>
				</div>
				<div class="grid grid-cols-4 gap-2">
					{#each backpack as item, index (item ? item.id : `empty-${index}`)}
						<div
							use:droppable={{
								container: `backpack-${index}`,
								callbacks: dragDropCallbacks,
								attributes: {
									dragOverClass: 'valid-drop'
								}
							}}
							class="aspect-square h-20 w-20"
							animate:flip={{ duration: FLIP_DURATION_MS }}
						>
							{#if item}
								<!-- {@const isDraggingThis = dndState.draggedItem?.item.id === item.id} -->
								<div
									use:draggable={{ container: `backpack-${index}`, dragData: { item } }}
									class="h-full w-full"
								>
									<LootItem {item} className="h-full w-full" />
								</div>
							{:else}
								<LootItem
									item={{ type: 'empty', id: `empty-${index}` }}
									className="h-full w-full pointer-events-none"
								/>
							{/if}
						</div>
					{/each}
				</div>
			</div>
			<!-- quick use  -->
			<div class="flex flex-col gap-4">
				<!-- useble item -->

				<div class="flex items-center gap-4">
					<div class="text-sm uppercase">quick use</div>
					<span class="text-sm">{backpackFilled}/{BACKPACK_SIZE}</span>
				</div>
				<!-- content -->
				<div class="grid grid-cols-3 gap-2">
					{#each usableItem.quickUse as item, index (item ? item.id : `empty-${index}`)}
						<div
							use:droppable={{
								container: `quickUse-${index}`,
								callbacks: dragDropCallbacks,
								attributes: {
									dragOverClass: 'valid-drop'
								}
							}}
							class="aspect-square h-20 w-20"
							animate:flip={{ duration: FLIP_DURATION_MS }}
						>
							{#if item}
								<div
									use:draggable={{ container: `quickUse-${index}`, dragData: { item } }}
									class="h-full w-full"
								>
									<LootItem {item} className="h-full w-full" />
								</div>
							{:else}
								<LootItem
									item={{ type: 'empty', id: `empty-${index}` }}
									className="h-full w-full pointer-events-none"
								/>
							{/if}
						</div>
					{/each}
				</div>
				<!-- augment slots  -->
				<div class="flex items-center gap-4">
					<div class="text-sm uppercase">augmented slots</div>
					<span class="text-sm">{backpackFilled}/{BACKPACK_SIZE}</span>
				</div>
				<!-- content -->
				<div class="flex gap-2">
					{#each usableItem.agumentSlots as item, index (item ? item.id : `empty-${index}`)}
						<div
							use:droppable={{
								container: `quickUse-${index}`,
								callbacks: dragDropCallbacks,
								attributes: {
									dragOverClass: 'valid-drop'
								}
							}}
							class="aspect-square h-20 w-20"
							animate:flip={{ duration: FLIP_DURATION_MS }}
						>
							{#if item}
								<div
									use:draggable={{ container: `quickUse-${index}`, dragData: { item } }}
									class="h-full w-full"
								>
									<LootItem {item} className="h-full w-full" />
								</div>
							{:else}
								<LootItem
									item={{ type: 'empty', id: `empty-${index}` }}
									className="h-full w-full pointer-events-none"
								/>
							{/if}
						</div>
					{/each}
				</div>
				<!-- safe pocket  -->
				<div class="flex items-center gap-4">
					<div class="text-sm uppercase">safe pocket</div>
					<span class="text-sm">{backpackFilled}/{BACKPACK_SIZE}</span>
				</div>
				<!-- content -->
				<div class="flex gap-2">
					{#each usableItem.safePocket as item, index (item ? item.id : `empty-${index}`)}
						<div
							use:droppable={{
								container: `quickUse-${index}`,
								callbacks: dragDropCallbacks,
								attributes: {
									dragOverClass: 'valid-drop'
								}
							}}
							class="aspect-square h-20 w-20"
							animate:flip={{ duration: FLIP_DURATION_MS }}
						>
							{#if item}
								<div
									use:draggable={{ container: `quickUse-${index}`, dragData: { item } }}
									class="h-full w-full"
								>
									<LootItem {item} className="h-full w-full" />
								</div>
							{:else}
								<LootItem
									item={{ type: 'empty', id: `empty-${index}` }}
									className="h-full w-full pointer-events-none"
								/>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
