<script lang="ts">
	import { dndState } from '@thisux/sveltednd';

	let mouseX = $state(0);
	let mouseY = $state(0);
	let initFrame = $state(false);

	function handleMove(e: DragEvent | PointerEvent) {
		if (!dndState.isDragging) return;

		if (e.clientX !== 0 || e.clientY !== 0) {
			mouseX = e.clientX;
			mouseY = e.clientY;
			initFrame = true;
		}
	}

	const reset = () => {
		initFrame = false;
	};

	const item = $derived(dndState.draggedItem?.item);

	const isInvalid = $derived(dndState.targetContainer === null || dndState.invalidDrop);
</script>

<svelte:window
	ondragover={(e) => {
		if (dndState.isDragging) {
			e.preventDefault();
			handleMove(e);
		}
	}}
	onpointermove={handleMove}
	ondragend={reset}
	onpointerup={reset}
/>

{#if dndState.isDragging && item && initFrame}
	<div
		class="pointer-events-none fixed z-50 flex size-20 items-center justify-center
               rounded-lg shadow-2xl backdrop-blur-sm"
		style="
			left: 0; 
			top: 0; 
			transform: translate3d({mouseX}px, {mouseY}px, 0) translate(-50%, -50%);
			background-color: {isInvalid ? 'rgba(239, 68, 68, 0.5)' : 'rgba(37, 99, 235, 0.3)'};

		"
	>
		<img src={item.image} alt="" class="h-full w-full object-contain" />
		<!-- <div>
			{item.count}
		</div> -->
	</div>
{/if}
