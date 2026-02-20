<script lang="ts">
	import { droppable, slotInteractions } from '$lib/actions/actions';
	import { getDef } from '$lib/config/items';
	import WeaponCard from './weapon-card.svelte';
	import ItemCard from './item-card.svelte';

	import type { StoredItem } from '$lib/types';

	type Props = {
		storedItem: StoredItem;
		className?: string;
		selectedItem: boolean;
	};

	let { storedItem, className = '', selectedItem }: Props = $props();

	const { item, storage } = $derived(storedItem);
	const dropTarget = $derived({
		storage: storedItem.storage,
		item: storedItem.item
	});

	const def = $derived(getDef(item.defId));
	const isWeapon = $derived(def.type === 'weapon');
</script>

<div
	class="{className} h-full w-full"
	{@attach droppable(dropTarget)}
	{@attach slotInteractions(storedItem)}
>
	{#if isWeapon && storedItem.storage.storageId === 'weapon'}
		<WeaponCard {item} className="h-full w-full" weaponSlotRef={storage} selected={selectedItem} />
	{:else}
		<ItemCard {item} selected={selectedItem} className="h-full w-full" />
	{/if}
</div>
