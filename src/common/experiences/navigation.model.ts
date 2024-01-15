import type { Spherical, Vector3 } from "three";

export interface NavigationView {
	enabled?: boolean;
	controls?: boolean;
	center?: Vector3;
	spherical?: {
		smoothed: Spherical;
		smoothing: number;
		limits: {
			radius: { min: number; max: number };
			phi: { min: number; max: number };
			theta: { min: number; max: number };
			enabled: boolean;
			enabledPhi: boolean;
			enabledTheta: boolean;
		};
		value: Spherical;
	};
	target?: {
		value: Vector3;
		smoothed: Vector3;
		smoothing: number;
		limits: {
			x: { min: number; max: number };
			y: { min: number; max: number };
			z: { min: number; max: number };
			enabled: boolean;
		};
	};
	drag?: {
		delta: { x: number; y: number };
		previous: { x: number; y: number };
		sensitivity: number;
		alternative: boolean;
	};
	zoom?: { sensitivity: number; delta: number };
	down?: (x: number, y: number) => unknown;
	move?: (x: number, y: number) => unknown;
	up?: () => unknown;
	zooming?: (delta: number) => unknown;
	onMouseDown?: (event: MouseEvent) => unknown;
	onMouseUp?: (this: HTMLElement, ev: MouseEvent) => unknown;
	onMouseMove?: (this: HTMLElement, ev: MouseEvent) => unknown;
	onTouchStart?: (event: TouchEvent) => unknown;
	onTouchEnd?: (event: TouchEvent) => unknown;
	onTouchMove?: (event: TouchEvent) => unknown;
	onContextMenu?: (event: MouseEvent) => unknown;
	onWheel?: (event: Event) => unknown;
}
