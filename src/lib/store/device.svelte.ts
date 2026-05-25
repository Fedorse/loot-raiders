interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PORTRAIT_MOBILE_QUERY = '(orientation: portrait) and (max-width: 1023px)';

export class Device {
	isIPhone = $state(false);
	isStandalone = $state(false);
	deferredPrompt = $state<BeforeInstallPromptEvent | null>(null);
	isPortraitMobile = $state(
		typeof window !== 'undefined' && window.matchMedia(PORTRAIT_MOBILE_QUERY).matches
	);

	private started = false;

	init() {
		if (this.started) return;
		if (typeof navigator === 'undefined') return;
		this.started = true;

		const ua = navigator.userAgent;
		this.isIPhone = /iPhone|iPod/.test(ua);
		this.isStandalone =
			window.matchMedia('(display-mode: standalone)').matches ||
			(navigator as { standalone?: boolean }).standalone === true;

		const portrait = window.matchMedia(PORTRAIT_MOBILE_QUERY);
		this.isPortraitMobile = portrait.matches;
		portrait.addEventListener('change', () => {
			this.isPortraitMobile = portrait.matches;
		});

		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			this.deferredPrompt = e as BeforeInstallPromptEvent;
		});

		window.addEventListener('appinstalled', () => {
			this.deferredPrompt = null;
		});
	}

	async install() {
		if (!this.deferredPrompt) return;
		await this.deferredPrompt.prompt();
		this.deferredPrompt = null;
	}
}
