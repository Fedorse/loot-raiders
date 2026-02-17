<script lang="ts">
	import TierIcon from '$lib/components/tier-icon.svelte';
	import Slot from '$lib/components/slot.svelte';
	import type { ItemInstance } from '$lib/config/items';
	import { getDef } from '$lib/config/items';
	import { getRarityStyle } from '$lib/config/rarity';

	type Props = {
		item: ItemInstance;
		className?: string;
		weaponStorage?: string;
		weaponPosition?: number;
		selected: boolean;
	};

	let { item, className = 'h-40', weaponStorage, weaponPosition, selected }: Props = $props();
	let def = $derived(getDef(item.defId));

	const style = $derived(getRarityStyle(def.rarity));
</script>

<div class="{className} weapon-card group/weapon">
	<div
		class="flex h-full w-full flex-col overflow-hidden rounded-lg bg-linear-to-tr p-[1px] {style.border}"
	>
		<div
			class="weapon-card__body relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-t-[8px] bg-[#0f111a] transition-shadow duration-300"
		>
			{@render absoluteGlowShadow()}
			{@render absoluteBlob()}
			<div class="min-h-0 flex-1">
				<img
					src={def?.image ?? ''}
					alt="weapon"
					class="z-10 max-h-full max-w-full object-contain transition-transform group-hover/weapon:scale-110"
				/>
			</div>
			<div class="weapon-card__slots z-20 mb-1 flex shrink-0 items-center justify-center gap-1">
				{#each def.attachmentSlots as _, index}
					<Slot
						slotRef={{
							storageId: weaponStorage ?? '',
							index: weaponPosition ?? 0,
							attachIndex: index
						}}
						class="z-20 aspect-square size-8"
					/>
				{/each}
			</div>
		</div>
		<div class="shrink-0">
			{@render footer()}
		</div>
	</div>
</div>

{#snippet absoluteGlowShadow()}
	<div class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-10 blur-xl {style.glow}"></div>
{/snippet}

{#snippet absoluteBlob()}
	<div
		class="absolute -bottom-1 -left-0.5 z-0 aspect-square {style.height} {style.bg}"
		style="mask-image: radial-gradient(circle at 100% 0%, transparent 69%, black 70%);"
	></div>
{/snippet}

{#snippet footer()}
	<div
		class=" z-10 flex h-8 w-full items-center justify-between rounded-b-[8px] bg-black pr-2 pl-0.5"
	>
		<div class="flex h-full items-center justify-center gap-0.5">
			<img src={def.categoryIcon} alt="ammo" class="size-9 object-contain" />
			<div class="flex font-mono text-xs text-white/90">
				<p class="tabular-nums">{0}</p>
				<span class="text-white">/</span>
				<p class="tabular-nums">{30}</p>
			</div>
		</div>
		<div class="text-white/70">
			<TierIcon tier={(def as { tier?: number }).tier ?? 3} className="size-7" />
		</div>
	</div>
{/snippet}

<style>
	/* Подсветка оружия при наведении на слот атачмента или когда слот — дроп-таргет */
	.weapon-card:has(.weapon-card__slots .slot-root:hover) .weapon-card__body,
	.weapon-card:has(.weapon-card__slots .is-drop-target) .weapon-card__body {
		box-shadow: inset 0 0 0 2px rgb(255 255 255 / 0.4);
	}
</style>
