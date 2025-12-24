<script lang="ts">
	import LootItem from '$lib/components/loot-item.svelte';

	import item from '$lib/assets/loot_assets/ARC Motion Core.png';
	import item1 from '$lib/assets/loot_assets/Blue Gate Communication Tower Key.png';
	import item2 from '$lib/assets/loot_assets/Blue Gate Cellar Key.png';
	import item3 from '$lib/assets/loot_assets/Industrial Charger.png';
	import equipmentImg from '$lib/assets/looting-bag.png';
	import weaponImg from '$lib/assets/weapon-kettle.webp';

	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	const BACKPACK_SIZE = 20;
	const MAX_WEAPON_SLOTS = 2;

	let equipments = $state([
		{ type: 'equipment', id: 'eq-1', image: equipmentImg, count: 1, rare: 'epic' },
		{ type: 'placeholder', id: 'eq-2', image: '' }
	]);

	// let weapons = $state([
	// 	{ type: 'weapon', id: 'w-1', image: weaponImg, count: 1, rare: 'legendary' },
	// 	{ type: 'placeholder', id: 'w-2', image: '' }
	// ]);
	let weapons = $state([
		{ type: 'placeholder', id: 'w-p-1', image: '' },
		{ type: 'placeholder', id: 'w-p-2', image: '' }
	]);

	let items = $state([
		{ type: 'loot', id: 'l-1', image: item, count: 50, rare: 'common' },
		{ type: 'loot', id: 'l-2', image: item1, count: 3, rare: 'uncommon' },
		{ type: 'loot', id: 'l-3', image: item2, count: 1, rare: 'epic' },
		{ type: 'loot', id: 'l-4', image: item3, count: 50, rare: 'legendary' },
		{ type: 'loot', id: 'l-5', image: item3, count: 12, rare: 'rare' },
		...Array(15)
			.fill(0)
			.map((_, i) => ({ type: 'empty', id: `e-${i}` }))
	]);

	const flipDurationMs = 0;

	function handleBackpackConsider(e) {
		console.log('handleBackpackConsider', e);
		items = e.detail.items;
	}
	function handleBackpackFinalize(e) {
		console.log('handleBackpackFinalize', e);
		items = e.detail.items;
	}

	const handleWeaponConsider = (e) => {
		weapons = e.detail.items;
	};
	const handleWeaponFinalize = (e) => {
		const incomingItems = e.detail.items;

		const realItems = incomingItems.filter((i) => i.type !== 'placeholder');

		const cappedItems = realItems.slice(0, MAX_WEAPON_SLOTS);

		const missingCount = MAX_WEAPON_SLOTS - cappedItems.length;

		const newPlaceholders = Array(missingCount)
			.fill(0)
			.map(() => ({
				type: 'placeholder',
				id: `placeholder-${crypto.randomUUID()}`,
				image: ''
			}));

		weapons = [...cappedItems, ...newPlaceholders];
	};

	const handleEquipConsider = (e) => {
		console.log('handleEquipConsider', e);
		equipments = e.detail.items;
	};
	const handleEquipFinalize = (e) => {
		console.log('handleEquipFinalize', e);
		equipments = e.detail.items;
	};
</script>

<div class="flex h-full w-full items-start justify-center gap-8 bg-[#0f111a] pt-10">
	<div class="flex flex-col gap-4">
		<section
			class="grid w-[340px] grid-cols-2 gap-4"
			use:dndzone={{ items: equipments, flipDurationMs }}
			onconsider={(e) => handleEquipConsider(e)}
			onfinalize={(e) => handleEquipFinalize(e)}
		>
			{#each equipments as item (item.id)}
				<div class="aspect-video h-full w-full" animate:flip={{ duration: flipDurationMs }}>
					<LootItem {item} className="h-full w-full" />
				</div>
			{/each}
		</section>

		<section
			class="grid w-[340px] grid-cols-1 gap-4"
			use:dndzone={{ items: weapons, flipDurationMs }}
			onconsider={(e) => handleWeaponConsider(e)}
			onfinalize={(e) => handleWeaponFinalize(e)}
		>
			{#each weapons as item (item.id)}
				<div class="aspect-video h-full w-full" animate:flip={{ duration: flipDurationMs }}>
					<LootItem {item} className="h-full w-full" />
				</div>
			{/each}
		</section>
	</div>

	<section
		class="grid min-h-[400px] w-[400px] grid-cols-4 gap-2"
		use:dndzone={{ items, flipDurationMs }}
		onconsider={(e) => handleBackpackConsider(e)}
		onfinalize={(e) => handleBackpackFinalize(e)}
	>
		{#each items as item (item.id)}
			<div class="aspect-square" animate:flip={{ duration: flipDurationMs }}>
				<LootItem {item} className="h-full w-full" />
			</div>
		{/each}
	</section>
</div>
