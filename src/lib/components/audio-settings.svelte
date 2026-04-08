<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import Arrow from '$lib/ui-icon/arrow.svelte';

	const { audio } = getGameContext();

	const BTN =
		'group flex w-full min-w-[320px] items-center rounded-md border border-[#2a2f4c] bg-[#0c101c]/80 px-4 py-4  transition-all hover:bg-[#1a2133]';
</script>

<div class={BTN}>
	<div class="flex w-full items-center justify-between gap-3">
		<span class="text-md font-semibold tracking-wider text-white/80 group-hover:text-white"
			>Volume</span
		>

		<input
			type="range"
			min="0"
			max="2"
			step="0.1"
			value={audio.volume}
			oninput={(e) => audio.setVolume(Number(e.currentTarget.value))}
			disabled={audio.muted}
			class="volume-slider h-[10px] w-44 cursor-pointer appearance-none bg-[#404455] disabled:cursor-not-allowed disabled:opacity-40"
		/>
		<span
			class="flex w-8 text-sm tracking-wide group-hover:text-white {audio.muted
				? 'text-muted'
				: 'text-white/80'}"
		>
			{Math.round((audio.volume / 2) * 100)}%
		</span>
	</div>
</div>

<button
	class="{BTN} justify-between active:scale-[0.98]"
	onclick={() => {
		audio.play('click');
		audio.toggleMute();
	}}
>
	<span class="text-md font-semibold tracking-wider text-white/80 group-hover:text-white">
		Sound
	</span>
	<div class="flex items-center gap-1">
		<span
			class="text-md mr-2 w-8 text-right font-semibold tracking-wider text-white/80 uppercase hover:text-white"
		>
			{audio.muted ? 'Off' : 'On'}
		</span>
		<div class="flex h-6 w-6 items-center justify-center text-white">
			<Arrow />
		</div>
		<div class="flex h-6 w-6 rotate-180 items-center justify-center text-white">
			<Arrow />
		</div>
	</div>
</button>

<style>
	@reference "tailwindcss";

	.volume-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 12px;
		height: 10px;
		background: #9fa5b5;
		cursor: pointer;
		border-radius: 0;
	}

	.volume-slider::-moz-range-thumb {
		width: 12px;
		height: 10px;
		background: #9fa5b5;
		cursor: pointer;
		border-radius: 0;
		border: none;
	}

	.volume-slider:disabled::-webkit-slider-thumb {
		cursor: not-allowed;
		background: #5b6073;
	}

	.volume-slider:disabled::-moz-range-thumb {
		cursor: not-allowed;
		background: #5b6073;
	}
</style>
