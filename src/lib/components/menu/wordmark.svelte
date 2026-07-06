<span
	class="lr-wordmark inline-flex flex-col items-center text-[70px] leading-[0.82] font-extrabold tracking-[0.02em] uppercase select-none md:text-[70px] lg:text-[75px] xl:text-[80px] 2xl:text-[85px] 3xl:text-[95px] 4xl:text-[105px] pointer-coarse:!text-[70px]"
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
		color: #d9d0c0;
		text-shadow:
			0 -1px 0 rgba(255, 250, 240, 0.18),
			0 1px 0 rgba(0, 0, 0, 0.55),
			0 2px 4px rgba(0, 0, 0, 0.6);
	}
	.lr-raiders {
		color: transparent;
		-webkit-text-stroke: 0.045em #c9bfae; /* bone */
		text-shadow:
			0 1px 0 rgba(0, 0, 0, 0.45),
			0 2px 5px rgba(224, 166, 58, 0.22); /* faint gold catch */
	}
</style>
