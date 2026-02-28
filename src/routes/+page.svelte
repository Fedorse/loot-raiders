<script lang="ts">
	import DragLayer from '$lib/components/drag-layer.svelte';
	import ContextMenu from '$lib/components/context-menu.svelte';
	import TooltipOverlay from '$lib/components/tooltip-overlay.svelte';
	import RecycleModal from '$lib/components/recycle-modal.svelte';
	import DebugPanel from '$lib/components/debug-panel.svelte';
	import Shortcuts from '$lib/components/shortcuts.svelte';
	import { initGame } from '$lib/store/game.svelte';
	import { getStorageConfig } from '$lib/config/storages';
	import StorageGrid from '$lib/components/storage-grid.svelte';

	const game = initGame();
	const { inventory, overlay, debug } = game;

	const lootBackConfig = getStorageConfig('lootBack');
	const backpackConfig = getStorageConfig('backpack');
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'd' || e.key === 'D') {
			const tag = (e.target as HTMLElement)?.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
			debug.toggle();
		}
	}}
/>

<div class="flex h-full w-full flex-col items-start gap-6 px-5 py-16">
	<div class="flex items-start justify-center gap-4">
		<div
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
		</div>
		<div
			class="z-10 flex flex-col items-start gap-4 rounded-lg bg-background/50 px-4 py-4 backdrop-blur-xs"
		>
			<div class="flex items-center">
				<h2 class="text-base font-bold uppercase">loadout</h2>
			</div>
			<div class="flex h-full w-full justify-center gap-8">
				<div class="flex flex-col gap-4">
					<div class="text-sm uppercase">equipment</div>
					<div class="flex gap-4">
						<StorageGrid storageId="augment" class="h-20 w-[120px] " />
						<StorageGrid storageId="shield" class="h-20 w-[120px] " />
					</div>
					<StorageGrid storageId="weapon" class="h-44 w-64" />
				</div>

				<div class="flex flex-col gap-4">
					<div class="flex items-center gap-4">
						<div class="text-sm uppercase">backpack</div>
						{#if backpackConfig}
							<span class="text-sm">{inventory.backpack.length}/{backpackConfig.size}</span>
						{/if}
					</div>

					<div class="grid grid-cols-4">
						<StorageGrid storageId="backpack" class="aspect-square h-20 w-20" />
					</div>
				</div>
			</div>
		</div>
	</div>

	<Shortcuts />
</div>

<DragLayer />
<ContextMenu />
<TooltipOverlay />

{#if overlay.recycleModal}
	{@const { item, location } = overlay.recycleModal}
	<RecycleModal
		{item}
		onClose={() => overlay.closeRecycleModal()}
		onConfirm={() => {
			inventory.recycleItem(location);
			overlay.closeRecycleModal();
		}}
	/>
{/if}

<DebugPanel />

<style>
	@reference "tailwindcss";
</style>
