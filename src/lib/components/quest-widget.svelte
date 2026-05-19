<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import WidgetArrow from '$lib/ui-icon/widget-arrow.svelte';

	type Props = {
		onclick?: () => void;
	};
	let { onclick }: Props = $props();
	const { quest } = getGameContext();
</script>

{#if quest.items.length}
	<button
		type="button"
		{onclick}
		aria-label="Open quests"
		class="group flex w-full items-center gap-2 rounded-2xl bg-[#0c101c]/80 px-2 py-1.5 ring-1 ring-white/5 backdrop-blur-md transition-transform active:scale-[0.98]"
	>
		<img
			src="/assets/ui/Icon_Quest.webp"
			alt=""
			aria-hidden="true"
			class="size-7 shrink-0 object-contain"
		/>

		<div class="flex flex-1 flex-col items-start overflow-hidden leading-tight">
			<div class="flex items-baseline gap-1">
				<span class="text-[9px] font-bold tracking-wider text-white/80 uppercase">Quests</span>
				<span
					class="font-mono text-[10px] font-black tabular-nums {quest.stageCompleted
						? 'text-emerald-400'
						: 'text-cyan-400'}"
				>
					{quest.completed}<span class="text-[8px] font-bold text-white/30">/{quest.total}</span>
				</span>
			</div>
			<span class="w-full truncate text-left text-[10px] font-medium text-white/50">
				{quest.stageDef.name}
			</span>
		</div>

		<div class="flex shrink-0 items-center gap-1 text-white/40">
			<span class="text-[8px] font-bold tracking-wider uppercase">View</span>
			<WidgetArrow />
		</div>
	</button>
{/if}
