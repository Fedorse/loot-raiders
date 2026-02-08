<script lang="ts">
	import { droppable } from '$lib/attach/dnd';

	type Props = {
		storage?: string;
		position?: number;
		className: string;
		placeholder?: string;
	};

	let { storage, position, className = '', placeholder }: Props = $props();
</script>

<div
	class={className}
	{@attach droppable({ storage: storage ?? '', position: position ?? 0, item: null })}
>
	<div
		class="flex h-full w-full cursor-default items-center justify-center rounded-lg border border-white/20"
	>
		{#if placeholder}
			<img src={placeholder} alt="placeholder" class="w-full object-contain opacity-50" />
		{/if}
	</div>
</div>
