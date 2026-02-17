<script lang="ts">
	import { getDef } from '$lib/config/items';
	import { getGameContext } from '$lib/store/game.svelte';

	const GHOST_SIZE = 80;

	const game = getGameContext();
	const { interaction } = game;

	const { dragOrigin, pointer, offset, isValidDrop } = $derived(interaction);

	const draggedItem = $derived(dragOrigin?.item);
	const def = $derived(getDef(draggedItem?.defId ?? ''));

	const x = $derived(pointer.x - offset.x * GHOST_SIZE);
	const y = $derived(pointer.y - offset.y * GHOST_SIZE);
</script>

{#if dragOrigin}
	<div
		class="pointer-events-none fixed top-0 left-0 z-50 flex h-20 w-20 items-center justify-center rounded-lg
                will-change-transform {isValidDrop ? ' bg-sky-900/60' : ' bg-[#251212]/90'}"
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
