<script lang="ts">
	import TierIcon from '$lib/components/tier-icon.svelte';
	import { getDef } from '$lib/config/items';
	import type { ItemInstance } from '$lib/config/items';

	type Props = {
		item: ItemInstance | null;
		className?: string;
	};

	let { item, className = 'h-20 w-20' }: Props = $props();

	const def = $derived(item?.defId != null ? getDef(item.defId) : null);

	const RARITY_CONFIG = {
		common: {
			border: 'bg-white/20',
			bg: 'bg-white/30',
			glow: 'bg-gray-600',
			height: 'h-[40%]'
		},
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

	const style = $derived(
		def ? RARITY_CONFIG[def.rarity] || RARITY_CONFIG.common : RARITY_CONFIG.common
	);
	const hasAttachments = $derived(item?.attachments?.some((a) => a !== null));
</script>

{#if item && def}
	<div class="{className} group">
		<div
			class=" flex h-full w-full flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.border}"
		>
			<div class="relative flex h-full w-full flex-col overflow-hidden rounded-[7px] bg-[#0f111a]">
				<div class="relative min-h-0 flex-1 items-center justify-center">
					{@render absoluteGlowShadow()}
					{@render absoluteBlob()}
					<img
						src={def.image}
						alt="Loot"
						class="relative z-10 h-full w-full object-contain transition-transform group-hover:scale-110"
					/>
				</div>

				{@render footer()}
			</div>
		</div>
	</div>
{/if}

{#snippet absoluteGlowShadow()}
	<div class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-10 blur-xl {style.glow} "></div>
{/snippet}

{#snippet absoluteBlob()}
	<div
		class="absolute -bottom-0.5 -left-0.5 z-0 aspect-square {style.height} {style.bg}"
		style="
                            mask-image: radial-gradient(circle at 100% 0%, transparent 69%, black 70%); 
                            -webkit-mask-image: radial-gradient(circle at 100% 0%, transparent 69%, black 70%);
                        "
	></div>
{/snippet}

{#snippet footer()}
	<div class="z-10 flex h-[25%] w-full shrink-0 items-center justify-between bg-black pr-1 pl-0.5">
		{#if def?.type === 'weapon'}
			<div class="text-white/70">
				<img src={def.categoryIcon} alt="category" class="size-4 object-contain" />
			</div>
			{#if hasAttachments}
				<div>
					<img src={def.categoryIcon} alt="category" class="size-4 object-contain opacity-50" />
				</div>
			{/if}
			<div>
				<TierIcon tier={(item as { tier?: number }).tier ?? 3} className="size-4 opacity-50" />
			</div>
		{:else}
			<div class="text-white/70">
				<img src={def?.categoryIcon} alt="category" class="size-4 object-contain" />
			</div>
			{#if item && item.count > 1}
				<div class="font-mono text-xs font-bold tracking-wider text-white">
					{item.count}
				</div>
			{/if}
		{/if}
	</div>
{/snippet}
