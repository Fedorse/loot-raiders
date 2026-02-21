<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import { getDef } from '$lib/config/items';

	const { overlay } = getGameContext();
	const tooltip = $derived(overlay.tooltip);
	const def = $derived(tooltip.item ? getDef(tooltip.item.defId) : null);

	// Логика, чтобы тултип не уезжал за пределы экрана справа/снизу
	let tooltipRef: HTMLElement;
	let adjustedX = $state(0);
	let adjustedY = $state(0);

	$effect(() => {
		if (tooltip.visible && tooltipRef) {
			const rect = tooltipRef.getBoundingClientRect();
			const vw = window.innerWidth;
			const vh = window.innerHeight;

			// Корректируем X, если не влезает
			adjustedX = tooltip.x + rect.width > vw ? tooltip.x - rect.width - 20 : tooltip.x;
			// Корректируем Y, если не влезает
			adjustedY = tooltip.y + rect.height > vh ? tooltip.y - rect.height - 20 : tooltip.y;
		}
	});
</script>

{#if tooltip.visible && def && tooltip.item}
	<div
		bind:this={tooltipRef}
		class="pointer-events-none fixed z-[9999] flex w-80 flex-col rounded shadow-2xl"
		style="top: {adjustedY}px; left: {adjustedX}px;"
	>
		<!-- Главное тело тултипа (Бежевый фон) -->
		<div class="rounded-t border border-[#d2ccbc] bg-[#F3EFE0] p-3 text-[#1a1a1a]">
			<!-- Подзаголовок (Тип и Редкость) -->
			<div class="mb-1 flex gap-1 text-[10px] font-bold tracking-wider uppercase">
				<div class="flex items-center gap-1 bg-[#8c8c8c] px-1.5 py-0.5 text-white">
					<img src={def.categoryIcon} class="size-3 opacity-80 invert filter" alt="" />
					<span>{def.type}</span>
				</div>
				<div class="bg-[#8c8c8c] px-1.5 py-0.5 text-white">{def.rarity}</div>
			</div>

			<!-- Заголовок -->
			<h1 class="mb-2 text-xl font-black tracking-tight uppercase">{def.name}</h1>

			<!-- Описание -->
			{#if def.description}
				<p class="mb-4 text-sm leading-tight font-medium text-[#333]">
					{def.description}
				</p>
			{/if}

			<!-- Мок-Иконки аттачментов (Заглушка как на скрине) -->
			{#if def.type === 'weapon'}
				<div class="mb-3 flex gap-1">
					<div class="flex size-8 items-center justify-center rounded border border-[#1a1a1a]/30">
						M
					</div>
					<div
						class="flex size-8 items-center justify-center rounded border border-[#1a1a1a]/30 bg-[#1a1a1a]/10"
					>
						T
					</div>
					<div class="flex size-8 items-center justify-center rounded border border-[#1a1a1a]/30">
						S
					</div>
				</div>
			{/if}

			<!-- Характеристики (Grid) -->
			<div class="flex flex-col text-sm font-medium">
				{#if def.durability !== undefined}
					<div class="flex justify-between border-b border-[#1a1a1a]/10 py-1.5">
						<span>Durability</span>
						<span>{def.durability}/{def.maxDurability}</span>
					</div>
				{/if}
				{#if def.ammoType}
					<div class="flex justify-between border-b border-[#1a1a1a]/10 py-1.5">
						<span>Ammo Type</span>
						<span class="flex items-center gap-1">
							<div class="size-3 bg-gray-600"></div>
							{def.ammoType}
						</span>
					</div>
				{/if}
				{#if def.magazineSize}
					<div class="flex justify-between border-b border-[#1a1a1a]/10 py-1.5">
						<span>Magazine Size</span>
						<span>{def.magazineSize}</span>
					</div>
				{/if}
				{#if def.firingMode}
					<div class="flex justify-between border-b border-[#1a1a1a]/10 py-1.5">
						<span>Firing Mode</span>
						<span>{def.firingMode}</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- Подвал (Вес и Цена) -->
		<div class="flex h-8 w-full rounded-b bg-[#e3decf] text-sm font-bold text-[#1a1a1a]">
			<div class="flex flex-1 items-center justify-center border-r border-[#d2ccbc]">
				<span class="mr-1">⚖</span>
				{def.weight.toFixed(1)}
			</div>
			<div class="flex flex-1 items-center justify-center">
				<span class="mr-1">¤</span>
				{def.price.toLocaleString()}
			</div>
		</div>
	</div>
{/if}
