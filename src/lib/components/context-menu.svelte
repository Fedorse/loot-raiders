<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import { getDef } from '$lib/config/items';
	import { getStorageConfig } from '$lib/config/storages';

	const { overlay, inventory } = getGameContext();
	const menu = $derived(overlay.contextMenu);

	const close = () => overlay.closeContextMenu();
</script>

<svelte:window
	onpointerdown={(e) => {
		if (menu && e.button === 0) close();
	}}
/>

{#if menu}
	{@const def = getDef(menu.storedItem.item.defId)}
	{@const moveTargetId = getStorageConfig(menu.storedItem.storage.storageId)?.quickMoveTarget}

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- <div class="fixed inset-0 z-[9998]" oncontextmenu={(e) => e.preventDefault()}></div> -->

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed z-[9999] flex w-48 flex-col rounded-sm border border-[#d2ccbc] bg-[#F3EFE0] py-1.5 shadow-xl"
		style="top: {menu.y}px; left: {menu.x}px;"
		oncontextmenu={(e) => e.preventDefault()}
	>
		<div
			class="border-b border-[#d2ccbc] px-3 pb-1 text-xs font-bold tracking-wider text-[#8c8c8c] uppercase"
		>
			{def.name}
		</div>

		{#if moveTargetId}
			<button
				class="flex w-full px-3 py-1.5 text-left text-sm font-medium text-[#1a1a1a] hover:bg-[#ffab00]"
				onpointerdown={(e) => {
					e.stopPropagation();
					inventory.quickMove(menu.storedItem);
					close();
				}}
			>
				Move to {moveTargetId === 'backpack' ? 'backpack' : 'loot'}
			</button>
		{/if}

		{#if def.maxStack && menu.storedItem.item.count > 1}
			<button
				class="flex w-full px-3 py-1.5 text-left text-sm font-medium text-[#1a1a1a] hover:bg-[#ffab00]"
				onpointerdown={(e) => {
					e.stopPropagation();
					inventory.splitStack(menu.storedItem);
					close();
				}}
			>
				Split Stack
			</button>
		{/if}

		<div class="my-0.5 border-t border-[#d2ccbc]"></div>

		<button
			class="flex w-full px-3 py-1.5 text-left text-sm font-medium text-[#1a1a1a] hover:bg-[#ffab00]"
			onpointerdown={(e) => {
				e.stopPropagation();
				inventory.removeItem(menu.storedItem.storage);
				close();
			}}
		>
			Remove
		</button>

		<!-- TODO: recycle item -->
		{#if def.recycling?.length}
			<button
				class="flex w-full px-3 py-1.5 text-left text-sm font-medium text-[#1a1a1a] hover:bg-[#e69a00]"
				onpointerdown={(e) => {
					e.stopPropagation();
					close();
				}}
			>
				Recycle
			</button>
		{/if}
	</div>
{/if}
