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

Loot Raiders is a timed inventory game: players manage drag-and-drop inventory (weapons with attachments, loot, augments, shields) while a scrolling track of items must be matched from inventory for points. Includes loot generation with scanning animations, item recycling, and rarity tiers.

### Layered structure under `src/lib/`

- **`types.ts`** — All TypeScript types and enums: `InstanceItem`, `OccupiedSlot`, `SlotState`, `ItemLocation` (discriminated union: `slot | attachment | trash`), `DragState`, `ItemDefinition`, `StorageConfig`, enums `ItemType`, `ItemRarity`, `AttachmentType`, `StorageId`.
- **`utils.ts`** — Helpers: `isWeapon`, `isEqualLocation`, `randInt`, `formatTime`, `getDef`.
- **`config/`** — Static data:
  - `items.ts` — `ITEM_DB`: ~150+ item definitions keyed by `defId` (weapons, loot, augments, shields, attachments).
  - `storages.ts` — Storage containers: backpack (14), lootBack (16), weapon (2), augment (1), shield (1) with allowed types and quick-move targets.
  - `rarity.ts` — Visual styles per rarity tier (border, bg, glow, height).
  - `stages.ts` — Game stage configurations.
- **`store/`** — Svelte 5 runes-based state management (9 files):
  - `game.svelte.ts` — `Game` class: root coordinator. Instantiates all subsystems. Distributed via Svelte context (`initGame`/`getGameContext` with Symbol key).
  - `inventory.svelte.ts` — `Inventory` class: `$state<OccupiedSlot[]>` items, `$derived` per-storage filters. CRUD: move, stack, swap, attach, quickMove, splitStack, recycleItem. Match system: countAvailable, consumeMatched, removeMatch.
  - `interaction.svelte.ts` — `Interaction` class: drag-drop state (pointer, offset, dragState, hoveredSlot, status), drop validation via pure functions, pointer event lifecycle, split detection (Alt/Meta), double-click quick-move.
  - `inventory-validation.ts` — Pure validation: `isAllowedInLocation`, `canStackItems`, `canAttachToWeapon`, `getDropActionType`, `validateDrop`. Drop actions: move/stack/attach/swap/delete/invalid.
  - `selection.svelte.ts` — `Selection` class: `SvelteSet<string>` for multi-select tracking. Methods: select, toggle, deselect, clear.
  - `overlay.svelte.ts` — `Overlay` class: context menu, tooltip, recycle modal state and positioning. Exclusivity rules (tooltip hidden when menu/modal open).
  - `loot.svelte.ts` — `LootGenerator` class: generates loot with profiles (type/rarity weights, attachment chance), drives scanning animation (phase: idle/loading/done).
  - `game-loop.svelte.ts` — `GameLoop` class: RAF-based game loop. Timer (300s), score (+10 per match, +3s bonus), status (idle/playing/paused/over). Checks track matches against inventory.
  - `track.svelte.ts` — `Track` class: scrolling queue of TrackItem objects. Visibility culling via `$derived.by`, match marking, auto-extend.
  - `debug.svelte.ts` — `DebugStore`: toggle debug panel visibility.
- **`actions/`** — `actions.ts`: Svelte action directives — `droppable` (drop target), `draggable` (drag source), `clickOutside` (dismiss handler).
- **`components/`** — 18 Svelte components (see Component Tree below).

### Key data model

- **`ItemLocation`** — Discriminated union: `{ type: 'slot', storageId, index }` | `{ type: 'attachment', parentLocation, attachIndex }` | `{ type: 'trash' }`.
- **`InstanceItem`** — `{ uid, defId, count, attachments?, match? }`. `defId` maps to `ITEM_DB`.
- **`OccupiedSlot`** — `{ location: ItemLocation, item: InstanceItem }`.
- **`SlotState`** — `{ location: ItemLocation, item: InstanceItem | null }`.
- **`DragState`** — `{ item: InstanceItem, sourceLocation: ItemLocation, isSplit: boolean }`.
- **5 item types**: loot, weapon, augment, shield, attachment. **5 rarity tiers**: common, uncommon, rare, epic, legendary.
- **Attachment system**: weapons define `attachmentSlots` with type constraints (optic, muzzle, magazine, grip, stock, underbarrel). Attachments stored in `InstanceItem.attachments[]`.

### Drag-and-drop

Custom pointer-event-based implementation (no external DnD library at runtime). Actions use `{@attach}` directive. Drag threshold: 1px. Double-click (300ms) for quick-move. Ctrl/Cmd+click for multi-select. Shift+click for quick-move. Alt/Meta+drag for split stack.

### Component tree

```
+layout.svelte (initGame, global overlays, keyboard: Escape/Space/D)
├── +page.svelte
│   ├── StorageGrid × 5 (lootBack, augment, shield, weapon, backpack)
│   │   └── Slot × N
│   │       ├── ItemSlot → WeaponCard (→ AttachmentSlot × M) | ItemCard
│   │       ├── EmptySlot
│   │       └── Scanner (loading animation)
│   ├── DropZone (trash)
│   ├── TrackItem (animated match queue)
│   └── Shortcuts
├── DragLayer (ghost following pointer)
├── ContextMenu (quick move, split, remove, recycle)
├── TooltipOverlay (item details, weapon stats, recycling yields)
├── RecycleModal (confirmation with resource preview)
├── DebugPanel (press D)
└── GameMenu (idle/paused/over screens)
```

### State flow

Components access state via `getGameContext()` → `Game` → subsystems. Drag-drop: Svelte actions → `Interaction` → validation → `Inventory` mutations. Game loop: `GameLoop.tick()` → `Track.movement()` → match check → `Inventory.consumeMatched()`. Loot: `LootGenerator.next()` → fill lootBack → scanning animation.

### Routes

Single-page app: `+layout.svelte` initializes game context and renders global overlays, `+page.svelte` renders the inventory UI (storage grids, track, drop zone).

## Code Style

- Svelte 5 runes (`$state`, `$derived`, `$derived.by`, `$props()`, `$effect`) — no legacy `$:` or stores API
- Svelte 5 snippets (`{#snippet}`) for reusable template fragments
- Svelte 5 `{@attach}` directive for actions (not `use:`)
- Tabs, single quotes, no trailing commas, 100 char print width (`.prettierrc`)
- `ItemLocation` comparison uses `isEqualLocation` from `utils.ts` (deep equality)
