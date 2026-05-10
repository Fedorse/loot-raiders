<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import QuestBar from './quest-bar.svelte';
	import { getGameContext } from '$lib/store/game.svelte';

	const { gameLoop } = getGameContext();

	let open = $state(false);
	let touchStartX = $state(0);
	let touchStartY = $state(0);

	// Auto-close when game pauses/ends
	$effect(() => {
		const status = gameLoop.status;
		if (status !== 'playing') {
			open = false;
		}
	});

	function onTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
	}

	function onTouchEnd(e: TouchEvent) {
		const dx = e.changedTouches[0].clientX - touchStartX;
		const dy = e.changedTouches[0].clientY - touchStartY;

		// Ignore vertical swipes
		if (Math.abs(dy) > Math.abs(dx)) return;

		const screenW = window.innerWidth;
		if (screenW >= 1024) return;

		if (!open && touchStartX > screenW - 30 && dx < -50) {
			open = true;
		} else if (open && dx > 50) {
			open = false;
		}
	}
</script>

<svelte:window ontouchstart={onTouchStart} ontouchend={onTouchEnd} />

<!-- Desktop: render QuestBar inline -->
<div class="hidden lg:block">
	<QuestBar />
</div>

<!-- Mobile: toggle button + sidebar -->
{#if gameLoop.status === 'playing'}
	<button
		class="fixed top-1/2 right-0 z-[111] flex h-12 w-6 -translate-y-1/2 items-center justify-center rounded-l-md bg-background/70 backdrop-blur-sm lg:hidden"
		onclick={() => (open = !open)}
		aria-label={open ? 'Close quests' : 'Open quests'}
	>
		<svg
			class="size-4 text-white/70 transition-transform duration-200"
			class:rotate-180={open}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<polyline points="15 18 9 12 15 6" />
		</svg>
	</button>
{/if}

{#if open}
	<!-- Backdrop -->
	<button
		class="fixed inset-0 z-[110] bg-black/50 lg:hidden"
		transition:fade={{ duration: 150 }}
		onclick={() => (open = false)}
		aria-label="Close sidebar"
	></button>

	<!-- Sidebar panel -->
	<div
		class="fixed top-0 right-0 z-[111] flex h-full items-center pr-2 lg:hidden"
		transition:fly={{ x: 300, duration: 250 }}
	>
		<QuestBar />
	</div>
{/if}
