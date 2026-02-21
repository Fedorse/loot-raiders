<!-- <script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import { getDef } from '$lib/config/items';

	const { overlay } = getGameContext();
	const menu = $derived(overlay.contextMenu);
	const def = $derived(menu.item ? getDef(menu.item.defId) : null);

	// Закрываем меню при клике в любое место
	const close = () => overlay.closeContextMenu();
</script>

<svelte:window
	onpointerdown={(e) => {
		// Если меню открыто, любой клик левой кнопкой мыши закроет его
		if (menu.visible && e.button === 0) close();
	}}
/>

{#if menu.visible && def && menu.item}
	<!-- Прозрачный фон для перехвата кликов мимо меню -->
	<div class="fixed inset-0 z-[9998]" oncontextmenu={(e) => e.preventDefault()}></div>

	<div
		class="fixed z-[9999] flex w-48 flex-col rounded-sm border border-[#d2ccbc] bg-[#F3EFE0] py-1 shadow-xl"
		style="top: {menu.y}px; left: {menu.x}px;"
		oncontextmenu={(e) => e.preventDefault()}
	>
		<!-- Заголовок предмета -->
		<div
			class="border-b border-[#d2ccbc] px-3 pb-1 text-xs font-bold tracking-wider text-[#8c8c8c] uppercase"
		>
			{def.name}
		</div>

		<!-- Кнопки действий -->
		<button
			class="flex px-3 py-1.5 text-left text-sm font-medium text-[#1a1a1a] hover:bg-[#e3decf]"
		>
			Ping item
		</button>

		<div class="my-1 border-t border-[#d2ccbc]"></div>

		<button
			class="flex px-3 py-1.5 text-left text-sm font-medium text-[#1a1a1a] hover:bg-[#e3decf]"
		>
			Drop To Ground
		</button>

		<button
			class="flex bg-[#ffab00] px-3 py-1.5 text-left text-sm font-medium text-[#1a1a1a] hover:bg-[#e69a00]"
		>
			Salvage Fabric × 5
		</button>
	</div>
{/if} -->
