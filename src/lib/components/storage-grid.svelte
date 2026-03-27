<script lang="ts">
	import Slot from '$lib/components/slot.svelte';
	import { getStorageConfig } from '$lib/config/storages';
	import type { StorageId } from '$lib/types';

	type Props = {
		storageId: StorageId;
		class?: string;
	};
	let { storageId, class: className = '' }: Props = $props();
	const config = getStorageConfig(storageId);
</script>

{#each Array.from({ length: config.size }, (__, i) => i) as index (index)}
	<Slot
		location={{ type: 'slot', storageId: config.name, index }}
		placeholder={config.placeholder}
		class={className}
	/>
{/each}
