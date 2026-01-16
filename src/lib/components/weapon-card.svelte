<script lang="ts">
	import { draggable } from '@thisux/sveltednd';

	import duck1 from '$lib/assets/loot_assets/Camera Lens.png';
	import ammoTypeImg from '$lib/assets/ammo-type.webp';
	import TierIcon from '$lib/components/tier-icon.svelte';
	import { dndState } from '@thisux/sveltednd';
	import DndItem from '$lib/components/dnd-item.svelte';
	import ItemCard from './item-card.svelte';
	import InvalidCard from './invalid-card.svelte';

	type Props = {
		item: any;
		className?: string;
		containerId: string;
	};

	let { item, className = 'h-40', containerId }: Props = $props();

	const RARITY_CONFIG = {
		common: { border: 'bg-white/20', bg: 'bg-white/30', glow: 'bg-gray-600', height: 'h-[40%]' },
		uncommon: {
			border: 'from-green-500 via-green-500 via-5% to-slate-700 to-80%',
			bg: 'bg-green-500',
			glow: 'bg-green-400',
			height: 'h-[50%]'
		},
		rare: {
			border: 'from-blue-500 via-blue-400 via-5% to-slate-700 to-80%',
			bg: 'bg-blue-500',
			glow: 'bg-blue-400',
			height: 'h-[60%]'
		},
		epic: {
			border: 'from-purple-500 via-purple-500 via-5% to-slate-700 to-80%',
			bg: 'bg-purple-500',
			glow: 'bg-purple-400',
			height: 'h-[70%]'
		},
		legendary: {
			border: 'from-yellow-400 via-yellow-500 via-5% to-slate-700 to-80%',
			bg: 'bg-yellow-400',
			glow: 'bg-yellow-300',
			height: 'h-[80%]'
		}
	} as const;

	const rarityStyle = $derived(item ? RARITY_CONFIG[item.rare ?? 'common'] : RARITY_CONFIG.common);

	function handleInternalDrag(e: Event) {
		e.stopPropagation();
	}
</script>

<div class={className}>
	<div
		class="flex h-full w-full flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[0.5px] {rarityStyle.border}"
	>
		<div class="relative flex h-full w-full flex-col overflow-hidden rounded-[8px] bg-[#0f111a]">
			{@render absoluteGlowShadow()}

			<div
				class="relative min-h-0 items-center justify-center"
				use:draggable={{
					container: containerId,
					dragData: { item },
					disabled: dndState.isDragging && dndState.draggedItem?.item?.id !== item.id
				}}
			>
				{@render absoluteBlob()}

				<img
					src={item.image || duck1}
					alt="weapon"
					class="relative z-10 h-full w-full object-contain"
				/>
			</div>

			<div class="z-20 mb-1 flex h-10 items-center justify-center gap-1">
				{#each item.attachments as _, index}
					{@const slotId = `${containerId}-attach-${index}`}
					<DndItem
						id={slotId}
						collection={item.attachments}
						{index}
						allowedTypes={['attachment']}
						className=" z-20 flex aspect-square size-8 cursor-default items-center justify-center rounded border border-white/20 bg-black/40"
						onpointerdown={(e) => e.stopPropagation()}
					>
						{#snippet children(attachItem, isInvalid)}
							{#if attachItem}
								<ItemCard item={attachItem} className="h-full w-full" />
							{:else if isInvalid}
								<InvalidCard />
							{:else}
								<div class=" font-mono text-[8px] text-white/20 select-none">
									{index}
								</div>
							{/if}
						{/snippet}
					</DndItem>
				{/each}
			</div>

			{@render footer()}
		</div>
	</div>
</div>

{#snippet absoluteGlowShadow()}
	<div
		class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-10 blur-xl {rarityStyle.glow}"
	></div>
{/snippet}

{#snippet absoluteBlob()}
	<div
		class="absolute -bottom-10.5 -left-0.5 z-0 aspect-square {rarityStyle.height} {rarityStyle.bg}"
		style="mask-image: radial-gradient(circle at 100% 0%, transparent 69%, black 70%);"
	></div>
{/snippet}

{#snippet footer()}
	<div
		class="z-10 flex h-[20%] min-h-0 w-full shrink-0 items-center justify-between bg-black pr-2 pl-0.5"
	>
		<div class="flex h-full items-center justify-center gap-0.5">
			<img src={ammoTypeImg} alt="ammo" class="size-9 object-contain" />
			<div class="flex font-mono text-xs text-white/90">
				<p class="tabular-nums">{item.ammoCurrent || 0}</p>
				<span class="text-white">/</span>
				<p class="tabular-nums">{item.ammoMax || 30}</p>
			</div>
		</div>
		<div class="text-white/70">
			<TierIcon tier={item.tier || 3} className="size-7" />
		</div>
	</div>
{/snippet}
