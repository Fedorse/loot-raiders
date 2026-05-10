<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import { getDef } from '$lib/config/items';
	import { getStorageConfig } from '$lib/config/storages';
	import { clickOutside } from '$lib/actions/actions';

	const { overlay, inventory } = getGameContext();
	const menuData = $derived(overlay.contextMenu);

	const close = () => overlay.closeContextMenu();
	const def = $derived(menuData ? getDef(menuData.slot.item.defId) : null);
</script>

{#if menuData && def}
	{@const moveTargetId =
		menuData.slot.location.type === 'slot'
			? getStorageConfig(menuData.slot.location.storageId)?.quickMoveTarget
			: undefined}

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		{@attach clickOutside(close)}
		class="fixed z-[100] flex w-32 flex-col rounded-sm border border-modal-border bg-modal py-1 shadow-xl md:w-36 md:py-1.5 lg:w-40 xl:w-44 2xl:w-48 3xl:w-56"
		style="top: {menuData.y}px; left: {menuData.x}px;"
		oncontextmenu={(e) => e.preventDefault()}
	>
		<div
			class="border-b border-modal-border px-2 pt-0.5 pb-1.5 text-[9px] font-bold tracking-wider text-muted uppercase md:px-2.5 md:pt-1 md:pb-2 md:text-[10px] lg:px-3 lg:text-[11px] 2xl:text-xs 3xl:px-3.5 3xl:text-[13px]"
		>
			{def.name}
		</div>

		{#if moveTargetId}
			<button
				class="flex w-full px-2 py-1 text-left text-[10px] font-medium text-modal-foreground hover:bg-accent md:px-2.5 md:py-1.5 md:text-[11px] lg:px-3 lg:text-xs 2xl:text-[13px] 3xl:px-3.5 3xl:text-sm"
				onclick={() => {
					inventory.quickMove(menuData.slot.location);
					close();
				}}
			>
				Move to {moveTargetId === 'backpack' ? 'backpack' : 'loot'}
			</button>
		{/if}

		{#if def.maxStack && menuData.slot.item.count > 1}
			<button
				class="flex w-full px-2 py-1 text-left text-[10px] font-medium text-modal-foreground hover:bg-accent md:px-2.5 md:py-1.5 md:text-[11px] lg:px-3 lg:text-xs 2xl:text-[13px] 3xl:px-3.5 3xl:text-sm"
				onclick={() => {
					inventory.splitStack(menuData.slot.location);
					close();
				}}
			>
				Split Stack
			</button>
		{/if}

		<div class="my-0.5 border-t border-modal-border md:my-1"></div>

		<button
			class="flex w-full px-2 py-1 text-left text-[10px] font-medium text-modal-foreground hover:bg-accent md:px-2.5 md:py-1.5 md:text-[11px] lg:px-3 lg:text-xs 2xl:text-[13px] 3xl:px-3.5 3xl:text-sm"
			onclick={() => {
				inventory.removeItem(menuData.slot.location);
				close();
			}}
		>
			Drop
		</button>

		{#if def.recycling?.length}
			<button
				class="flex w-full px-2 py-1 text-left text-[10px] font-medium text-modal-foreground hover:bg-accent-alt md:px-2.5 md:py-1.5 md:text-[11px] lg:px-3 lg:text-xs 2xl:text-[13px] 3xl:px-3.5 3xl:text-sm"
				onclick={() => {
					overlay.openRecycleModal(menuData.slot.item, menuData.slot.location);
					close();
				}}
			>
				Recycle
			</button>
		{/if}
	</div>
{/if}
