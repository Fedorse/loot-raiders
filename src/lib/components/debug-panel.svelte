<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import { getDef } from '$lib/config/items';
	import { STORAGE_CONFIGS } from '$lib/config/storages';
	import { getDropActionType } from '$lib/inventory-validation';
	import { formatLocation } from '$lib/store/debug.svelte';
	import type { StorageId } from '$lib/types';

	const { inventory, interaction, debug, selection } = getGameContext();

	let openSections = $state({
		interaction: true,
		drag: true,
		hover: true,
		stats: false
	});

	const statusColors: Record<string, string> = {
		idle: 'bg-gray-500',
		pressing: 'bg-yellow-500',
		dragging: 'bg-green-500'
	};

	const actionColors: Record<string, string> = {
		move: 'bg-blue-600',
		stack: 'bg-green-600',
		swap: 'bg-purple-600',
		attach: 'bg-orange-600',
		quickMove: 'bg-cyan-600',
		split: 'bg-teal-600',
		remove: 'bg-red-600',
		recycle: 'bg-amber-600'
	};

	function shortUid(uid: string): string {
		return uid.slice(0, 8);
	}

	function getStorageItems(storageId: StorageId) {
		return inventory.items.filter(
			(i) => i.location.type === 'slot' && i.location.storageId === storageId
		);
	}

	const dropActionPreview = $derived.by(() => {
		if (!interaction.dragState || !interaction.hoveredSlot) return null;
		return getDropActionType(interaction.dragState, interaction.hoveredSlot);
	});
</script>

{#snippet sectionHeader(title: string, key: keyof typeof openSections)}
	<button
		class="flex w-full items-center gap-2 border-b border-white/10 px-3 py-1.5 text-left text-[11px] font-bold tracking-wider text-white/70 uppercase hover:text-white/90"
		onclick={() => (openSections[key] = !openSections[key])}
	>
		<span class="text-[9px]">{openSections[key] ? '▼' : '▶'}</span>
		{title}
	</button>
{/snippet}

{#snippet badge(text: string, color: string)}
	<span class="inline-block rounded px-1.5 py-0.5 text-[10px] font-bold text-white {color}">
		{text}
	</span>
{/snippet}

{#snippet row(label: string, value: string)}
	<div class="flex items-baseline justify-between gap-2 px-3 py-0.5">
		<span class="text-[10px] text-white/50">{label}</span>
		<span class="font-mono text-[11px] text-white/90">{value}</span>
	</div>
{/snippet}

{#if debug.visible}
	<div
		class="fixed top-0 right-0 z-[9998] flex h-full w-[350px] flex-col overflow-hidden border-l border-white/10 bg-[#0b0c15]/90 backdrop-blur-sm"
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-white/10 px-3 py-2">
			<span class="text-xs font-bold tracking-wider text-white/80 uppercase">Debug Panel</span>
			<button class="text-[10px] text-white/40 hover:text-white/70" onclick={() => debug.toggle()}>
				CLOSE
			</button>
		</div>

		<div class="flex-1 overflow-y-auto">
			<!-- Interaction State -->
			{@render sectionHeader('Interaction State', 'interaction')}
			{#if openSections.interaction}
				<div class="space-y-0.5 py-1">
					<div class="flex items-center justify-between px-3 py-0.5">
						<span class="text-[10px] text-white/50">status</span>
						{@render badge(interaction.status, statusColors[interaction.status] ?? 'bg-gray-500')}
					</div>
					{@render row(
						'pointer',
						`${Math.round(interaction.pointer.x)}, ${Math.round(interaction.pointer.y)}`
					)}
					<div class="flex items-center justify-between px-3 py-0.5">
						<span class="text-[10px] text-white/50">isValidDrop</span>
						{@render badge(
							String(interaction.isValidDrop),
							interaction.isValidDrop ? 'bg-green-600' : 'bg-red-600/60'
						)}
					</div>
				</div>
			{/if}

			<!-- Drag State -->
			{@render sectionHeader('Drag State', 'drag')}
			{#if openSections.drag}
				{#if interaction.dragState}
					{@const ds = interaction.dragState}
					{@const def = getDef(ds.item.defId)}
					<div class="space-y-0.5 py-1">
						<div class="flex items-center gap-2 px-3 py-0.5">
							<img src={def.image} alt="" class="h-8 w-8 object-contain" />
							<div>
								<div class="text-[11px] font-medium text-white/90">{def.name}</div>
								<div class="font-mono text-[10px] text-white/50">{def.id}</div>
							</div>
						</div>
						{@render row('uid', shortUid(ds.item.uid))}
						{@render row('count', String(ds.item.count))}
						{@render row('source', formatLocation(ds.sourceLocation))}
						<div class="flex items-center justify-between px-3 py-0.5">
							<span class="text-[10px] text-white/50">isSplit</span>
							{@render badge(String(ds.isSplit), ds.isSplit ? 'bg-teal-600' : 'bg-gray-600')}
						</div>
					</div>
				{:else}
					<div class="px-3 py-2 text-[10px] text-white/30 italic">No active drag</div>
				{/if}
			{/if}

			<!-- Hover State -->
			{@render sectionHeader('Hover State', 'hover')}
			{#if openSections.hover}
				{#if interaction.hoveredSlot}
					{@const hs = interaction.hoveredSlot}
					<div class="space-y-0.5 py-1">
						{@render row('location', formatLocation(hs.location))}
						{@render row('item', hs.item ? getDef(hs.item.defId).name : '(empty)')}
						{#if dropActionPreview}
							<div class="flex items-center justify-between px-3 py-0.5">
								<span class="text-[10px] text-white/50">dropAction</span>
								{@render badge(dropActionPreview, actionColors[dropActionPreview] ?? 'bg-gray-600')}
							</div>
						{/if}
					</div>
				{:else}
					<div class="px-3 py-2 text-[10px] text-white/30 italic">No hovered slot</div>
				{/if}
			{/if}

			<!-- Inventory Stats -->
			{@render sectionHeader('Inventory Stats', 'stats')}
			{#if openSections.stats}
				<div class="space-y-2 py-1">
					{#each Object.entries(STORAGE_CONFIGS) as [storageId, config] (storageId)}
						{@const items = getStorageItems(storageId as StorageId)}
						<div class="px-3">
							<div class="flex items-baseline justify-between">
								<span class="text-[11px] font-medium text-white/80">{storageId}</span>
								<span class="font-mono text-[10px] text-white/50">
									{items.length}/{config.size}
								</span>
							</div>
							{#if items.length > 0}
								<div class="mt-0.5 space-y-0">
									{#each items as slot (slot.item.uid)}
										{@const def = getDef(slot.item.defId)}
										<div class="flex items-baseline justify-between font-mono text-[10px]">
											<span class="text-white/60">{def.name}</span>
											{#if slot.item.count > 1}
												<span class="text-white/40">×{slot.item.count}</span>
											{/if}
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
					<div class="px-3 pt-1">
						<span class="text-[10px] text-white/50">
							selected: [{[...selection.ids].map(shortUid).join(', ')}]
						</span>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	@reference "tailwindcss";
</style>
