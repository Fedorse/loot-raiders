export interface PreloadImage {
	src: string;
	alt: string;
}

export const PRELOAD_IMAGES: PreloadImage[] = [
	{ src: '/assets/preload/slide-1.webp', alt: '' },
	{ src: '/assets/preload/slide-2.webp', alt: '' },
	{ src: '/assets/preload/intro.webp', alt: '' },
	{ src: '/assets/preload/slide-3.webp', alt: '' },
	{ src: '/assets/preload/slide-4.webp', alt: '' }
];

export const PRELOAD_URLS: string[] = PRELOAD_IMAGES.map((i) => i.src);
