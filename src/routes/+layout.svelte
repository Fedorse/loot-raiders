<script lang="ts">
	import DragLayer from '$lib/components/drag-layer.svelte';
	import ContextMenu from '$lib/components/context-menu.svelte';
	import TooltipOverlay from '$lib/components/tooltip-overlay.svelte';
	import RecycleModal from '$lib/components/recycle-modal.svelte';
	import AugmentPanel from '$lib/components/augment-panel.svelte';
	import DebugPanel from '$lib/components/debug-panel.svelte';
	import GameMenu from '$lib/components/game-menu.svelte';
	import MobileGate from '$lib/components/mobile-gate.svelte';
	import QuestBottomSheet from '$lib/components/quest-bottom-sheet.svelte';
	import { initGame } from '$lib/store/game.svelte';

	import './layout.css';

	let { children } = $props();

	const game = initGame();
	const { overlay, debug, loot, gameLoop, interaction } = game;

	$effect(() => {
		return () => gameLoop.stop();
	});

	$effect(() => {
		const isFullscreen = () =>
			!!(
				document.fullscreenElement ||
				(document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement
			);

		const pauseIfPlaying = () => {
			if (gameLoop.status === 'playing') gameLoop.pause();
		};

		const onFullscreenChange = () => {
			if (!isFullscreen()) pauseIfPlaying();
		};

		const onVisibilityChange = () => {
			if (document.hidden) pauseIfPlaying();
		};

		document.addEventListener('fullscreenchange', onFullscreenChange);
		document.addEventListener('webkitfullscreenchange', onFullscreenChange);
		document.addEventListener('visibilitychange', onVisibilityChange);

		return () => {
			document.removeEventListener('fullscreenchange', onFullscreenChange);
			document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
			document.removeEventListener('visibilitychange', onVisibilityChange);
		};
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

<main class="relative h-dvh font-sans text-white selection:bg-blue-500/30">
	<!-- <video
		src="/assets/intro-bg-960-crf30.mp4"
		autoplay
		loop
		muted
		playsinline
		disablepictureinpicture
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 h-full w-full object-cover"
	></video> -->

	<div class="absolute inset-0 h-full w-full bg-black/80"></div>

	<div
		class="relative z-10 h-full w-full pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]"
	>
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
<QuestBottomSheet />
<MobileGate />
