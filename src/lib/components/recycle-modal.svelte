<!-- ===== lib/components/recycle-modal.svelte ===== -->
<script lang="ts">
	import { getDef } from '$lib/config/items';
	import { getRarityStyle } from '$lib/config/rarity';
	import type { InstanceItem, RecyclingResult } from '$lib/types';
	import { fade, scale } from 'svelte/transition';

	type Props = {
		item: InstanceItem;
		onClose: () => void;
		onConfirm: () => void;
	};

	let { item, onClose, onConfirm }: Props = $props();

	// Получаем дефиницию предмета, который разбираем
	const def = $derived(getDef(item.defId));
	// Получаем список того, что выпадет при разборке
	const resources = $derived(def.recycling ?? []);
</script>

<!-- Бекграунд затемнения -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
	transition:fade={{ duration: 150 }}
	onclick={onClose}
>
	<!-- Тело модалки -->
	<div
		class="flex w-[540px] flex-col overflow-hidden rounded-md shadow-2xl"
		transition:scale={{ duration: 200, start: 0.95 }}
		onclick={(e) => e.stopPropagation()}
	>
		<!-- Верхняя часть (Светлая) -->
		<div class="bg-[#F4EFE1] px-7 py-6 text-[#111418]">
			<h1 class="mb-3 text-[28px] leading-none font-black tracking-tight uppercase">
				Recycle {def.name}
			</h1>

			<p class="mb-5 text-[15px] leading-snug font-medium text-[#333]">
				You have selected {item.count} item{item.count > 1 ? 's' : ''} to recycle. These are the resources
				you will get back:
			</p>

			<!-- Контейнер для ресурсов -->
			<div class="flex min-h-[110px] flex-wrap gap-2.5 rounded bg-[#E3DEC7] p-3">
				{#each resources as res}
					{@render resourceCard(res)}
				{/each}

				{#if resources.length === 0}
					<div class="flex w-full items-center justify-center text-sm font-bold text-black/30">
						No resources can be salvaged.
					</div>
				{/if}
			</div>
		</div>

		<!-- Нижняя часть (Темная) -->
		<div class="flex gap-4 bg-[#0F111A] px-7 py-6">
			<button
				class="flex h-11 flex-1 items-center justify-center rounded-full bg-[#626262] text-[13px] font-bold tracking-widest text-white transition-colors hover:bg-[#7a7a7a] active:scale-[0.98]"
				onclick={onClose}
			>
				CANCEL
			</button>
			<button
				class="flex h-11 flex-1 items-center justify-center rounded-full bg-[#FFB800] text-[13px] font-bold tracking-widest text-[#111418] transition-colors hover:bg-[#ffc733] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
				disabled={resources.length === 0}
				onclick={onConfirm}
			>
				RECYCLE
			</button>
		</div>
	</div>
</div>

<!-- Сниппет для отрисовки мини-карточки ресурса (как на скриншоте) -->
{#snippet resourceCard(res: RecyclingResult)}
	{@const resDef = getDef(res.itemId)}
	{@const style = getRarityStyle(resDef.rarity)}

	<div
		class="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[4px] p-[1.5px] {style.border}"
	>
		<div class="relative flex h-full w-full flex-col bg-[#0F111A]">
			<!-- Свечение на фоне карточки -->
			<div
				class="absolute bottom-0 left-0 z-0 h-[80%] w-[80%] opacity-20 blur-xl {style.glow}"
			></div>

			<!-- Изображение ресурса -->
			<div class="relative z-10 flex min-h-0 flex-1 items-center justify-center p-1.5">
				<img
					src={resDef.image}
					alt={resDef.name}
					class="h-full w-full object-contain drop-shadow-md"
				/>
			</div>

			<!-- Футер карточки (иконка + количество) -->
			<div class="z-10 flex h-[18px] w-full shrink-0 items-center justify-between bg-black px-1">
				<img src={resDef.categoryIcon} alt="cat" class="size-[10px] object-contain opacity-80" />
				<div class="flex items-baseline gap-[1px] text-white">
					<span class="text-[8px]">×</span>
					<span class="font-sans text-[10px] leading-none font-medium tracking-tight">
						<!-- Умножаем базовое кол-во на размер стака, который мы разбираем -->
						{res.amount * item.count}
					</span>
				</div>
			</div>
		</div>
	</div>
{/snippet}
