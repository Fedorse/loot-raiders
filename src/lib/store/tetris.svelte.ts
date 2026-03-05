import type {
	TetrisCell,
	TetrisConfig,
	TetrisGroup,
	TetrisPhase,
	TetrisPoolEntry
} from '$lib/types';
import type { Inventory } from './inventory.svelte';

export class Tetris {
	grid: (TetrisCell | null)[] = $state([]);
	phase: TetrisPhase = $state('idle');

	private spawnTimer: ReturnType<typeof setInterval> | null = null;
	private gravityTimer: ReturnType<typeof setInterval> | null = null;
	private inventory: Inventory;
	readonly config: TetrisConfig;

	// derived group list for rendering (two-layer grid)
	groups: TetrisGroup[] = $derived.by(() => {
		const map = new Map<string, { defId: string; count: number; indices: number[] }>();

		for (let i = 0; i < this.grid.length; i++) {
			const cell = this.grid[i];
			if (!cell) continue;

			if (!map.has(cell.groupId)) {
				map.set(cell.groupId, { defId: cell.defId, count: cell.count, indices: [] });
			}
			map.get(cell.groupId)!.indices.push(i);
		}

		return [...map.entries()].map(([groupId, { defId, count, indices }]) => {
			const rows = indices.map((i) => Math.floor(i / this.config.cols));
			const cols = indices.map((i) => i % this.config.cols);
			return {
				groupId,
				defId,
				count,
				row: Math.min(...rows),
				col: Math.min(...cols),
				spanRows: Math.max(...rows) - Math.min(...rows) + 1,
				spanCols: Math.max(...cols) - Math.min(...cols) + 1
			};
		});
	});

	constructor(inventory: Inventory, config: TetrisConfig) {
		this.inventory = inventory;
		this.config = config;
		this.grid = Array(config.cols * config.rows).fill(null);
	}

	// ---- Grid helpers ----

	private cellAt(row: number, col: number): TetrisCell | null {
		return this.grid[row * this.config.cols + col];
	}

	private setCell(row: number, col: number, cell: TetrisCell | null): void {
		this.grid[row * this.config.cols + col] = cell;
	}

	// ---- Game control ----

	start(): void {
		this.grid = Array(this.config.cols * this.config.rows).fill(null);
		this.phase = 'playing';
		this.spawnTimer = setInterval(() => this.spawnTick(), this.config.tickMs);
		this.gravityTimer = setInterval(() => this.gravityTick(), this.config.gravityMs);
	}

	stop(): void {
		if (this.spawnTimer) {
			clearInterval(this.spawnTimer);
			this.spawnTimer = null;
		}
		if (this.gravityTimer) {
			clearInterval(this.gravityTimer);
			this.gravityTimer = null;
		}
	}

	restart(): void {
		this.stop();
		this.start();
	}

	// ---- Spawn ----

	private spawnTick(): void {
		if (this.phase !== 'playing') return;
		this.spawnItem();
	}

	private spawnItem(): void {
		const entry = this.rollItem();
		const shape = entry.shape ?? [[0, 0]];

		const maxCol = Math.max(...shape.map(([, c]) => c));
		const availableCols = this.config.cols - maxCol;
		const col = Math.floor(Math.random() * availableCols);

		for (const [dr, dc] of shape) {
			if (this.cellAt(dr, col + dc)) {
				this.phase = 'gameover';
				this.stop();
				return;
			}
		}

		const groupId = crypto.randomUUID();
		for (const [dr, dc] of shape) {
			this.setCell(dr, col + dc, {
				uid: crypto.randomUUID(),
				groupId,
				defId: entry.defId,
				count: entry.count
			});
		}
	}

	private rollItem(): TetrisPoolEntry {
		const pool = this.config.pool;
		const total = pool.reduce((sum, p) => sum + p.weight, 0);
		let roll = Math.random() * total;

		for (const entry of pool) {
			roll -= entry.weight;
			if (roll <= 0) return entry;
		}

		return pool[pool.length - 1];
	}

	// ---- Gravity ----

	private gravityTick(): void {
		if (this.phase !== 'playing') return;
		this.applyGravity();
		this.checkClears();
	}

	private applyGravity(): void {
		const groups = new Map<string, number[]>();
		for (let i = 0; i < this.grid.length; i++) {
			const cell = this.grid[i];
			if (!cell) continue;
			if (!groups.has(cell.groupId)) groups.set(cell.groupId, []);
			groups.get(cell.groupId)!.push(i);
		}

		// process bottom groups first
		const sorted = [...groups.entries()].sort((a, b) => {
			const maxA = Math.max(...a[1].map((i) => Math.floor(i / this.config.cols)));
			const maxB = Math.max(...b[1].map((i) => Math.floor(i / this.config.cols)));
			return maxB - maxA;
		});

		for (const [, indices] of sorted) {
			const canFall = indices.every((idx) => {
				const row = Math.floor(idx / this.config.cols);
				const col = idx % this.config.cols;
				if (row >= this.config.rows - 1) return false;
				const below = this.cellAt(row + 1, col);
				return below === null || indices.includes((row + 1) * this.config.cols + col);
			});

			if (canFall) {
				const bottomFirst = [...indices].sort((a, b) => b - a);
				for (const idx of bottomFirst) {
					const row = Math.floor(idx / this.config.cols);
					const col = idx % this.config.cols;
					this.setCell(row + 1, col, this.grid[idx]);
					this.setCell(row, col, null);
				}
			}
		}
	}

	// ---- Auto-clear ----

	checkClears(): void {
		const cleared = new Set<string>();

		for (let i = this.grid.length - 1; i >= 0; i--) {
			const cell = this.grid[i];
			if (!cell || cleared.has(cell.groupId)) continue;

			const available = this.inventory.countInBackpack(cell.defId);
			if (available >= cell.count) {
				this.inventory.consumeFromBackpack(cell.defId, cell.count);
				cleared.add(cell.groupId);
			}
		}

		if (cleared.size > 0) {
			for (let i = 0; i < this.grid.length; i++) {
				if (this.grid[i] && cleared.has(this.grid[i]!.groupId)) {
					this.grid[i] = null;
				}
			}
		}
	}
}
