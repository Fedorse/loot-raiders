<script lang="ts">
	import { ITEM_DB } from '$lib/config/items';
	import { getRarityStyle } from '$lib/config/rarity';
	import type { SlotState, ItemLocation, ItemDefinition, AttachmentType } from '$lib/types';
	const feedItems = (() => {
		const all = Object.values(ITEM_DB);

		// Build attachment pool grouped by kind
		const attachmentsByKind = new Map<AttachmentType, ItemDefinition[]>();
		for (const d of all) {
			if (d.type === 'attachment' && d.attachmentKind) {
				const list = attachmentsByKind.get(d.attachmentKind) ?? [];
				list.push(d);
				attachmentsByKind.set(d.attachmentKind, list);
			}
		}

		const byType = new Map<string, ItemDefinition[]>();
		for (const d of all) {
			const list = byType.get(d.type) ?? [];
			list.push(d);
			byType.set(d.type, list);
		}
		const picked: ItemDefinition[] = [];
		for (const [, list] of byType) {
			const take = Math.min(list.length, Math.ceil(20 / byType.size));
			picked.push(...list.slice(0, take));
		}
		return picked.slice(0, 20).map((def) => {
			if (def.type === 'weapon' && def.attachmentSlots?.length) {
				const attachments = def.attachmentSlots.map((slot) => {
					if (Math.random() < 0.5) return null;
					const pool = attachmentsByKind.get(slot.type);
					if (!pool?.length) return null;
					return pool[Math.floor(Math.random() * pool.length)];
				});
				return { def, count: 1, attachments };
			}
			return {
				def,
				count: def.type === 'weapon' ? 1 : Math.floor(Math.random() * 9) + 2,
				attachments: null as (ItemDefinition | null)[] | null
			};
		});
	})();
</script>

<div
	class="scrollbar-none z-10 flex h-[calc(100vh-10rem)] w-52 flex-col gap-2 overflow-y-auto rounded-lg bg-background/50 px-3 py-4"
>
	<h2 class="text-xs font-bold text-white/60 uppercase">Items</h2>

	{#each feedItems as { def, count, attachments } (def.id)}
		{@const style = getRarityStyle(def.rarity)}
		<div class="flex w-full justify-center">
			{#if def.type === 'weapon' && def.attachmentSlots?.length}
				<!-- Weapon with attachment slots -->
				<div
					class="flex w-44 flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.border}"
				>
					<div class="relative flex flex-col overflow-hidden rounded-[7px] bg-surface">
						<div class="relative flex h-16 items-center justify-center">
							<div
								class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-20 blur-xl {style.glow}"
							></div>
							<img
								src={def.image}
								alt={def.name}
								class="relative z-10 h-full w-full object-contain"
							/>
						</div>
						<div class="z-10 flex items-center justify-center gap-0.5 px-1 py-1">
							{#each def.attachmentSlots as slot, i}
								{@const att = attachments?.[i]}
								{#if att}
									{@const attStyle = getRarityStyle(att.rarity)}
									<div
										class="flex size-7 items-center justify-center overflow-hidden rounded bg-linear-to-tr p-[0.5px] {attStyle.border}"
									>
										<div
											class="flex h-full w-full items-center justify-center rounded-sm bg-surface"
										>
											<img src={att.image} alt={att.name} class="size-8 scale-125 object-contain" />
										</div>
									</div>
								{:else}
									<div
										class="flex size-7 items-center justify-center rounded border border-white/15"
									>
										<img
											src={slot.placeholder}
											alt={slot.type}
											class="size-8 object-contain opacity-30"
										/>
									</div>
								{/if}
							{/each}
						</div>
					</div>
				</div>
			{:else}
				<!-- Simple item -->
				<div
					class="flex h-20 w-44 flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.border}"
				>
					<div class="relative flex h-full w-full overflow-hidden rounded-[7px] bg-surface">
						<div
							class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-20 blur-xl {style.glow}"
						></div>
						<img
							src={def.image}
							alt={def.name}
							class="relative z-10 h-full w-full object-contain"
						/>
						{#if count > 1}
							<div
								class="absolute right-1 bottom-1 z-20 flex items-center gap-0.5 rounded bg-black/70 px-1 py-0.5 text-xs leading-none font-medium text-white"
							>
								<span class="text-[9px] text-white/50">x</span>
								<span class="font-sans text-xs tracking-[-0.05em]">{count}</span>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>
