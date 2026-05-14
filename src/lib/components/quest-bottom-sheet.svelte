<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { getRarityStyleTooltip } from '$lib/config/rarity';
	import { getGameContext } from '$lib/store/game.svelte';
	import { STAGES } from '$lib/config/stages';

	const { overlay, quest } = getGameContext();

	const progressPct = $derived(
		quest.total > 0 ? Math.min(100, (quest.completed / quest.total) * 100) : 0
	);

	let dragY = $state(0);
	let dragStartY = 0;
	let dragging = $state(false);
	const CLOSE_THRESHOLD = 100;

	function onPointerDown(e: PointerEvent) {
		dragStartY = e.clientY;
		dragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		const dy = e.clientY - dragStartY;
		dragY = Math.max(0, dy);
	}

	function onPointerUp(e: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		if (dragY > CLOSE_THRESHOLD) {
			overlay.closeQuestSheet();
		}
		dragY = 0;
	}
</script>

{#if overlay.questSheet}
	<button
		type="button"
		aria-label="Close quests"
		class="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm"
		onclick={() => overlay.closeQuestSheet()}
		transition:fade={{ duration: 200 }}
	></button>

	<div
		class="fixed inset-x-0 bottom-0 z-[121] flex flex-col rounded-t-2xl bg-[#0c101c]/95 pb-[env(safe-area-inset-bottom,12px)] shadow-[0_-8px_24px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur-md"
		style="transform: translateY({dragY}px); transition: transform {dragging
			? '0s'
			: '220ms'} cubic-bezier(0.2, 0.8, 0.2, 1);"
		transition:fly={{ y: 500, duration: 320, easing: quintOut }}
	>
		<button
			type="button"
			aria-label="Drag to close"
			class="flex w-full cursor-grab touch-none justify-center py-2.5 active:cursor-grabbing"
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			onpointercancel={onPointerUp}
		>
			<div class="h-1 w-10 rounded-full bg-white/30"></div>
		</button>

		<div class="flex items-center gap-2 px-4">
			<img
				src="/assets/ui/Icon_Quest.png"
				alt=""
				aria-hidden="true"
				class="size-5 shrink-0 object-contain"
			/>
			<span class="flex-1 text-[13px] font-bold tracking-wider text-white uppercase">Quests</span>
			<button
				type="button"
				aria-label="Close"
				class="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-transform active:scale-90"
				onclick={() => overlay.closeQuestSheet()}
			>
				<svg
					class="size-3.5 text-white/70"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			</button>
		</div>

		<div class="mt-3 px-4">
			<div class="mb-1.5 flex items-baseline justify-between">
				<div class="flex items-baseline gap-1.5 overflow-hidden">
					<span class="shrink-0 text-[9px] font-bold tracking-widest text-white/40 uppercase">
						Stage {quest.currentStage + 1}
					</span>
					<span class="truncate text-xs font-black tracking-wider text-white uppercase">
						{quest.stageDef.name}
					</span>
				</div>
				<span class="shrink-0 font-mono leading-none tabular-nums">
					<span
						class="text-sm font-black {quest.stageCompleted ? 'text-emerald-400' : 'text-cyan-400'}"
					>
						{quest.completed}
					</span>
					<span class="text-[10px] font-bold text-white/30">/{quest.total}</span>
				</span>
			</div>
			<div class="h-1 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/5">
				<div
					class="h-full transition-all duration-500 {quest.stageCompleted
						? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]'
						: 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]'}"
					style="width: {progressPct}%"
				></div>
			</div>
			<div class="mt-2 flex gap-1">
				{#each STAGES as _, i (i)}
					<div
						class="h-0.5 flex-1 overflow-hidden rounded-full bg-white/10 transition-colors {i <
						quest.currentStage
							? 'bg-emerald-400/70'
							: i === quest.currentStage
								? 'bg-cyan-400'
								: ''}"
					></div>
				{/each}
			</div>
		</div>

		<div
			class="mt-4 flex snap-x gap-2 overflow-x-auto px-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
		>
			{#each quest.items as item (item.id)}
				{@const style = getRarityStyleTooltip(item.def.rarity)}
				{@const collected = Math.min(item.count, quest.getCollected(item.defId))}
				{@const itemPct = item.matched ? 100 : (collected / item.count) * 100}
				<div class="flex w-[88px] shrink-0 snap-start flex-col items-center gap-1.5">
					<div
						class="relative w-full overflow-hidden rounded-xl bg-linear-to-tr p-[1.5px] {item.matched
							? 'bg-emerald-500/60'
							: style.bg}"
					>
						<div
							class="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[10px] {item.matched
								? 'bg-emerald-950/80'
								: 'bg-black/80'}"
						>
							<div
								class="absolute inset-0 opacity-30 blur-lg {item.matched
									? 'bg-emerald-400'
									: style.glow}"
							></div>

							<img
								src={item.def.image}
								alt={item.def.name}
								class="relative z-10 h-[70%] w-[70%] object-contain transition-all duration-500"
								class:grayscale={!collected && !item.matched}
								class:opacity-40={!collected && !item.matched}
							/>

							{#if item.matched}
								<div
									class="absolute inset-0 z-20 flex items-center justify-center bg-emerald-950/40"
								>
									<svg
										class="size-8 text-emerald-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
							{/if}

							<div class="absolute right-1 bottom-1 z-30">
								<span
									class="rounded-md bg-black/60 px-1.5 py-0.5 font-mono text-[9px] font-black tabular-nums ring-1 ring-white/10 {item.matched
										? 'text-emerald-300'
										: 'text-white'}"
								>
									{item.matched ? item.count : collected}<span class="text-white/40"
										>/{item.count}</span
									>
								</span>
							</div>
						</div>
					</div>

					<span
						class="w-full truncate px-0.5 text-center text-[10px] leading-tight font-semibold text-white/80"
						title={item.def.name}
					>
						{item.def.name}
					</span>

					<div class="h-0.5 w-full overflow-hidden rounded-full bg-white/10">
						<div
							class="h-full transition-all duration-300 {item.matched
								? 'bg-emerald-400'
								: 'bg-cyan-400'}"
							style="width: {itemPct}%"
						></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
