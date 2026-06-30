# Loot Raiders

An inventory-management extraction game: open loot drops, triage items into a weight-limited backpack, auto-complete quests for extra time, upgrade your loadout for more space, and maximise the value of what you're holding when the clock hits zero.

## Core loop

**Loot Drop**:
A batch of items that appears in the loot container (`lootBack`) for the player to triage. Items here are **not owned** — they count toward nothing (quest, weight, score, upgrade resources) until dragged into the loadout.
_Avoid_: chest, loot bag, lootBack (in prose)

**Loadout**:
The owned storages — backpack plus the weapon, augment, and shield slots. The only items that count toward quests, weight, and score. The act the player repeats is "drag from the Loot Drop into the Loadout".
_Avoid_: equipment, inventory (the whole system is the inventory)

**Extract**:
The scored value of the Loadout at game-over — the ranked metric. Reduced by the overweight penalty.
_Avoid_: score, loot value, totalExtract (in prose)

**Overweight**:
The state where the Loadout's weight exceeds capacity, applying a soft penalty that scales the Extract down (1% per 1% over, floored).
_Avoid_: overloaded, encumbered

## Ambience

**Living Background**:
The full-screen animated backdrop that sits behind the game UI everywhere — a photographic scene with procedural atmosphere (fog, particles, godrays) and post-processing, cycling between scenes with transitions. Purely decorative; it owns no game state and reads none.
_Avoid_: wallpaper, skybox, splash, the canvas

## Onboarding

**FTUE**:
The first-time user experience — a guided, scripted walkthrough shown on a player's first entry that teaches the core loop, persisted so it shows only once, and replayable on demand from the menu.
_Avoid_: onboarding flow, walkthrough, "the tutorial" (ambiguous on its own)

**Tutorial Mode**:
The session the FTUE runs in, where the game's non-deterministic systems — the countdown clock, the automatic loot cadence, and the instant auto-upgrade of the augment — are frozen or scripted so every step is reproducible. A real session that shares components with a normal run but diverges in control flow.
_Avoid_: sandbox, demo mode, practice mode

**Coachmark**:
The single on-screen panel that drives the FTUE — it shows the current step (N of total), a segmented progress bar, an action-type badge (e.g. "click", "drag"), the step title and description, and a per-step skip control. The one surface the player reads; there is no separate step gallery and no "back" navigation.
_Avoid_: tooltip, popover, modal, "the menu" (ambiguous)
