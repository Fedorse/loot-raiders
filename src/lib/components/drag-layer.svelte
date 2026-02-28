<script lang="ts">
	import { getDef } from '$lib/config/items';
	import { getGameContext } from '$lib/store/game.svelte';

	const GHOST_SIZE = 80;

	const game = getGameContext();
	const { interaction } = game;

	const draggedItem = $derived(interaction.draggedItem);
	const def = $derived(draggedItem ? getDef(draggedItem.defId) : null);

	const x = $derived(interaction.pointer.x - interaction.offset.x * GHOST_SIZE);
	const y = $derived(interaction.pointer.y - interaction.offset.y * GHOST_SIZE);
</script>

{#if draggedItem && def}
	<div
		class="pointer-events-none fixed top-0 left-0 z-50 flex h-20 w-20 items-center justify-center rounded-lg
                will-change-transform {interaction.isValidDrop
			? ' bg-drag-valid'
			: ' bg-drag-invalid'}"
		style="
			transform: translate3d({x}px, {y}px, 0) 
		"
	>
		<img
			src={def.image}
			alt=""
			class=" object-contain {(draggedItem?.count ?? 1) > 1
				? 'h-[80%] w-[80%]'
				: 'h-[95%] w-[95%]'}"
		/>

		{#if (draggedItem?.count ?? 1) > 1}
			<div
				class="absolute right-2 bottom-1.5 flex items-baseline gap-0.5 leading-none font-medium text-white"
			>
				<span class="text-[9px]">×</span>
				<span class=" font-sans text-xs tracking-[-0.05em]">
					{draggedItem?.count ?? 1}
				</span>
			</div>
		{/if}
	</div>
{/if}
