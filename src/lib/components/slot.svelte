<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import ItemSlot from './item-slot.svelte';
	import EmptySlot from './empty-slot.svelte';
	import type { ItemLocation } from '$lib/types';

	type Props = {
		location: ItemLocation;
		class: string;
		placeholder?: string;
	};

	let { location, class: className = '', placeholder }: Props = $props();

	const { interaction, inventory, overlay } = getGameContext();

	const isHovered = $derived(interaction.isHovered(location));

	const item = $derived(inventory.getItem(location));

	const itemUid = $derived(item?.uid ?? '');

	const selectedItem = $derived(inventory.isSelected(itemUid));

	const isDraggingThisItem = $derived(interaction.isSource(location));

	const slotState = $derived({ location, item });

	const showInvalidHint = $derived(interaction.shouldShowInvalidHint(slotState));
</script>

<div class="{className}  relative rounded-lg">
	{@render gradientBorder()}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="relative z-20 h-full w-full p-[3.5px]"
		oncontextmenu={(e) => {
			e.preventDefault();
			if (e.ctrlKey) return;
			if (item) overlay.openContextMenu(e.clientX, e.clientY, { location, item });
		}}
	>
		{#if item && !isDraggingThisItem}
			<ItemSlot {slotState} {selectedItem} className="h-full w-full" />
		{:else}
			<EmptySlot {slotState} {placeholder} className="h-full w-full" />
		{/if}
	</div>
	{@render invalidIcon()}
</div>

{#snippet gradientBorder()}
	{#if isHovered}
		<div class="glow-ring-mask absolute inset-0 z-0 transition-opacity duration-300">
			<div class="glow-animation absolute inset-[-100%]"></div>
		</div>
	{/if}
{/snippet}

{#snippet invalidIcon()}
	{#if showInvalidHint}
		<div class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
			<img src="/assets/invalid.png" alt="!!" class="size-10 opacity-50" />
		</div>
	{/if}
{/snippet}

<style>
	.glow-ring-mask {
		border-radius: inherit;

		padding: 1px;

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
