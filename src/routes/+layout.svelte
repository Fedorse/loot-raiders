<script lang="ts">
	import DragLayer from '$lib/components/drag-layer.svelte';
	import ContextMenu from '$lib/components/context-menu.svelte';
	import TooltipOverlay from '$lib/components/tooltip-overlay.svelte';
	import RecycleModal from '$lib/components/recycle-modal.svelte';
	import AugmentPanel from '$lib/components/augment-panel.svelte';
	import DebugPanel from '$lib/components/debug-panel.svelte';
	import GameMenu from '$lib/components/game-menu.svelte';
	import PortraitBlocker from '$lib/components/portrait-blocker.svelte';
	import { initGame } from '$lib/store/game.svelte';

	import './layout.css';

	let { children } = $props();

	const game = initGame();
	const { overlay, debug, loot, gameLoop, interaction } = game;

	$effect(() => {
		return () => gameLoop.stop();
	});

	$effect(() => {
		const type = interaction.dragType;
		if (type) {
			document.body.classList.add('is-dragging');
		}
		if (type === 'weapon') {
			document.body.classList.add('dragging-weapon');
		} else if (type === 'attachment') {
			document.body.classList.add('dragging-attachment');
		}
		return () => {
			document.body.classList.remove('is-dragging', 'dragging-weapon', 'dragging-attachment');
		};
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
	<img src="/assets/intro.gif" alt="bg" class="absolute inset-0 h-full w-full object-cover" />
	<div class="absolute inset-0 h-full w-full bg-black/80"></div>

	<div class="relative z-10 h-full w-full">
		{@render children()}
	</div>
</main>

<DragLayer />
<ContextMenu />
<TooltipOverlay />
<RecycleModal />
<AugmentPanel />
<DebugPanel />
<GameMenu />
<PortraitBlocker />
