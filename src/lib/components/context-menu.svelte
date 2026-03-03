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
		menuData.slot.location.type === 'container'
			? getStorageConfig(menuData.slot.location.storageId)?.quickMoveTarget
			: undefined}

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		{@attach clickOutside(close)}
		class="fixed z-[100] flex w-48 flex-col rounded-sm border border-modal-border bg-modal py-1.5 shadow-xl"
		style="top: {menuData.y}px; left: {menuData.x}px;"
		oncontextmenu={(e) => e.preventDefault()}
	>
		<div
			class="border-b border-modal-border px-3 pt-1 pb-2 text-xs font-bold tracking-wider text-muted uppercase"
		>
			{def.name}
		</div>

		{#if moveTargetId}
			<button
				class="flex w-full px-3 py-1.5 text-left text-sm font-medium text-modal-foreground hover:bg-accent"
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
				class="flex w-full px-3 py-1.5 text-left text-sm font-medium text-modal-foreground hover:bg-accent"
				onclick={() => {
					inventory.splitStack(menuData.slot.location);
					close();
				}}
			>
				Split Stack
			</button>
		{/if}

		<div class="my-0.5 border-t border-modal-border"></div>

		<button
			class="flex w-full px-3 py-1.5 text-left text-sm font-medium text-modal-foreground hover:bg-accent"
			onclick={() => {
				inventory.removeItem(menuData.slot.location);
				close();
			}}
		>
			Remove
		</button>

		{#if def.recycling?.length}
			<button
				class="flex w-full px-3 py-1.5 text-left text-sm font-medium text-modal-foreground hover:bg-accent-alt"
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
