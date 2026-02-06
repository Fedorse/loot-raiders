<script lang="ts">
	import { type ItemInstance, type ItemType, type AttachmentType } from '$lib/config/items';
	import { droppable, draggable } from '$lib/attach/dnd';
	import { getGameContext } from '$lib/store/game.svelte';
	import WeaponCard from './weapon-card.svelte';
	import ItemCard from './item-card.svelte';
	import { getDef } from '$lib/config/items';
	import AttachCard from './attach-weapon-card.svelte';

	type Props = {
		storage?: string;
		position?: number;
		item: ItemInstance;
		className: string;
	};

	let { storage, position, item, className = '' }: Props = $props();

	const game = getGameContext();

	const { dnd } = game;

	const { isDragging } = $derived(dnd);

	// const isDraggingMe = $derived(dnd.isSource(slotRef));

	const def = $derived(getDef(item.defId));
</script>

<div
	class="{className} relative h-full w-full"
	{@attach droppable({ slotRef: { storage, position }, storage, item })}
	{@attach draggable({ item, slotRef: { storage, position } })}
>
	<!-- {#if !isDraggingMe} -->

	{#if storage === 'weapon'}
		<WeaponCard
			{item}
			className="h-full w-full"
			weaponStorage={storage}
			weaponPosition={position}
		/>
	{:else if def.type === 'attachment' && storage.includes(':attachment')}
		<AttachCard {item} className="h-full w-full" />
	{:else}
		<ItemCard {item} className="h-full w-full" />
	{/if}

	<!-- {/if} -->
</div>
