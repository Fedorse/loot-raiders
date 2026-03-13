<script lang="ts">
	import DragLayer from '$lib/components/drag-layer.svelte';
	import ContextMenu from '$lib/components/context-menu.svelte';
	import TooltipOverlay from '$lib/components/tooltip-overlay.svelte';
	import RecycleModal from '$lib/components/recycle-modal.svelte';
	import DebugPanel from '$lib/components/debug-panel.svelte';
	import GameMenu from '$lib/components/game-menu.svelte';
	import { initGame } from '$lib/store/game.svelte';

	import './layout.css';

	let { children } = $props();

	const game = initGame();
	const { overlay, debug, loot, gameLoop } = game;

	$effect(() => {
		return () => gameLoop.stop();
	});
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			if (gameLoop.status === 'playing') {
				gameLoop.pause();
			} else if (gameLoop.status === 'paused') {
				gameLoop.resume();
			} else {
				overlay.handleEscape();
			}
			return;
		}
		if (e.key === ' ' && gameLoop.status === 'playing') {
			e.preventDefault();
			loot.next();
			return;
		}
		if (e.key === 'd' || e.key === 'D') {
			const tag = (e.target as HTMLElement)?.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
			debug.toggle();
		}
	}}
/>

<main class="relative h-screen font-sans text-white selection:bg-blue-500/30">
	<img src="/assets/bg.webp" alt="bg" class="absolute inset-0 h-full w-full object-cover blur-sm" />
	<div class="absolute inset-0 h-full w-full bg-black/90 object-cover"></div>

	<div class="z-10 h-full w-full">
		{@render children()}
	</div>
</main>

<DragLayer />
<ContextMenu />
<TooltipOverlay />
<RecycleModal />
<DebugPanel />

<GameMenu />

<style>
	@reference "tailwindcss";

	:global(body.dragging-weapon [data-slot-type='attachment']) {
		pointer-events: none !important;
	}

	:global(body.dragging-attachment [data-slot-type='attachment']) {
		pointer-events: auto !important;
	}
</style>
