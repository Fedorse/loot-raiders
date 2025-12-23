<script>
	import LootItem from '$lib/components/loot-item.svelte';
	let items = [
		{ type: 'loot', id: '3', rare: 'common', count: 500 },
		{ type: 'loot', id: '1', rare: 'uncommon', count: 3 },
		{ type: 'loot', id: '2', rare: 'epic', count: 1 },
		{ type: 'loot', id: '3', rare: 'legendary', count: 500 },
		{ type: 'loot', id: '5', rare: 'rare', count: 12 },
		{ type: 'empty', id: '4' },
		{ type: 'empty', id: '6' },
		{ type: 'empty', id: '7' },
		{ type: 'empty', id: '8' },
		{ type: 'empty', id: '9' },
		{ type: 'empty', id: '10' },
		{ type: 'empty', id: '11' },
		{ type: 'empty', id: '12' },
		{ type: 'empty', id: '13' },
		{ type: 'empty', id: '14' },
		{ type: 'empty', id: '15' },
		{ type: 'empty', id: '16' },
		{ type: 'empty', id: '17' },
		{ type: 'empty', id: '18' },
		{ type: 'empty', id: '19' }
	];
</script>

<div class="flex h-full w-full items-start justify-center gap-8 bg-[#0f111a] pt-10">
	<!-- <div class="flex flex-col gap-4">
		<div class="grid w-[340px] grid-cols-2 gap-4">
			<LootItem item={items[0]} className="h-full w-full aspect-video" />
			<LootItem item={items[0]} className="h-full w-full aspect-video" />
		</div>
		<div class="grid w-[340px] grid-cols-1 gap-4">
			<LootItem item={items[0]} className="h-full w-full aspect-video" />
			<LootItem item={items[0]} className="h-full w-full aspect-video" />
		</div>
	</div> -->

	<div class="grid w-[400px] grid-cols-4 gap-2">
		{#each items as item}
			<div class="">
				<LootItem {item} className="h-full w-full aspect-square" />
			</div>
		{/each}
	</div>
</div>
