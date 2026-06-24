<script lang="ts">
	import { untrack } from 'svelte';
	import { getGameContext } from '$lib/store/game.svelte';
	import { trackLayout, elementToPath } from '$lib/utils';

	const { tutorial, overlay, inventory, device, loot } = getGameContext();

	// Latch the quest-sheet open for the mobile 'open-quests' step, whose predicate completes on the
	// subsequent close. The reactive sheet flag is the only "was opened" signal, so we bridge it here.
	$effect(() => {
		if (!tutorial.active) return;
		if (overlay.questSheet) untrack(() => tutorial.noteQuestSheetOpened());
	});

	const FRAME_W = 1.5;

	const RING_PAD = 6;

	const RING_PAD_MOBILE = 4;

	const ITEM_RING_PAD = 3;

	const EXCLUDE_RADIUS = 6;

	let holes = $state<string[]>([]);
	let frameHoles = $state<string[]>([]);
	let excludeHoles = $state<string[]>([]);
	let rings = $state<string[]>([]);

	const revealIds = $derived(tutorial.active ? (tutorial.step?.targets ?? []) : []);
	const pulseIds = $derived(
		tutorial.active ? (tutorial.step?.pulse ?? tutorial.step?.targets ?? []) : []
	);
	const excludeIds = $derived(tutorial.active ? (tutorial.step?.exclude ?? []) : []);
	const itemPulseDefs = $derived(tutorial.active ? (tutorial.step?.itemPulse ?? []) : []);

	// pointer-transparent via `body.tutorial-active`; only revealed targets get it back.
	$effect(() => {
		const on = tutorial.active;
		document.body.classList.toggle('tutorial-active', on);
		return () => document.body.classList.remove('tutorial-active');
	});

	// Resolve every referenced id by `data-tut`, re-measure on entry and on any layout shift.
	// Only reveal ∪ pulse become interactive; excluded ids are measured but stay dimmed.
	$effect(() => {
		// Re-resolve when seeded items mount/unmount, so item rings catch elements that appear
		// after step entry (e.g. fillStorage in setup()) — layout tracking alone can't see them.
		// `loot.phase` covers drop items, which only render the slot (and its data-tut-item) once
		// they finish the scan-in animation.
		void inventory.items.length;
		void loot.phase;

		const interactiveIds = Array.from(new Set([...revealIds, ...pulseIds]));
		const allIds = Array.from(new Set([...interactiveIds, ...excludeIds]));
		if (allIds.length === 0 && itemPulseDefs.length === 0) {
			holes = [];
			frameHoles = [];
			excludeHoles = [];
			rings = [];
			return;
		}

		const resolved = new Map<string, HTMLElement>();
		for (const id of allIds) {
			const el = document.querySelector<HTMLElement>(`[data-tut="${id}"]`);
			if (el) resolved.set(id, el);
		}

		const interactiveEls: HTMLElement[] = [];
		for (const id of interactiveIds) {
			const el = resolved.get(id);
			if (el) {
				el.classList.add('tut-active');
				interactiveEls.push(el);
			}
		}

		// Item rings address a moving item by defId, so one def can resolve to several live nodes.
		const itemEls = itemPulseDefs.flatMap((def) =>
			Array.from(document.querySelectorAll<HTMLElement>(`[data-tut-item="${def}"]`))
		);

		const pathsOf = (ids: string[], pad = 0, forceRadius?: number): string[] =>
			ids
				.map((id) => resolved.get(id))
				.filter((el): el is HTMLElement => !!el)
				.map((el) => elementToPath(el, pad, forceRadius));

		const ringPad = device.isCoarsePointer ? RING_PAD_MOBILE : RING_PAD;

		const measure = () => {
			holes = pathsOf(interactiveIds);
			frameHoles = pathsOf(revealIds);
			excludeHoles = pathsOf(excludeIds, 0, EXCLUDE_RADIUS);
			rings = [
				...pathsOf(pulseIds, ringPad),
				...itemEls.map((el) => elementToPath(el, ITEM_RING_PAD))
			];
		};

		const stop = trackLayout(() => [...resolved.values(), ...itemEls], measure);

		return () => {
			for (const el of interactiveEls) el.classList.remove('tut-active');
			stop();
		};
	});
</script>

{#if tutorial.active}
	<!-- Cosmetic layer only: pointer-transparent, so clicks fall through the hole onto the
	     one re-enabled target underneath  -->
	<svg
		class="pointer-events-none fixed inset-0 z-30 h-full w-full"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
	>
		<defs>
			<pattern
				id="tut-hatch"
				width="11"
				height="11"
				patternUnits="userSpaceOnUse"
				patternTransform="rotate(35)"
			>
				<rect width="11" height="11" fill="rgba(7,10,16,0.82)" />
				<line x1="0" y1="0" x2="0" y2="11" stroke="rgba(255,255,255,0.025)" stroke-width="6" />
			</pattern>

			<!-- Erodes the rasterised union of the reveal shape, so the inner edge of the frame band
			     follows the combined contour with no seam where adjacent cuts (tab + panel) meet. -->
			<filter id="tut-erode">
				<feMorphology operator="erode" radius={FRAME_W} />
			</filter>

			<!-- Soft gold halo around the pulsing goal ring. Generous region so the blur isn't clipped. -->
			<filter id="tut-ring-glow" x="-50%" y="-50%" width="200%" height="200%">
				<feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#ffb800" flood-opacity="0.85" />
			</filter>

			<mask id="tut-mask">
				<rect width="100%" height="100%" fill="white" />
				{#each holes as hole, i (i)}
					<path d={hole} fill="black" />
				{/each}
				<!-- Carve excluded sub-regions back out: re-cover them with hatch, keep them dimmed. -->
				{#each excludeHoles as ex, i (i)}
					<path d={ex} fill="white" />
				{/each}
			</mask>

			<!-- Frame band = union(reveal) minus erode(union(reveal)). Both layers are rasterised
			     unions, so touching cuts merge with no internal line. -->
			<mask id="tut-frame">
				{#each frameHoles as hole, i (i)}
					<path d={hole} fill="white" />
				{/each}
				<g filter="url(#tut-erode)">
					{#each frameHoles as hole, i (i)}
						<path d={hole} fill="black" />
					{/each}
				</g>
			</mask>
		</defs>

		<rect width="100%" height="100%" fill="url(#tut-hatch)" mask="url(#tut-mask)" />

		<!-- Static frame around the combined revealed shape — matches the quest card border (bg-white/20). -->
		<rect width="100%" height="100%" fill="#ffffff" fill-opacity="0.08" mask="url(#tut-frame)" />

		<!-- Pulsing gold ring on the goal target(s) only — padded off the edge and softly glowing. -->
		{#each rings as ring, i (i)}
			<path
				class="tut-ring"
				d={ring}
				fill="none"
				stroke="#ffb800"
				stroke-width="2.5"
				filter="url(#tut-ring-glow)"
			/>
		{/each}
	</svg>
{/if}

<style>
	.tut-ring {
		animation: tut-ring-pulse 1.5s ease-in-out infinite;
	}

	@keyframes tut-ring-pulse {
		0%,
		100% {
			opacity: 0.55;
			stroke-width: 2;
		}
		50% {
			opacity: 1;
			stroke-width: 4;
		}
	}
</style>
