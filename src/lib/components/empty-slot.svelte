<script lang="ts">
	import { type ItemInstance, type ItemType, type AttachmentType } from '$lib/config/items';
	import { droppable, draggable } from '$lib/attach/dnd';
	import { getGameContext } from '$lib/store/game.svelte';
	import { getStorageConfig } from '$lib/config/storages';

	type Props = {
		storage?: string;
		position?: number;
		className: string;
		placeholder?: string;
		// Для обратной совместимости с attachments в weapon-card
		collection?: (ItemInstance | null)[];
		index?: number;
		allowedTypes?: (ItemType | AttachmentType)[];
	};

	let {
		storage,
		position,
		className = '',
		placeholder,

		collection,
		index,
		allowedTypes
	}: Props = $props();

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
	const item = $derived(
		collection !== undefined && index !== undefined
			? collection[index]
			: inventory.getItem(storage ?? '', position ?? 0)
	);

	const storageConfig = $derived(
		collection !== undefined && index !== undefined ? null : getStorageConfig(storage ?? '')
	);
	const storageName: string = $derived(
		collection !== undefined && index !== undefined ? '' : (storage ?? '')
	);
</script>

<div class={className} {@attach droppable({ slotRef, storage: storageName, item })}>
	<div
		class="flex h-full w-full cursor-default items-center justify-center rounded-lg border border-white/20"
	>
		{#if placeholder}
			<img src={placeholder} alt="placeholder" class="w-full object-contain opacity-50" />
		{/if}
	</div>
</div>
