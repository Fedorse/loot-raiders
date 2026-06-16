<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';

	const { audio } = getGameContext();

	const MAX = 2; // audio.volume range is 0..2
	const pct = $derived(Math.round((audio.volume / MAX) * 100));
	// заполнение трека: при муте — пусто
	const fill = $derived(audio.muted ? 0 : pct);
	// волны динамика: 0 = mute, 1 = тихо, 2 = громко
	const level = $derived(audio.muted ? 0 : audio.volume / MAX < 0.5 ? 1 : 2);

	function onInput(e: Event) {
		audio.setVolume(Number((e.currentTarget as HTMLInputElement).value));
		if (audio.muted) audio.toggleMute(); // снять mute при движении ползунка
	}
	function toggleMute() {
		audio.play('click');
		audio.toggleMute();
	}
</script>

<div
	class="group flex w-full items-center gap-3 rounded-md border border-[#2a2f4c] bg-[#0c101c]/80 px-5 py-3.5 transition-all 2xl:gap-3.5 2xl:px-6 2xl:py-4 3xl:gap-4 3xl:px-7 3xl:py-4.5 4xl:px-8 4xl:py-5 pointer-coarse:gap-2 pointer-coarse:px-3.5 pointer-coarse:py-2.5"
>
	<!-- speaker = mute toggle -->
	<button
		type="button"
		onclick={toggleMute}
		aria-label={audio.muted ? 'Unmute' : 'Mute'}
		aria-pressed={audio.muted}
		class="flex shrink-0 cursor-pointer items-center transition-colors {audio.muted
			? 'text-white/30'
			: 'text-primary'}"
	>
		<svg
			viewBox="0 0 24 24"
			class="h-5 w-5 2xl:h-[22px] 2xl:w-[22px] 3xl:h-6 3xl:w-6 4xl:h-7 4xl:w-7 pointer-coarse:h-4 pointer-coarse:w-4"
			fill="none"
			stroke="currentColor"
			stroke-width="1.7"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M4 9h3l4-3.5v13L7 15H4z" fill="currentColor" stroke="none" />
			{#if !audio.muted && level >= 1}
				<path d="M15.5 9.2a4 4 0 0 1 0 5.6" />
			{/if}
			{#if !audio.muted && level >= 2}
				<path d="M18 6.8a7.5 7.5 0 0 1 0 10.4" />
			{/if}
			{#if audio.muted}
				<path d="M16 9.5l4.5 5M20.5 9.5l-4.5 5" />
			{/if}
		</svg>
	</button>

	<span
		class="flex-1 text-[15px] font-semibold tracking-wider text-white/80 group-hover:text-white lg:text-base 2xl:text-[17px] 3xl:text-lg 4xl:text-xl pointer-coarse:text-sm"
		>Sound</span
	>

	<input
		type="range"
		min="0"
		max="2"
		step="0.1"
		value={audio.volume}
		oninput={onInput}
		aria-label="Volume"
		class="menu-slider h-2 w-32 cursor-pointer appearance-none 2xl:w-36 3xl:h-2.5 3xl:w-40 4xl:w-48 pointer-coarse:w-32"
		style="background: linear-gradient(to right, var(--color-primary) {fill}%, #404455 {fill}%);"
	/>

	<span
		class="w-10 text-right text-[13px] font-semibold tabular-nums 2xl:text-sm 3xl:w-12 3xl:text-[15px] 4xl:w-14 4xl:text-base pointer-coarse:w-8 pointer-coarse:text-[11px] {audio.muted
			? 'text-muted'
			: 'text-white/80'}">{audio.muted ? 'OFF' : `${pct}%`}</span
	>
</div>

<style>
	@reference "tailwindcss";

	.menu-slider {
		-webkit-appearance: none;
		appearance: none;
	}
	.menu-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 14px;
		height: 14px;
		background: #cfd3dd;
		cursor: pointer;
		border-radius: 0;
	}
	.menu-slider::-moz-range-thumb {
		width: 14px;
		height: 14px;
		background: #cfd3dd;
		border: none;
		border-radius: 0;
	}
</style>
