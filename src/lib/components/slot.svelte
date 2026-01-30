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

	const { isDragging } = $derived(dnd);

	const isDraggingMe = $derived(dnd.isSource({ collection, index }));
	const item = $derived(collection[index]);
	const valid = $derived(dnd.canAccept(allowedTypes, item));
</script>

<div
	class="{className}  relative"
	{@attach droppable({ item, slotRef: { collection, index }, allowedTypes, dnd })}
>
	{#if !item || isDraggingMe}
		<div
			class="flex h-full w-full cursor-default items-center justify-center rounded-lg border border-white/20"
		>
			{#if placeholder}
				{@render placeholder()}
			{/if}
		</div>
	{:else}
		<div class="h-full w-full" {@attach draggable({ item, slotRef: { collection, index }, dnd })}>
			{#if item}
				{@render children(item)}
			{/if}
		</div>
	{/if}

	{#if isDragging && !valid && showInvalid}
		<div class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
			<img src="/assets/invalid.png" alt="!!" class="size-10 opacity-50" />
		</div>
	{/if}
</div>
