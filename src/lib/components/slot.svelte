<script lang="ts">
	import { type ItemInstance, type ItemType, type AttachmentType } from '$lib/config/items';

	import { getGameContext } from '$lib/store/game.svelte';
	import { getStorageConfig } from '$lib/config/storages';
	import ItemSlot from './item-slot.svelte';
	import EmptySlot from './empty-slot.svelte';

	type Props = {
		storage?: string;
		position?: number;
		class: string;
		placeholder?: any;
		showInvalid?: boolean;
	};

	let {
		storage,
		position,
		class: className = '',
		placeholder,
		showInvalid = true
	}: Props = $props();

	const game = getGameContext();

	const { dnd, inventory } = game;

	const { isDragging } = $derived(dnd);

	const item = $derived(inventory.getItem(storage, position));
	$inspect(item);

	const valid = $derived(dnd.canAccept(storage, item));

	// const isDraggingMe = $derived(dnd.isSource(slotRef));
</script>

<div class="{className}  relative">
	{#if item}
		<ItemSlot {item} {storage} {position} {className} />
	{:else}
		<EmptySlot {storage} {position} {placeholder} {className} />
	{/if}
	{@render invalidIcon()}
</div>

{#snippet invalidIcon()}
	{#if isDragging && !valid && showInvalid}
		<div class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
			<img src="/assets/invalid.png" alt="!!" class="size-10 opacity-50" />
		</div>
	{/if}
{/snippet}
