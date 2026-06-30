/// <reference types="@webgpu/types" />

// Public, typed surface of the frozen vendor engine in ./engine.js.

export interface EngineParams {
	intensity: number;
	fogAmt: number;
	grainAmt: number;
	bloomAmt: number;
	dofAmt: number;
	exposure: number;
	zoomAmt: number;
}

export interface EngineState {
	time: number;
	mouse: [number, number];
	wind: number;
	glitch: number;
	toggles: Record<string, boolean>;
	params: EngineParams;
}

export interface Engine {
	device: GPUDevice;
	state: EngineState;
	backend: 'webgpu';
	loadTexture(key: string, url: string): void;
	setActive(key: string): void;
	setTransition(modeIdx: number, durSec: number): void;
	setMouse(x: number, y: number): void;
	setToggles(toggles: Record<string, boolean>): void;
	setParams(params: Partial<EngineParams>): void;
	setGlitch(v: number): void;
	transitioning(): boolean;
	tick(dt: number): void;
	dispose(): void;
}

export function createEngine(canvas: HTMLCanvasElement): Promise<Engine>;
