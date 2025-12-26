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
	const FLIP_DURATION_MS = 50;

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
	let weaponSlots = $state([null, null]);
	let equipmentSlots = $state([null, null]);

	const checkCompatibility = (
		itemType: string,
		targetContainerType: string,
		index: number
	): boolean => {
		if (targetContainerType === 'backpack') return true;
		if (targetContainerType === 'weapon') {
			return itemType === 'weapon';
		}
		if (targetContainerType === 'equipment') {
			if (index === 0) return itemType === 'augment';
			if (index === 1) return itemType === 'shield';
		}
		return false;
	};
	function isSlotInvalid(targetType: 'weapon' | 'equipment' | 'backpack', index: number) {
		if (!dndState.isDragging || !dndState.draggedItem) return false;

		const itemType = dndState.draggedItem.item.type;
		const isValid = checkCompatibility(itemType, targetType, index);

		return !isValid;
	}

	const validateOnDragOver = (state: DragDropState<DragData>) => {
		const { draggedItem, targetContainer } = state;
		if (!draggedItem || !targetContainer) return;

		const [type, idxStr] = targetContainer.split('-');
		const index = parseInt(idxStr);
		const itemType = draggedItem.item.type;

		const isCompatible = checkCompatibility(itemType, type, index);
		dndState.invalidDrop = !isCompatible;
	};

	const getListRef = (containerId: string) => {
		const [type, idxStr] = containerId.split('-');
		const index = parseInt(idxStr);
		if (type === 'backpack') return { list: backpack, index };
		if (type === 'weapon') return { list: weaponSlots, index };
		if (type === 'equipment') return { list: equipmentSlots, index };
		return { list: backpack, index: 0 };
	};

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
			console.log('source', source, 'target', target, 'dndState', dndState);
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

<div class="flex h-full w-full items-start justify-center gap-6 bg-[#0f111a] pt-10 select-none">
	<div class="flex w-[300px] flex-col gap-6">
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
					class="flex aspect-video w-full items-center justify-center overflow-hidden
           rounded-xl border border-white/10 bg-[#0f1016]/50 ${isSlotInvalid('equipment', index)
						? 'border-red-500 bg-red-500/20'
						: 'valid-drop'}"
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
							<span class="font-mono text-sm tracking-widest uppercase">Equipment {index + 1}</span>
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
				class="flex aspect-video w-full items-center justify-center overflow-hidden
           rounded-xl border border-white/10 bg-[#0f1016]/50 ${isSlotInvalid('weapon', index)
					? 'border-red-500 bg-red-500/20'
					: 'valid-drop'}"
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
					<div class="pointer-events-none flex flex-col items-center justify-center text-white/20">
						<span class="font-mono text-sm tracking-widest uppercase">Weapon {index + 1}</span>
						<span class="text-xs opacity-50">Empty</span>
					</div>
				{/if}
			</div>
		{/each}
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
						class="h-full w-full cursor-grab transition-transform hover:scale-105 active:cursor-grabbing"
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

<style>
	:global(.valid-drop) {
		border-color: rgba(34, 197, 94, 0.5) !important;
		background-color: rgba(34, 197, 94, 0.1) !important;
	}

	:global(.invalid-drop) {
		border-color: rgba(68, 239, 168, 0.5) !important;
		background-color: rgba(239, 68, 68, 0.1) !important;
		cursor: no-drop !important;
	}
</style>
