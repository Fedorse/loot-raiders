<script lang="ts">
	import { getDef } from '$lib/config/items';
	import { getGameContext } from '$lib/store/game.svelte';

	const GHOST_SIZE = 80;

	const game = getGameContext();
	const { dnd } = game;

	const { isDragging, pointer, offset, draggedItem, isValidDrop } = $derived(dnd);

	let def = $derived(getDef(draggedItem?.defId));

	const x = $derived(pointer.x - offset.x * GHOST_SIZE);
	const y = $derived(pointer.y - offset.y * GHOST_SIZE);
</script>

{#if isDragging}
	<div
		class="pointer-events-none fixed top-0 left-0 z-50 flex size-20 items-center justify-center rounded-lg
               shadow-2xl backdrop-blur-sm will-change-transform {isValidDrop
			? 'bg-blue-500/30'
			: 'bg-red-500/30'}"
		style="
			transform: translate3d({x}px, {y}px, 0) 
		"
	>
		<img src={def.image} alt="" class="h-full w-full object-contain" />
		<!-- <div>
			{item.count}
		</div> -->
	</div>
{/if}
