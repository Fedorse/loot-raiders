<script lang="ts">
	import { getDef } from '$lib/config/items';
	import { getRarityStyle } from '$lib/config/rarity';
	import { getGameContext } from '$lib/store/game.svelte';
	import Scanner from './scanner.svelte';
	import type { InstanceItem, ItemLocation } from '$lib/types';

	type Props = {
		item: InstanceItem;
		location?: ItemLocation;
		className?: string;
		selected: boolean;
		readonly?: boolean;
		onmatched?: () => void;
	};

	let { item, location, className = 'h-20 w-20', selected, readonly, onmatched }: Props =
		$props();

	const { interaction, gameLoop } = getGameContext();

	const def = $derived(getDef(item.defId));
	const style = $derived(getRarityStyle(def.rarity));
	const hasAttachments = $derived(item.attachments?.some((a) => a !== null) ?? false);
	const displayCount = $derived(
		location ? interaction.getDisplayCount(item, location) : item.count
	);
</script>

<div class="{className} group">
	<div
		class=" flex h-full w-full flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.border}"
	>
		<div
			class="relative h-full w-full overflow-hidden rounded-[7px] {selected
				? 'bg-white'
				: 'bg-surface'}"
		>
			{#if item.match}
				<div class="pointer-events-none absolute inset-0 z-20 overflow-hidden">
					<Scanner
						duration={1}
						direction="vertical"
						wipe
						pause={gameLoop.status === 'paused'}
						onscanned={onmatched}
					/>
				</div>
			{/if}
			<div class="relative flex h-full w-full flex-col">
				<div class="relative min-h-0 flex-1 items-center justify-center">
					{@render absoluteGlowShadow()}
					{@render absoluteBlob()}
					<img
						src={def.image}
						alt="Loot"
						class="relative z-10 h-full w-full object-contain transition-transform {readonly
							? ''
							: 'group-hover:scale-105'} "
					/>
				</div>

				{@render footer()}
			</div>
		</div>
	</div>
</div>

{#snippet absoluteGlowShadow()}
	<div class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-20 blur-xl {style.glow} "></div>
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
		{#if def.type === 'weapon'}
			<img src={def.categoryIcon} alt="ammo type" class="size-4 object-contain" />
			{#if hasAttachments}
				<img
					src="/assets/ui/mod_slot_assets/weapon-mod.png"
					alt="modded"
					class="size-4 object-contain opacity-50"
				/>
			{/if}
		{:else}
			<div class="text-white/70">
				<img src={def.categoryIcon} alt="category" class="size-4 object-contain" />
			</div>
			{#if displayCount > 1}
				<div
					class="flex items-baseline items-center gap-0.5 text-xs leading-none font-medium text-white"
				>
					<span class="text-[9px]">x</span>
					<span class="font-sans text-xs tracking-[-0.05em]">
						{displayCount}
					</span>
				</div>
			{/if}
		{/if}
	</div>
{/snippet}

