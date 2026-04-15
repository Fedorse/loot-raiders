import { Howl } from 'howler';
import { SOUNDS, type SoundKey } from '$lib/config/sounds';

export class AudioManager {
	volume = $state(2);
	muted = $state(true);
	private howls = new Map<SoundKey, Howl>();
	private bgm: Howl | null = null;

	constructor() {
		this.preload();
	}

	private preload() {
		for (const [key, config] of Object.entries(SOUNDS)) {
			const howl = new Howl({
				src: [config.src],
				volume: config.volume ?? this.volume,
				loop: config.loop ?? false
			});
			this.howls.set(key as SoundKey, howl);
		}
		this.bgm = this.howls.get('bgm') ?? null;
	}
	play(key: SoundKey) {
		const howl = this.howls.get(key);
		if (!howl || this.muted) return;
		howl.volume((SOUNDS[key].volume ?? 1) * this.volume);
		howl.play();
	}
	playBGM() {
		if (!this.bgm || this.muted) return;
		this.bgm.volume(SOUNDS.bgm.volume * this.volume);
		this.bgm.play();
	}
	duckBGM() {
		this.bgm?.fade(this.bgm.volume(), SOUNDS.bgm.volume * this.volume * 0.3, 400);
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
