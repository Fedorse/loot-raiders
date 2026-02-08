# Примеры кода: Рефакторинг attachments с attachIndex

## 1. Новая структура StoredItem

```typescript
// src/lib/store/inventory-manger.svelte.ts

export interface StoredItem {
	item: ItemInstance;
	storage: string;        // "weapon", "backpack", "lootBack" и т.д.
	position: number;       // позиция в хранилище
	attachIndex?: number;   // индекс слота attachment (если это attachment)
}
```

## 2. Состояние до и после attach

### ДО: Attachment лежит в рюкзаке

```typescript
// Массив items в InventoryManager:
[
  {
    item: { uid: "weapon-123", defId: "wpn_kettle", count: 1 },
    storage: "weapon",
    position: 0
    // attachIndex: undefined - это само оружие
  },
  {
    item: { uid: "attach-456", defId: "att_compensator_1", count: 1 },
    storage: "backpack",
    position: 5
    // attachIndex: undefined - attachment еще не прикреплен
  }
]
```

### ПОСЛЕ: Attachment прикреплен к оружию

```typescript
// Массив items в InventoryManager:
[
  {
    item: { uid: "weapon-123", defId: "wpn_kettle", count: 1 },
    storage: "weapon",
    position: 0
    // attachIndex: undefined - это само оружие
  },
  {
    item: { uid: "attach-456", defId: "att_compensator_1", count: 1 },
    storage: "weapon",      // ← изменилось с "backpack"
    position: 0,            // ← изменилось с 5 (теперь позиция оружия)
    attachIndex: 0          // ← появилось! Это attachment в слоте 0
  }
]
```

**Важно:** Attachment больше НЕ лежит в рюкзаке! Он теперь связан с оружием через `storage="weapon"`, `position=0`, `attachIndex=0`.

## 3. Полный код InventoryManager с derived state

```typescript
// src/lib/store/inventory-manger.svelte.ts

import { getDef, type ItemInstance, type SlotReference, type DropTarget } from '$lib/config/items';
import { getStorageConfig } from '$lib/config/storages';

export interface StoredItem {
	item: ItemInstance;
	storage: string;
	position: number;
	attachIndex?: number;  // ← НОВОЕ ПОЛЕ
}

export class InventoryManager {
	items = $state<StoredItem[]>([]);

	constructor() {
		this.setup();
	}

	/**
	 * Получить item из хранилища (обычный предмет или оружие)
	 */
	getItem(storage: string, position: number, attachIndex?: number): StoredItem | null {
		const storedItem = this.items.find(
			(item) =>
				item.storage === storage &&
				item.position === position &&
				(item.attachIndex ?? undefined) === (attachIndex ?? undefined)
		);
		return storedItem ?? null;
	}

	/**
	 * Получить само оружие (без attachments)
	 */
	getWeaponItem(storage: string, position: number): StoredItem | null {
		return this.items.find(
			(item) =>
				item.storage === storage &&
				item.position === position &&
				item.attachIndex === undefined
		) ?? null;
	}

	/**
	 * Получить attachment в конкретном слоте оружия
	 */
	getAttachmentSlot(storage: string, position: number, slotIndex: number): StoredItem | null {
		return this.items.find(
			(item) =>
				item.storage === storage &&
				item.position === position &&
				item.attachIndex === slotIndex
		) ?? null;
	}

	/**
	 * Получить все attachments оружия (derived state)
	 */
	getWeaponAttachments(storage: string, position: number): StoredItem[] {
		return this.items.filter(
			(item) =>
				item.storage === storage &&
				item.position === position &&
				item.attachIndex !== undefined
		).sort((a, b) => (a.attachIndex ?? 0) - (b.attachIndex ?? 0));
	}

	/**
	 * Получить attachments оружия как массив ItemInstance (для обратной совместимости)
	 * Это derived state - вычисляется из items массива
	 */
	getWeaponAttachmentsArray(storage: string, position: number): (ItemInstance | null)[] {
		const weapon = this.getWeaponItem(storage, position);
		if (!weapon) return [];

		const def = getDef(weapon.item.defId);
		if (!def.attachmentSlots) return [];

		// Создаем массив размером с количество слотов
		const attachments = new Array(def.attachmentSlots.length).fill(null);

		// Заполняем attachments из items массива
		this.getWeaponAttachments(storage, position).forEach((stored) => {
			if (stored.attachIndex !== undefined && stored.attachIndex < attachments.length) {
				attachments[stored.attachIndex] = stored.item;
			}
		});

		return attachments;
	}

	/**
	 * Установить item в хранилище
	 */
	setItem(
		storage: string,
		position: number,
		item: ItemInstance | null,
		attachIndex?: number
	): void {
		const index = this.items.findIndex(
			(storedItem) =>
				storedItem.storage === storage &&
				storedItem.position === position &&
				(storedItem.attachIndex ?? undefined) === (attachIndex ?? undefined)
		);

		if (item === null) {
			// Удаляем item
			if (index >= 0) {
				this.items.splice(index, 1);
			}
			return;
		}

		// Обновляем или добавляем item
		if (index >= 0) {
			this.items[index] = { item, storage, position, attachIndex };
		} else {
			this.items.push({ item, storage, position, attachIndex });
		}
	}

	/**
	 * Получить коллекцию хранилища (без attachments)
	 */
	getStorageCollection(name: string): (ItemInstance | null)[] {
		const config = getStorageConfig(name);
		if (!config) return [];

		return Array.from({ length: config.size }, (_, index) => {
			// Ищем только обычные items (без attachIndex)
			const stored = this.getItem(name, index);
			return stored?.item ?? null;
		});
	}

	createItem(defId: string, count = 1): ItemInstance {
		const def = getDef(defId);
		const item: ItemInstance = {
			uid: crypto.randomUUID(),
			defId,
			count
		};
		// Больше НЕ создаем attachments массив здесь!
		// Он будет вычисляться через derived state
		return item;
	}

	tryAttach(dragOrigin: StoredItem, dropTarget: DropTarget): boolean {
		const targetItem = dropTarget.item;
		if (targetItem === null) return false;

		const sourceItem = dragOrigin.item;
		const sourceDef = getDef(sourceItem.defId);
		const targetDef = getDef(targetItem.defId);

		// Проверяем, что это attachment
		if (sourceDef.type !== 'attachment' || !sourceDef.attachmentKind) return false;

		// Определяем slotIndex
		let slotIndex: number;

		// Если dropTarget - это attachment слот оружия
		if (dropTarget.attachIndex !== undefined) {
			slotIndex = dropTarget.attachIndex;

			// Проверяем, что тип attachment соответствует слоту
			const slotDef = targetDef.attachmentSlots?.[slotIndex];
			if (!slotDef || slotDef.type !== sourceDef.attachmentKind) {
				return false;
			}
		} else {
			// Ищем слот по типу (если drop на само оружие)
			if (dropTarget.storage !== 'weapon') return false;

			const foundSlotIndex = targetDef.attachmentSlots?.findIndex(
				(s) => s.type === sourceDef.attachmentKind
			);
			if (foundSlotIndex == null || foundSlotIndex < 0) return false;
			slotIndex = foundSlotIndex;
		}

		// Получаем старый attachment (если был)
		const oldStored = this.getAttachmentSlot(
			dropTarget.storage,
			dropTarget.position,
			slotIndex
		);
		const oldAttachment = oldStored?.item ?? null;

		// Перемещаем attachment из dragOrigin в слот оружия
		this.setItem(
			dropTarget.storage,
			dropTarget.position,
			sourceItem,
			slotIndex  // ← attachIndex!
		);

		// Старый attachment (если был) перемещаем на место dragOrigin
		this.setItem(
			dragOrigin.storage,
			dragOrigin.position,
			oldAttachment,
			dragOrigin.attachIndex  // сохраняем attachIndex если был
		);

		return true;
	}

	handleDrop(dragOrigin: StoredItem, dropTarget: DropTarget) {
		if (
			dragOrigin.storage === dropTarget.storage &&
			dragOrigin.position === dropTarget.position &&
			dragOrigin.attachIndex === dropTarget.attachIndex
		) return;

		const draggedItem = dragOrigin.item;
		const itemInSlot = dropTarget.item;

		if (this.tryAttach(dragOrigin, dropTarget)) return;

		// Не позволяем drop attachment на attachment слот напрямую
		if (dropTarget.attachIndex !== undefined && dragOrigin.attachIndex === undefined) return;
		if (dragOrigin.attachIndex !== undefined && dropTarget.attachIndex === undefined) return;

		if (itemInSlot && this.tryStack(dragOrigin, dropTarget, draggedItem, itemInSlot)) return;
		this.swap(dragOrigin, dropTarget);
	}

	swap(dragOrigin: StoredItem, dropTarget: DropTarget) {
		this.setItem(
			dropTarget.storage,
			dropTarget.position,
			dragOrigin.item,
			dropTarget.attachIndex
		);
		this.setItem(
			dragOrigin.storage,
			dragOrigin.position,
			dropTarget.item ?? null,
			dragOrigin.attachIndex
		);
	}

	// ... остальные методы (tryStack, splitStack и т.д.)
}
```

## 4. Обновленный DropTarget интерфейс

```typescript
// src/lib/config/items.ts

export interface DropTarget {
	storage: string;
	position: number;
	item: ItemInstance | null;
	attachIndex?: number;  // ← НОВОЕ ПОЛЕ для attachment слотов
}
```

## 5. Компонент WeaponCard с derived state

```typescript
// src/lib/components/weapon-card.svelte

<script lang="ts">
	import TierIcon from '$lib/components/tier-icon.svelte';
	import Slot from '$lib/components/slot.svelte';
	import type { ItemInstance } from '$lib/config/items';
	import { getDef } from '$lib/config/items';
	import { getGameContext } from '$lib/store/game.svelte';

	type Props = {
		item: ItemInstance;
		className?: string;
		weaponStorage?: string;
		weaponPosition?: number;
	};

	let { item, className = 'h-40', weaponStorage, weaponPosition }: Props = $props();
	let def = $derived(getDef(item.defId));

	const game = getGameContext();
	const { inventory } = game;

	// Derived state: получаем attachments оружия
	const weaponAttachments = $derived(
		weaponStorage && weaponPosition !== undefined
			? inventory.getWeaponAttachmentsArray(weaponStorage, weaponPosition)
			: []
	);

	// Derived state: проверяем есть ли attachments
	const hasAttachments = $derived(
		weaponAttachments.some(a => a !== null)
	);

	// ... остальной код
</script>

<div class="{className} group">
	<!-- ... -->
	<div class="z-20 mb-1 flex shrink-0 items-center justify-center gap-1">
		{#each def.attachmentSlots as _, index}
			<Slot
				storage={weaponStorage}
				position={weaponPosition}
				attachIndex={index}  {/* ← НОВОЕ! Передаем attachIndex */}
				class="z-20 aspect-square size-8"
			/>
		{/each}
	</div>
	<!-- ... -->
</div>
```

## 6. Компонент Slot с attachIndex

```typescript
// src/lib/components/slot.svelte

<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';
	import ItemSlot from './item-slot.svelte';
	import EmptySlot from './empty-slot.svelte';

	type Props = {
		storage: string;
		position: number;
		attachIndex?: number;  // ← НОВОЕ ПОЛЕ
		class: string;
		placeholder?: any;
	};

	let { storage, position, attachIndex, class: className = '', placeholder }: Props = $props();

	const game = getGameContext();
	const { dnd, inventory } = game;

	const { dragOrigin } = $derived(dnd);

	// Получаем storedItem с учетом attachIndex
	const storedItem = $derived(
		inventory.getItem(storage, position, attachIndex)
	);

	const dragOriginSlot = $derived(
		dragOrigin?.item === storedItem?.item &&
		dragOrigin?.attachIndex === storedItem?.attachIndex
	);

	const validSlot = $derived(
		dnd.canAccept({
			storage: storage ?? '',
			position: position ?? 0,
			item: storedItem?.item ?? null,
			attachIndex: attachIndex  // ← передаем attachIndex
		})
	);
</script>

<div class="{className} relative">
	{#if storedItem && !dragOriginSlot}
		<ItemSlot {storedItem} {className} />
	{:else}
		<EmptySlot {storage} {position} {attachIndex} {placeholder} {className} />
	{/if}
	{@render invalidIcon()}
</div>

{#snippet invalidIcon()}
	{#if dragOrigin && !validSlot && attachIndex === undefined}
		<div class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
			<img src="/assets/invalid.png" alt="!!" class="size-10 opacity-50" />
		</div>
	{/if}
{/snippet}
```

## 7. Компонент ItemSlot с attachIndex

```typescript
// src/lib/components/item-slot.svelte

<script lang="ts">
	import { getDef } from '$lib/config/items';
	import { droppable, draggable } from '$lib/attach/dnd';
	import type { StoredItem } from '$lib/store/inventory-manger.svelte';
	import WeaponCard from './weapon-card.svelte';
	import ItemCard from './item-card.svelte';
	import AttachCard from './attach-weapon-card.svelte';

	type Props = {
		storedItem: StoredItem;
		className: string;
	};

	let { storedItem, className = '' }: Props = $props();

	const { item, storage, position, attachIndex } = $derived(storedItem);

	const dropTarget = $derived({
		storage: storedItem.storage,
		position: storedItem.position,
		item: storedItem.item,
		attachIndex: storedItem.attachIndex  // ← передаем attachIndex
	});

	const def = $derived(getDef(item.defId));
</script>

<div
	class="{className} relative h-full w-full"
	{@attach droppable(dropTarget)}
	{@attach draggable(storedItem)}
>
	{#if storage === 'weapon' && attachIndex === undefined}
		{/* Это само оружие */}
		<WeaponCard
			{item}
			className="h-full w-full"
			weaponStorage={storage}
			weaponPosition={position}
		/>
	{:else if def.type === 'attachment' && attachIndex !== undefined}
		{/* Это attachment в слоте оружия */}
		<AttachCard {item} className="h-full w-full" />
	{:else}
		{/* Обычный предмет */}
		<ItemCard {item} className="h-full w-full" />
	{/if}
</div>
```

## 8. Компонент ItemCard с derived state для hasAttachments

```typescript
// src/lib/components/item-card.svelte

<script lang="ts">
	import TierIcon from '$lib/components/tier-icon.svelte';
	import { getDef } from '$lib/config/items';
	import type { ItemInstance } from '$lib/config/items';
	import { getGameContext } from '$lib/store/game.svelte';

	type Props = {
		item: ItemInstance | null;
		className?: string;
		weaponStorage?: string;  // ← для получения attachments
		weaponPosition?: number;  // ← для получения attachments
	};

	let { item, className = 'h-20 w-20', weaponStorage, weaponPosition }: Props = $props();

	const def = $derived(item?.defId != null ? getDef(item.defId) : null);

	const game = getGameContext();
	const { inventory } = game;

	// Derived state: получаем attachments если это оружие
	const weaponAttachments = $derived(
		def?.type === 'weapon' && weaponStorage && weaponPosition !== undefined
			? inventory.getWeaponAttachmentsArray(weaponStorage, weaponPosition)
			: null
	);

	// Derived state: проверяем есть ли attachments
	const hasAttachments = $derived(
		weaponAttachments?.some(a => a !== null) ?? false
	);

	// ... остальной код
</script>

{#if item && def}
	<!-- ... -->
	{#if def?.type === 'weapon'}
		<!-- ... -->
		{#if hasAttachments}
			<div>
				<img src={def.categoryIcon} alt="category" class="size-4 object-contain opacity-50" />
			</div>
		{/if}
	{/if}
{/if}
```

## 9. Пример использования в компонентах

```typescript
// Пример: получение attachments оружия в любом компоненте

<script lang="ts">
	import { getGameContext } from '$lib/store/game.svelte';

	const game = getGameContext();
	const { inventory } = game;

	// Получаем все attachments оружия в слоте 0 хранилища "weapon"
	const attachments = $derived(
		inventory.getWeaponAttachments('weapon', 0)
	);

	// Получаем attachments как массив ItemInstance
	const attachmentsArray = $derived(
		inventory.getWeaponAttachmentsArray('weapon', 0)
	);

	// Получаем конкретный attachment в слоте 0
	const muzzleAttachment = $derived(
		inventory.getAttachmentSlot('weapon', 0, 0)
	);

	// Проверяем есть ли attachments
	const hasAttachments = $derived(attachments.length > 0);
</script>
```

## 10. Сценарий: Attachment в рюкзаке → Attachment на оружии

```typescript
// ИСХОДНОЕ СОСТОЯНИЕ:
// Attachment лежит в рюкзаке на позиции 5
inventory.items = [
  {
    item: { uid: "attach-123", defId: "att_compensator_1", count: 1 },
    storage: "backpack",
    position: 5
    // attachIndex: undefined
  }
]

// ПОЛЬЗОВАТЕЛЬ ПЕРЕТАСКИВАЕТ attachment на оружие в слот 0
// Вызывается: tryAttach(dragOrigin, dropTarget)
// где:
//   dragOrigin = { item: {...}, storage: "backpack", position: 5 }
//   dropTarget = { storage: "weapon", position: 0, attachIndex: 0 }

// РЕЗУЛЬТАТ:
inventory.items = [
  {
    item: { uid: "attach-123", defId: "att_compensator_1", count: 1 },
    storage: "weapon",      // ← изменилось!
    position: 0,            // ← изменилось!
    attachIndex: 0          // ← появилось!
  }
]

// Attachment больше НЕ в рюкзаке!
// Он теперь связан с оружием через storage/position/attachIndex
```

## 11. Сценарий: Получение attachments через derived state

```typescript
// Оружие в слоте 0 хранилища "weapon" имеет 2 attachments:
inventory.items = [
  {
    item: { uid: "weapon-1", defId: "wpn_kettle", count: 1 },
    storage: "weapon",
    position: 0
    // attachIndex: undefined - это само оружие
  },
  {
    item: { uid: "attach-1", defId: "att_compensator_1", count: 1 },
    storage: "weapon",
    position: 0,
    attachIndex: 0  // attachment в слоте 0
  },
  {
    item: { uid: "attach-2", defId: "att_stable_stock_1", count: 1 },
    storage: "weapon",
    position: 0,
    attachIndex: 2  // attachment в слоте 2
  }
]

// В компоненте:
const attachments = $derived(
  inventory.getWeaponAttachments('weapon', 0)
);
// Результат: [
//   { item: {...}, storage: "weapon", position: 0, attachIndex: 0 },
//   { item: {...}, storage: "weapon", position: 0, attachIndex: 2 }
// ]

const attachmentsArray = $derived(
  inventory.getWeaponAttachmentsArray('weapon', 0)
);
// Результат: [ItemInstance, null, ItemInstance, null]
// (массив размером с количество слотов, null где нет attachment)

const slot0Attachment = $derived(
  inventory.getAttachmentSlot('weapon', 0, 0)
);
// Результат: { item: {...}, storage: "weapon", position: 0, attachIndex: 0 }
```

## Итоги

1. **Attachment НЕ дублируется** - он хранится только в одном месте в массиве `items`
2. **Нет виртуальных хранилищ** - все через `attachIndex`
3. **Derived state для удобства** - `getWeaponAttachmentsArray()` вычисляет массив из items
4. **Единый источник истины** - один массив `items` для всего
5. **Простая логика** - нет синхронизации между хранилищами
