<script lang="ts">
	import duck1 from '$lib/assets/loot_assets/Camera Lens.png';
	import { type Item } from '$lib/state/inventory-manager.svelte';

	type Props = {
		mode: Item | null;
		className?: string;
	};

	let { mode, className = 'h-10 w-10' }: Props = $props();

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

	const rarityStyle = $derived(mode ? RARITY_CONFIG[mode.rare ?? 'common'] : RARITY_CONFIG.common);

	function preventDrag(e) {
		e.stopImmediatePropagation();
		e.preventDefault();
	}
</script>

<div class={className}>
	{#if !mode}
		<div
			class="h-full w-full cursor-default rounded-lg border border-white/20"
			onmousedown={preventDrag}
			ontouchstart={preventDrag}
			onpointerdown={preventDrag}
		></div>
	{:else}
		<div
			class=" flex h-full w-full flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {rarityStyle.border}"
		>
			<div class="relative flex h-full w-full flex-col overflow-hidden rounded-[7px] bg-[#0f111a]">
				<div
					class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-10 blur-xl {rarityStyle.glow} "
				></div>

				<div class="relative min-h-0 flex-1 items-center justify-center">
					<img
						src={mode.image || duck1}
						alt="Loot"
						class="relative z-10 h-full w-full object-contain"
					/>
				</div>
			</div>
		</div>
	{/if}
</div>
