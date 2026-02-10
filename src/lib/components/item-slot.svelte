<script lang="ts">
	import { getDef } from '$lib/config/items';
	import { droppable, draggable } from '$lib/attach/dnd';
	import type { StoredItem } from '$lib/store/inventory-manger.svelte';
	import WeaponCard from './weapon-card.svelte';
	import ItemCard from './item-card.svelte';
	import AttachCard from './attach-weapon-card.svelte';

	type Props = {
		storedItem: StoredItem;
		className: string;
	};

	let { storedItem, className = '' }: Props = $props();

	const { item, storage } = $derived(storedItem);
	const dropTarget = $derived({
		storage: storedItem.storage,
		item: storedItem.item
	});
	const def = $derived(getDef(item.defId));

	const isWeapon = $derived(storage.storageId === 'weapon' && !('attachIndex' in storage));
	const isAttachmentInWeapon = $derived('attachIndex' in storage);
</script>

<div
	class="{className} relative h-full w-full"
	{@attach droppable(dropTarget)}
	{@attach draggable(storedItem)}
>
	{#if isWeapon}
		<WeaponCard
			{item}
			className="h-full w-full"
			weaponStorage={storage.storageId}
			weaponPosition={storage.index}
		/>
	{:else if isAttachmentInWeapon}
		<AttachCard {item} className="h-full w-full" />
	{:else}
		<ItemCard {item} className="h-full w-full" />
	{/if}
</div>
