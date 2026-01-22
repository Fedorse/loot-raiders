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

	// inv.registerSlot(id, { collection, index, allowedTypes });

	const draggedItem = $derived(dndState.draggedItem);

	const isInvalid = $derived(draggedItem?.item && !allowedTypes.includes(draggedItem.item.type));

	$effect(() => {
		const cleanup = inv.registerSlot(id, { collection, index, allowedTypes });
		return cleanup;
	});

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

	// disabled default behavior browse drag and drop
	const handleDragStart = (event: DragEvent) => {
		const img = new Image();
		img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
		event.dataTransfer?.setDragImage(img, 0, 0);

		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
		}
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	{...props}
	use:droppable={{
		container: id,
		callbacks: dropCallbacks,
		attributes: {
			// draggingClass: 'scale-105 rotate-2 !shadow-2xl !ring-2 ring-blue-500/50 z-50',
			dragOverClass: 'opacity-0'
		}
	}}
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
			ondragstart={handleDragStart}
			class="h-full w-full"
		>
			{@render children(item, isInvalid)}
		</div>
	{:else}
		{@render children(item, isInvalid)}
	{/if}
</div>

<!-- <style>
	@reference "tailwindcss";

	:global(.dragging) {
		@apply opacity-0;
	}
</style> -->
