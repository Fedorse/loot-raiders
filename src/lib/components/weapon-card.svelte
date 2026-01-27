<script lang="ts">
	// import duck1 from '$lib/assets/loot_assets/Camera Lens.png';
	// import ammoTypeImg from '$lib/assets/ammo-type.webp';
	import TierIcon from '$lib/components/tier-icon.svelte';
	import Socket from '$lib/components/socket.svelte';
	import InvalidCard from './invalid-card.svelte';
	import AttachCard from './attach-weapon-card.svelte';
	import type { ItemInstance } from '$lib/config/items';
	import { getDef } from '$lib/config/items';

	type Props = {
		item: ItemInstance;
		className?: string;
	};

	let { item, className = 'h-40' }: Props = $props();
	let def = $derived(getDef(item.defId));

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

	const style = $derived(def ? RARITY_CONFIG[def.rarity] : RARITY_CONFIG.common);
</script>

<div class={className}>
	<div
		class="flex h-full w-full flex-col overflow-hidden rounded-[8px] bg-linear-to-tr p-[1px] {style.border}"
	>
		<div
			class="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-t-[8px] bg-[#0f111a]"
		>
			{@render absoluteGlowShadow()}
			{@render absoluteBlob()}
			<div class="min-h-0 flex-1">
				<img
					src={def.image || duck1}
					alt="weapon"
					class="z-10 max-h-full max-w-full object-contain"
				/>
			</div>
			<div class="z-20 mb-1 flex shrink-0 items-center justify-center gap-1">
				{#each def.attachmentSlots as slot, index}
					<Socket
						collection={item.attachments}
						{index}
						categories={[slot.type]}
						className="z-20 aspect-square size-8"
					>
						{#snippet children(item)}
							<AttachCard {item} className="h-full w-full" />
						{/snippet}
					</Socket>
				{/each}
			</div>
		</div>
		<div class="shrink-0">
			{@render footer()}
		</div>
	</div>
</div>

{#snippet absoluteGlowShadow()}
	<div class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-10 blur-xl {style.glow}"></div>
{/snippet}

{#snippet absoluteBlob()}
	<div
		class="absolute -bottom-1 -left-0.5 z-0 aspect-square {style.height} {style.bg}"
		style="mask-image: radial-gradient(circle at 100% 0%, transparent 69%, black 70%);"
	></div>
{/snippet}

{#snippet footer()}
	<div
		class=" z-10 flex h-8 w-full items-center justify-between rounded-b-[8px] bg-black pr-2 pl-0.5"
	>
		<div class="flex h-full items-center justify-center gap-0.5">
			<img src={def.categoryIcon} alt="ammo" class="size-9 object-contain" />
			<div class="flex font-mono text-xs text-white/90">
				<p class="tabular-nums">{0}</p>
				<span class="text-white">/</span>
				<p class="tabular-nums">{30}</p>
			</div>
		</div>
		<div class="text-white/70">
			<TierIcon tier={def.tier || 3} className="size-7" />
		</div>
	</div>
{/snippet}
