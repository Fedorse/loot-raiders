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

- **`types.ts`** — All TypeScript types: `InstanceItem`, `StoredItem`, `SlotRef`, `AttachmentRef`, `DragPayload`, `DropTarget`, `ItemDefinition`, `StorageConfig`, enums for `ItemType`, `ItemRarity`, `AttachmentType`, `StorageId`.
- **`utils.ts`** — Helper functions (e.g. `isWeapon`).
- **`config/`** — Static data: `items.ts` has the `ITEM_DB` (item definitions keyed by `defId`). `storages.ts` defines storage containers (backpack, lootBack, weapon, augment, shield) with allowed item types and sizes. `rarity.ts` defines visual styles per rarity tier.
- **`store/`** — Svelte 5 runes-based state management:
  - `game.svelte.ts` — `Game` class: top-level coordinator. Instantiates Inventory and Interaction. Distributed via Svelte context (`initGame`/`getGameContext`).
  - `inventory.svelte.ts` — `Inventory` class: reactive item state (`$state`, `$derived`), CRUD operations on `StoredItem[]`, selection tracking via `SvelteSet`, drop/move/swap/attachment logic, quick-move, multi-select actions.
  - `interaction.svelte.ts` — `Interaction` class: drag-and-drop state (pointer tracking, origin/target, validity), context menu state, tooltip state.
  - `inventory-validation.ts` — Pure validation functions (`canPlace`, `canAttach`, `canDrop`) enforcing storage rules.
- **`actions/`** — Single `actions.ts` file with Svelte action directives: `droppable`, `slotInteractions`, `attachmentInteractions` for pointer-based drag-drop and click interactions.
- **`components/`** — UI components: storage grids, item/weapon/attachment slots, drag layer, context menu, tooltips, shortcuts.

### Key data model

- **`InstanceItem`** — `{ uid, defId, count, attachments? }`. `defId` maps to `ITEM_DB` for the full `ItemDefinition`.
- **`StoredItem`** — `{ storage: SlotRef, item: InstanceItem }`. Links an item to its grid position.
- **`SlotRef`** — `{ storageId, index }`. Identifies a slot within a storage container.
- **`AttachmentRef`** — `{ weaponSlotRef: SlotRef, attachIndex }`. Identifies an attachment slot on a weapon.
- **`DragPayload`** — Discriminated union: `inventory_slot` (slot drag) or `weapon_attachment` (attachment drag).
- **5 item types**: loot, weapon, augment, shield, attachment. **5 rarity tiers**: common, uncommon, rare, epic, legendary.
- **Attachment system**: weapons define `attachmentSlots` with type constraints (optic, muzzle, magazine, grip, stock, underbarrel). Attachments stored in `InstanceItem.attachments[]` array.

### Drag-and-drop

Custom pointer-event-based implementation (no external DnD library is used at runtime despite some being in package.json). Actions use `{@attach}` directive syntax. Drag begins after 5px threshold. Double-click for selection.

### State flow

Components access state through `getGameContext()` → `Game` instance → `inventory` and `interaction`. Drag-drop interactions go through Svelte actions → `Interaction` → `Inventory`. Validation is checked before operations execute.

### Routes

Single-page app: `+layout.svelte` initializes the game context, `+page.svelte` renders the inventory UI (loot caches, loadout, backpack grids).

## Code Style

- Svelte 5 runes (`$state`, `$derived`, `$props()`, `$effect`) — no legacy `$:` or stores API
- Svelte 5 snippets (`{#snippet}`) for reusable template fragments
- Svelte 5 `{@attach}` directive for actions (not `use:`)
- Tabs, single quotes, no trailing commas, 100 char print width (`.prettierrc`)
- SlotRef comparison uses `isEqual` from `es-toolkit` (deep equality for object refs)
