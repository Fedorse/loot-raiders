<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import { getRarityStyle } from '$lib/config/rarity'; // Импортируем стили редкости

	const { augment } = getGameContext();
	const info = $derived(augment.info);
</script>

{#if info && !info.isMaxLevel}
	{@const isReady = info.canAfford}
	{@const requiredCount = info.upgradeAugment.materials.count}
	{@const currentCount = Math.min(info.costHave, requiredCount)}
	{@const progress = (currentCount / requiredCount) * 100}

	<!-- Получаем стили редкости для нужного ресурса -->
	{@const resStyle = getRarityStyle(info.costDef.rarity)}

	<button
		onclick={() => {
			if (isReady) augment.doUpgrade();
		}}
		class="group relative flex h-14 w-full items-center gap-4 overflow-hidden rounded-b-xl border-t border-white/5 bg-background/50 px-5 backdrop-blur-md transition-all duration-300 {isReady
			? 'cursor-pointer hover:bg-background/70'
			: 'cursor-default'}"
	>
		<!-- Progress line -->
		{#if !isReady}
			<div
				class="absolute bottom-0 left-0 h-[2px] bg-cyan-500/80 transition-all duration-500"
				style="width: {progress}%"
			></div>
		{/if}

		<!-- Ready glow -->
		{#if isReady}
			<div
				class="pointer-events-none absolute inset-0 animate-pulse bg-amber-500/5 mix-blend-screen"
			></div>
			<div
				class="absolute bottom-0 left-0 h-[2px] w-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
			></div>
		{/if}

		<!-- Level badge -->
		<div class="z-10 flex items-center gap-2">
			<div class="flex size-7 items-center justify-center rounded border border-white/5 bg-white/5">
				<img
					src={info.def.categoryIcon}
					alt="Augment"
					class="size-4 object-contain opacity-80 transition-all {isReady
						? 'brightness-150 hue-rotate-[-30deg] saturate-200 sepia'
						: ''}"
				/>
			</div>
			<div class="flex items-center gap-1.5">
				<span class="font-mono text-[10px] font-bold text-white/50">
					Lv.{info.level + 1}
				</span>
				<svg class="size-3 text-white/20" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
						clip-rule="evenodd"
					/>
				</svg>
				<span
					class="font-mono text-[11px] font-black {isReady ? 'text-amber-400' : 'text-cyan-400'}"
				>
					Lv.{info.level + 2}
				</span>
			</div>
		</div>

		<div class="z-10 h-4 w-[1px] bg-white/10"></div>

		<!-- УЛУЧШЕННЫЙ БЛОК РЕСУРСОВ -->
		<div class="z-10 flex items-center gap-2.5">
			<!-- Иконка ресурса с фоном редкости -->
			<div
				class="flex size-9 flex-col overflow-hidden rounded bg-linear-to-tr p-[1px] {isReady
					? 'border border-amber-500/50 bg-amber-500/20'
					: resStyle.bg}"
			>
				<div class="flex size-full items-center justify-center rounded-sm bg-black/60">
					<img src={info.costDef.image} alt={info.costDef.name} class="size-6 object-contain" />
				</div>
			</div>

			<!-- Название и цифры в столбик -->
			<div class="flex flex-col items-start justify-center leading-none">
				<span
					class="mb-1 max-w-[100px] truncate text-[9px] font-bold tracking-wider text-white/50 uppercase"
					title={info.costDef.name}
				>
					{info.costDef.name}
				</span>
				<span class="flex items-baseline gap-px font-mono tabular-nums">
					<span class="text-sm font-black {isReady ? 'text-amber-400' : 'text-white'}">
						{currentCount}
					</span>
					<span class="text-[10px] font-bold text-white/40">/{requiredCount}</span>
				</span>
			</div>
		</div>

		<div class="z-10 h-4 w-[1px] bg-white/10"></div>

		<!-- Bonus preview -->
		<div class="z-10 flex flex-col justify-center leading-none">
			<span class="mb-1 text-[8px] font-bold tracking-widest text-white/30 uppercase"
				>Upgrade Bonus</span
			>
			<span class="text-[10px] font-bold text-emerald-400/90 uppercase">
				{info.upgradeAugment.bonus}
			</span>
		</div>

		<!-- Spacer -->
		<div class="flex-1"></div>

		<!-- Action button -->
		<div class="z-10 w-[85px] shrink-0">
			{#if isReady}
				<div
					class="flex h-7 w-full items-center justify-center rounded bg-amber-500 font-mono text-[10px] font-black tracking-widest text-black uppercase shadow-[0_0_10px_rgba(245,158,11,0.2)] transition-all group-hover:bg-amber-400 group-active:scale-95"
				>
					Install
				</div>
			{:else}
				<div
					class="flex h-7 w-full items-center justify-center rounded border border-dashed border-white/20 bg-white/5"
				>
					<span class="font-mono text-[9px] font-bold tracking-widest text-white/30 uppercase">
						upgrade
					</span>
				</div>
			{/if}
		</div>
	</button>
{/if}
