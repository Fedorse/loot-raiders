<script lang="ts">
	import { getDef } from '$lib/config/items';
	import { type Item } from '$lib/store/inventory-manger.svelte';

	type Props = {
		item: Item | null;
		className?: string;
	};

	let { item, className = '' }: Props = $props();

	let def = $derived(getDef(item.defId));

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

	const style = $derived(def ? RARITY_CONFIG[def.rarity] : RARITY_CONFIG.common);
</script>

<div class={className}>
	<div
		class=" flex h-full w-full flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.border}"
	>
		<div class="relative flex h-full w-full flex-col overflow-hidden rounded-[7px] bg-[#0f111a]">
			{@render absoluteGlowShadow()}
			<div class="relative min-h-0 flex-1 items-center justify-center">
				<img
					src={def.image || duck1}
					alt="Loot"
					class="relative z-10 h-full w-full scale-105 object-contain"
				/>
			</div>
		</div>
	</div>
</div>
{#snippet absoluteGlowShadow()}
	<div class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-60 blur-xl {style.glow}"></div>
{/snippet}
