<script lang="ts">
	import { useInventory, type Item } from '$lib/store/inventory-manger.svelte';
	import type { ItemInstance, ItemType } from '$lib/config/items';
	import { getDndContext } from '$lib/store/dnd-manger.svelte';
	import { droppable, draggable } from '$lib/attach/dnd';
	import type { SlotReference } from '$lib/config/items';

	type Props = {
		collection: (ItemInstance | null)[];
		index: number;
		allowedTypes: ItemType[];
		children: any;
		className: string;
	};

	let { collection, index, allowedTypes, children, className = '' }: Props = $props();

	const dnd = getDndContext();

	const { isDragging, source } = $derived(dnd.state);

	// const isInvalid = $derived(draggedItem?.item && !allowedTypes.includes(draggedItem.item.type));

	const item = $derived(collection[index]);
	const slotRef = { collection, index };

	const draggingItem = $derived(
		isDragging && source?.collection === collection && source.index === index
	);
</script>

<div class={className} {@attach droppable(slotRef, allowedTypes, dnd)}>
	{#if !item || draggingItem}
		<div class="h-full w-full cursor-default rounded-lg border border-white/20"></div>
	{:else}
		<div
			class="h-full w-full"
			class:opacity-0={draggingItem}
			{@attach draggable(item, slotRef, dnd)}
		>
			{#if item}
				{@render children(item)}
			{/if}
		</div>
	{/if}
</div>

<!-- <style>
	@reference "tailwindcss";

	:global(.dragging) {
		@apply opacity-0;
	}
</style> -->
