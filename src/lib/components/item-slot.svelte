<script lang="ts">
	import { droppable, slotInteractions } from '$lib/actions/actions';
	import type { StoredItem } from '$lib/store/inventory-manger.svelte';
	import { getGameContext } from '$lib/store/game.svelte';
	import WeaponCard from './weapon-card.svelte';
	import ItemCard from './item-card.svelte';
	import AttachCard from './attach-weapon-card.svelte';

	type Props = {
		storedItem: StoredItem;
		className?: string;
		selectedItem: boolean;
	};

	let { storedItem, className = '', selectedItem }: Props = $props();

	const { inventory } = getGameContext();
	const { item, storage } = $derived(storedItem);
	const dropTarget = $derived({
		storage: storedItem.storage,
		item: storedItem.item
	});

	const isWeapon = $derived(storage.storageId === 'weapon' && !('attachIndex' in storage));
	const isAttachmentInWeapon = $derived('attachIndex' in storage);
	const hasAttachments = $derived(
		inventory.items.some(
			(i) =>
				'attachIndex' in i.storage &&
				i.storage.storageId === storage.storageId &&
				i.storage.index === storage.index
		)
	);
</script>

<div
	class="{className} h-full w-full"
	{@attach droppable(dropTarget)}
	{@attach slotInteractions(storedItem)}
>
	{#if isWeapon}
		<WeaponCard
			{item}
			className="h-full w-full"
			weaponStorage={storage.storageId}
			weaponPosition={storage.index}
			selected={selectedItem}
		/>
	{:else if isAttachmentInWeapon}
		<AttachCard {item} className="h-full w-full" />
	{:else}
		<ItemCard {item} selected={selectedItem} {hasAttachments} className="h-full w-full" />
	{/if}
</div>
