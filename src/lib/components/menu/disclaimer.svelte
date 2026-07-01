<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { getGameContext } from '$lib/store/game.svelte';
	import Cross from '$lib/ui-icon/cross.svelte';

	let { class: className = '', minimal = false }: { class?: string; minimal?: boolean } = $props();

	const { audio, device } = getGameContext();

	let open = $state(false);

	const wrapperPos = $derived(
		minimal && device.isCoarsePointer
			? 'bottom-2 left-3'
			: device.isCoarsePointer
				? 'bottom-2 right-3'
				: 'bottom-3 right-4'
	);

	function openModal() {
		audio.play('click');
		open = true;
	}
	function close() {
		open = false;
	}
</script>

<div class="pointer-events-none fixed {wrapperPos} {className}">
	{#if minimal}
		<button
			type="button"
			onclick={openModal}
			aria-label="Legal disclaimer"
			class="pointer-events-auto font-mono text-[8px] font-semibold text-[#6b6056] uppercase transition-colors hover:text-[#e0a63a] active:scale-95 2xl:text-[10px] 3xl:text-[11px] 4xl:text-xs"
		>
			Notice
		</button>
	{:else}
		<p
			class="flex items-center gap-1.5 font-mono text-[8px] text-[#6b6056] 2xl:text-[10px] 3xl:text-[11px] 4xl:text-xs pointer-coarse:text-[8px]"
		>
			<span
				>Unofficial fan project · Not affiliated with {@render embarkLink(
					'pointer-events-auto text-[#8b8178]'
				)}</span
			>
			<button
				type="button"
				onclick={openModal}
				aria-label="Legal disclaimer"
				class="pointer-events-auto flex size-4 shrink-0 items-center justify-center rounded-full text-[#8b8178] transition-colors hover:text-[#e0a63a] active:scale-90 2xl:size-[18px] 4xl:size-5"
			>
				{@render infoIcon()}
			</button>
		</p>
	{/if}
</div>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm"
		onclick={close}
		transition:fade={{ duration: 150 }}
	>
		<div
			class="max-h-[88dvh] w-full max-w-[520px] overflow-y-auto rounded-md bg-background/95 p-6 shadow-2xl ring-1 ring-white/10 2xl:p-7 3xl:p-8"
			onclick={(e) => e.stopPropagation()}
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<div class="mb-4 flex items-start justify-between gap-4">
				<h2
					class="font-sans text-base font-black tracking-tight text-white uppercase 2xl:text-lg 3xl:text-xl"
				>
					Legal Disclaimer
				</h2>
				<button
					type="button"
					onclick={close}
					aria-label="Close"
					class="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-transform hover:bg-white/10 active:scale-90"
				>
					<Cross />
				</button>
			</div>

			<div
				class="flex flex-col gap-3 text-[13px] leading-relaxed text-white/60 2xl:text-sm 3xl:text-[15px]"
			>
				<p>
					Loot Raiders is an unofficial fan project inspired by ARC Raiders. This project is not
					affiliated with, endorsed, sponsored, supported, or approved by {@render embarkLink(
						'text-white/90'
					)}.
				</p>
				<p>
					ARC RAIDERS, EMBARK, and all related names, trademarks, logos, characters, artwork, music,
					sounds, game assets, and other intellectual property are the property of {@render embarkLink(
						'text-white/90'
					)} or their respective rights holders.
				</p>
				<p>
					Loot Raiders does not claim ownership of any ARC Raiders intellectual property. No
					copyright or trademark infringement is intended. If you are a rights holder or
					representative of Embark Studios AB and believe that any material used in this project
					violates your rights, please contact us at [your email], and we will review and remove or
					modify the relevant material.
				</p>
			</div>
		</div>
	</div>
{/if}

{#snippet infoIcon()}
	<svg
		viewBox="0 0 24 24"
		class="size-full"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<circle cx="12" cy="12" r="10" />
		<line x1="12" y1="16" x2="12" y2="12" />
		<line x1="12" y1="8" x2="12.01" y2="8" />
	</svg>
{/snippet}

{#snippet embarkLink(cls: string)}
	<a
		href="https://www.embark-studios.com/"
		target="_blank"
		rel="noopener noreferrer"
		class="underline decoration-white/25 underline-offset-2 transition-colors hover:text-[#e0a63a] hover:decoration-[#e0a63a]/60 {cls}"
		>Embark Studios AB</a
	>
{/snippet}
