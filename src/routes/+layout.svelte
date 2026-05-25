<script lang="ts">
	import { onMount } from 'svelte';
	import DragLayer from '$lib/components/drag-layer.svelte';
	import ContextMenu from '$lib/components/context-menu.svelte';
	import TooltipOverlay from '$lib/components/tooltip-overlay.svelte';
	import RecycleModal from '$lib/components/recycle-modal.svelte';
	import AugmentPanel from '$lib/components/augment-panel.svelte';
	import GameMenu from '$lib/components/game-menu.svelte';
	import MobileGate from '$lib/components/mobile-gate.svelte';
	import QuestBottomSheet from '$lib/components/quest-bottom-sheet.svelte';
	import { Preloader } from '$lib/motion-core';
	import { initGame } from '$lib/store/game.svelte';
	import { assetLoader } from '$lib/store/asset-loader.svelte';
	import { PRELOAD_IMAGES, PRELOAD_URLS } from '$lib/config/preload';
	import { handleGlobalKeydown } from '$lib/keyboard';

	import './layout.css';

	let { children } = $props();

	let showPreloader = $state(true);

	const game = initGame();

	const { gameLoop, interaction, device } = game;

	onMount(() => {
		device.init();
		assetLoader.preload();
		const detachAutoPause = gameLoop.attachAutoPause();
		return () => {
			detachAutoPause();
			gameLoop.stop();
		};
	});

	let videoEl: HTMLVideoElement | undefined = $state();

	$effect(() => {
		if (!videoEl) return;
		if (gameLoop.status === 'playing') {
			videoEl.play().catch(() => {});
		} else {
			videoEl.pause();
		}
	});
</script>

<svelte:head>
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
	<video
		bind:this={videoEl}
		poster="/assets/preload/intro.webp"
		loop
		muted
		playsinline
		disablepictureinpicture
		aria-hidden="true"
		class="pointer-events-none absolute inset-0 h-full w-full object-cover"
	>
		<source src="/assets/intro-bg-mobile-768.mp4" type="video/mp4" media="(max-height: 500px)" />
		<source src="/assets/intro.mp4" type="video/mp4" />
	</video>

	{#if gameLoop.status === 'playing'}
		<div class="absolute inset-0 h-full w-full bg-black/80"></div>
	{/if}

	<div
		class="relative z-10 h-full w-full pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]"
	>
		{@render children()}
	</div>

	{#if gameLoop.status !== 'playing'}
		<img
			src="/assets/preload/intro.webp"
			alt=""
			aria-hidden="true"
			class="pointer-events-none absolute inset-0 z-20 h-full w-full object-cover"
		/>
	{/if}
</main>

<DragLayer />
<ContextMenu />
<TooltipOverlay />
<RecycleModal />
<AugmentPanel />
<GameMenu {showPreloader} />
<QuestBottomSheet />
<MobileGate />

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
