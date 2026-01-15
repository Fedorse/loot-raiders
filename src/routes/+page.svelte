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
	import invalid from '$lib/assets/invalid.png';
	import { flip } from 'svelte/animate';
	import WeaponCard from '$lib/components/weapon-card.svelte';

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
	}

	type InventorySlot = BaseItem | null;

	const BACKPACK_SIZE = 14;
	const LOOT_BACK_SIZE = 20;
	const FLIP_DURATION_MS = 0;

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
	let lootBack: InventorySlot[] = $state(
		Array.from({ length: LOOT_BACK_SIZE }, (_, i) => {
			if (i === 0) return { type: 'loot', id: 'lb-1', image: item, count: 50, rare: 'common' };
			if (i === 1) return { type: 'loot', id: 'lb-2', image: item1, count: 3, rare: 'uncommon' };
			if (i === 4)
				return {
					type: 'weapon',
					id: 'lb-4',
					image: weaponImg,
					count: 1,
					rare: 'epic',
					attachments: [null, null, null, null]
				};
			if (i === 5)
				return { type: 'augment', id: 'lb-5', image: augment1, count: 1, rare: 'uncommon' };
			if (i === 6)
				return { type: 'shield', id: 'lb-6', image: shield1, count: 1, rare: 'uncommon' };

			return null;
		})
	);
	let weaponSlots = $state([
		{
			type: 'weapon',
			id: 'w-4',
			image: weaponImg,
			count: 1,
			rare: 'common',
			attachments: [null, null, null, null]
		},
		null
	]);
	let equipmentSlots = $state([null, null]);

	const raidersCahsesFilled = $derived(lootBack.filter((item) => item !== null).length);
	const backpackFilled = $derived(backpack.filter((item) => item !== null).length);

	const checkCompatibility = (itemType: string, targetType: string, targetIndex: number) => {
		if (targetType === 'backpack' || targetType === 'lootBack') return true;
		if (targetType === 'weapon') return itemType === 'weapon';
		if (targetType === 'weaponAttach') return true;

		if (targetType === 'equipment') {
			if (targetIndex === 0) return itemType === 'augment';
			if (targetIndex === 1) return itemType === 'shield';
		}
		return false;
	};

	const getListRef = (containerId: string) => {
		const parts = containerId.split('-');

		const type = parts[0];
		const index = parseInt(parts[1]);

		if (type === 'weapon' && parts[2] === 'attach') {
			const attachIndex = parseInt(parts[3]);
			const weapon = weaponSlots[index];

			if (!weapon || weapon.type !== 'weapon') return null;

			return { list: weapon.attachments, index: attachIndex, weaponIndex: index };
		}

		if (type === 'backpack') return { list: backpack, index: index };
		if (type === 'lootBack') return { list: lootBack, index: index };
		if (type === 'weapon') return { list: weaponSlots, index: index };
		if (type === 'equipment') return { list: equipmentSlots, index: index };

		return { list: backpack, index: 0 };
	};

	const dragDropCallbacks = {
		onDragOver: (state: DragDropState<DragData>) => {
			const { draggedItem, targetContainer } = state;

			if (!draggedItem || !targetContainer) return;

			const parts = targetContainer.split('-');

			console.log('[OVER]', {
				source: state.sourceContainer,
				target: state.targetContainer,
				invalid: dndState.invalidDrop
			});

			let targetType = parts[0];
			let targetIndx = parseInt(parts[1]);

			// weapon-0-attach-2  =>  targetType = weaponAttach, targetIndx = 2
			if (parts[0] === 'weapon' && parts[2] === 'attach') {
				targetType = 'weaponAttach';
				targetIndx = parseInt(parts[3]);
			}

			const isValid = checkCompatibility(draggedItem.item.type, targetType, targetIndx);
			dndState.invalidDrop = !isValid;
		},
		onDrop: (state: DragDropState<DragData>) => {
			if (dndState.invalidDrop) return;

			const { sourceContainer, targetContainer } = state;

			if (!targetContainer || sourceContainer === targetContainer) return;

			const source = getListRef(sourceContainer);
			const target = getListRef(targetContainer);

			// swap items
			const itemFrom = source.list[source.index];
			const itemTo = target.list[target.index];

			target.list[target.index] = itemFrom;
			source.list[source.index] = itemTo;
		},
		onDragEnd: () => {}
	};
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
	<div class="z-10 flex flex-col gap-4 rounded-lg bg-[#0b0c15]/80 px-4 py-4 backdrop-blur-xs">
		<!-- header -->
		<div class="flex items-center gap-4">
			<h2 class="text-base font-bold uppercase">Loot raiders cashes</h2>
			<span class="text-sm">{raidersCahsesFilled}/{LOOT_BACK_SIZE}</span>
		</div>
		<!-- content -->
		<div class="text-sm uppercase">filter</div>

		<div class="grid grid-cols-4 gap-2">
			{#each lootBack as item, index (item ? item.id : `lootBack-empty-${index}`)}
				<div
					use:droppable={{
						container: `lootBack-${index}`,
						callbacks: dragDropCallbacks
					}}
					class="aspect-square h-20 w-20"
					animate:flip={{ duration: FLIP_DURATION_MS }}
				>
					{#if item}
						<div
							use:draggable={{ container: `lootBack-${index}`, dragData: { item } }}
							class="h-full w-full"
						>
							<LootItem {item} className="h-full w-full" />
						</div>
					{:else}
						<LootItem
							item={{ type: 'empty', id: `lootBack-empty-${index}` }}
							className="h-full w-full pointer-events-none"
						/>
					{/if}
				</div>
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
			<!-- equipment slots -->
			<div class="flex flex-col gap-4">
				<div class="text-sm uppercase">equipment</div>
				<div class="flex gap-4">
					{#each equipmentSlots as item, index (item ? item.id : `equipment-empty-${index}`)}
						{@const isInvalid =
							dndState.isDragging &&
							dndState.draggedItem &&
							!checkCompatibility(dndState.draggedItem.item.type, 'equipment', index)}
						<div
							use:droppable={{
								container: `equipment-${index}`,
								callbacks: dragDropCallbacks
							}}
							class="flex h-20 w-[120px] items-center justify-center
           rounded-lg border border-white/20"
						>
							{#if item}
								<div
									use:draggable={{
										container: `equipment-${index}`,
										dragData: { item }
									}}
									class="h-full w-full"
								>
									<LootItem {item} className="h-full w-full" />
								</div>
							{:else if isInvalid}
								<div class="pointer-events-none h-full w-full p-5">
									<img
										src={invalid}
										alt="invalid"
										class="h-full w-full object-contain opacity-50"
									/>
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
					{@const isInvalid =
						dndState.isDragging &&
						dndState.draggedItem &&
						!checkCompatibility(dndState.draggedItem.item.type, 'weapon', index)}
					{@const isDraggingLoot =
						dndState.isDragging && dndState.draggedItem?.item.type !== 'weapon'}

					<div
						use:droppable={{
							container: `weapon-${index}`,
							callbacks: dragDropCallbacks,
							disabled: dndState.isDragging && dndState.draggedItem?.item.type !== 'weapon'
						}}
						class="flex h-44 w-64 items-center justify-center overflow-hidden
           rounded-lg border border-white/20"
					>
						{#if item}
							<WeaponCard
								{item}
								className="h-full w-full"
								containerId={`weapon-${index}`}
								callbacks={dragDropCallbacks}
							/>
						{:else if isInvalid}
							<div class=" h-full w-full p-5">
								<img src={invalid} alt="invalid" class="h-full w-full object-contain opacity-50" />
							</div>
						{:else}
							<div class="flex flex-col items-center justify-center text-white/20">
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
								callbacks: dragDropCallbacks
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
		</div>
	</div>
</div>

<style>
	@reference "tailwindcss";
	/* :global(.dragging) {
		@apply opacity-50 shadow-lg ring-2 ring-blue-400;
	} */
</style>
