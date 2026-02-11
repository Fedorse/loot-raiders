<script lang="ts">
	import { getDef } from '$lib/config/items';
	import { getGameContext } from '$lib/store/game.svelte';

	const GHOST_SIZE = 80;

	const game = getGameContext();
	const { dnd } = game;

	const { dragOrigin, pointer, offset, isValidDrop } = $derived(dnd);

	const draggedItem = $derived(dragOrigin?.item ?? null);

	let def = $derived(draggedItem?.defId != null ? getDef(draggedItem.defId) : null);

	const x = $derived(pointer.x - offset.x * GHOST_SIZE);
	const y = $derived(pointer.y - offset.y * GHOST_SIZE);
</script>

{#if dragOrigin}
	<div
		class="pointer-events-none fixed top-0 left-0 z-50 flex size-20 items-center justify-center rounded-lg
               shadow-2xl backdrop-blur-sm will-change-transform {isValidDrop
			? 'bg-blue-500/30'
			: 'bg-red-500/30'}"
		style="
			transform: translate3d({x}px, {y}px, 0) 
		"
	>
		{#if def}
			<img src={def.image} alt="" class="h-full w-full object-contain" />
		{/if}
		<!-- <div>
			{item.count}
		</div> -->
	</div>
{/if}
