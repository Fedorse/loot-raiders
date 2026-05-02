<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import Arrow from '$lib/ui-icon/arrow.svelte';

	const { audio } = getGameContext();

	const BTN =
		'group flex w-full min-w-[200px] items-center rounded-md border border-[#2a2f4c] bg-[#0c101c]/80 px-2.5 py-2.5 transition-all hover:bg-[#1a2133] md:min-w-[240px] md:px-3 md:py-3 lg:min-w-[280px] lg:px-3.5 lg:py-3.5 2xl:min-w-[320px] 2xl:px-4 2xl:py-4 3xl:min-w-[380px] 3xl:px-5 3xl:py-5';
</script>

<div class={BTN}>
	<div class="flex w-full items-center justify-between gap-3">
		<span class="text-xs font-semibold tracking-wider text-white/80 group-hover:text-white md:text-sm lg:text-[15px] 2xl:text-md 3xl:text-lg"
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
			class="volume-slider h-[8px] w-28 cursor-pointer appearance-none bg-[#404455] disabled:cursor-not-allowed disabled:opacity-40 md:h-[9px] md:w-32 lg:w-36 2xl:h-[10px] 2xl:w-44 3xl:w-52"
		/>
		<span
			class="flex w-6 text-[10px] tracking-wide group-hover:text-white md:text-xs 2xl:w-8 2xl:text-sm 3xl:text-[15px] {audio.muted
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
	<span class="text-xs font-semibold tracking-wider text-white/80 group-hover:text-white md:text-sm lg:text-[15px] 2xl:text-md 3xl:text-lg">
		Sound
	</span>
	<div class="flex items-center gap-1">
		<span
			class="mr-1 w-6 text-right text-xs font-semibold tracking-wider text-white/80 uppercase hover:text-white md:text-sm 2xl:mr-2 2xl:w-8 2xl:text-md 3xl:text-lg"
		>
			{audio.muted ? 'Off' : 'On'}
		</span>
		<div class="flex h-4 w-4 md:h-5 md:w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7 items-center justify-center text-white">
			<Arrow />
		</div>
		<div class="flex h-4 w-4 md:h-5 md:w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7 rotate-180 items-center justify-center text-white">
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
