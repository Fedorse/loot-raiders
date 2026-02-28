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

			const TAB_HEIGHT = 32; // высота вкладки "ACTIONS" (-top-8)
			adjustedX = tooltip.x + rect.width > vw ? tooltip.x - rect.width - 20 : tooltip.x + 15;
			const rawY = tooltip.y + rect.height > vh ? tooltip.y - rect.height - 20 : tooltip.y + 15;
			adjustedY = Math.max(TAB_HEIGHT + 4, rawY);
		}
	});

	// TODO: Replace mockData with real item properties from ItemDefinition
	const mockData = {
		durability: '37/130',
		ammoType: 'Shotgun Ammo',
		magazineSize: 10,
		firingMode: 'Pump-Action',
		armorPenetration: 'Weak',
		upgradeModifiers: ['50% Increased Fire Rate'],
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
			class="absolute -top-8 left-0 flex h-8 items-center gap-2 rounded-t-[6px] bg-modal-secondary px-4 font-bold text-modal-foreground"
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
			class="flex flex-col rounded-tr-[6px] rounded-b-[6px] bg-modal text-modal-foreground shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]"
		>
			<!-- Паддинг-контейнер для контента -->
			<div class="flex flex-col px-5 py-5">
				<!-- Подзаголовок (Бейджи) -->
				<div class="mb-2 flex gap-1 text-[11px] font-bold tracking-wider text-white uppercase">
					<div class="flex items-center gap-1 bg-badge px-1.5 py-0.5">
						<!-- todo icon category shoud be here -->
						<!-- <span class="font-black">!!</span> -->
						<!-- Иконка шотгана -->
						<span>Shotgun</span>
					</div>
					<div class="bg-badge px-1.5 py-0.5">
						{def.rarity}
					</div>
				</div>

				<!-- Заголовок -->
				<h1 class="mb-2 text-[26px] leading-none font-black tracking-tight uppercase">
					{def.name}
				</h1>

				<!-- Описание -->
				<p class="mb-4 text-[15px] leading-snug font-medium text-modal-secondary-foreground">
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
				<div class="mb-4 flex flex-col text-[14px] font-medium text-modal-foreground">
					<div class="flex items-center justify-between border-b border-modal-foreground/10 py-2">
						<span class="text-modal-secondary-foreground">Ammo Type</span>
						<span class="flex items-center gap-1.5 font-bold">
							<!-- todo icon category shoud be here -->
							<!-- <span class="font-black opacity-60">!!</span> -->
							{mockData.ammoType}
						</span>
					</div>
					<div class="flex items-center justify-between border-b border-modal-foreground/10 py-2">
						<span class="text-modal-secondary-foreground">Magazine Size</span>
						<span class="font-bold">{mockData.magazineSize}</span>
					</div>
					<div class="flex items-center justify-between border-b border-modal-foreground/10 py-2">
						<span class="text-modal-secondary-foreground">Firing Mode</span>
						<span class="font-bold">{mockData.firingMode}</span>
					</div>
					<div class="flex items-center justify-between border-b border-modal-foreground/10 py-2">
						<span class="text-modal-secondary-foreground">ARC Armor Penetration</span>
						<span class="font-bold">{mockData.armorPenetration}</span>
					</div>
				</div>

				<!-- Upgrade Modifiers -->
				<!-- <div class="mb-4 flex flex-col">
					<span class="mb-1 text-[12px] font-bold tracking-widest text-muted-dim uppercase">
						Upgrade Modifiers
					</span>
					<div
						class="border-b border-modal-foreground/10 pb-2 text-[14px] font-bold text-modal-foreground"
					>
						{#each mockData.upgradeModifiers as mod}
							<div>{mod}</div>
						{/each}
					</div>
				</div> -->

				<!-- Recycles Into -->
				<div class="flex flex-col">
					<span class="mb-2 text-[12px] font-bold tracking-widest text-modal-foreground uppercase">
						Recycles Into
					</span>
					<div class="flex gap-1.5">
						{#each mockData.mockRecycles as _}
							{@render miniItem('common')}
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Сниппет для отрисовки квадратных мини-иконок (аттачменты и ресурсы) -->
{#snippet miniItem(rarityStr: string)}
	{@const style = getRarityStyle(rarityStr as any) || getRarityStyle('common')}
	<div class="relative h-[42px] w-[42px] shrink-0 overflow-hidden rounded-[4px] bg-surface">
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
