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
	{@const def = getDef(menu.slot.item.defId)}
	{@const moveTargetId =
		menu.slot.location.type === 'container'
			? getStorageConfig(menu.slot.location.storageId)?.quickMoveTarget
			: undefined}

	<!-- <div class="fixed inset-0 z-[9998]" oncontextmenu={(e) => e.preventDefault()}></div> -->

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
					inventory.quickMove(menu.slot.location);
					close();
				}}
			>
				Move to {moveTargetId === 'backpack' ? 'backpack' : 'loot'}
			</button>
		{/if}

		{#if def.maxStack && menu.slot.item.count > 1}
			<button
				class="flex w-full px-3 py-1.5 text-left text-sm font-medium text-[#1a1a1a] hover:bg-[#ffab00]"
				onpointerdown={(e) => {
					e.stopPropagation();
					inventory.splitStack(menu.slot.location);
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
				inventory.removeItem(menu.slot.location);
				close();
			}}
		>
			Remove
		</button>

		{#if def.recycling?.length}
			<button
				class="flex w-full px-3 py-1.5 text-left text-sm font-medium text-[#1a1a1a] hover:bg-[#e69a00]"
				onpointerdown={(e) => {
					e.stopPropagation();
					overlay.openRecycleModal(menu.slot.item, menu.slot.location);
					close();
				}}
			>
				Recycle
			</button>
		{/if}
	</div>
{/if}
