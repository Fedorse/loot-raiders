<script lang="ts">
	import { type ItemInstance, type ItemType, type ItemCategory, getDef } from '$lib/config/items';
	import { getDndContext } from '$lib/store/dnd-manger.svelte';
	import { droppable, draggable } from '$lib/attach/dnd';
	import InvalidCard from './invalid-card.svelte';
	import { checkValidation } from '$lib/utils/utils';

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

	const { isDragging, source, item: draggedItem } = $derived(dnd.state);

	const itemDef = $derived(getDef(draggedItem?.defId));

	const isInvalid = $derived(draggedItem && !categories.includes(itemDef.type));

	// const isInvalid = $derived(draggedItem?.item && !allowedTypes.includes(draggedItem.item.type));

	const item = $derived(collection[index]);

	const slotRef = { collection, index };

	const draggedItemSelf = $derived(
		isDragging && source?.collection === collection && source.index === index
	);

	let validation = $derived(checkValidation(draggedItem, categories));
</script>

<div class="{className}  relative" {@attach droppable(slotRef, categories, dnd, item)}>
	{#if !item || draggedItemSelf}
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
			class:opacity-0={draggedItemSelf}
			{@attach draggable(item, slotRef, dnd)}
		>
			{#if item}
				{@render children(item)}
			{/if}
		</div>
	{/if}
	<!-- {#if isDragging && isInvalid}
		<div class="absolute inset-0 z-10 flex w-full items-center justify-center">
			<InvalidCard />
		</div>
	{/if} -->
</div>
