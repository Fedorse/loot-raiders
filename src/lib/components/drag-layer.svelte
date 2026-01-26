<script lang="ts">
	import { getDndContext } from '$lib/store/dnd-manger.svelte';
	import { getDef } from '$lib/config/items';

	const dnd = getDndContext();

	const { isDragging, pointer, offset, item, isValidDrop } = $derived(dnd.state);

	let def = $derived(getDef(item?.defId));
</script>

{#if isDragging}
	<div
		class="pointer-events-none fixed top-0 left-0 z-50 flex size-20 items-center justify-center rounded-lg
               shadow-2xl backdrop-blur-sm will-change-transform {isValidDrop
			? 'bg-blue-500/50'
			: 'bg-red-500/50'}"
		style="
			transform: translate3d({pointer.x - offset.x}px, {pointer.y - offset.y}px, 0) 
		"
	>
		<img src={def.image} alt="" class="h-full w-full object-contain" />
		<!-- <div>
			{item.count}
		</div> -->
	</div>
{/if}
