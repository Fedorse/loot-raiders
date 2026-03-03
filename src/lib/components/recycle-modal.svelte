<script lang="ts">
	import { getDef } from '$lib/config/items';
	import ItemCard from '$lib/components/item-card.svelte';
	import type { InstanceItem } from '$lib/types';
	import { fade, scale } from 'svelte/transition';
	import { getGameContext } from '$lib/store/game.svelte';

	const { overlay, inventory } = getGameContext();
	const modalData = $derived(overlay.recycleModal);

	const def = $derived(modalData ? getDef(modalData.item.defId) : null);

	const resources = $derived(def?.recycling ?? []);
	const attachments = $derived(
		modalData?.item.attachments?.filter((a): a is InstanceItem => a !== null) ?? []
	);

	function handleClose() {
		overlay.closeRecycleModal();
	}

	function handleConfirm() {
		if (!modalData) return;
		inventory.recycleItem(modalData.location);
		overlay.closeRecycleModal();
	}
</script>

{#if modalData && def}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		onclick={handleClose}
	>
		<div
			class="flex w-[540px] flex-col overflow-hidden rounded-md shadow-2xl"
			transition:scale={{ duration: 200, start: 0.95 }}
			onclick={(e) => e.stopPropagation()}
		>
			<div class="bg-modal px-7 py-6 text-modal-foreground">
				<h1 class="mb-3 text-[28px] leading-none font-black tracking-tight uppercase">
					Recycle {def.name}
				</h1>

				<p class="mb-5 text-[15px] leading-snug font-medium text-modal-secondary-foreground">
					You have selected {modalData.item.count} item{modalData.item.count > 1 ? 's' : ''} to recycle.
					These are the resources you will get back:
				</p>

				<div class="flex min-h-[110px] flex-wrap gap-2.5 rounded bg-modal-secondary p-3">
					{#each def.recycling as res (res.itemId)}
						<ItemCard
							item={{
								uid: res.itemId,
								defId: res.itemId,
								count: res.amount * modalData.item.count
							}}
							selected={false}
							className="h-[90px] w-[90px]"
							readonly={true}
						/>
					{/each}

					{#each attachments as att (att.uid)}
						<ItemCard item={att} selected={false} className="h-[90px] w-[90px] " readonly={true} />
					{/each}

					{#if resources.length === 0 && attachments.length === 0}
						<div class="flex w-full items-center justify-center text-sm font-bold text-black/30">
							No resources can be salvaged.
						</div>
					{/if}
				</div>
			</div>

			<div class="flex gap-4 bg-surface px-7 py-6">
				<button
					class="flex h-11 flex-1 items-center justify-center rounded-full bg-secondary text-[13px] font-bold tracking-widest text-white transition-colors hover:bg-secondary-hover active:scale-[0.98]"
					onclick={handleClose}
				>
					CANCEL
				</button>
				<button
					class="flex h-11 flex-1 items-center justify-center rounded-full bg-primary text-[13px] font-bold tracking-widest text-primary-foreground transition-colors hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
					disabled={resources.length === 0}
					onclick={handleConfirm}
				>
					RECYCLE
				</button>
			</div>
		</div>
	</div>
{/if}
