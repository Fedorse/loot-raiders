export const SOUNDS = {
	bgm: {
		src: 'assets/audio/bgm.mp3',
		volume: 0.1,
		loop: true
	},
	rare_loot: {
		src: 'assets/audio/rare_loot.mp3',
		volume: 0.1,
		loop: false
	},
	drag: {
		src: 'assets/audio/drag.wav',
		volume: 0.3,
		loop: false
	},
	lodauout: {
		src: 'assets/audio/lodauout.wav',
		volume: 0.3,
		loop: false
	},
	match: {
		src: 'assets/audio/match.wav',
		volume: 0.3,
		loop: false
	},
	selected: {
		src: 'assets/audio/selected.wav',
		volume: 0.3,
		loop: false
	},
	recycle: {
		src: 'assets/audio/recycle.wav',
		volume: 0.3,
		loop: false
	},
	sheild: {
		src: 'assets/audio/shield.wav',
		volume: 0.3,
		loop: false
	},
	attach: {
		src: 'assets/audio/attach.wav',
		volume: 0.3,
		loop: false
	},
	drop: {
		src: 'assets/audio/drop.wav',
		volume: 0.3,
		loop: false
	},
	swap: {
		src: 'assets/audio/swap.wav',
		volume: 0.3,
		loop: false
	},
	click: {
		src: 'assets/audio/click_ui.wav',
		volume: 0.3,
		loop: false
	},
	hover: {
		src: 'assets/audio/hover_ui.wav',
		volume: 0.3,
		loop: false
	}
} as const;

export type SoundKey = keyof typeof SOUNDS;
