<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';

	const { tutorial } = getGameContext();

	interface Hole {
		x: number;
		y: number;
		width: number;
		height: number;
	}

	// Breathing room around each target and the hole's corner radius.
	const PAD = 8;
	const RADIUS = 12;

	let holes = $state<Hole[]>([]);

	// The ids the current step wants highlighted (empty for ack steps — full hatch, no holes).
	const targetIds = $derived(tutorial.active ? (tutorial.step?.targets ?? []) : []);

	// Interaction gate (ADR-0005): while a tutorial step is active the app root is made
	// pointer-transparent via `body.tutorial-active`; only resolved targets get it back.
	$effect(() => {
		const on = tutorial.active;
		document.body.classList.toggle('tutorial-active', on);
		return () => document.body.classList.remove('tutorial-active');
	});

	// Resolve targets by `data-tut` id, re-measure their rects on entry and whenever the
	// layout shifts, and mark them as the only interactive elements for the duration.
	$effect(() => {
		const ids = targetIds;
		if (ids.length === 0) {
			holes = [];
			return;
		}

		const els = ids
			.map((id) => document.querySelector<HTMLElement>(`[data-tut="${id}"]`))
			.filter((el): el is HTMLElement => el !== null);

		for (const el of els) el.classList.add('tut-active');

		const measure = () => {
			holes = els.map((el) => {
				const r = el.getBoundingClientRect();
				return {
					x: r.left - PAD,
					y: r.top - PAD,
					width: r.width + PAD * 2,
					height: r.height + PAD * 2
				};
			});
		};
		measure();

		const ro = new ResizeObserver(measure);
		for (const el of els) ro.observe(el);
		window.addEventListener('resize', measure);
		window.addEventListener('scroll', measure, true);

		return () => {
			for (const el of els) el.classList.remove('tut-active');
			ro.disconnect();
			window.removeEventListener('resize', measure);
			window.removeEventListener('scroll', measure, true);
		};
	});
</script>

{#if tutorial.active}
	<!-- Cosmetic layer only: pointer-transparent, so clicks fall through the hole onto the
	     one re-enabled target underneath (ADR-0005). -->
	<svg
		class="pointer-events-none fixed inset-0 z-30 h-full w-full"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
	>
		<defs>
			<pattern
				id="tut-hatch"
				width="10"
				height="10"
				patternUnits="userSpaceOnUse"
				patternTransform="rotate(45)"
			>
				<rect width="10" height="10" fill="rgba(6,8,16,0.82)" />
				<line x1="0" y1="0" x2="0" y2="10" stroke="rgba(255,255,255,0.04)" stroke-width="5" />
			</pattern>
			<mask id="tut-mask">
				<rect width="100%" height="100%" fill="white" />
				{#each holes as hole, i (i)}
					<rect
						x={hole.x}
						y={hole.y}
						width={hole.width}
						height={hole.height}
						rx={RADIUS}
						fill="black"
					/>
				{/each}
			</mask>
		</defs>

		<rect width="100%" height="100%" fill="url(#tut-hatch)" mask="url(#tut-mask)" />

		{#each holes as hole, i (i)}
			<rect
				class="tut-ring"
				x={hole.x}
				y={hole.y}
				width={hole.width}
				height={hole.height}
				rx={RADIUS}
				fill="none"
				stroke="#ffb800"
				stroke-width="2"
			/>
		{/each}
	</svg>
{/if}

<style>
	.tut-ring {
		animation: tut-ring-pulse 1.4s ease-in-out infinite;
	}

	@keyframes tut-ring-pulse {
		0%,
		100% {
			opacity: 0.4;
			stroke-width: 2;
		}
		50% {
			opacity: 1;
			stroke-width: 3.5;
		}
	}
</style>
