<script lang="ts">
	interface Props {
		duration?: number;
		onscanned?: () => void;
		pause?: boolean;
	}

	let { duration = 3, onscanned, pause = false }: Props = $props();
</script>

<div
	class="erase-wipe"
	style="--duration: {duration}s; animation-play-state: {pause ? 'paused' : 'running'};"
></div>
<div
	class="erase-beam"
	style="--duration: {duration}s; animation-play-state: {pause ? 'paused' : 'running'};"
	onanimationend={onscanned}
></div>

<style>
	.erase-wipe {
		position: absolute;
		inset: 0;
		background: black;
		clip-path: inset(0 100% 0 0);
		animation: wipe var(--duration) ease-in forwards;
	}

	.erase-beam {
		position: absolute;
		inset: 0;
		transform: translateX(-100%);

		background: linear-gradient(
			to right,
			transparent 0%,
			rgba(192, 38, 211, 0) 10%,
			rgba(192, 38, 211, 0.6) 40%,
			rgba(34, 211, 238, 0.9) 75%,
			rgba(255, 255, 255, 1) 95%,
			transparent 100%
		);

		mix-blend-mode: screen;
		animation: sweep var(--duration) linear forwards;
	}

	@keyframes wipe {
		0% {
			clip-path: inset(0 100% 0 0);
		}
		100% {
			clip-path: inset(0 -5% 0 0);
		}
	}

	@keyframes sweep {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>
