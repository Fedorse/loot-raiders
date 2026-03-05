<script lang="ts">
	import Shortcuts from '$lib/components/shortcuts.svelte';
	import { getGameContext } from '$lib/store/game.svelte';
	import { getStorageConfig } from '$lib/config/storages';
	import StorageGrid from '$lib/components/storage-grid.svelte';
	import LootboxMachine from '$lib/components/lootbox.svelte';
	import TetrisGrid from '$lib/components/tetris-grid.svelte';

	const { inventory } = getGameContext();

	const lootBackConfig = getStorageConfig('lootBack');
	const backpackConfig = getStorageConfig('backpack');
</script>

<div class="flex h-full w-full flex-col items-start gap-6 px-5 py-16">
	<div class="flex items-start justify-center gap-4">
		<!-- <div
			class="z-10 flex flex-col gap-4 rounded-lg bg-background/50 px-4 pt-4 pb-12 backdrop-blur-xs"
		>
			<div class="flex items-center gap-4">
				<h2 class="text-base font-bold uppercase">Loot raiders cashes</h2>
				{#if lootBackConfig}
					<span class="text-sm">{inventory.lootBack.length}/{lootBackConfig.size}</span>
				{/if}
			</div>
			<div class="text-sm uppercase">filter</div>
			<div class="grid grid-cols-4">
				<StorageGrid storageId="lootBack" class="aspect-square h-20 w-20" />
			</div>
		</div> -->
		<LootboxMachine />

		<div
			class="z-10 flex flex-col items-start gap-4 rounded-lg bg-background/50 px-4 py-4 backdrop-blur-xs"
		>
			<div class="flex items-center">
				<h2 class="text-base font-bold uppercase">loadout</h2>
			</div>
			<div class="flex h-full w-full justify-center gap-8">
				<div class="flex flex-col gap-4">
					<!-- <div class="text-sm uppercase">equipment</div> -->
					<div class="flex gap-4">
						<StorageGrid storageId="augment" class="h-20 w-[120px] " />
						<StorageGrid storageId="shield" class="h-20 w-[120px] " />
					</div>
					<StorageGrid storageId="weapon" class="h-44 w-64" />
				</div>

				<div class="flex flex-col gap-4">
					<div class="flex items-center gap-4">
						<!-- <div class="text-sm uppercase">backpack</div> -->
						<!-- {#if backpackConfig}
							<span class="text-sm">{inventory.backpack.length}/{backpackConfig.size}</span>
						{/if} -->
					</div>

					<div class="grid grid-cols-4">
						<StorageGrid storageId="backpack" class="aspect-square h-20 w-20" />
					</div>
				</div>
			</div>
		</div>
	</div>

	<Shortcuts />

	<div class="fixed right-5 top-16">
		<TetrisGrid />
	</div>
</div>

<style>
	@reference "tailwindcss";
</style>
