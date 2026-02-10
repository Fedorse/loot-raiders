<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import type { SlotRef } from '$lib/config/items';
	import ItemSlot from './item-slot.svelte';
	import EmptySlot from './empty-slot.svelte';

	type Props = {
		slotRef: SlotRef;
		class: string;
		placeholder?: string;
	};

	let { slotRef, class: className = '', placeholder }: Props = $props();

	const game = getGameContext();
	const { dnd, inventory } = game;
	const { dragOrigin } = $derived(dnd);

	const storedItem = $derived(inventory.getItem(slotRef));
	const dragOriginSlot = $derived(dragOrigin?.item === storedItem?.item);

	const validSlot = $derived(
		dnd.canAccept({
			storage: slotRef,
			item: storedItem?.item ?? null
		})
	);
</script>

<div class="{className} relative">
	{#if storedItem && !dragOriginSlot}
		<ItemSlot {storedItem} {className} />
	{:else}
		<EmptySlot {slotRef} {placeholder} {className} />
	{/if}
	{@render invalidIcon()}
</div>

{#snippet invalidIcon()}
	{#if dragOrigin && !validSlot && !('attachIndex' in slotRef)}
		<div class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
			<img src="/assets/invalid.png" alt="!!" class="size-10 opacity-50" />
		</div>
	{/if}
{/snippet}
