import { Howl } from 'howler';
import { SOUNDS, type SoundKey, type SoundConfig } from '$lib/config/sounds';

export class AudioManager {
	volume = $state(1);
	muted = $state(false);
	private howls = new Map<SoundKey, Howl>();
	private bgm: Howl | null = null;

	constructor() {
		this.preload();
	}

	private preload() {
		for (const [key, config] of Object.entries(SOUNDS) as [SoundKey, SoundConfig][]) {
			const howl = new Howl({
				src: [config.src],
				volume: config.volume ?? this.volume,
				loop: config.loop ?? false
			});
			this.howls.set(key, howl);
		}
		this.bgm = this.howls.get('bgm') ?? null;
	}
	play(key: SoundKey) {
		const howl = this.howls.get(key);
		if (!howl || this.muted) return;
		const cfg = SOUNDS[key] as SoundConfig;
		howl.volume((cfg.volume ?? 1) * this.volume);
		const id = howl.play();

		if (cfg.offset) howl.seek(cfg.offset / 1000, id);
	}
	playBGM() {
		if (!this.bgm || this.muted) return;
		this.bgm.volume(SOUNDS.bgm.volume * this.volume);
		this.bgm.play();
	}
	duckBGM() {
		this.bgm?.fade(this.bgm.volume(), SOUNDS.bgm.volume * this.volume * 0.25, 400);
	}

	unduckBGM() {
		this.bgm?.fade(this.bgm.volume(), SOUNDS.bgm.volume * this.volume, 400);
	}

	stopBGM() {
		this.bgm?.fade(this.bgm.volume(), 0, 500);
		setTimeout(() => this.bgm?.stop(), 500);
	}

	setVolume(v: number) {
		this.volume = v;
		if (this.bgm?.playing()) {
			this.bgm.volume(SOUNDS.bgm.volume * v);
		}
	}

	toggleMute() {
		this.muted = !this.muted;
		Howler.mute(this.muted);
	}
}
