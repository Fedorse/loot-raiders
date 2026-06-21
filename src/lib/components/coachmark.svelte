<script lang="ts">
	import { untrack } from 'svelte';
	import { fly } from 'svelte/transition';
	import { getGameContext } from '$lib/store/game.svelte';

	const { tutorial, audio } = getGameContext();

	const segments = $derived(Array.from({ length: tutorial.total }, (_, i) => i));

	// Run the active step's setup() on entry (ADR-0004): seeds the scripted state before the
	// player can act. Re-runs only when the step index changes, never on unrelated reads.
	$effect(() => {
		if (!tutorial.active) return;
		void tutorial.index;
		untrack(() => tutorial.enterStep());
	});

	// Advance when the step's predicate holds (ADR-0002). The manual path (player acts) and
	// the skip path (autoPerform) both converge here, so completion has a single owner.
	$effect(() => {
		if (!tutorial.active) return;
		if (tutorial.stepComplete) {
			untrack(() => tutorial.advance());
		}
	});

	function go() {
		audio.play('click');
		tutorial.advance();
	}

	function skip() {
		audio.play('click');
		tutorial.skip();
	}
</script>

{#if tutorial.active && tutorial.step}
	<div
		class="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-6 pointer-coarse:pb-4"
		transition:fly|global={{ y: 24, duration: 280 }}
	>
		<div
			class="pointer-events-auto w-full max-w-[440px] rounded-lg border border-[#2a2f4c] bg-[#0c101c]/90 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md 2xl:max-w-[480px] 2xl:p-6 pointer-coarse:max-w-[380px] pointer-coarse:p-3.5"
		>
			<div class="mb-3 flex items-center gap-3 pointer-coarse:mb-2 pointer-coarse:gap-2">
				<span
					class="rounded bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-primary uppercase 2xl:text-[11px] pointer-coarse:text-[9px]"
					>{tutorial.step.badge}</span
				>
				<span
					class="font-mono text-[10px] font-semibold tracking-wider text-muted uppercase tabular-nums 2xl:text-[11px] pointer-coarse:text-[9px]"
					>Step {tutorial.stepNumber} of {tutorial.total}</span
				>
				<div class="ml-auto flex items-center gap-1">
					{#each segments as i (i)}
						<span
							class="h-1 w-5 rounded-full transition-colors 2xl:w-6 pointer-coarse:w-4 {i <
							tutorial.index
								? 'bg-primary'
								: 'bg-white/12'}"
						></span>
					{/each}
				</div>
			</div>

			<h2
				class="mb-1.5 text-lg font-extrabold tracking-wide text-white 2xl:text-xl pointer-coarse:mb-1 pointer-coarse:text-base"
			>
				{tutorial.step.title}
			</h2>
			<p
				class="mb-4 text-sm leading-relaxed text-white/70 2xl:text-[15px] pointer-coarse:mb-3 pointer-coarse:text-[13px]"
			>
				{tutorial.step.description}
			</p>

			{#if tutorial.isActionStep}
				<button
					onclick={skip}
					class="flex w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold tracking-wide text-white/60 transition-all hover:bg-white/10 hover:text-white/90 active:scale-[0.99] pointer-coarse:py-2 pointer-coarse:text-[13px]"
				>
					Skip this step
				</button>
			{:else}
				<button
					onclick={go}
					class="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-extrabold tracking-wide text-primary-foreground transition-all hover:bg-primary-hover active:scale-[0.99] 2xl:py-3.5 pointer-coarse:py-2.5 pointer-coarse:text-sm"
				>
					{tutorial.step.cta}
				</button>
			{/if}
		</div>
	</div>
{/if}
