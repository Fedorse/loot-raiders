<script lang="ts">
	import TetrisCell from './tetris-cell.svelte';
	import { getGameContext } from '$lib/store/game.svelte';

	const { tetris } = getGameContext();
</script>

<div class="flex flex-col gap-4 rounded-lg bg-background/50 px-4 py-4 backdrop-blur-xs">
	<div class="flex items-center justify-between">
		{#if tetris.phase === 'idle'}
			<button
				class="rounded bg-white/10 px-3 py-1 text-sm font-medium text-white uppercase transition-colors hover:bg-white/20"
				onclick={() => tetris.start()}
			>
				Start
			</button>
		{:else if tetris.phase === 'playing'}
			<button
				class="rounded bg-red-500/20 px-3 py-1 text-sm font-medium text-red-400 uppercase transition-colors hover:bg-red-500/30"
				onclick={() => {
					tetris.stop();
					tetris.phase = 'idle';
				}}
			>
				Stop
			</button>
		{:else if tetris.phase === 'gameover'}
			<button
				class="rounded bg-white/10 px-3 py-1 text-sm font-medium text-white uppercase transition-colors hover:bg-white/20"
				onclick={() => tetris.restart()}
			>
				Restart
			</button>
		{/if}
	</div>

	{#if tetris.phase === 'gameover'}
		<div class="text-center text-lg font-bold text-red-400 uppercase">Game Over</div>
	{/if}

	<div class="relative">
		<!-- Layer 1: background grid -->
		<div class="grid gap-1" style="grid-template-columns: repeat({tetris.config.cols}, 1fr)">
			{#each Array(tetris.config.cols * tetris.config.rows) as _}
				<div class="aspect-square w-14 rounded-md border border-white/20"></div>
			{/each}
		</div>

		<!-- Layer 2: items positioned on top -->
		<div
			class="absolute inset-0 grid gap-1"
			style="grid-template-columns: repeat({tetris.config.cols}, 1fr); grid-template-rows: repeat({tetris.config.rows}, 1fr)"
		>
			{#each tetris.groups as group (group.groupId)}
				<div
					style="grid-column: {group.col + 1} / span {group.spanCols}; grid-row: {group.row + 1} / span {group.spanRows}"
				>
					<TetrisCell {group} />
				</div>
			{/each}
		</div>
	</div>
</div>
