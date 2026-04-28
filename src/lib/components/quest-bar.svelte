<script lang="ts">
	import { getRarityStyle } from '$lib/config/rarity';
	import { STAGES } from '$lib/config/stages';
	import type { ItemDefinition, RarityStyle } from '$lib/types';
	import { getGameContext } from '$lib/store/game.svelte';
	import type { QuestItem } from '$lib/store/quest.svelte';

	const { gameLoop, quest } = getGameContext();
</script>

{#snippet itemImage(def: ItemDefinition, style: RarityStyle, matched: boolean)}
	<div class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-20 blur-xl {style.glow}"></div>
	<img
		src={def.image}
		alt={def.name}
		class="relative z-10 h-full w-full object-contain transition-all duration-500"
		class:grayscale={matched}
		class:opacity-40={matched}
	/>
{/snippet}

{#snippet progressBadge(item: QuestItem)}
	{@const collected = Math.min(item.count, quest.getCollected(item.defId))}
	<div
		class="absolute top-0 right-0 z-30 flex min-w-11 items-center justify-center rounded-bl-md border-b border-l px-2 py-1 {item.matched
			? 'bg-emerald-900/60'
			: 'bg-black/40'}"
		style="border-color: color-mix(in srgb, var(--rarity-{item.def
			.rarity}) 50%, transparent); box-shadow: 0 0 10px color-mix(in srgb, var(--rarity-{item.def
			.rarity}) 50%, transparent)"
	>
		<span class="flex items-baseline gap-px font-mono leading-none tabular-nums">
			<span
				class="text-sm font-black"
				class:text-emerald-400={item.matched}
				class:text-white={!item.matched}
			>
				{item.matched ? item.count : collected}
			</span>
			<span class="text-[10px] font-bold text-white/40">/{item.count}</span>
		</span>
	</div>
{/snippet}

{#snippet progressBar(item: QuestItem)}
	{@const collected = Math.min(item.count, quest.getCollected(item.defId))}
	{@const pct = item.matched ? 100 : (collected / item.count) * 100}
	{#if collected}
		<div class="absolute inset-x-0 bottom-0 z-20 h-1 bg-white/5">
			<div
				class="h-full transition-all duration-300 {item.matched
					? 'bg-emerald-400'
					: pct > 0
						? 'bg-cyan-400'
						: ''}"
				style="width: {pct}%"
			></div>
		</div>
	{/if}
{/snippet}

{#snippet matchedOverlay()}
	<div
		class="absolute inset-0 z-20 flex items-center justify-center rounded-[7px] bg-emerald-950/40"
	>
		<div class="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1">
			<svg class="size-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
					clip-rule="evenodd"
				/>
			</svg>
			<span class="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">Done</span>
		</div>
	</div>
{/snippet}

<div class="relative z-10 flex w-56 flex-col rounded-t-lg rounded-b-none">
	{#if gameLoop.status !== 'idle'}
		<div class="flex flex-col gap-1.5 rounded-t-xl bg-background/50 px-5 py-2 backdrop-blur-md">
			<div class="flex items-center justify-between">
				<span class="text-[10px] font-medium text-white/50 uppercase">{quest.stageDef.name}</span>
			</div>
			<div class="mt-0.5 flex w-full gap-1">
				{#each STAGES as _, i (i)}
					<div
						class="h-1 flex-1 overflow-hidden rounded-full bg-black/20 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
					>
						<div
							class="h-full w-full transition-all duration-500 {i < quest.currentStage
								? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
								: i === quest.currentStage
									? 'animate-pulse bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]'
									: 'bg-white/20'}"
						></div>
					</div>
				{/each}
			</div>
		</div>

		<div class="flex flex-col gap-2 overflow-hidden bg-background/50 px-3 py-4 backdrop-blur-md">
			{#each quest.items as item (item.id)}
				{@const style = getRarityStyle(item.def.rarity)}
				{@const showAsWeaponLayout =
					item.def.type === 'weapon' && !!item.def.attachmentSlots?.length}

				<div
					class="flex w-full justify-center transition-opacity duration-500"
					class:opacity-60={item.matched}
				>
					{#if showAsWeaponLayout}
						<div
							class="flex h-[120px] w-52 flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {item.matched
								? 'border border-emerald-500/30'
								: style.border}"
						>
							<div class="relative flex flex-col overflow-hidden rounded-[7px] bg-surface">
								{#if item.matched}
									{@render matchedOverlay()}
								{/if}
								<div class="relative flex h-16 items-center justify-center">
									{@render itemImage(item.def, style, item.matched)}
									{@render progressBadge(item)}
								</div>
								<div class="z-10 flex items-center justify-center gap-0.5 px-1 py-3">
									{#each item.def.attachmentSlots as slot, i (slot.type + i)}
										<div
											class="flex size-9 items-center justify-center rounded border border-white/15"
										>
											<img
												src={slot.placeholder}
												alt={slot.type}
												class="size-7 object-contain opacity-30"
											/>
										</div>
									{/each}
								</div>
								{@render progressBar(item)}
							</div>
						</div>
					{:else}
						<div
							class="flex h-24 w-52 flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {item.matched
								? 'border border-emerald-500/30'
								: style.border}"
						>
							<div class="relative flex h-full w-full overflow-hidden rounded-[7px] bg-surface">
								{#if item.matched}
									{@render matchedOverlay()}
								{/if}
								{@render itemImage(item.def, style, item.matched)}
								{@render progressBadge(item)}
								{@render progressBar(item)}
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
		<div
			class="flex items-center justify-between rounded-b-lg bg-background/50 px-5 py-2 backdrop-blur-md"
		>
			<span class="text-[10px] font-medium text-white/50 uppercase">
				Stage {quest.currentStage + 1}
			</span>
			<div class="flex items-center gap-1.5">
				<span class="text-[9px] font-medium tracking-wider text-white/20 uppercase">Progress</span>
				<span class="flex items-baseline gap-px font-mono tabular-nums">
					<span
						class="text-[10px] font-bold transition-colors duration-300 {quest.stageCompleted
							? 'text-emerald-500/80 drop-shadow-[0_0_2px_rgba(16,185,129,0.5)]'
							: 'text-white/40'}"
					>
						{quest.completed}
					</span>
					<span class="text-[9px] font-bold text-white/20">/{quest.total}</span>
				</span>
			</div>
		</div>
	{/if}
</div>
