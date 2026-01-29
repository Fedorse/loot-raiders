<script lang="ts">
	import { type ItemInstance, type ItemType, type ItemCategory, getDef } from '$lib/config/items';
	import { droppable, draggable } from '$lib/attach/dnd';
	import { getGameContext } from '$lib/store/game.svelte';
	import * as Rules from '$lib/store/inventory-rules';

	type Props = {
		collection: (ItemInstance | null)[];
		index: number;
		allowedTypes?: ItemType[];
		children: any;
		className: string;
		placeholder?: any;
		showInvalid?: boolean;
	};

	let {
		collection,
		index,
		allowedTypes = [],
		children,
		className = '',
		placeholder,
		showInvalid = true
	}: Props = $props();

	const game = getGameContext();

	const { dnd } = game;

	const { isDragging, source, item: draggedItem, isValidDrop } = $derived(dnd.state);

	const currentItem = $derived(collection[index]);

	const slotRef = { collection, index };

	const draggedCurrentItem = $derived(
		isDragging && source?.collection === collection && source.index === index
	);

	const canAccept = $derived.by(() => {
		if (!draggedItem) return true; // Если ничего не тащим, слот активен

		// Слот активен, если можно ПОЛОЖИТЬ сюда или ПРИКРЕПИТЬ к тому, кто тут лежит
		return Rules.canPlace(draggedItem, allowedTypes) || Rules.canAttach(draggedItem, currentItem);
	});
</script>

<div
	class="{className}  relative"
	{@attach droppable(slotRef, allowedTypes, dnd, currentItem)}
	data-slot-role
>
	{#if !currentItem || draggedCurrentItem}
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
			class:opacity-0={draggedCurrentItem}
			{@attach draggable(currentItem, slotRef, dnd)}
		>
			{#if currentItem}
				{@render children(currentItem)}
			{/if}
		</div>
	{/if}

	{#if dnd.state.isDragging && !canAccept && showInvalid}
		<div class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
			<img src="/assets/invalid.png" alt="!!" class="size-10 opacity-50" />
		</div>
	{/if}
</div>
