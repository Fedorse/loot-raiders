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
	const isDragOrigin = $derived(interaction.dragOrigin?.item === attachment && attachment !== null);

	const dropTarget = $derived({
		storage: weaponSlotRef,
		item: weaponItem
	});

	const def = $derived(attachment ? getDef(attachment.defId) : null);
	const style = $derived(def ? getRarityStyle(def.rarity) : null);
</script>

{#if attachment && def && style && !isDragOrigin}
	<div
		class="z-20 aspect-square size-8"
		{@attach droppable(dropTarget)}
		{@attach attachmentInteractions(weaponSlotRef, attachIndex, attachment)}
	>
		<div
			class="flex h-full w-full flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.border}"
		>
			<div class="relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-[#0f111a]">
				<div class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-60 blur-xl {style.glow}">
				</div>
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
{:else}
	<div class="z-20 aspect-square size-8" {@attach droppable(dropTarget)}>
		<div
			class="flex h-full w-full cursor-default items-center justify-center rounded-lg border border-white/20"
		>
			{#if placeholder}
				<span class="text-[8px] text-white/30">{placeholder}</span>
			{/if}
		</div>
	</div>
{/if}
