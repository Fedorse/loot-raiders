import type { GameLoop } from './game-loop.svelte';
import type { LootGenerator } from './loot.svelte';
import type { Inventory } from './inventory.svelte';
import type { Quest } from './quest.svelte';
import type { Augment } from './augment.svelte';
import type { DragState, InstanceItem, StorageId } from '$lib/types';

// A loadout this heavy (well above the rookie augment's 28 capacity) guarantees the
// Overweight state on step 4, regardless of the light items triaged in earlier steps.
const OVERWEIGHT_SEED = { defId: 'loot_motor', count: 12 } as const;

// A common recyclable seeded into the Loadout for the recycle step — its single recycling
// output keeps the resulting state easy to read in the sim.
const RECYCLE_SEED = 'loot_crumpled_plastic_bottle';

// Versioned so a future redesign can deliberately re-show the FTUE by bumping the key,
// without re-showing it on a minor copy edit. Mirrors the leaderboard-nickname idiom.
const STORAGE_FTUE = 'lr_ftue_v1';

function readSeen(): boolean {
	if (typeof window === 'undefined') return false;
	try {
		return window.localStorage.getItem(STORAGE_FTUE) === '1';
	} catch {
		return false;
	}
}

function writeSeen(): void {
	if (typeof window === 'undefined') return;
	try {
		window.localStorage.setItem(STORAGE_FTUE, '1');
	} catch {
		// storage disabled — silently ignore
	}
}

// A step is either an acknowledgement (a `cta` button advances) or an action step. An
// action step carries `targets` to highlight, a `setup()` that lazily seeds the scripted
// state it needs on entry (ADR-0004), a pure `predicate()` over store state that an
// $effect observes to advance (ADR-0002), and an `autoPerform()` that the per-step skip
// runs so the end state matches the manual path (ADR-0003).
export interface TutorialStep {
	id: string;
	badge: string;
	title: string;
	description: string;
	cta?: string;
	targets?: string[];
	setup?: () => void;
	predicate?: () => boolean;
	autoPerform?: () => void;
	// Platform gate (ADR-0007): a step present only on the listed platforms. Modelled now so
	// the hotkeys step can later be filtered out on touch; absent ⟺ shown everywhere. The
	// engine does not filter yet — the desktop slice runs the full list.
	platforms?: ('desktop' | 'mobile')[];
}

export class Tutorial {
	private gameLoop: GameLoop;
	private loot: LootGenerator;
	private inventory: Inventory;
	private quest: Quest;
	private augment: Augment;
	private steps: TutorialStep[];

	// Captured by an action step's setup() on entry so its predicate measures progress
	// against the value at entry, not an assumed zero (the FTUE is replayable, so the
	// signal may be non-zero on re-entry). Only one step is active at a time.
	private baseline = 0;

	index = $state(0);

	// Computed as getters rather than $derived: each reads a rune ($state index / the loot
	// signal), so it stays reactive inside components while also returning a fresh value when
	// read from plain code — an unowned $derived caches and would go stale in the headless sim.
	get active(): boolean {
		return this.gameLoop.status === 'tutorial';
	}
	get step(): TutorialStep | null {
		return this.steps[this.index] ?? null;
	}
	get total(): number {
		return this.steps.length;
	}
	get stepNumber(): number {
		return this.index + 1;
	}
	get isActionStep(): boolean {
		return !!this.step?.autoPerform;
	}

	// Pure read of the active step's completion predicate; false for ack steps. Kept pure so
	// the headless sim can assert it directly without standing up the advancing $effect.
	get stepComplete(): boolean {
		return this.step?.predicate?.() ?? false;
	}

	constructor(
		gameLoop: GameLoop,
		loot: LootGenerator,
		inventory: Inventory,
		quest: Quest,
		augment: Augment
	) {
		this.gameLoop = gameLoop;
		this.loot = loot;
		this.inventory = inventory;
		this.quest = quest;
		this.augment = augment;
		this.steps = this.buildSteps();
	}

	hasSeen(): boolean {
		return readSeen();
	}

	// Entry choke point invoked from `play()`: a first-timer gets the FTUE, a returning
	// player drops straight into a normal run. Read lazily here (client-only), never on
	// mount — the flag lives in localStorage and is unreadable during SSR.
	enter() {
		if (this.hasSeen()) {
			this.gameLoop.start();
		} else {
			this.start();
		}
	}

	// Enters Tutorial Mode. Also the replay path from the main menu's "How to Play".
	start() {
		this.index = 0;
		this.gameLoop.startTutorial();
	}

	// Runs the active step's setup() — the Coachmark calls this on step entry so the
	// scripted state exists before the player can act.
	enterStep() {
		this.step?.setup?.();
	}

	// The Coachmark's forward-only "go" control: advance, or hand off to a real run on the
	// final step. There is no back/undo.
	advance() {
		if (this.index < this.steps.length - 1) {
			this.index++;
			return;
		}
		this.finish();
	}

	// Per-step skip (ADR-0003): auto-perform the canonical action so game state ends up
	// identical to the manual path, then the predicate effect advances. An ack step has no
	// action, so skip just moves forward.
	skip() {
		const step = this.step;
		if (!step) return;
		if (step.autoPerform) {
			step.autoPerform();
		} else {
			this.advance();
		}
	}

	// Sets the seen flag, tears down the artificial Tutorial Mode state, and restarts
	// seamlessly into a fresh normal stage-1 run (live clock, random loot).
	private finish() {
		writeSeen();
		this.index = 0;
		this.gameLoop.restart();
	}

	private buildSteps(): TutorialStep[] {
		return [
			{
				id: 'open-drop',
				badge: 'click',
				title: 'Open the Loot Drop',
				description:
					'Loot arrives on a timer — but you do not have to wait. Hit "Open Now" to crack the drop open and see what is inside.',
				targets: ['open-now'],
				setup: () => {
					this.baseline = this.loot.chestsOpened;
					this.loot.scriptedDrop = () => this.openDropItems();
				},
				predicate: () => this.loot.chestsOpened > this.baseline,
				autoPerform: () => this.loot.next()
			},
			{
				id: 'triage',
				badge: 'drag',
				title: 'Stash Your Loot',
				description:
					'Drag an item out of the Loot Drop and into your Loadout to keep it. Only what is in your Loadout counts toward your score.',
				targets: ['loot-drop', 'backpack'],
				setup: () => {
					this.baseline = this.backpackCount();
				},
				predicate: () => this.backpackCount() > this.baseline,
				autoPerform: () => this.dragItem('lootBack', 'backpack')
			},
			{
				id: 'quest',
				badge: 'drag',
				title: 'Complete a Quest',
				description:
					'Quests want specific items. Drag the matching item into your Loadout and the quest turns in automatically — banking you bonus time.',
				targets: ['quest-bar', 'loot-drop', 'backpack'],
				setup: () => {
					this.baseline = this.quest.totalQuestsCompleted;
					this.loot.scriptedDrop = () => this.questDropItems();
					this.loot.next();
				},
				predicate: () => this.quest.totalQuestsCompleted > this.baseline,
				autoPerform: () => {
					this.dragItem('lootBack', 'backpack', 'loot_bandage');
					this.quest.checkMatches();
				}
			},
			{
				id: 'overweight',
				badge: 'drag',
				title: 'Drop the Dead Weight',
				description:
					'Your Loadout is over capacity — heavy gear is dragging your extract down. Drag the bulky item back into the Loot Drop to clear the Overweight penalty.',
				targets: ['backpack', 'loot-drop'],
				setup: () => {
					this.inventory.fillStorage('backpack', [
						this.inventory.createItem(OVERWEIGHT_SEED.defId, OVERWEIGHT_SEED.count)
					]);
				},
				// The seed is the sole cause of the Overweight state (its 36 weight alone exceeds
				// the rookie cap), so "no longer in the Loadout" ⟺ no longer overweight. Read as a
				// pure $state scan rather than the unowned `isOverweight` $derived, which caches
				// (see the getters note above) and would go stale in the headless sim.
				predicate: () => !this.loadoutHas(OVERWEIGHT_SEED.defId),
				autoPerform: () => this.dragItem('backpack', 'lootBack', OVERWEIGHT_SEED.defId)
			},
			{
				id: 'timer',
				badge: 'note',
				title: 'Watch the Clock',
				description:
					'Your run is on a countdown. When it hits zero the run ends and whatever is in your Loadout is scored — so bank what you can before time runs out.',
				cta: 'Got it',
				targets: ['timer']
			},
			{
				id: 'hotkeys',
				badge: 'note',
				title: 'Keyboard Shortcuts',
				description:
					'Play faster with the keyboard: hold Ctrl to multi-select, Shift to quick-move an item, and Alt to split a stack.',
				cta: 'Got it',
				targets: ['hotkeys'],
				platforms: ['desktop']
			},
			{
				id: 'augment',
				badge: 'drag',
				title: 'Upgrade Your Augment',
				description:
					'Augments level up when you hold enough crafting resources. Drag the parts into your Loadout to auto-upgrade and unlock more Loadout slots.',
				targets: ['loot-drop', 'backpack', 'augment'],
				setup: () => {
					this.baseline = this.augment.upgradePulse;
					this.loot.scriptedDrop = () => this.augmentDropItems();
					this.loot.next();
				},
				predicate: () => this.augment.upgradePulse > this.baseline,
				autoPerform: () => {
					this.dragItem('lootBack', 'backpack', 'res_metal_parts');
					this.augment.autoUpgrade();
				}
			},
			{
				id: 'shield',
				badge: 'drag',
				title: 'Equip a Shield',
				description:
					'Shields slot in to buy you extra time on the clock. Drag the shield into its slot to bank the bonus.',
				targets: ['loot-drop', 'shield'],
				setup: () => {
					this.loot.scriptedDrop = () => this.shieldDropItems();
					this.loot.next();
				},
				// Fresh $state read of the shield slot rather than the unowned `shieldItem`
				// $derived, for the same staleness reason as the overweight step above.
				predicate: () =>
					this.inventory.getItem({ type: 'slot', storageId: 'shield', index: 0 }) !== null,
				autoPerform: () => this.dragItem('lootBack', 'shield', 'shield_light')
			},
			{
				id: 'recycle',
				badge: 'right-click',
				title: 'Recycle the Junk',
				description:
					'Low-value gear is worth more as parts. Right-click the highlighted item in your Loadout and choose Recycle to break it down into crafting resources.',
				targets: ['backpack'],
				setup: () => {
					this.baseline = this.inventory.recyclePulse;
					this.inventory.fillStorage('backpack', [this.inventory.createItem(RECYCLE_SEED, 1)]);
				},
				// recyclePulse is bumped only on a successful recycleItem, so "rose above entry" ⟺
				// the player recycled. Auto-recycles (none in Tutorial Mode) would advance too, but
				// the cadence is suspended, so the seeded item is the only thing that can fire it.
				predicate: () => this.inventory.recyclePulse > this.baseline,
				autoPerform: () => this.recycleSeeded()
			},
			{
				id: 'outro',
				badge: 'finish',
				title: "You're Ready to Raid",
				description:
					'When the clock runs out your run ends and your Loadout is cashed in as Extract — but stay Overweight and a penalty eats your score. That is the whole loop. Good luck out there.',
				cta: 'Start raiding'
			}
		];
	}

	// Deterministic step-1 drop: a small, readable spread of common loot so the player sees
	// items arrive without the noise of a random roll.
	private openDropItems(): InstanceItem[] {
		return [
			this.inventory.createItem('loot_battery', 1),
			this.inventory.createItem('loot_fabric', 2),
			this.inventory.createItem('loot_oil', 1),
			this.inventory.createItem('res_metal_parts', 3)
		];
	}

	// Step 3 drop: a full stack of the stage-1 bandage quest so a single drag into the
	// Loadout satisfies the quest and the auto-match effect turns it in.
	private questDropItems(): InstanceItem[] {
		return [this.inventory.createItem('loot_bandage', 4)];
	}

	// Step 7 drop: exactly the rookie augment's upgrade cost (res_metal_parts x8), seeded
	// lazily so the auto-upgrade effect cannot fire before the player drags it in.
	private augmentDropItems(): InstanceItem[] {
		return [this.inventory.createItem('res_metal_parts', 8)];
	}

	// Step 8 drop: a single equippable (green) shield to slot into the shield bay.
	private shieldDropItems(): InstanceItem[] {
		return [this.inventory.createItem('shield_light', 1)];
	}

	// Occupied Loadout (backpack) slot count — the signal the triage step advances on.
	private backpackCount(): number {
		return this.inventory.items.filter(
			(slot) => slot.location.type === 'slot' && slot.location.storageId === 'backpack'
		).length;
	}

	// True while the Loadout (backpack) still holds any of `defId`. Pure $state scan.
	private loadoutHas(defId: string): boolean {
		return this.inventory.items.some(
			(slot) =>
				slot.location.type === 'slot' &&
				slot.location.storageId === 'backpack' &&
				slot.item.defId === defId
		);
	}

	// Recycle step skip path: locates the seeded junk in the Loadout and runs the same
	// inventory.recycleItem the context-menu "Recycle" invokes, so skip ≡ the manual recycle.
	private recycleSeeded(): void {
		const source = this.inventory.items.find(
			(slot) =>
				slot.location.type === 'slot' &&
				slot.location.storageId === 'backpack' &&
				slot.item.defId === RECYCLE_SEED
		);
		if (source) this.inventory.recycleItem(source.location);
	}

	// Replays a player drag without the pointer layer: builds the minimal DragState the DnD
	// path produces and routes it through inventory.move, so skip ends exactly where a manual
	// drag would. `defId` picks a specific item when the source slot holds a mix.
	private dragItem(from: StorageId, to: StorageId, defId?: string): void {
		const source = this.inventory.items.find(
			(slot) =>
				slot.location.type === 'slot' &&
				slot.location.storageId === from &&
				(defId === undefined || slot.item.defId === defId)
		);
		if (!source) return;
		const target = this.inventory.getFirstEmptySlot(to);
		if (!target) return;
		const drag: DragState = {
			item: source.item,
			sourceLocation: source.location,
			isSplit: false
		};
		this.inventory.move(drag, target);
	}
}
