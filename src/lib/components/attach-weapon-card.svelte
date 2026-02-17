<script lang="ts">
	import { getDef, type ItemInstance } from '$lib/config/items';
	import { getRarityStyle } from '$lib/config/rarity';

	type Props = {
		item: ItemInstance | null;
		className?: string;
	};

	let { item, className = '' }: Props = $props();

	let def = $derived(item ? getDef(item.defId) : null);

	const style = $derived(def ? getRarityStyle(def.rarity) : getRarityStyle('common'));
</script>

<div class={className}>
	{#if item && def}
		<div
			class=" flex h-full w-full flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.border}"
		>
			<div class="relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-[#0f111a]">
				{@render absoluteGlowShadow()}
				<div class="relative min-h-0 flex-1 items-center justify-center">
					<img
						src={def.image}
						alt="Loot"
						class="relative z-10 h-full w-full scale-105 object-contain"
					/>
				</div>
			</div>
		</div>
	{/if}
</div>
{#snippet absoluteGlowShadow()}
	<div class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-60 blur-xl {style.glow}"></div>
{/snippet}
