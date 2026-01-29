<script lang="ts">
	// import { setDndContext } from '$lib/store/dnd-manger.svelte';
	import './layout.css';

	let { children } = $props();
</script>

<main class="relative h-screen font-sans text-white selection:bg-blue-500/30">
	<!-- <img src={bgImage} alt="bg" class="absolute inset-0 h-full w-full object-cover blur-sm" /> -->
	<div class="absolute inset-0 h-full w-full bg-black/90 object-cover" />

	<div class="z-10 h-full w-full">
		{@render children()}
	</div>
</main>

<style>
	body.dragging-weapon [data-slot-type='attachment'] {
		pointer-events: none !important;
	}

	/* Если тащим аттачмент — они снова активны */
	body.dragging-attachment [data-slot-type='attachment'] {
		pointer-events: auto !important;
	}
</style>
