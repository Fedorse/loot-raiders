<script lang="ts">
	let { align = 'center' }: { align?: 'center' | 'start' } = $props();
</script>

<span
	class="lr-wordmark inline-flex flex-col text-[70px] leading-[0.82] font-extrabold tracking-[0.02em] uppercase select-none md:text-[70px] lg:text-[75px] xl:text-[80px] 2xl:text-[85px] 3xl:text-[95px] 4xl:text-[105px] pointer-coarse:!text-[70px] {align ===
	'start'
		? 'items-start'
		: 'items-center'}"
>
	<span class="lr-loot">LOOT</span>
	<span class="lr-raiders">RAIDERS</span>
</span>

<style>
	@reference "tailwindcss";

	.lr-wordmark {
		font-family: 'Saira Condensed', 'Saira', system-ui, sans-serif;
	}

	.lr-loot {
		color: #f4ecdd;
		text-shadow:
			0 1px 0 rgba(0, 0, 0, 0.45),
			0 2px 5px rgba(0, 0, 0, 0.5);
	}
	.lr-raiders {
		color: transparent;
		-webkit-text-stroke: 2.5px #f4ecdd;
	}
</style>
