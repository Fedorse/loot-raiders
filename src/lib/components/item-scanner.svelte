<script lang="ts">
	interface Props {
		duration?: number;
		onscanned?: () => void;
		pause?: boolean;
	}

	let { duration = 0.2, onscanned, pause = false }: Props = $props();
</script>

<div
	class="scanner-beam pointer-events-none absolute inset-0"
	style="--scan-duration: {duration}s; animation-play-state: {pause ? 'paused' : 'running'};"
	onanimationend={onscanned}
></div>

<style>
	.scanner-beam {
		transform: translateX(-100%);

		background: linear-gradient(
			to right,
			transparent 0%,
			rgba(192, 38, 211, 0) 10%,
			/* Начало шлейфа */ rgba(192, 38, 211, 0.6) 40%,
			/* Фиолетовый (Fuchsia) */ rgba(34, 211, 238, 0.9) 75%,
			/* Голубой (Cyan) */ rgba(255, 255, 255, 1) 95%,
			/* Белый пик */ transparent 100%
		);

		mix-blend-mode: screen;

		animation: scan-move var(--scan-duration) linear forwards;

		width: 100%;
		height: 100%;
	}

	@keyframes scan-move {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>
