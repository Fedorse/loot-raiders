<script lang="ts">
	import { getDef } from '$lib/config/items';
	import { getRarityStyleTooltip } from '$lib/config/rarity';
	import type { TetrisGroup } from '$lib/types';

	type Props = {
		group: TetrisGroup;
	};

	let { group }: Props = $props();

	const def = $derived(getDef(group.defId));
	const style = $derived(getRarityStyleTooltip(def.rarity));
</script>

<div class="relative h-full w-full">
	<div
		class="flex h-full w-full flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.bg}"
	>
		<div class="relative flex h-full w-full flex-col overflow-hidden rounded-[7px] bg-black/80">
			<img src={def.image} alt={def.name} class="relative z-10 h-full w-full object-contain" />
		</div>
	</div>
	{#if group.count > 1}
		<div
			class="pointer-events-none absolute top-0.5 right-0.5 z-20 rounded bg-black/70 px-1 py-0.5 text-[10px] font-bold text-white"
		>
			{group.count}
		</div>
	{/if}
</div>
