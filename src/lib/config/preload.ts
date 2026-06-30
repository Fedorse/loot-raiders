import { SCENES } from '$lib/components/backdrop/scenes';

export interface PreloadImage {
	src: string;
	alt: string;
}

export const PRELOAD_IMAGES: PreloadImage[] = [
	{ src: '/assets/preload/slide-1.webp', alt: '' },
	{ src: '/assets/preload/slide-2.webp', alt: '' },
	// The middle slide scales up to fill the screen as the preloader's final frame; pointing it at
	// the menu scene image lands the preloader→menu hand-off on the same picture.
	{ src: SCENES.menu.image, alt: '' },
	{ src: '/assets/preload/slide-3.webp', alt: '' },
	{ src: '/assets/preload/slide-4.webp', alt: '' }
];

// Only the .webp slides get the typed <link rel=preload> in the head; the menu scene image is
// preloaded separately (high priority) and tracked by the asset loader via SCENE_IMAGE_URLS.
export const PRELOAD_URLS: string[] = PRELOAD_IMAGES.map((i) => i.src).filter((src) =>
	src.endsWith('.webp')
);
