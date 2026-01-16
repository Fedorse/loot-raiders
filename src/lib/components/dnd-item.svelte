<script lang="ts">
	import { draggable, droppable, dndState, type DragDropState } from '@thisux/sveltednd';
	import { useInventory, type Item, type ItemType } from '$lib/state/inventory-manager.svelte';

	type Props = {
		id: string;
		collection: (Item | null)[];
		index: number;
		allowedTypes: ItemType[];
		children: any;
		className: string;
		draggbleEnabled?: boolean;
		[key: string]: any;
	};

	type DragData = {
		item: Item;
	};

	let {
		id,
		collection,
		index,
		allowedTypes,
		children,
		className = '',
		draggbleEnabled = true,
		...props
	}: Props = $props();

	const inv = useInventory();

	inv.registerSlot(id, { collection, index, allowedTypes });

	const draggedItem = $derived(dndState.draggedItem);

	const isInvalid = $derived(draggedItem?.item && !allowedTypes.includes(draggedItem.item.type));

	// $effect(() => {
	// 	const cleanup = inv.registerSlot(id, { collection, index, allowedTypes });
	// 	return cleanup;
	// });

	const item = $derived(collection[index]);

	const dropCallbacks = {
		onDragOver: (state: DragDropState<DragData>) => {
			dndState.invalidDrop = !inv.canMove(state.sourceContainer, id);
		},
		onDragLeave: () => {
			inv.clearDragState();
		},
		onDrop: async (state: DragDropState<DragData>) => {
			inv.swap(state.sourceContainer, id);
		}
	};
	const dragCallbacks = {
		onDragEnd: (state: DragDropState<DragData>) => {
			inv.clearDragState();
		}
	};
</script>

<div
	{...props}
	use:droppable={{ container: id, callbacks: dropCallbacks }}
	class={className}
	class:ring-2={dndState.targetContainer === id && !dndState.invalidDrop}
	class:ring-blue-500={dndState.targetContainer === id && !dndState.invalidDrop}
>
	{#if draggbleEnabled}
		<div
			use:draggable={{
				container: id,
				dragData: { item },
				disabled: !item,
				callbacks: dragCallbacks
			}}
			class="h-full w-full"
		>
			{@render children(item, isInvalid)}
		</div>
	{:else}
		{@render children(item, isInvalid)}
	{/if}
</div>
