<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';

	const { audio } = getGameContext();

	let isFullscreen = $state(false);

	$effect(() => {
		const sync = () => (isFullscreen = !!document.fullscreenElement);
		sync();
		document.addEventListener('fullscreenchange', sync);
		return () => document.removeEventListener('fullscreenchange', sync);
	});

	$effect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key !== 'f' && e.key !== 'F') return;
			const tag = (e.target as HTMLElement)?.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
			e.preventDefault();
			toggle();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	function toggle() {
		audio.play('click');
		const el = document.documentElement as HTMLElement & {
			webkitRequestFullscreen?: () => Promise<void>;
		};
		if (document.fullscreenElement) {
			document.exitFullscreen?.().catch(() => {});
		} else if (el.requestFullscreen) {
			el.requestFullscreen().catch(() => {});
		} else if (el.webkitRequestFullscreen) {
			el.webkitRequestFullscreen();
		}
	}
</script>

<button
	type="button"
	onclick={toggle}
	aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
	class="group flex cursor-pointer items-center gap-1 transition-opacity hover:opacity-90 md:gap-1.5 lg:gap-2 2xl:gap-2.5"
>
	<kbd
		class="inline-flex min-w-7 items-center justify-center rounded-md bg-gradient-to-b from-kbd-from via-kbd-via to-kbd-to px-1.5 py-0.5 text-[7px] font-semibold text-kbd-text uppercase shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_1px_2px_rgba(0,0,0,0.2)] transition-transform group-active:scale-95 md:min-w-8 md:px-2 md:py-1 md:text-[8px] lg:min-w-9 lg:text-[9px] xl:text-[10px] 2xl:min-w-11 2xl:text-xs 3xl:min-w-12 3xl:text-[13px]"
	>
		F
	</kbd>
	<span
		class="text-[7px] font-semibold tracking-wider text-muted uppercase group-hover:text-white/90 md:text-[8px] lg:text-[9px] xl:text-[10px] 2xl:text-xs 3xl:text-[13px]"
	>
		{isFullscreen ? 'Exit' : 'Fullscreen'}
	</span>
</button>
