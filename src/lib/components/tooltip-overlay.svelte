<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import { getDef } from '$lib/config/items';
	import { getRarityStyle } from '$lib/config/rarity';
	import type { ItemDefinition } from '$lib/types';

	const { overlay } = getGameContext();
	const tooltip = $derived(overlay.tooltip);

	const def = $derived(tooltip?.item ? getDef(tooltip.item.defId) : null);
	$effect(() => {
		console.log('def', def);
	});
	const isWeapon = $derived(def?.type === 'weapon');

	const attachmentSlots = $derived(def?.attachmentSlots ?? []);
	const attachments = $derived(tooltip?.item.attachments ?? []);
	const recycling = $derived(def?.recycling ?? []);

	let tooltipRef: HTMLElement;
	let adjustedX = $state(0);
	let adjustedY = $state(0);

	const style = $derived(def ? getRarityStyle(def.rarity) : null);

	$effect(() => {
		if (tooltip && tooltipRef) {
			const rect = tooltipRef.getBoundingClientRect();
			const vw = window.innerWidth;
			const vh = window.innerHeight;

			const TAB_HEIGHT = 32;
			adjustedX = tooltip.x + rect.width > vw ? tooltip.x - rect.width - 20 : tooltip.x + 15;
			const rawY = tooltip.y + rect.height > vh ? tooltip.y - rect.height - 20 : tooltip.y + 15;
			adjustedY = Math.max(TAB_HEIGHT + 4, rawY);
		}
	});
</script>

{#if tooltip && def && tooltip.item}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={tooltipRef}
		class="pointer-events-none fixed z-[10000] flex w-[340px] flex-col drop-shadow-2xl"
		style="top: {adjustedY}px; left: {adjustedX}px;"
	>
		<div
			class="absolute -top-8 left-0 flex h-8 items-center gap-2 rounded-t-[6px] bg-modal-secondary px-4 font-bold text-modal-foreground"
		>
			<svg class="size-4 opacity-70" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C8.13 2 5 5.13 5 9v6c0 3.87 3.13 7 7 7s7-3.13 7-7V9c0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5v1H7V9c0-2.76 2.24-5 5-5zm-1 3v3h2V7h-2z"
				/>
			</svg>
			<span class="text-[13px] tracking-widest uppercase">Actions</span>
		</div>

		<div
			class="flex flex-col rounded-tr-[6px] rounded-b-[6px] bg-modal text-modal-foreground shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]"
		>
			<div class="flex flex-col px-5 py-5">
				<div class="mb-2 flex gap-0.5 text-xs font-bold tracking-wider text-black uppercase">
					<div class=" px-1.5 {style?.bg}">
						<img src={def.categoryIcon} alt="category" class="size-5 object-contain brightness-0" />
					</div>
					{#if def.weaponClass}
						<div class="bg-badge px-1 py-0.5 {style?.bg}">
							{def.weaponClass}
						</div>
					{/if}

					<div class="bg-badge px-1.5 py-0.5 {style?.bg}">
						{def.rarity}
					</div>
				</div>

				<h1 class="mb-2 text-[26px] leading-none font-black tracking-tight uppercase">
					{def.name}
				</h1>

				{#if def.description}
					<p class="mb-4 text-[15px] leading-snug font-medium text-modal-secondary-foreground">
						{def.description}
					</p>
				{/if}

				{#if attachmentSlots.length > 0}
					<div class="mb-5 flex gap-1.5">
						{#each attachmentSlots as slot, i}
							{@const attached = attachments[i]}
							{@const attDef = attached ? getDef(attached.defId) : null}
							{@render attachmentItem(attDef, slot.placeholder)}
						{/each}
					</div>
				{/if}

				<!-- Характеристики (только для оружия) -->
				{#if isWeapon}
					<div class="mb-4 flex flex-col text-[14px] font-medium text-modal-foreground">
						{#if def.ammoType}
							<div
								class="flex items-center justify-between border-b border-modal-foreground/10 py-2"
							>
								<span class="text-modal-secondary-foreground">Ammo Type</span>
								<span class="flex items-center gap-1 font-bold">
									<img src={def.categoryIcon} alt="" class="size-5 object-contain brightness-0" />
									{def.ammoType}
								</span>
							</div>
						{/if}
						{#if def.magazineSize}
							<div
								class="flex items-center justify-between border-b border-modal-foreground/10 py-2"
							>
								<span class="text-modal-secondary-foreground">Magazine Size</span>
								<span class="font-bold">{def.magazineSize}</span>
							</div>
						{/if}
						{#if def.firingMode}
							<div
								class="flex items-center justify-between border-b border-modal-foreground/10 py-2"
							>
								<span class="text-modal-secondary-foreground">Firing Mode</span>
								<span class="font-bold">{def.firingMode}</span>
							</div>
						{/if}
						{#if def.armorPenetration}
							<div
								class="flex items-center justify-between border-b border-modal-foreground/10 py-2"
							>
								<span class="text-modal-secondary-foreground">ARC Armor Penetration</span>
								<span class="font-bold">{def.armorPenetration}</span>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Stat Bonuses (attachments) -->
				{#if def.statBonuses?.length}
					<div class="mb-4 flex flex-col gap-1">
						{#each def.statBonuses as bonus}
							<span class="text-[15px] leading-snug font-medium text-modal-secondary-foreground">
								{bonus}
							</span>
						{/each}
					</div>
				{/if}

				<!-- Recycles Into -->
				{#if recycling.length > 0}
					<div class="flex flex-col">
						<span
							class="mb-2 text-[12px] font-bold tracking-widest text-modal-foreground uppercase"
						>
							Recycles Into
						</span>
						<div class="flex gap-1.5">
							{#each recycling as res (res.itemId)}
								{@const resDef = getDef(res.itemId)}
								{@render recycleItem(resDef, res.amount)}
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

{#snippet attachmentItem(attDef: ItemDefinition | null, placeholder: string)}
	{@const style = attDef ? getRarityStyle(attDef.rarity) : null}
	{#if attDef && style}
		<div class="aspect-square size-8 rounded-lg">
			<div class="h-full w-full">
				<div
					class="flex h-full w-full flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.border}"
				>
					<div class="relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-surface">
						<div
							class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-60 blur-xl {style.glow}"
						></div>
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
		</div>
	{:else}
		<div class="aspect-square size-8 rounded-lg">
			<div class="h-full w-full">
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
		</div>
	{/if}
{/snippet}

{#snippet recycleItem(resDef: ItemDefinition, amount: number)}
	{@const style = getRarityStyle(resDef.rarity) || getRarityStyle('common')}

	<div class="size-10">
		<div
			class=" flex h-full w-full flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.border} size-10"
		>
			<div class="relative flex h-full w-full flex-col overflow-hidden rounded-[7px]">
				<div class="relative min-h-0 flex-1 items-center justify-center">
					<div
						class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-10 blur-xl {style.glow} "
					></div>

					<img
						src={resDef.image}
						alt="Loot"
						class="relative z-10 h-full w-full object-contain transition-transform"
					/>
				</div>
			</div>
		</div>
	</div>
{/snippet}
