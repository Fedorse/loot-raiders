<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import { getRarityStyle } from '$lib/config/rarity';
	import { ITEM_DB } from '$lib/config/items';

	const { augment } = getGameContext();
	const info = $derived(augment.info);
</script>

{#if info && !info.isMaxLevel}
	{@const isReady = info.canAfford}
	{@const requiredCount = info.upgradeAugment.materials.count}
	{@const currentCount = Math.min(info.costHave, requiredCount)}
	{@const progress = (currentCount / requiredCount) * 100}
	{@const resStyle = getRarityStyle(info.costDef.rarity)}

	<div
		class="group relative flex min-h-16 w-full overflow-hidden rounded-b-lg border-t border-white/10 bg-background/50 text-left backdrop-blur-md"
	>
		<!-- soft progress background -->
		<!-- <div class="absolute inset-0"></div> -->

		<div
			class="absolute inset-y-0 left-0 bg-cyan-400/5 transition-all duration-500"
			style="width: {progress}%"
		></div>

		<!-- bottom accent -->
		<div
			class="absolute bottom-0 left-0 h-[2px] bg-cyan-400/70 transition-all duration-500"
			style="width: {progress}%"
		></div>

		<div class="relative z-10 flex w-full items-center gap-4 px-4">
			<div class="flex min-w-0 flex-1 items-center gap-3">
				<div class="flex size-10 items-center justify-center rounded-lg border border-white/10">
					<img src={info.def.categoryIcon} alt="Augment" class="size-6 object-contain opacity-80" />
				</div>

				<div class="min-w-0">
					<div class="mb-1 flex items-center gap-2">
						<!-- <span class="h-1 w-1 rounded-full bg-white/20"></span> -->

						<div class="flex items-center gap-1 font-mono">
							<span class="text-[10px] font-bold text-white/45">Lv.{info.level + 1}</span>
							<span class="text-[10px] text-white/25">→</span>
							<span class="text-[11px] font-black text-cyan-300">
								Lv.{info.level + 2}
							</span>
						</div>
					</div>

					<div class="flex items-center gap-2 text-[11px] font-semibold text-emerald-300/90">
						<span>{info.upgradeAugment.bonus}</span>
					</div>
				</div>
			</div>

			<!-- divider -->
			<div class="h-9 w-px shrink-0 bg-white/10"></div>

			<!-- required resource -->
			<div class="flex w-[190px] shrink-0 items-center gap-3">
				<div
					class="relative flex size-10 shrink-0 overflow-hidden rounded-lg bg-linear-to-tr p-[1px]"
				>
					<div class="flex size-full items-center justify-center rounded-[7px] bg-black/70">
						<div
							class="absolute bottom-0 left-0 size-7 rounded-full opacity-20 blur-md {resStyle.glow}"
						></div>

						<img
							src={info.costDef.image}
							alt={info.costDef.name}
							class="relative z-10 size-7 object-contain"
						/>
					</div>
				</div>

				<div class="min-w-0">
					<div
						class="mb-1 max-w-[120px] truncate text-[9px] font-bold tracking-wider text-white/40 uppercase"
						title={info.costDef.name}
					>
						{info.costDef.name}
					</div>

					<div class="flex items-baseline gap-1 font-mono tabular-nums">
						<span class="text-sm font-black text-white">
							{currentCount}
						</span>
						<span class="text-[10px] font-bold text-white/35">/ {requiredCount}</span>
					</div>
				</div>
			</div>

			<!-- action -->
			<div class="w-24 shrink-0">
				<button
					disabled={!isReady}
					onclick={() => augment.doUpgrade()}
					class="flex h-8 w-full items-center justify-center rounded-md font-mono text-[10px] font-black tracking-widest uppercase transition-all duration-200
						{isReady
						? 'cursor-pointer bg-white/90 text-black hover:bg-white active:scale-95'
						: 'cursor-not-allowed border border-dashed border-white/15 bg-white/[0.03] text-white/30'}"
				>
					Upgrade
				</button>
			</div>
		</div>
	</div>
{/if}
