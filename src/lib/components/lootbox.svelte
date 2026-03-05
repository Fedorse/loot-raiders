<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import { LOOTBOX_ORDER, getLootboxDef } from '$lib/config/lootboxes';
	import { getRarityStyle } from '$lib/config/rarity';
	import { getStorageConfig } from '$lib/config/storages';
	import { tweened } from 'svelte/motion';
	import StorageGrid from './storage-grid.svelte';

	const { lootbox, inventory } = getGameContext();
	const lootBackConfig = getStorageConfig('lootBack');

	// --- Настройки Визуала ---
	const REPEATS = 50; // Количество повторений для "бесконечности"
	const BOX_W = 220; // Ширина карточки
	const BOX_H = 160; // Высота карточки
	const GAP = 20; // Отступ между карточками
	const CELL = BOX_H + GAP; // Шаг прокрутки

	// Размер видимой области (высота "окна")
	const VIEWPORT_HEIGHT = BOX_H * 2.5;
	const CENTER_Y = VIEWPORT_HEIGHT / 2;

	const STRIP_LENGTH = LOOTBOX_ORDER.length * REPEATS;

	const boxes = Array.from({ length: STRIP_LENGTH }, (_, i) => {
		const id = LOOTBOX_ORDER[i % LOOTBOX_ORDER.length];
		return { ...getLootboxDef(id), globalIndex: i };
	});

	function slotMachineEase(t: number): number {
		return 1 - Math.pow(1 - t, 4); // Плавное замедление
	}

	const stripOffset = tweened(0, { duration: 3000, easing: slotMachineEase });
	const centerRepeat = Math.floor(REPEATS / 2);

	// --- Логика 3D проекции ---
	// Мы вычисляем стиль только для тех элементов, которые сейчас видны, чтобы не грузить браузер

	const VISIBLE_COUNT = 5; // Сколько элементов рендерим одновременно (запас сверху и снизу)

	let visibleItems = $derived.by(() => {
		const currentOffset = $stripOffset;

		// Индекс элемента, который сейчас ближе всего к центру
		const centerIndex = Math.floor(currentOffset / CELL);

		// Определяем диапазон индексов для рендеринга
		const start = Math.max(0, centerIndex - 2);
		const end = Math.min(boxes.length, centerIndex + 3);

		const items = [];

		for (let i = start; i < end; i++) {
			const box = boxes[i];

			// Позиция элемента относительно центра "в пикселях прокрутки"
			// (i * CELL) - это идеальная позиция элемента в ленте
			// currentOffset - это текущая прокрутка
			// diff - это расстояние от центра виртуальной ленты до текущей позиции прокрутки
			const itemCenterY = i * CELL + BOX_H / 2; // Центр конкретного айтема в ленте
			const distFromScrollCenter = itemCenterY - (currentOffset + BOX_H / 2); // Смещение относительно центра вьюпорта

			// Нормализуем дистанцию (-1 ... 0 ... 1) где 1 это край видимой зоны
			const normalizedDist = distFromScrollCenter / (VIEWPORT_HEIGHT * 0.6);

			// Вычисляем стили для 3D эффекта
			const rotateX = -normalizedDist * 45; // Поворот вокруг оси X (градусы)
			const scale = Math.max(0.7, 1 - Math.abs(normalizedDist) * 0.3); // Уменьшение к краям
			const opacity = Math.max(0, 1 - Math.abs(normalizedDist) * 0.8); // Прозрачность к краям
			const zIndex = 100 - Math.round(Math.abs(normalizedDist) * 10); // Центр поверх остальных

			// Сдвиг по Y с учетом перспективы (немного сжимаем края)
			const translateY = distFromScrollCenter * 0.85;

			items.push({
				box,
				style: `
					transform: translate3d(0, ${translateY}px, 0) rotateX(${rotateX}deg) scale(${scale});
					opacity: ${opacity};
					z-index: ${zIndex};
				`,
				isWinner: lootbox.phase === 'result' && Math.abs(distFromScrollCenter) < 5
			});
		}

		return items;
	});

	async function handleSpin() {
		// Сброс в середину перед спином для запаса хода (опционально)
		if ($stripOffset === 0 || $stripOffset > CELL * STRIP_LENGTH * 0.8) {
			const resetIdx = Math.floor(REPEATS / 5) * LOOTBOX_ORDER.length;
			await stripOffset.set(resetIdx * CELL, { duration: 0 });
		}

		lootbox.spin();

		// Текущий индекс
		const currentIdx = Math.round($stripOffset / CELL);

		// Целевой индекс (минимум +30 прокруток вперед)
		const spinDistance = 30 + Math.floor(Math.random() * 10);
		let targetIdx = currentIdx + spinDistance;

		// Выравниваем на правильную редкость
		while (targetIdx % LOOTBOX_ORDER.length !== lootbox.resultIndex) {
			targetIdx++;
		}

		await stripOffset.set(targetIdx * CELL);
		lootbox.onSpinComplete();
	}
</script>

<div
	class="flex flex-col gap-4 rounded-lg bg-background/50 px-4 pt-4 pb-12 backdrop-blur-xs select-none"
>
	{#if lootbox.phase === 'opened'}
		<div class="flex items-center gap-4">
			<h2 class="text-base font-bold uppercase">{lootbox.selectedBox.rarity}</h2>
			<span class="text-sm">{inventory.lootBack.length}/{lootBackConfig.size}</span>
		</div>
		<div class="grid grid-cols-4">
			<StorageGrid storageId="lootBack" class="aspect-square h-20 w-20" />
		</div>
		<button
			class="mt-2 cursor-pointer rounded bg-white/10 px-6 py-2 text-sm font-bold tracking-wider text-white uppercase transition-colors hover:bg-white/20"
			onclick={() => lootbox.close()}
		>
			Close
		</button>
	{:else}
		<h2 class="text-center text-base font-bold tracking-widest text-white/80 uppercase">
			Loot Raiders Cashes
		</h2>

		<!-- 3D Carousel Viewport -->
		<div
			class="relative flex items-center justify-center overflow-hidden"
			style="
				width: {BOX_W + 40}px; 
				height: {VIEWPORT_HEIGHT}px;
				perspective: 800px; /* Ключевое свойство для 3D */
				mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%);
				-webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%);
			"
		>
			<!-- Center Highlighting Frame (Static) -->
			<div
				class="pointer-events-none absolute inset-0 z-50 m-auto rounded-xl border-2 border-yellow-400/60 shadow-[0_0_20px_rgba(250,204,21,0.3)]"
				style="width: {BOX_W}px; height: {BOX_H}px; transform: translateZ(20px);"
			></div>

			<!-- Items Container -->
			<div class="transform-style-3d relative flex h-full w-full items-center justify-center">
				{#each visibleItems as { box, style, isWinner } (box.globalIndex)}
					{@const rStyle = getRarityStyle(box.rarity)}

					<div
						class="absolute flex items-center justify-center rounded-xl bg-gradient-to-b p-[2px] transition-colors duration-300 will-change-transform {rStyle.border}"
						class:ring-2={isWinner}
						class:ring-yellow-400={isWinner}
						class:shadow-[0_0_30px_rgba(250,204,21,0.6)]={isWinner}
						class:brightness-125={isWinner}
						style="
							width: {BOX_W}px; 
							height: {BOX_H}px; 
							{style}
							backface-visibility: hidden;
						"
					>
						<!-- Card Body -->
						<div
							class="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-black/80"
						>
							<!-- Background Glow -->
							<div class="absolute inset-0 opacity-30 {rStyle.glow} blur-xl"></div>

							<img
								src={box.image}
								alt={box.rarity}
								class="relative z-10 h-[70%] w-[70%] object-contain drop-shadow-2xl"
							/>
							<div
								class="relative z-10 mt-2 text-xs font-bold tracking-widest text-white/50 uppercase"
							>
								{box.rarity}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Controls -->
		<div class="flex h-12 w-full items-end justify-center">
			{#if lootbox.phase === 'idle'}
				<button
					class="mt-2 w-full cursor-pointer rounded-lg bg-linear-to-b from-yellow-400 to-yellow-600 px-6 py-3 text-sm font-black tracking-widest text-black uppercase shadow-lg shadow-yellow-500/20 transition-all hover:scale-105 active:scale-95"
					onclick={handleSpin}
				>
					Roll
				</button>
			{:else if lootbox.phase === 'result'}
				<button
					class="mt-2 w-full cursor-pointer rounded-lg bg-linear-to-b from-green-400 to-green-600 px-6 py-3 text-sm font-black tracking-widest text-black uppercase shadow-lg shadow-green-500/20 transition-all hover:scale-105 active:scale-95"
					onclick={() => lootbox.open()}
				>
					Open
				</button>
			{:else if lootbox.phase === 'spinning'}
				<div
					class="mt-2 animate-pulse px-6 py-3 text-center text-xs font-bold tracking-widest text-yellow-500/70 uppercase"
				>
					Rolling...
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	@reference "tailwindcss";

	.transform-style-3d {
		transform-style: preserve-3d;
	}
</style>
