<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import { getDef } from '$lib/config/items';
	import { getRarityStyleTooltip } from '$lib/config/rarity';
	import type { ItemDefinition } from '$lib/types';

	const PADDING = 6;
	const TAB_HEIGHT = 32;

	const { overlay } = getGameContext();
	const tooltipData = $derived(overlay.tooltip);

	let tooltipRef = $state<HTMLElement>();
	let adjustedX = $state(0);
	let adjustedY = $state(0);

	const def = $derived(tooltipData?.item ? getDef(tooltipData.item.defId) : null);

	const isWeapon = $derived(def?.type === 'weapon');
	const isAttachment = $derived(def?.type === 'attachment');

	const attachments = $derived(tooltipData?.item.attachments ?? []);
	const recycling = $derived(def?.recycling ?? []);
	const style = $derived(def ? getRarityStyleTooltip(def.rarity) : null);

	$effect(() => {
		if (tooltipData && tooltipRef) {
			const rect = tooltipRef.getBoundingClientRect();
			const vh = window.innerHeight;

			adjustedX = tooltipData.x + PADDING;

			const rawY = tooltipData.y + rect.height > vh ? vh - rect.height - PADDING : tooltipData.y;
			adjustedY = Math.max(TAB_HEIGHT + 4, rawY);
		}
	});
</script>

{#if tooltipData && def}
	<div
		bind:this={tooltipRef}
		class="pointer-events-none fixed z-[100] flex w-[340px] flex-col"
		style="top: {adjustedY}px; left: {adjustedX}px;"
	>
		<div
			class="flex h-8 w-fit items-center gap-2 rounded-t-[6px] bg-modal-secondary px-4 font-bold text-modal-foreground"
		>
			<img src="/assets/ui/icon-actions.png" alt="category" class="size-5 object-contain" />
			<span class="text-[13px] tracking-widest uppercase">Actions</span>
		</div>

		<div class="flex flex-col rounded-tr-[6px] rounded-b-[6px] bg-modal text-modal-foreground">
			<div class="flex flex-col px-5 py-3">
				<!-- badge  -->
				<div class="mb-2 flex gap-0.5 text-xs font-bold text-black uppercase">
					<div class="px-1 {style?.bg} flex items-center rounded-l-xs">
						<img src={def.categoryIcon} alt="category" class="size-5 object-contain brightness-0" />
					</div>
					{#if isWeapon}
						<div class="flex items-center px-1 {style?.bg}">
							{def.weaponClass}
						</div>
					{/if}
					<div class="flex items-center rounded-r-xs px-1 {style?.bg}">
						{def.rarity}
					</div>
				</div>

				<h1 class="mb-2 text-2xl leading-none font-black tracking-tight uppercase">
					{def.name}
				</h1>

				{#if def.description}
					<p class="mb-2 text-sm leading-snug font-medium text-modal-secondary-foreground">
						{def.description}
					</p>
				{/if}

				{#if isWeapon}
					<div class="flex gap-1.5">
						{#each def.attachmentSlots ?? [] as slot, i (i)}
							{@const attached = attachments[i]}
							{@const attDef = attached ? getDef(attached.defId) : null}
							{@render attachmentItem(attDef, slot.placeholder)}
						{/each}
					</div>
				{/if}

				{#if isWeapon}
					<div class="mb-4 flex flex-col text-sm font-medium text-modal-foreground">
						<div
							class="flex items-center justify-between border-b border-modal-foreground/10 px-1.5 pt-2 pb-1"
						>
							<span class="text-modal-secondary-foreground">Ammo Type</span>
							<span class="flex items-center gap-1 font-bold">
								<img src={def.categoryIcon} alt="" class="size-6 object-contain brightness-0" />
								{def.ammoType}
							</span>
						</div>

						<div
							class="flex items-center justify-between border-b border-modal-foreground/10 px-1.5 pt-2 pb-1"
						>
							<span class="text-modal-secondary-foreground">Magazine Size</span>
							<span class="font-bold">{def.magazineSize}</span>
						</div>

						<div
							class="flex items-center justify-between border-b border-modal-foreground/10 bg-modal-secondary/40 px-1.5 pt-2 pb-1"
						>
							<span class="text-modal-secondary-foreground">Firing Mode</span>
							<span class="font-bold">{def.firingMode}</span>
						</div>

						<div
							class="flex items-center justify-between border-b border-modal-foreground/10 px-1.5 pt-2 pb-1"
						>
							<span class="text-modal-secondary-foreground">ARC Armor Penetration</span>
							<span class="font-bold">{def.armorPenetration}</span>
						</div>
					</div>
				{/if}

				{#if isAttachment}
					<div class="mb-4 flex flex-col gap-1">
						{#each def.statBonuses ?? [] as bonus, i (i)}
							<span class="text-sm leading-snug font-medium text-modal-secondary-foreground">
								{bonus}
							</span>
						{/each}
					</div>
				{/if}

				{#if recycling.length > 0}
					<div class="flex flex-col {isWeapon ? 'pl-2' : ''}">
						<span class="mb-2 text-xs font-bold text-modal-foreground uppercase">
							Recycles Into
						</span>
						<div class="flex gap-1.5">
							{#each recycling as res (res.itemId)}
								{@const resDef = getDef(res.itemId)}
								{@render recycleItem(resDef)}
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

{#snippet attachmentItem(attDef: ItemDefinition | null, placeholder: string)}
	{@const style = attDef ? getRarityStyleTooltip(attDef.rarity) : null}
	{#if attDef && style}
		<div class="aspect-square size-10 rounded-lg">
			<div
				class="flex h-full w-full flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.border}"
			>
				<div class="relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-surface">
					<div class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] blur-xl {style.glow}"></div>
					<div class="relative min-h-0 flex-1 items-center justify-center">
						<img
							src={attDef.image}
							alt={attDef.name}
							class="relative z-10 h-full w-full scale-105 object-contain"
						/>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="aspect-square size-10 rounded-lg">
			<div
				class="flex h-full w-full items-center justify-center rounded-lg border border-black/10 bg-black/5"
			>
				<img
					src={placeholder}
					alt="mod slot"
					class="h-[90%] w-[90%] object-contain opacity-40 brightness-0"
				/>
			</div>
		</div>
	{/if}
{/snippet}

{#snippet recycleItem(resDef: ItemDefinition)}
	{@const style = getRarityStyleTooltip(resDef.rarity)}

	<div class="size-10">
		<div
			class="flex size-10 h-full w-full flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.bg}"
		>
			<div class="relative flex h-full w-full flex-col overflow-hidden rounded-[7px] bg-black/80">
				<img src={resDef.image} alt="Loot" class="relative z-10 h-full w-full object-contain" />
			</div>
		</div>
	</div>
{/snippet}
