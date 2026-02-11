<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import type { SlotRef } from '$lib/config/items';
	import ItemSlot from './item-slot.svelte';
	import EmptySlot from './empty-slot.svelte';
	import { isEqual } from 'es-toolkit';

	type Props = {
		slotRef: SlotRef;
		class: string;
		placeholder?: string;
	};

	let { slotRef, class: className = '', placeholder }: Props = $props();

	const game = getGameContext();
	const { dnd, inventory } = game;
	const { dragOrigin } = $derived(dnd);
	const highlightHoverSlot = $derived(dnd.highlightHoverSlot(slotRef));

	const storedItem = $derived(inventory.getItem(slotRef));
	const dragOriginSlot = $derived(dragOrigin?.item === storedItem?.item);

	const validSlot = $derived(
		dnd.canAccept({
			storage: slotRef,
			item: storedItem?.item ?? null
		})
	);
</script>

<div class="{className}  relative rounded-lg">
	{@render gradientBorder()}
	<div class="relative z-20 h-full w-full p-[3.5px]">
		{#if storedItem && !dragOriginSlot}
			<ItemSlot {storedItem} className="h-full w-full" />
		{:else}
			<EmptySlot {slotRef} {placeholder} className="h-full w-full" />
		{/if}
	</div>
	{@render invalidIcon()}
</div>

{#snippet gradientBorder()}
	{#if highlightHoverSlot}
		<div class="glow-ring-mask absolute inset-0 z-0 transition-opacity duration-300">
			<div class="glow-animation absolute inset-[-100%]"></div>
		</div>
	{/if}
{/snippet}

{#snippet invalidIcon()}
	{#if dragOrigin && !validSlot && !('attachIndex' in slotRef)}
		<div class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
			<img src="/assets/invalid.png" alt="!!" class="size-10 opacity-50" />
		</div>
	{/if}
{/snippet}

<style>
	.glow-ring-mask {
		border-radius: inherit;

		padding: 1.5px;

		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);

		/* cut centert */
		-webkit-mask-composite: xor;
		mask-composite: exclude;
	}

	.glow-animation {
		background: conic-gradient(
			from 0deg,
			#ff00ff 0deg,
			#00ffff 45deg,
			transparent 90deg,
			#6080e0 135deg,
			#ff00ff 180deg,
			#00ffff 240deg,
			transparent 270deg,
			#ff00ff 330deg,
			#ff00ff 360deg
		);
		animation: rotate 4s linear infinite;
		filter: blur(1px);
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
