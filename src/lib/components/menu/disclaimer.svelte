<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { getGameContext } from '$lib/store/game.svelte';
	import Cross from '$lib/ui-icon/cross.svelte';
	import Info from '$lib/ui-icon/info.svelte';

	let { minimal = false }: { minimal?: boolean } = $props();

	const { audio, device } = getGameContext();

	let open = $state(false);

	const wrapperPos = $derived(
		!device.isCoarsePointer
			? minimal
				? 'bottom-3 right-4 z-20'
				: 'bottom-3 right-4'
			: minimal
				? 'bottom-2 left-3 z-20'
				: 'bottom-[max(24px,env(safe-area-inset-bottom))] left-[max(24px,env(safe-area-inset-left))]'
	);

	function openModal() {
		audio.play('click');
		open = true;
	}
	function close() {
		open = false;
	}
</script>

<div class="pointer-events-none fixed {wrapperPos}">
	{#if minimal}
		<button
			type="button"
			onclick={openModal}
			aria-label="Legal disclaimer"
			class="pointer-events-auto font-mono text-[8px] font-semibold text-fg-faint uppercase transition-colors hover:text-accent active:scale-95 2xl:text-[10px] 3xl:text-[11px] 4xl:text-xs"
		>
			Notice
		</button>
	{:else}
		<p
			class="flex items-center gap-1.5 font-mono text-[8px] text-fg-faint 2xl:text-[10px] 3xl:text-[11px] 4xl:text-xs pointer-coarse:text-[8px]"
		>
			<span
				>Unofficial fan project · Not affiliated with {@render embarkLink(
					'pointer-events-auto text-fg-muted'
				)}</span
			>
			<button
				type="button"
				onclick={openModal}
				aria-label="Legal disclaimer"
				class="pointer-events-auto flex size-4 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:text-accent active:scale-90 2xl:size-[18px] 4xl:size-5"
			>
				<Info />
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
			class="max-h-[88dvh] w-full max-w-[520px] overflow-hidden rounded-md border border-accent/20 bg-gradient-to-b from-panel-top to-panel-bottom font-sans text-fg-body shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
			onclick={(e) => e.stopPropagation()}
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<div class="flex items-center justify-between gap-4 border-b border-hairline px-6 py-3.5">
				<span
					class="font-sans text-[13px] font-extrabold tracking-[0.22em] text-fg uppercase 2xl:text-[15px]"
				>
					Legal Disclaimer
				</span>
				<button
					type="button"
					onclick={close}
					aria-label="Close"
					class="flex size-8 shrink-0 items-center justify-center rounded-full border border-hairline bg-white/5 text-fg-muted transition-colors hover:border-accent/40 hover:text-accent active:scale-90"
				>
					<Cross />
				</button>
			</div>

			<div
				class="flex max-h-[calc(88dvh-56px)] flex-col gap-3 overflow-y-auto px-6 py-5 text-[13px] leading-relaxed text-fg-muted 2xl:text-sm 3xl:text-[15px]"
			>
				<p>
					Loot Raiders is an unofficial fan project inspired by ARC Raiders. This project is not
					affiliated with, endorsed, sponsored, supported, or approved by {@render embarkLink(
						'text-fg-body'
					)}.
				</p>
				<p>
					ARC RAIDERS, EMBARK, and all related names, trademarks, logos, characters, artwork, music,
					sounds, game assets, and other intellectual property are the property of {@render embarkLink(
						'text-fg-body'
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

{#snippet embarkLink(cls: string)}
	<a
		href="https://www.embark-studios.com/"
		target="_blank"
		rel="noopener noreferrer"
		class="underline decoration-hairline underline-offset-2 transition-colors hover:text-accent hover:decoration-accent/60 {cls}"
		>Embark Studios AB</a
	>
{/snippet}
