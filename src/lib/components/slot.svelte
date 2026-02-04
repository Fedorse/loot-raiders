<script lang="ts">
	import { type ItemInstance, type ItemType } from '$lib/config/items';
	import { droppable, draggable } from '$lib/attach/dnd';
	import { getGameContext } from '$lib/store/game.svelte';
	import { getStorageConfig } from '$lib/config/storages';

	type Props = {
		storage: string;
		position: number;
		children: any;
		className: string;
		placeholder?: any;
		showInvalid?: boolean;
		// Для обратной совместимости с attachments в weapon-card
		collection?: (ItemInstance | null)[];
		index?: number;
	};

	let {
		storage,
		position,
		children,
		className = '',
		placeholder,
		showInvalid = true,
		collection,
		index
	}: Props = $props();

	const game = getGameContext();

	const { dnd, inventory } = game;

	const { isDragging } = $derived(dnd);

	// Поддержка старого API для attachments (collection/index)
	const slotRef = $derived(
		collection !== undefined && index !== undefined
			? { storage: '', position: index } // Временный SlotReference для attachments
			: { storage, position }
	);

	const isDraggingMe = $derived(dnd.isSource(slotRef));
	const item = $derived(
		collection !== undefined && index !== undefined
			? collection[index]
			: inventory.getItem(storage, position)
	);
	const storageConfig = $derived(
		collection !== undefined && index !== undefined ? null : getStorageConfig(storage)
	);
	const allowedTypes = $derived(storageConfig?.allowedTypes ?? []);
	const storageName = $derived(collection !== undefined && index !== undefined ? '' : storage);
	const valid = $derived(dnd.canAccept(storageName, item));
</script>

<div
	class="{className}  relative"
	{@attach droppable({ item, slotRef, storage: storageName, dnd })}
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
		<div class="h-full w-full" {@attach draggable({ item, slotRef, dnd })}>
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
