<script lang="ts">
	import { fade } from 'svelte/transition';

	let isPortraitMobile = $state(false);

	$effect(() => {
		const portrait = matchMedia('(orientation: portrait) and (max-width: 1023px)');

		const update = () => {
			isPortraitMobile = portrait.matches;
		};

		update();
		portrait.addEventListener('change', update);

		return () => {
			portrait.removeEventListener('change', update);
		};
	});
</script>

{#if isPortraitMobile}
	<div
		class="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-black/95 p-8 backdrop-blur-md"
		transition:fade={{ duration: 200 }}
	>
		<svg
			class="size-20 text-white/60"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<rect x="4" y="2" width="16" height="20" rx="2" />
			<line x1="12" y1="18" x2="12" y2="18.01" />
			<path
				d="M 20 8 C 22 8 22 10 22 12 C 22 14 22 16 20 16"
				stroke="currentColor"
				stroke-dasharray="2 2"
				class="animate-pulse"
			/>
			<path
				d="M 4 16 C 2 16 2 14 2 12 C 2 10 2 8 4 8"
				stroke="currentColor"
				stroke-dasharray="2 2"
				class="animate-pulse"
			/>
		</svg>

		<div class="flex flex-col items-center gap-2 text-center">
			<h2 class="text-lg font-bold tracking-wide text-white/90">Rotate Your Device</h2>
			<p class="max-w-64 text-sm leading-relaxed text-white/50">
				Loot Raiders requires landscape orientation for the best experience.
			</p>
		</div>
	</div>
{/if}
