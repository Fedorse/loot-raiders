<!-- ===== lib/components/tooltip-overlay.svelte ===== -->
<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import { getDef } from '$lib/config/items';
	import { getRarityStyle } from '$lib/config/rarity';

	const { overlay } = getGameContext();
	const tooltip = $derived(overlay.tooltip);

	// Получаем реальные данные (название, цена, вес), остальное замокаем ниже
	const def = $derived(tooltip?.item ? getDef(tooltip.item.defId) : null);

	// Логика, чтобы тултип не уезжал за пределы экрана справа/снизу
	let tooltipRef: HTMLElement;
	let adjustedX = $state(0);
	let adjustedY = $state(0);

	$effect(() => {
		if (tooltip && tooltipRef) {
			const rect = tooltipRef.getBoundingClientRect();
			const vw = window.innerWidth;
			const vh = window.innerHeight;

			// Учитываем высоту вкладки "ACTIONS" (около 32px)
			adjustedX = tooltip.x + rect.width > vw ? tooltip.x - rect.width - 20 : tooltip.x + 15;
			adjustedY = tooltip.y + rect.height > vh ? tooltip.y - rect.height - 20 : tooltip.y + 15;
		}
	});

	// --- МОК ДАННЫХ ДЛЯ СКРИНШОТА ---
	const mockData = {
		durability: '37/130',
		ammoType: 'Shotgun Ammo',
		magazineSize: 10,
		firingMode: 'Pump-Action',
		armorPenetration: 'Weak',
		upgradeModifiers: ['50% Increased Fire Rate'],
		// Мокаем картинки для аттачментов и ресурсов (используем плейсхолдеры)
		mockAttachments: [1, 2, 3, 4],
		mockRecycles: [1, 2]
	};
</script>

{#if tooltip && def && tooltip.item}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={tooltipRef}
		class="pointer-events-none fixed z-[10000] flex w-[340px] flex-col drop-shadow-2xl"
		style="top: {adjustedY}px; left: {adjustedX}px;"
	>
		<!-- Вкладка ACTIONS (корешок сверху) -->
		<div
			class="absolute -top-8 left-0 flex h-8 items-center gap-2 rounded-t-[6px] bg-[#E3DEC7] px-4 font-bold text-[#111418]"
		>
			<svg class="size-4 opacity-70" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M13 2v8h8c0-4.42-3.58-8-8-8zm-2 0c-4.42 0-8 3.58-8 8h8V2zm0 10H3c0 4.42 3.58 8 8 8v-8zm2 0v8c4.42 0 8-3.58 8-8h-8z"
				/>
			</svg>
			<span class="text-[13px] tracking-widest uppercase">Actions</span>
		</div>

		<!-- Главное тело тултипа (Светлое) -->
		<div
			class="flex flex-col rounded-tr-[6px] rounded-b-[6px] bg-[#F4EFE1] text-[#111418] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]"
		>
			<!-- Паддинг-контейнер для контента -->
			<div class="flex flex-col px-5 py-5">
				<!-- Подзаголовок (Бейджи) -->
				<div class="mb-2 flex gap-1 text-[11px] font-bold tracking-wider text-white uppercase">
					<div class="flex items-center gap-1 bg-[#1BA15C] px-1.5 py-0.5">
						<span class="font-black">!!</span>
						<!-- Иконка шотгана -->
						<span>Shotgun</span>
					</div>
					<div class="bg-[#1BA15C] px-1.5 py-0.5">
						{def.rarity}
					</div>
				</div>

				<!-- Заголовок -->
				<h1 class="mb-2 text-[26px] leading-none font-black tracking-tight uppercase">
					{def.name}
				</h1>

				<!-- Описание -->
				<p class="mb-4 text-[15px] leading-snug font-medium text-[#333]">
					{def.description ||
						mockData.description ||
						'Has a large bullet spread, sharp falloff, and high damage output.'}
				</p>

				<!-- Мок Аттачментов -->
				<div class="mb-5 flex gap-1.5">
					{#each mockData.mockAttachments as _}
						{@render miniItem(def.rarity)}
					{/each}
				</div>

				<!-- Характеристики (Grid/List) -->
				<div class="mb-4 flex flex-col text-[14px] font-medium text-[#111418]">
					<div class="flex items-center justify-between border-b border-[#111418]/10 py-2">
						<span class="text-[#333]">Durability</span>
						<span class="font-bold">{mockData.durability}</span>
					</div>
					<div class="flex items-center justify-between border-b border-[#111418]/10 py-2">
						<span class="text-[#333]">Ammo Type</span>
						<span class="flex items-center gap-1.5 font-bold">
							<span class="font-black opacity-60">!!</span>
							{mockData.ammoType}
						</span>
					</div>
					<div class="flex items-center justify-between border-b border-[#111418]/10 py-2">
						<span class="text-[#333]">Magazine Size</span>
						<span class="font-bold">{mockData.magazineSize}</span>
					</div>
					<div class="flex items-center justify-between border-b border-[#111418]/10 py-2">
						<span class="text-[#333]">Firing Mode</span>
						<span class="font-bold">{mockData.firingMode}</span>
					</div>
					<div class="flex items-center justify-between border-b border-[#111418]/10 py-2">
						<span class="text-[#333]">ARC Armor Penetration</span>
						<span class="font-bold">{mockData.armorPenetration}</span>
					</div>
				</div>

				<!-- Upgrade Modifiers -->
				<div class="mb-4 flex flex-col">
					<span class="mb-1 text-[12px] font-bold tracking-widest text-[#777] uppercase">
						Upgrade Modifiers
					</span>
					<div class="border-b border-[#111418]/10 pb-2 text-[14px] font-bold text-[#111418]">
						{#each mockData.upgradeModifiers as mod}
							<div>{mod}</div>
						{/each}
					</div>
				</div>

				<!-- Recycles Into -->
				<div class="flex flex-col">
					<span class="mb-2 text-[12px] font-bold tracking-widest text-[#111418] uppercase">
						Recycles Into
					</span>
					<div class="flex gap-1.5">
						{#each mockData.mockRecycles as _}
							{@render miniItem('common')}
						{/each}
					</div>
				</div>
			</div>
			<!-- Конец паддинг-контейнера -->

			<!-- Подвал (Вес и Цена) -->
			<div
				class="flex h-[42px] w-full items-center rounded-b-[6px] bg-[#E3DEC7] text-[15px] font-bold text-[#111418]"
			>
				<div class="flex flex-1 items-center justify-center gap-2 border-r border-white/50">
					<!-- Иконка гири (Вес) -->
					<svg class="size-4 opacity-70" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 2c-1.1 0-2 .9-2 2v2H6c-1.1 0-2 .9-2 2v10c0 2.2 1.8 4 4 4h8c2.2 0 4-1.8 4-4V8c0-1.1-.9-2-2-2h-4V4c0-1.1-.9-2-2-2zm0 2c.55 0 1 .45 1 1v1h-2V5c0-.55.45-1 1-1z"
						/>
					</svg>
					{def.weight.toFixed(1)}
				</div>
				<div class="flex flex-1 items-center justify-center gap-1.5">
					<span class="text-[16px] font-medium opacity-70">Ф</span>
					{def.price.toLocaleString()}
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Сниппет для отрисовки квадратных мини-иконок (аттачменты и ресурсы) -->
{#snippet miniItem(rarityStr: string)}
	{@const style = getRarityStyle(rarityStr as any) || getRarityStyle('common')}
	<div class="relative h-[42px] w-[42px] shrink-0 overflow-hidden rounded-[4px] bg-[#0F111A]">
		<!-- Маска уголка редкости -->
		<div
			class="absolute -bottom-1 -left-1 z-0 aspect-square h-[60%] {style.bg}"
			style="mask-image: radial-gradient(circle at 100% 0%, transparent 69%, black 70%); -webkit-mask-image: radial-gradient(circle at 100% 0%, transparent 69%, black 70%);"
		></div>
		<!-- Плейсхолдер картинки -->
		<div class="relative z-10 flex h-full w-full items-center justify-center p-1 opacity-50">
			<img
				src="/assets/placeholder/placeholder_weapon.png"
				alt=""
				class="max-h-full max-w-full object-contain"
			/>
		</div>
	</div>
{/snippet}
