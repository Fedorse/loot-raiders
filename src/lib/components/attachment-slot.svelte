<script lang="ts">
	import { droppable, attachmentInteractions } from '$lib/actions/actions';
	import { getGameContext } from '$lib/store/game.svelte';
	import { getDef } from '$lib/config/items';
	import { getRarityStyle } from '$lib/config/rarity';
	import type { InstanceItem, SlotRef } from '$lib/types';

	type Props = {
		weaponSlotRef: SlotRef;
		attachIndex: number;
		attachment: InstanceItem | null;
		placeholder?: string;
		weaponItem: InstanceItem;
	};

	let { weaponSlotRef, attachIndex, attachment, placeholder, weaponItem }: Props = $props();

	const { interaction } = getGameContext();
	const itemUid = $derived(attachment?.uid ?? '');
	const isDraggingThisItem = $derived(interaction.isDraggingUid(itemUid));

	const dropTarget = $derived({
		storage: weaponSlotRef,
		item: weaponItem
	});

	const def = $derived(attachment ? getDef(attachment.defId) : null);
	const style = $derived(def ? getRarityStyle(def.rarity) : null);

	let isHovered = $state(false);
	const showDropHighlight = $derived(isHovered);
</script>

{#if attachment && def && style && !isDraggingThisItem}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="relative z-20 aspect-square size-8 rounded-lg"
		{@attach droppable(dropTarget)}
		{@attach attachmentInteractions(weaponSlotRef, attachIndex, attachment)}
		onpointerenter={() => (isHovered = true)}
		onpointerleave={() => (isHovered = false)}
	>
		{@render glowRing()}
		<div class="relative z-10 h-full w-full p-[2px]">
			<div
				class="flex h-full w-full flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.border}"
			>
				<div class="relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-[#0f111a]">
					<div
						class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-60 blur-xl {style.glow}"
					></div>
					<div class="relative min-h-0 flex-1 items-center justify-center">
						<img
							src={def.image}
							alt={def.name}
							class="relative z-10 h-full w-full scale-105 object-contain"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="relative z-20 aspect-square size-8 rounded-lg"
		{@attach droppable(dropTarget)}
		onpointerenter={() => (isHovered = true)}
		onpointerleave={() => (isHovered = false)}
	>
		{@render glowRing()}
		<div class="relative z-10 h-full w-full p-[2px]">
			<div
				class="flex h-full w-full cursor-default items-center justify-center rounded-lg border border-white/20"
			>
				{#if placeholder}
					<span class="text-[8px] text-white/30">{placeholder}</span>
				{/if}
			</div>
		</div>
	</div>
{/if}

{#snippet glowRing()}
	{#if showDropHighlight}
		<div class="glow-ring-mask absolute inset-0 z-0">
			<div class="glow-animation absolute inset-[-100%]"></div>
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
