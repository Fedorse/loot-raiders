<script lang="ts">
	import { droppable } from '$lib/attach/dnd';
	import { getGameContext } from '$lib/store/game.svelte';

	type Props = {
		storage?: string;
		position?: number;
		className: string;
		placeholder?: string;
	};

	let { storage, position, className = '', placeholder }: Props = $props();

	const game = getGameContext();

	const { dnd, inventory } = game;

	const { isDragging } = $derived(dnd);

	// const isDraggingMe = $derived(dnd.isSource(slotRef: { storage, position }));

	const item = $derived(inventory.getItem(storage, position));
</script>

<div class={className} {@attach droppable({ slotRef: { storage, position }, storage, item })}>
	<div
		class="flex h-full w-full cursor-default items-center justify-center rounded-lg border border-white/20"
	>
		{#if placeholder}
			<img src={placeholder} alt="placeholder" class="w-full object-contain opacity-50" />
		{/if}
	</div>
</div>
