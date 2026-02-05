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

		// Для обратной совместимости с attachments в weapon-card
		collection?: (ItemInstance | null)[];
		index?: number;
		allowedTypes?: (ItemType | AttachmentType)[];
	};

	let { storage, position, item, className = '', collection, index }: Props = $props();

	const game = getGameContext();

	const { dnd, inventory } = game;

	const { isDragging } = $derived(dnd);

	// Поддержка старого API для attachments (collection/index)
	const slotRef = $derived(
		collection !== undefined && index !== undefined
			? { storage: '', position: index }
			: { storage: storage ?? '', position: position ?? 0 }
	);

	const isDraggingMe = $derived(dnd.isSource(slotRef));

	const storageName: string = $derived(
		collection !== undefined && index !== undefined ? '' : (storage ?? '')
	);
	const def = $derived(getDef(item.defId));
	console.log(def);
</script>

<div class="{className}  relative" {@attach droppable({ slotRef, storage: storageName, item })}>
	{#if !isDraggingMe}
		<div class="h-full w-full" {@attach draggable({ item, slotRef })}>
			{#if def.type === 'weapon' && storage === 'weapon'}
				<WeaponCard {item} className="h-full w-full" />
			{:else if def.type === 'attachment' && storage === 'weapon'}
				<AttachCard {item} className="h-full w-full" />
			{:else}
				<ItemCard {item} className="h-full w-full" />
			{/if}
		</div>
	{/if}
</div>
