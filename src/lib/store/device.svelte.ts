interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export class Device {
	isIPhone = $state(false);
	isStandalone = $state(false);
	deferredPrompt = $state<BeforeInstallPromptEvent | null>(null);

	init() {
		if (typeof navigator === 'undefined') return;

		const ua = navigator.userAgent;
		this.isIPhone = /iPhone|iPod/.test(ua);
		this.isStandalone =
			window.matchMedia('(display-mode: standalone)').matches ||
			(navigator as { standalone?: boolean }).standalone === true;

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
