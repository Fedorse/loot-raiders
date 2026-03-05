import type { TetrisConfig } from '$lib/types';

export const TETRIS_CONFIG: TetrisConfig = {
	cols: 5,
	rows: 8,
	tickMs: 1000,
	gravityMs: 400,
	pool: [
		// resources (1 cell)
		{ defId: 'res_metal_parts', count: 5, weight: 50 },
		{ defId: 'res_wires', count: 3, weight: 30 },
		{ defId: 'res_plastic_parts', count: 4, weight: 35 },
		{ defId: 'res_rubber_parts', count: 3, weight: 25 },
		{ defId: 'res_mechanical_components', count: 2, weight: 15 },
		// attachments (1 cell)
		{ defId: 'att_compensator_2', count: 1, weight: 10 },
		{ defId: 'att_vertical_grip_1', count: 1, weight: 10 },
		{ defId: 'att_ext_light_mag_2', count: 1, weight: 10 },
		// weapons without attachments (1×2)
		{
			defId: 'wpn_ferro',
			count: 1,
			weight: 50,
			shape: [
				[0, 0],
				[0, 1]
			]
		}
	]
};
