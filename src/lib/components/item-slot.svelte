<script lang="ts">
	import { droppable, draggable } from '$lib/actions/actions';
	import { getDef } from '$lib/config/items';
	import WeaponCard from './weapon-card.svelte';
	import ItemCard from './item-card.svelte';

	import type { SlotState } from '$lib/types';

	type Props = {
		slotState: SlotState;
		className?: string;
		selectedItem: boolean;
		onmatched?: () => void;
	};

	let { slotState, className = '', selectedItem, onmatched }: Props = $props();

	const item = $derived(slotState.item!);
	const location = $derived(slotState.location);

	const def = $derived(getDef(item.defId));
	const isWeapon = $derived(
		def.type === 'weapon' && location.type === 'slot' && location.storageId === 'weapon'
	);
</script>

<div
	class="{className} h-full w-full"
	{@attach droppable(slotState)}
	{@attach draggable(slotState)}
>
	{#if isWeapon}
		<WeaponCard {item} selected={selectedItem} {location} className="h-full w-full" {onmatched} />
	{:else}
		<ItemCard {item} selected={selectedItem} {location} className="h-full w-full" {onmatched} />
	{/if}
</div>
