<script lang="ts">
	import { onMount } from 'svelte';
	import DragLayer from '$lib/components/inventory/drag-layer.svelte';
	import ContextMenu from '$lib/components/inventory/context-menu.svelte';
	import TooltipOverlay from '$lib/components/inventory/tooltip-overlay.svelte';
	import RecycleModal from '$lib/components/inventory/recycle-modal.svelte';
	import AugmentPanel from '$lib/components/augment/augment-panel.svelte';
	import GameMenu from '$lib/components/menu/game-menu.svelte';
	import Coachmark from '$lib/components/tutorial/coachmark.svelte';
	import TutorialHighlight from '$lib/components/tutorial/tutorial-highlight.svelte';
	import MobileGate from '$lib/components/hud/mobile-gate.svelte';
	import QuestBottomSheet from '$lib/components/quest/quest-bottom-sheet.svelte';
	import LeaderboardModal from '$lib/components/leaderboard/leaderboard-modal.svelte';
	import Toasts from '$lib/components/hud/toasts.svelte';
	import LivingBackground from '$lib/components/backdrop/living-background.svelte';
	import { Preloader } from '$lib/motion-core';
	import { initGame } from '$lib/store/game.svelte';
	import { assetLoader } from '$lib/store/asset-loader.svelte';
	import { PRELOAD_IMAGES, PRELOAD_URLS } from '$lib/config/preload';
	import { SCENES } from '$lib/components/backdrop/scenes';
	import { handleGlobalKeydown } from '$lib/keyboard';

	import './layout.css';

	let { children } = $props();

	let showPreloader = $state(true);

	const game = initGame();

	const { gameLoop, interaction, device, leaderboard } = game;

	onMount(() => {
		device.init();
		leaderboard.init();
		assetLoader.preload();
		const detachAutoPause = gameLoop.attachAutoPause();
		return () => {
			detachAutoPause();
			gameLoop.stop();
		};
	});
</script>

<svelte:head>
	<!-- Menu scene image is prioritized: it's the first frame the preloader and menu backdrop paint. -->
	<link rel="preload" as="image" href={SCENES.menu.image} fetchpriority="high" />
	<link rel="preload" as="image" href={SCENES.session.image} />
	{#each PRELOAD_URLS as url (url)}
		<link rel="preload" as="image" href={url} type="image/webp" />
	{/each}
</svelte:head>

<svelte:body
	class:is-dragging={!!interaction.dragType}
	class:dragging-weapon={interaction.dragType === 'weapon'}
	class:dragging-attachment={interaction.dragType === 'attachment'}
/>

<svelte:window onkeydown={(e) => handleGlobalKeydown(e, game)} />

<main class="relative h-dvh font-sans text-white selection:bg-blue-500/30">
	<LivingBackground />

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
<GameMenu />
<TutorialHighlight />
<Coachmark />
<QuestBottomSheet />
<LeaderboardModal />
<MobileGate />
<Toasts />

<!-- Dev-only backdrop tuning studio. import.meta.env.DEV is statically false in production, so the
	branch and the lazily-imported component chunk are eliminated from the production build. -->
{#if import.meta.env.DEV}
	{#await import('$lib/components/backdrop/debug-studio.svelte') then { default: DebugStudio }}
		<DebugStudio />
	{/await}
{/if}

{#if showPreloader && !device.isPortraitMobile}
	<Preloader
		class="bg-background"
		images={PRELOAD_IMAGES}
		progress={assetLoader.progress}
		onComplete={async () => {
			await assetLoader.readyPromise;
			showPreloader = false;
		}}
	/>
{/if}
