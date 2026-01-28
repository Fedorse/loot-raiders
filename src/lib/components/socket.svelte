<script lang="ts">
	import { type ItemInstance, type ItemType, type ItemCategory, getDef } from '$lib/config/items';
	import { getDndContext } from '$lib/store/dnd-manger.svelte';
	import { droppable, draggable } from '$lib/attach/dnd';
	import { checkValidation } from '$lib/utils/utils';

	type Props = {
		collection: (ItemInstance | null)[];
		index: number;
		categories: ItemCategory[];
		children: any;
		className: string;
		placeholder?: any;
		showInvalid?: boolean;
	};

	let {
		collection,
		index,
		categories,
		children,
		className = '',
		placeholder,
		showInvalid = true
	}: Props = $props();

	const dnd = getDndContext();

	const { isDragging, source, item: draggedItem, isValidDrop } = $derived(dnd.state);

	const item = $derived(collection[index]);

	const slotRef = { collection, index };

	const draggedItemSelf = $derived(
		isDragging && source?.collection === collection && source.index === index
	);

	const validation = $derived(checkValidation(draggedItem, categories, item));
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
	{#if isDragging && !validation && showInvalid}
		<div class="absolute inset-0 z-10 flex w-full items-center justify-center">
			<img src="/assets/invalid.png" alt="invalid" class=" size-10 object-contain opacity-70" />
		</div>
	{/if}
</div>
