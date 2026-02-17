# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `pnpm dev` (Vite dev server with HMR)
- **Build**: `pnpm build` (production build, Vercel adapter)
- **Type check**: `pnpm check` (svelte-check + TypeScript)
- **Lint**: `pnpm lint` (Prettier + ESLint)
- **Format**: `pnpm format` (Prettier auto-fix)

Package manager is **pnpm**.

## Tech Stack

SvelteKit 2 with Svelte 5, TypeScript (strict), TailwindCSS 4, Vite 7. Deployed via Vercel adapter.

## Architecture

Loot Raiders is a game inventory management UI with drag-and-drop, weapon attachments, item rarity tiers, and multiple storage containers.

### Layered structure under `src/lib/`

- **`config/`** — Static data: `items.ts` has the `ITEM_DB` (item definitions, types, rarities) and all type definitions (`ItemInstance`, `SlotRef`, `StorageSlot`, `AttachmentSlot`, `DropTarget`). `storages.ts` defines storage containers (backpack, lootBack, weapon, augment, shield) with allowed item types and sizes.
- **`store/`** — Svelte 5 runes-based state management:
  - `game.svelte.ts` — `Game` class: top-level coordinator. Instantiates InventoryManager, InventoryOperations, DndManager. Distributed via Svelte context (`initGame`/`getGameContext`).
  - `inventory-manger.svelte.ts` — `InventoryManager`: reactive item state (`$state`, `$derived`), CRUD operations on `StoredItem[]`, selection tracking via `SvelteSet`.
  - `inventory-operations.ts` — `InventoryOperations`: business logic for drops, moves, swaps, attachments, quick-move, multi-select actions.
  - `inventory-validation.ts` — Pure validation functions (`canPlace`, `canAttach`, `canDrop`) enforcing storage rules.
  - `ui-state.svelte.ts` — `DndManager`: drag-and-drop state (pointer tracking, origin/target, validity), broadcasts drop events.
- **`actions/`** — Svelte action directives: `droppable` and `slotInteractions` for drag-drop and click interactions on slots.
- **`components/`** — UI components: inventory grids, item cards, weapon cards, slots, attachment slots.

### Key data model

- **`ItemInstance`** — `{ uid, defId, count }`. `defId` maps to `ITEM_DB` for the full definition.
- **`StoredItem`** — `{ storage: SlotRef, item: ItemInstance }`. Links an item to its position.
- **`SlotRef`** — Union of `StorageSlot { storageId, index }` or `AttachmentSlot { storageId, index, attachIndex }`.
- **5 item types**: loot, weapon, augment, shield, attachment. **5 rarity tiers**: common, uncommon, rare, epic, legendary.
- **Attachment system**: weapons define `attachmentSlots` with type constraints (optic, muzzle, magazine, grip, stock, underbarrel). Attachments are stored as `AttachmentSlot` refs on the parent weapon.

### State flow

Components access state through `getGameContext()` which returns the `Game` instance. Drag-drop interactions go through Svelte actions → `DndManager` → `InventoryOperations` → `InventoryManager`. Validation is checked before operations execute.

## Code Style

- Svelte 5 runes (`$state`, `$derived`, `$props()`, `$effect`) — no legacy `$:` or stores API
- Svelte 5 snippets (`{#snippet}`) for reusable template fragments
- Tabs, single quotes, no trailing commas, 100 char print width (Prettier config)
- SlotRef comparison uses `isEqual` from `es-toolkit` (deep equality for object refs)
