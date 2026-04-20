<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import { getRarityStyleTooltip } from '$lib/config/rarity';
	import { clickOutside } from '$lib/actions/actions';
	import type { ItemDefinition } from '$lib/types';

	const PADDING = 6;
	const TAB_HEIGHT = 32;

	const { overlay, augment } = getGameContext();
	const panelData = $derived(overlay.augmentPanel);
	const info = $derived(augment.info);

	let panelRef = $state<HTMLElement>();
	let adjustedX = $state(0);
	let adjustedY = $state(0);

	$effect(() => {
		if (panelData && panelRef) {
			const rect = panelRef.getBoundingClientRect();
			const vh = window.innerHeight;

			adjustedX = panelData.x + PADDING;

			const rawY = panelData.y + rect.height > vh ? vh - rect.height - PADDING : panelData.y;
			adjustedY = Math.max(TAB_HEIGHT + 4, rawY);
		}
	});
</script>

{#if panelData && info}
	<div
		bind:this={panelRef}
		class="fixed z-[100] flex w-[340px] flex-col"
		style="top: {adjustedY}px; left: {adjustedX}px;"
		{@attach clickOutside(() => overlay.closeAugmentUpgrade())}
	>
		<div
			class="flex h-8 w-fit items-center gap-2 rounded-t-[6px] bg-modal-secondary px-4 font-bold text-modal-foreground"
		>
			<img src="/assets/ui/icon-actions.png" alt="actions" class="size-5 object-contain" />
			<span class="text-[13px] tracking-widest uppercase">Actions</span>
		</div>

		<div class="flex flex-col rounded-tr-[6px] rounded-b-[6px] bg-modal text-modal-foreground">
			<div class="flex flex-col px-5 py-3">
				<div class="mb-2 flex gap-0.5 text-xs font-bold text-black uppercase">
					<div class="px-1 {info.style.bg} flex items-center rounded-l-xs">
						<img src={info.def.categoryIcon} alt="category" class="size-5 object-contain brightness-0" />
					</div>
					<div class="flex items-center px-1 {info.style.bg}">
						Lv. {info.level + 1}
					</div>
					<div class="flex items-center rounded-r-xs px-1 {info.style.bg}">
						{info.def.rarity}
					</div>
				</div>

				<h1 class="mb-2 text-xl leading-none font-black tracking-tight uppercase">
					{info.def.name}
				</h1>

				{#if info.def.description}
					<p class="mb-2 text-sm leading-snug font-medium text-modal-secondary-foreground">
						{info.def.description}
					</p>
				{/if}

				{#if info.isMaxLevel}
					<div
						class="flex items-center justify-center border-b border-modal-foreground/10 px-1.5 pt-2 pb-2"
					>
						<span class="text-sm font-bold tracking-widest text-cyan-400 uppercase">
							Max Level
						</span>
					</div>
				{:else}
					<div class="flex flex-col">
						<span class="mb-2 pb-1 text-xs font-bold text-modal-foreground uppercase">
							Upgrade To
						</span>
						<div
							class="flex items-center gap-3 border-t border-b border-modal-foreground/10 bg-modal-secondary/40 py-2"
						>
							{@render itemTile(info.nextDef, info.nextStyle.border, info.nextStyle.glow)}
							<div class="flex flex-col">
								<span class="text-sm font-bold text-modal-foreground">
									{info.nextDef.name}
								</span>
							</div>
						</div>
					</div>

					<!-- inventory layout preview -->
					<div class="mt-3 flex gap-1.5">
						<!-- left: equip slots -->
						<div class="flex flex-col gap-1">
							<div class="flex gap-1">
								<div
									class="flex size-13 items-center justify-center rounded border border-modal-foreground/20"
								>
									<img
										src="/assets/ui/placeholder/augment_placeholder.png"
										alt="augment"
										class="size-8 object-contain"
									/>
								</div>
								<div
									class="flex size-13 items-center justify-center rounded border border-modal-foreground/20"
								>
									<img
										src="/assets/ui/placeholder/shield_placeholder.png"
										alt="shield"
										class="size-8 object-contain"
									/>
								</div>
							</div>
							<div
								class="flex h-11 items-center justify-center rounded border border-modal-foreground/20"
							>
								<img
									src="/assets/ui/placeholder/placeholder_weapon.png"
									alt="weapon"
									class="h-8 object-contain"
								/>
							</div>
							<div
								class="flex h-11 items-center justify-center rounded border border-modal-foreground/20"
							>
								<img
									src="/assets/ui/placeholder/placeholder_weapon.png"
									alt="weapon"
									class="h-8 object-contain"
								/>
							</div>
						</div>
						<!-- right: backpack -->
						<div class="flex flex-1 items-center justify-center rounded border border-black/20">
							<div class="flex items-center gap-1.5">
								<svg class="size-5 text-black" viewBox="0 0 16 16" fill="currentColor">
									<rect x="0" y="0" width="4" height="4" rx="0.5" />
									<rect x="6" y="0" width="4" height="4" rx="0.5" />
									<rect x="12" y="0" width="4" height="4" rx="0.5" />
									<rect x="0" y="6" width="4" height="4" rx="0.5" />
									<rect x="6" y="6" width="4" height="4" rx="0.5" />
									<rect x="12" y="6" width="4" height="4" rx="0.5" />
									<rect x="0" y="12" width="4" height="4" rx="0.5" />
									<rect x="6" y="12" width="4" height="4" rx="0.5" />
									<rect x="12" y="12" width="4" height="4" rx="0.5" />
								</svg>
								<span class="text-sm font-bold">
									×{info.futureBackpackSlots}
								</span>
							</div>
						</div>
					</div>
					<!-- required resources -->
					<div class="mt-3 flex flex-col">
						<span class="text-xs font-bold text-modal-foreground uppercase">
							Required Resources
						</span>
						<div class="mt-1 border-t border-modal-foreground/10">
							<div class="flex items-center gap-3 border-b border-modal-foreground/10 py-2">
								{@render resourceTile(info.costDef)}
								<div class="flex flex-col">
									<span class="text-sm font-bold text-modal-foreground">
										{info.costDef.name}
									</span>
									<span class="flex items-baseline gap-px font-mono leading-none tabular-nums">
										<span
											class="text-sm font-black {info.canAfford
												? 'text-cyan-400'
												: 'text-black/50'}"
										>
											{info.costHave}
										</span>
										<span class="text-[10px] font-bold text-black">/{info.upgradeAugment.materials.count}</span>
									</span>
								</div>
							</div>
						</div>
					</div>

					<button
						disabled={!info.canAfford}
						onclick={() => augment.doUpgrade()}
						class="mt-4 w-full rounded-md px-4 py-2 text-sm font-bold uppercase {info.canAfford
							? 'cursor-pointer bg-yellow-500 text-white hover:bg-yellow-600'
							: 'cursor-not-allowed bg-modal-secondary text-modal-secondary-foreground opacity-50'}"
					>
						Upgrade
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

{#snippet itemTile(tileDef: ItemDefinition, border: string, glow: string)}
	<div class="aspect-square size-10 rounded-lg">
		<div
			class="flex h-full w-full flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {border}"
		>
			<div class="relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-surface">
				<div class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] blur-xl {glow}"></div>
				<div class="relative min-h-0 flex-1 items-center justify-center">
					<img
						src={tileDef.image}
						alt={tileDef.name}
						class="relative z-10 h-full w-full scale-105 object-contain"
					/>
				</div>
			</div>
		</div>
	</div>
{/snippet}

{#snippet resourceTile(resDef: ItemDefinition)}
	{@const resStyle = getRarityStyleTooltip(resDef.rarity)}
	<div class="size-8">
		<div
			class="flex h-full w-full flex-col overflow-hidden rounded bg-linear-to-tr p-[1px] {resStyle.bg}"
		>
			<div class="relative flex h-full w-full flex-col overflow-hidden rounded-sm bg-black/80">
				<img
					src={resDef.image}
					alt={resDef.name}
					class="relative z-10 h-full w-full object-contain"
				/>
			</div>
		</div>
	</div>
{/snippet}
