<script lang="ts">
	interface Props {
		tier: number;
		className?: string;
	}

	let { tier, className = 'size-4' }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1"
	stroke-linecap="round"
	stroke-linejoin="round"
	class={className}
>
	{#if tier === 1}
		<!-- I -->
		<path d="M12 5v14M9 5h6M9 19h6" />
	{:else if tier === 2}
		<!-- II -->
		<path d="M10 5v14M14 5v14M7 5h10M7 19h10" />
	{:else if tier === 3}
		<!-- III -->
		<path d="M9 5v14M15 5v14M12 5v14M6 5h12M6 19h12" />
	{:else if tier === 4}
		<!-- IV -->
		<path d="M12 5v14M9 5h6M9 19h6" />
		<path d="M14 5l4 14l4 -14" transform="translate(4, 0)" />
		<path d="M8 5v14M5 5h6M5 19h6" />
		<!-- I -->
		<path d="M14 5l4.5 14l4.5 -14" />
		<!-- V -->
	{:else if tier === 5}
		<!-- V -->
		<path d="M10 5l7 14l7-14" transform="translate(-5, 0)" />
		<!-- Centered V -->
		<path d="M6 5l6 14l6 -14" />
	{:else}
		<!-- Fallback (знак вопроса или просто цифра текстом) -->
		<text x="12" y="17" font-size="12" text-anchor="middle">{tier}</text>
	{/if}
</svg>
