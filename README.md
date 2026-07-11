# Loot Raiders

An inventory-management extraction game made with Svelte 5. Open loot drops, triage items into a weight-limited backpack, complete quests for extra time, and maximise the value of what you're holding when the clock hits zero.

Playable on Mobile and Desktop — [Live Demo](https://loot-raiders.vercel.app)

<img width="720" alt="Loot Raiders gameplay" src="https://github.com/user-attachments/assets/c159ce0e-1d98-4d68-a990-d09a4dbd2afb" />

## Core loop

- **Loot Drop** — a batch of items appears in the container to triage. Items here count toward nothing until you drag them into the loadout.
- **Loadout** — the owned storages: backpack plus weapon, augment, and shield slots. The only items that count toward quests, weight, and score.
- **Extract** — the scored value of your loadout at game-over, the ranked metric. Reduced by the overweight penalty.
- **Overweight** — exceeding capacity scales your Extract down, so every gram is a decision.

## Technologies

- Svelte 5 (runes) + SvelteKit 2
- TypeScript
- Tailwind CSS 4

## Run Locally

Requires Node 20+ and [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm dev
```
## Contribution

Contributions are welcome — feel free to fork the repository and open a pull request.

## License

Released under the [MIT License](LICENSE).
