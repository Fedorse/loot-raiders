<script lang="ts">
	import type { ItemInstance, ItemType, ItemCategory } from '$lib/config/items';
	import { getDndContext } from '$lib/store/dnd-manger.svelte';
	import { droppable, draggable } from '$lib/attach/dnd';
	import InvalidCard from './invalid-card.svelte';
	import { chekValidation } from '$lib/utils/utils';

	type Props = {
		collection: (ItemInstance | null)[];
		index: number;
		categories: ItemCategory[];
		children: any;
		className: string;
		placeholder?: any;
	};

	let { collection, index, categories, children, className = '', placeholder }: Props = $props();

	const dnd = getDndContext();

	const { isDragging, source, isValidDrop } = $derived(dnd.state);

	// const isInvalid = $derived(draggedItem?.item && !allowedTypes.includes(draggedItem.item.type));

	const item = $derived(collection[index]);
	const slotRef = { collection, index };

	const draggedItem = $derived(
		isDragging && source?.collection === collection && source.index === index
	);
	let invalid = $derived(isValidDrop);
	let validateSlot = $derived(isDragging ? chekValidation(draggedItem, categories) : true);
</script>

<div class="{className} relative" {@attach droppable(slotRef, categories, dnd)}>
	{#if !item || draggedItem}
		<div
			class="flex h-full w-full cursor-default items-center justify-center rounded-lg border border-white/20"
		>
			{#if placeholder}
				{@render placeholder()}
			{/if}
		</div>
	{:else}
		<div
			class="h-full w-full"
			class:opacity-0={draggedItem}
			{@attach draggable(item, slotRef, dnd)}
		>
			{#if item}
				{@render children(item)}
			{/if}
		</div>
	{/if}
	<!-- {#if isDragging && !validateSlot}
		<div class="absolute inset-0 z-10">
			<InvalidCard />
		</div>
	{/if} -->
</div>
